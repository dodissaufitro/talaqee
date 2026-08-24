<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AudioPageController extends Controller
{
    public function index()
    {
        $categories = \App\Models\Category::withCount('videos')->get();
        $audios = \App\Models\Audio::with(['category', 'user'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        $setorans = \App\Models\UserRecording::with(['ayah.surah'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        $surahs = \App\Models\Surah::orderBy('number')->get();

        return \Inertia\Inertia::render('Audios/Index', [
            'categories' => $categories,
            'audios' => $audios,
            'setorans' => $setorans,
            'surahs' => $surahs,
        ]);
    }
}
