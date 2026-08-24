<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Surah;
use Inertia\Inertia;

class QuranController extends Controller
{
    public function index()
    {
        $surahs = Surah::orderBy('number')->get();
        return Inertia::render('Alquran/Index', [
            'surahs' => $surahs
        ]);
    }

    public function show($id)
    {
        $surah = Surah::with(['ayahs' => function($query) {
            $query->orderBy('number_in_surah');
        }, 'ayahs.recordings' => function($query) {
            $query->where('user_id', auth()->id());
        }])->findOrFail($id);

        return Inertia::render('Alquran/Show', [
            'surah' => $surah
        ]);
    }
}
