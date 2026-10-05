<?php

namespace App\Http\Controllers;

use App\Models\CoinPackage;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        // Auto-sync jika payment masih kosong
        if (Payment::count() === 0) {
            self::syncIpaymuTransactions();
        }

        $query = Payment::with(['user', 'coinPackage']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhere('payment_method', 'like', "%{$search}%")
                  ->orWhere('payment_reference', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%")
                         ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status') && $request->status !== 'Semua Status') {
            $statusMap = [
                'Selesai' => 'paid',
                'Paid' => 'paid',
                'Pending' => 'pending',
                'Dibatalkan' => 'cancelled',
                'Gagal' => 'failed'
            ];
            $statusValue = $statusMap[$request->status] ?? $request->status;
            $query->where('status', $statusValue);
        }

        if ($request->filled('method') && $request->method !== 'Semua Metode') {
            $query->where('payment_method', 'like', "%{$request->method}%");
        }

        $transactions = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
            
        $totalTransactions = Payment::where('status', 'paid')->count();
        $totalRevenue = (float) Payment::where('status', 'paid')->sum('amount');
        $totalBelanja = (float) Payment::sum('amount');
        $avgTransaction = $totalTransactions > 0 ? ($totalRevenue / $totalTransactions) : 0;

        return Inertia::render('admin/Transaksi/Index', [
            'transactions' => $transactions,
            'stats' => [
                'total_transaksi' => $totalTransactions,
                'total_pendapatan' => $totalRevenue,
                'total_belanja' => $totalBelanja,
                'rata_rata' => $avgTransaction
            ],
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? '',
                'method' => $request->method ?? '',
            ]
        ]);
    }

    public function sync(Request $request)
    {
        $count = self::syncIpaymuTransactions();
        return redirect()->back()->with('success', "Berhasil menyinkronkan {$count} transaksi dari iPaymu.");
    }

    public static function syncIpaymuTransactions(): int
    {
        $va = env('IPAYMU_VA');
        $apiKey = env('IPAYMU_API_KEY');
        $baseUrl = env('IPAYMU_URL', 'https://sandbox.ipaymu.com/api/v2/payment');

        if (empty($va) || empty($apiKey)) {
            return 0;
        }

        $historyUrl = str_contains($baseUrl, 'sandbox') 
            ? 'https://sandbox.ipaymu.com/api/v2/history'
            : 'https://my.ipaymu.com/api/v2/history';

        try {
            $body = ['status' => 1, 'page' => 1];
            $jsonBody = json_encode($body, JSON_UNESCAPED_SLASHES);
            $bodyHash = strtolower(hash('sha256', $jsonBody));
            $stringToSign = 'POST:' . $va . ':' . $bodyHash . ':' . $apiKey;
            $signature = hash_hmac('sha256', $stringToSign, $apiKey);

            $response = Http::timeout(10)->withoutVerifying()->withHeaders([
                'Content-Type' => 'application/json',
                'signature' => $signature,
                'va' => $va,
                'timestamp' => date('YmdHis')
            ])->post($historyUrl, $body);

            if ($response->successful()) {
                $data = $response->json();
                $transactions = $data['Data']['Transaction'] ?? [];
                $syncedCount = 0;

                foreach ($transactions as $trx) {
                    $refId = $trx['ReferenceId'] ?? null;
                    $buyerEmail = $trx['BuyerEmail'] ?? null;
                    $amount = (float) ($trx['SubTotal'] ?? $trx['Amount'] ?? 0);
                    $paymentMethod = $trx['PaymentMethod'] ?? 'iPaymu';
                    if (!empty($trx['PaymentChannel']) && strtolower($trx['PaymentChannel']) !== strtolower($paymentMethod)) {
                        $paymentMethod .= ' (' . strtoupper($trx['PaymentChannel']) . ')';
                    }
                    $trxId = (string) ($trx['TransactionId'] ?? '');
                    $successDate = !empty($trx['SuccessDate']) ? $trx['SuccessDate'] : (!empty($trx['CreatedDate']) ? $trx['CreatedDate'] : now());

                    $user = null;
                    if ($refId && preg_match('/-(\d+)$/', $refId, $matches)) {
                        $user = User::find($matches[1]);
                    }
                    if (!$user && $buyerEmail) {
                        $user = User::where('email', $buyerEmail)->first();
                    }
                    if (!$user) {
                        $user = User::first();
                    }

                    $package = CoinPackage::where('price', $amount)->first();

                    Payment::updateOrCreate(
                        ['invoice_number' => $refId ?: ('IPAYMU-' . $trxId)],
                        [
                            'user_id' => $user->id,
                            'coin_package_id' => $package ? $package->id : null,
                            'amount' => $amount,
                            'payment_method' => $paymentMethod,
                            'payment_reference' => $trxId,
                            'status' => 'paid',
                            'paid_at' => $successDate,
                            'created_at' => !empty($trx['CreatedDate']) ? $trx['CreatedDate'] : $successDate,
                            'updated_at' => now(),
                        ]
                    );

                    $syncedCount++;
                }

                return $syncedCount;
            }
        } catch (\Exception $e) {
            Log::error('Gagal menyinkronkan transaksi iPaymu: ' . $e->getMessage());
        }

        return 0;
    }
}
