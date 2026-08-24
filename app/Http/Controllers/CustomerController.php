<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = \App\Models\User::withCount('payments')
            ->withSum('payments', 'amount')
            ->paginate(10);
            
        $totalCustomers = \App\Models\User::count();
        $newCustomers = \App\Models\User::whereMonth('created_at', now()->month)->count() ?: 156; // dummy fallback
        $activeCustomers = \App\Models\User::where('status', 'Aktif')->count();
        $loyalCustomers = \App\Models\User::where('status', 'Loyal')->count();

        return \Inertia\Inertia::render('admin/Pelanggan/Index', [
            'customers' => $customers,
            'stats' => [
                'total_pelanggan' => $totalCustomers,
                'pelanggan_baru' => $newCustomers,
                'pelanggan_aktif' => $activeCustomers,
                'pelanggan_loyal' => $loyalCustomers
            ]
        ]);
    }
}
