<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AudioPageController extends Controller
{
    public function index()
    {
        $categories = \Illuminate\Support\Facades\Cache::remember('categories_with_video_count', 3600, function () {
            return \App\Models\Category::withCount('videos')->get();
        });
        
        $audios = auth()->check() ? \App\Models\Audio::with(['category', 'user'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->take(30)
            ->get() : collect();
            
        $setorans = auth()->check() ? \App\Models\UserRecording::with(['ayah.surah'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->take(30)
            ->get() : collect();

        $surahs = \Illuminate\Support\Facades\Cache::remember('all_surahs', 3600 * 24, function () {
            return \App\Models\Surah::orderBy('number')->get();
        });

        return \Inertia\Inertia::render('Audios/Index', [
            'categories' => $categories,
            'audios' => $audios,
            'setorans' => $setorans,
            'surahs' => $surahs,
        ]);
    }
}
