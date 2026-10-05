<?php

namespace App\Http\Controllers;

use App\Models\CoinPackage;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TopUpController extends Controller
{
    /**
     * Display the Top Up page with available coin packages.
     */
    public function index(Request $request)
    {
        $packages = CoinPackage::where('is_active', true)
            ->orderBy('coin_amount', 'asc')
            ->get();

        return Inertia::render('Akun/TopUp', [
            'packages' => $packages,
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:coin_packages,id',
        ]);

        $package = CoinPackage::findOrFail($request->input('package_id'));

        if (!$package->is_active) {
            return back()->with('error', 'Paket koin tidak aktif.');
        }

        $totalCoins = (int) $package->coin_amount + (int) ($package->bonus_coin ?? 0);
        $user = $request->user();

        // Simpan URL buku terakhir ke session
        $returnUrl = $request->input('return_url') ?: session('last_book_url');
        if ($returnUrl) {
            session(['topup_return_url' => $returnUrl]);
        }

        // 1. Prepare iPaymu Request Data
        $va = env('IPAYMU_VA');
        $apiKey = env('IPAYMU_API_KEY');
        $url = env('IPAYMU_URL', 'https://sandbox.ipaymu.com/api/v2/payment');

        // Create a unique transaction reference
        $transactionId = 'TALAQEE-COIN-' . time() . '-' . $user->id;

        // Jika VA / API Key iPaymu belum diisi di environment local, lakukan simulasi top up langsung
        if (empty($va) || empty($apiKey)) {
            $newBalance = $user->coin_balance + $totalCoins;
            $user->coin_balance = $newBalance;
            $user->save();

            \Illuminate\Support\Facades\DB::table('coin_transactions')->insert([
                'user_id' => $user->id,
                'type' => 'topup',
                'amount' => $totalCoins,
                'balance_before' => $user->coin_balance - $totalCoins,
                'balance_after' => $newBalance,
                'reference_type' => 'simulasi_local',
                'reference_id' => null,
                'description' => 'Top Up ' . $package->name . ' (' . $totalCoins . ' Koin) (Simulasi)',
                'transaction_number' => $transactionId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            \App\Models\Payment::updateOrCreate(
                ['invoice_number' => $transactionId],
                [
                    'user_id' => $user->id,
                    'coin_package_id' => $package->id,
                    'amount' => (int) $package->price,
                    'payment_method' => 'Simulasi',
                    'status' => 'paid',
                    'paid_at' => now(),
                    'notes' => 'Top Up ' . $package->name . ' (' . $totalCoins . ' Koin) (Simulasi)',
                ]
            );

            $targetUrl = session()->pull('topup_return_url') ?: session('last_book_url');
            if (!$targetUrl) {
                $progress = \App\Models\ReadingProgress::where('user_id', $user->id)
                    ->orderBy('last_read_at', 'desc')
                    ->first();
                if ($progress && $progress->book_id) {
                    $targetUrl = $progress->chapter_id 
                        ? "/buku/{$progress->book_id}/read/{$progress->chapter_id}"
                        : "/buku/{$progress->book_id}";
                }
            }

            return redirect($targetUrl ?: '/akun/topup')->with('success', 'Top Up ' . $totalCoins . ' Koin Berhasil!');
        }

        $packagePrice = (int) $package->price;

        $body = [
            'product' => ['Top Up ' . $package->name . ' Talaqee'],
            'qty' => ['1'],
            'price' => [$packagePrice],
            'amount' => $packagePrice,
            'returnUrl' => route('topup.success'),
            'cancelUrl' => route('topup.cancel'),
            'notifyUrl' => route('topup.callback'),
            'referenceId' => $transactionId,
            'buyerName' => $user->name,
            'buyerEmail' => $user->email,
            'buyerPhone' => '081234567890', // Dummy phone if user doesn't have one
        ];

        $jsonBody = json_encode($body, JSON_UNESCAPED_SLASHES);

        // 2. Generate Signature
        // Format: Method:VA:lowercase(hash(sha256, request_body)):API_KEY
        $bodyHash = strtolower(hash('sha256', $jsonBody));
        $stringToSign = "POST:" . $va . ":" . $bodyHash . ":" . $apiKey;
        $signature = hash_hmac('sha256', $stringToSign, $apiKey);

        // 3. Send Request to iPaymu (with timeout to prevent 502)
        try {
            $response = Http::timeout(15)
                ->withoutVerifying()
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'signature' => $signature,
                    'va' => $va,
                    'timestamp' => date('YmdHis')
                ])->post($url, $body);
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('iPaymu Connection Failed', ['error' => $e->getMessage()]);
            return back()->with('error', 'Gagal terhubung ke server pembayaran. Silakan coba beberapa saat lagi.');
        } catch (\Exception $e) {
            Log::error('iPaymu Request Exception', ['error' => $e->getMessage()]);
            return back()->with('error', 'Terjadi kesalahan saat memproses pembayaran.');
        }

        $result = $response->json();

        if ($response->successful() && isset($result['Data']['Url'])) {
            // Success getting payment URL
            $paymentUrl = $result['Data']['Url'];
            $sessionId = $result['Data']['SessionID'];

            // Save this transaction to DB as 'pending'
            \Illuminate\Support\Facades\DB::table('coin_transactions')->insert([
                'user_id' => $user->id,
                'type' => 'topup',
                'amount' => $totalCoins,
                'balance_before' => $user->coin_balance,
                'balance_after' => $user->coin_balance, // Will be updated on callback / return
                'reference_type' => 'ipaymu',
                'reference_id' => null,
                'description' => 'Top Up ' . $package->name . ' (' . $totalCoins . ' Koin) via iPaymu (Session: '.$sessionId.')',
                'transaction_number' => $transactionId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Save payment record as pending
            \App\Models\Payment::updateOrCreate(
                ['invoice_number' => $transactionId],
                [
                    'user_id' => $user->id,
                    'coin_package_id' => $package->id,
                    'amount' => $packagePrice,
                    'payment_method' => 'iPaymu',
                    'status' => 'pending',
                    'notes' => 'Top Up ' . $package->name . ' (' . $totalCoins . ' Koin)',
                ]
            );

            return inertia()->location($paymentUrl);
        } else {
            // Failed
            Log::error('iPaymu Checkout Failed', ['response' => $result]);
            return back()->with('error', 'Gagal memproses pembayaran. Pastikan VA dan API Key valid.');
        }
    }

    public function success(Request $request)
    {
        // Simulasi Localhost: Tambahkan koin langsung saat user diarahkan kembali ke aplikasi
        $user = clone $request->user();

        // Ambil transaksi terakhir yang masih pending untuk user ini
        $transaction = \Illuminate\Support\Facades\DB::table('coin_transactions')
            ->where('user_id', $user->id)
            ->where('type', 'topup')
            ->orderBy('id', 'desc')
            ->first();

        if ($transaction && $transaction->balance_after == $transaction->balance_before) {
            $newBalance = $user->coin_balance + $transaction->amount;
            
            // Tambahkan koin ke user
            \Illuminate\Support\Facades\DB::table('users')
                ->where('id', $user->id)
                ->update(['coin_balance' => $newBalance]);

            // Update status transaksi
            \Illuminate\Support\Facades\DB::table('coin_transactions')
                ->where('id', $transaction->id)
                ->update([
                    'balance_after' => $newBalance,
                    'updated_at' => now()
                ]);

            // Update status Payment
            \App\Models\Payment::where('invoice_number', $transaction->transaction_number)
                ->where('status', '!=', 'paid')
                ->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);
        }

        $targetUrl = session()->pull('topup_return_url') ?: session('last_book_url');
        if (!$targetUrl) {
            $progress = \App\Models\ReadingProgress::where('user_id', $user->id)
                ->orderBy('last_read_at', 'desc')
                ->first();
            if ($progress && $progress->book_id) {
                $targetUrl = $progress->chapter_id 
                    ? "/buku/{$progress->book_id}/read/{$progress->chapter_id}"
                    : "/buku/{$progress->book_id}";
            }
        }

        return redirect($targetUrl ?: '/akun/topup')->with('success', 'Top Up Koin Berhasil! Koin telah ditambahkan.');
    }

    public function cancel()
    {
        return redirect('/akun/topup')->with('error', 'Pembayaran dibatalkan.');
    }

    public function callback(Request $request)
    {
        // This is where iPaymu sends a POST request when payment is successful
        $trx_id = $request->input('trx_id');
        $status = $request->input('status');
        $referenceId = $request->input('reference_id');

        if ($status === 'berhasil' || $status === 'successful') {
            // Find the pending transaction
            $transaction = \Illuminate\Support\Facades\DB::table('coin_transactions')
                ->where('transaction_number', $referenceId)
                ->where('type', 'topup')
                ->first();

            if ($transaction) {
                // Add coins to user
                $user = \App\Models\User::find($transaction->user_id);
                if ($user) {
                    $newBalance = $user->coin_balance + $transaction->amount;
                    $user->coin_balance = $newBalance;
                    $user->save();

                    // Update transaction status
                    \Illuminate\Support\Facades\DB::table('coin_transactions')
                        ->where('id', $transaction->id)
                        ->update([
                            'balance_after' => $newBalance,
                            'updated_at' => now()
                        ]);
                }
            }

            // Update status Payment
            \App\Models\Payment::where('invoice_number', $referenceId)
                ->where('status', '!=', 'paid')
                ->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);
        }

        return response()->json(['status' => 'success']);
    }
}
