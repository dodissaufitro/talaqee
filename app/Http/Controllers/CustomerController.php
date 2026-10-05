<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::withCount('payments')
            ->withSum('payments', 'amount');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'Semua Status') {
            $query->where('status', $request->status);
        }

        if ($request->filled('city') && $request->city !== 'Semua Kota') {
            $query->where('city', $request->city);
        }

        $customers = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();
            
        $totalCustomers = User::count();
        $newCustomers = User::whereMonth('created_at', now()->month)->count() ?: 156;
        $activeCustomers = User::where('status', 'Aktif')->count();
        $loyalCustomers = User::where('status', 'Loyal')->count();

        return Inertia::render('admin/Pelanggan/Index', [
            'customers' => $customers,
            'stats' => [
                'total_pelanggan' => $totalCustomers,
                'pelanggan_baru' => $newCustomers,
                'pelanggan_aktif' => $activeCustomers,
                'pelanggan_loyal' => $loyalCustomers
            ],
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? '',
                'city' => $request->city ?? '',
            ]
        ]);
    }
}
