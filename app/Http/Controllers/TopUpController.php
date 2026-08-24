<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TopUpController extends Controller
{
    // Packages definition (matching the frontend TopUp.tsx)
    private $coinPackages = [
        1 => ['coins' => 50, 'price' => 2500],
        2 => ['coins' => 100, 'price' => 5000],
        3 => ['coins' => 250, 'price' => 10000],
        4 => ['coins' => 500, 'price' => 20000],
        5 => ['coins' => 1000, 'price' => 40000],
        6 => ['coins' => 5000, 'price' => 200000],
    ];

    public function checkout(Request $request)
    {
        $request->validate([
            'package_id' => 'required|integer',
        ]);

        $packageId = $request->input('package_id');
        
        if (!array_key_exists($packageId, $this->coinPackages)) {
            return back()->with('error', 'Paket koin tidak valid.');
        }

        $package = $this->coinPackages[$packageId];
        $user = $request->user();

        // 1. Prepare iPaymu Request Data
        $va = env('IPAYMU_VA');
        $apiKey = env('IPAYMU_API_KEY');
        $url = env('IPAYMU_URL', 'https://sandbox.ipaymu.com/api/v2/payment');

        // Create a unique transaction reference
        $transactionId = 'TALAQEE-COIN-' . time() . '-' . $user->id;

        $body = [
            'product' => ['Top Up ' . $package['coins'] . ' Koin Talaqee'],
            'qty' => ['1'],
            'price' => [$package['price']],
            'amount' => $package['price'],
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

        // 3. Send Request to iPaymu
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'signature' => $signature,
            'va' => $va,
            'timestamp' => date('YmdHis')
        ])->post($url, $body);

        $result = $response->json();

        if ($response->successful() && isset($result['Data']['Url'])) {
            // Success getting payment URL
            $paymentUrl = $result['Data']['Url'];
            $sessionId = $result['Data']['SessionID'];

            // Normally you would save this transaction to DB as 'pending'
            \Illuminate\Support\Facades\DB::table('coin_transactions')->insert([
                'user_id' => $user->id,
                'type' => 'topup',
                'amount' => $package['coins'],
                'balance_before' => $user->coin_balance,
                'balance_after' => $user->coin_balance, // Will be updated on callback
                'reference_type' => 'ipaymu',
                'reference_id' => null,
                'description' => 'Top Up ' . $package['coins'] . ' Koin via iPaymu (Session: '.$sessionId.')',
                'transaction_number' => $transactionId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

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
        // Di server production asli, proses ini HANYA boleh ada di dalam fungsi callback().
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
        }

        return redirect('/akun/topup')->with('success', 'Top Up Koin Berhasil! (Koin telah ditambahkan otomatis untuk keperluan simulasi Localhost)');
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
        }

        return response()->json(['status' => 'success']);
    }
}
