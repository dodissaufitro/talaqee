<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment::with('user')->latest('id')->paginate(10);
        $totalSales = Payment::where('status', 'paid')->sum('amount');
        $totalBooks = \App\Models\BookPurchase::count(); 
        $totalCustomers = Payment::distinct('user_id')->count('user_id');
        $avgTransaction = Payment::where('status', 'paid')->avg('amount') ?? 0;

        return \Inertia\Inertia::render('admin/Penjualan/Index', [
            'payments' => $payments,
            'stats' => [
                'total_penjualan' => $totalSales,
                'total_terjual' => $totalBooks,
                'total_pelanggan' => $totalCustomers,
                'avg_transaction' => $avgTransaction
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        //
    }
}
