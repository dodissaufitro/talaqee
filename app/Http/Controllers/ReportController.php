<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        return \Inertia\Inertia::render('admin/Laporan/Index', [
            'stats' => [
                'total_penjualan' => 235450000,
                'total_transaksi' => 120,
                'total_item_terjual' => 1248,
                'rata_rata' => 1962083,
                'total_diskon' => 12450000
            ]
        ]);
    }
}
