<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\CoinTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of user subscription status and available plans.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $activeSub = $user->activeSubscription;

        $plans = [
            [
                'id' => 'monthly',
                'name' => 'Premium Bulanan',
                'duration' => '30 Hari',
                'duration_days' => 30,
                'price_rp' => 'Rp 29.000',
                'price_coins' => 30,
                'badge' => null,
                'popular' => false,
            ],
            [
                'id' => 'yearly',
                'name' => 'Premium Tahunan',
                'duration' => '365 Hari',
                'duration_days' => 365,
                'price_rp' => 'Rp 199.000',
                'price_coins' => 200,
                'badge' => 'Hemat 42%',
                'popular' => true,
            ]
        ];

        $benefits = [
            [
                'title' => 'Buka Semua Bab Buku',
                'desc' => 'Akses seluruh bab dari setiap buku tanpa harus membuka dengan koin satu per satu.',
                'icon' => 'BookOpen'
            ],
            [
                'title' => 'Unduhan Tanpa Batas',
                'desc' => 'Simpan buku sebanyak yang kamu mau untuk dibaca secara offline kapan saja.',
                'icon' => 'Download'
            ],
            [
                'title' => 'Pengalaman Tanpa Iklan',
                'desc' => 'Membaca lebih khusyuk dan nyaman tanpa interupsi promosi atau iklan.',
                'icon' => 'ShieldCheck'
            ],
            [
                'title' => 'Rilis Konten Lebih Awal',
                'desc' => 'Dapatkan akses prioritas ke buku dan kajian terbaru sebelum dirilis umum.',
                'icon' => 'Sparkles'
            ],
            [
                'title' => 'Lencana Mahkota VIP',
                'desc' => 'Profil eksklusif dengan lencana Crown emas di komunitas Talaqee.',
                'icon' => 'Crown'
            ]
        ];

        $history = $user->subscriptions()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($sub) {
                return [
                    'id' => $sub->id,
                    'plan_name' => $sub->plan_name,
                    'price' => $sub->price,
                    'status' => $sub->status,
                    'started_at' => $sub->started_at ? $sub->started_at->format('d M Y') : null,
                    'expired_at' => $sub->expired_at ? $sub->expired_at->format('d M Y') : null,
                ];
            });

        $activeSubData = null;
        if ($activeSub) {
            $daysLeft = max(0, Carbon::now()->diffInDays($activeSub->expired_at, false));
            $activeSubData = [
                'id' => $activeSub->id,
                'plan_name' => $activeSub->plan_name,
                'started_at' => $activeSub->started_at->format('d M Y'),
                'expired_at' => $activeSub->expired_at->format('d M Y'),
                'days_left' => (int) ceil($daysLeft),
                'status' => $activeSub->status,
            ];
        }

        return Inertia::render('Akun/Langganan', [
            'activeSubscription' => $activeSubData,
            'plans' => $plans,
            'benefits' => $benefits,
            'history' => $history,
            'coinBalance' => $user->coin_balance,
        ]);
    }

    /**
     * Subscribe using coin balance.
     */
    public function store(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|string|in:monthly,yearly',
        ]);

        $user = auth()->user();
        $planId = $request->plan_id;

        $planDetails = [
            'monthly' => [
                'name' => 'Premium Bulanan',
                'coins' => 30,
                'days' => 30,
                'price' => 29000,
            ],
            'yearly' => [
                'name' => 'Premium Tahunan',
                'coins' => 200,
                'days' => 365,
                'price' => 199000,
            ],
        ];

        $selected = $planDetails[$planId];

        if ($user->coin_balance < $selected['coins']) {
            return back()->with('error', 'Saldo koin tidak mencukupi untuk mengaktifkan paket ini.');
        }

        // Deduct coins
        $user->decrement('coin_balance', $selected['coins']);

        // Check if there's already an active subscription to extend
        $currentActive = $user->activeSubscription;
        $startFrom = ($currentActive && $currentActive->expired_at->isFuture()) 
            ? $currentActive->expired_at 
            : Carbon::now();

        $expiredAt = (clone $startFrom)->addDays($selected['days']);

        Subscription::create([
            'user_id' => $user->id,
            'plan_name' => $selected['name'],
            'price' => $selected['price'],
            'started_at' => Carbon::now(),
            'expired_at' => $expiredAt,
            'status' => 'active',
        ]);

        return back()->with('success', "Selamat! {$selected['name']} berhasil diaktifkan.");
    }

    /**
     * Cancel an active subscription.
     */
    public function cancel(Request $request)
    {
        $user = auth()->user();
        $activeSub = $user->activeSubscription;

        if ($activeSub) {
            $activeSub->update(['status' => 'cancelled']);
            return back()->with('success', 'Langganan Anda telah dibatalkan.');
        }

        return back()->with('error', 'Tidak ditemukan langganan aktif.');
    }
}
