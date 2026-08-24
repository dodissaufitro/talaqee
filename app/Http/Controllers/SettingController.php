<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        return \Inertia\Inertia::render('admin/Pengaturan/Index');
    }
}
