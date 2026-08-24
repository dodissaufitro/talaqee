<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = \App\Models\Faq::where('is_active', true)->orderBy('order', 'asc')->get();
        return \Inertia\Inertia::render('Faq/Index', [
            'faqs' => $faqs
        ]);
    }
}
