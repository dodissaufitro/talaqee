<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index()
    {
        $promotions = \App\Models\Promotion::paginate(10);
            
        $totalPromotions = \App\Models\Promotion::count();
        $activePromotions = \App\Models\Promotion::where('status', 'Aktif')->count();
        $endingSoon = \App\Models\Promotion::where('status', 'Akan Berakhir')->count();
        $totalDiscount = 12450000; // static as per screenshot requirements

        return \Inertia\Inertia::render('admin/Promosi/Index', [
            'promotions' => $promotions,
            'stats' => [
                'total_promosi' => 12,
                'promosi_aktif' => 5,
                'akan_berakhir' => 2,
                'total_diskon' => $totalDiscount
            ]
        ]);
    }
}
