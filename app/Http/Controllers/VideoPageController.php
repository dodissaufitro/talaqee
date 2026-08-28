<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VideoPageController extends Controller
{
    public function index()
    {
        $categories = \Illuminate\Support\Facades\Cache::remember('categories_with_video_count', 3600, function () {
            return \App\Models\Category::withCount('videos')->get();
        });
        $recentVideos = \App\Models\Video::with('author', 'category')->orderBy('created_at', 'desc')->take(15)->get();
        $popularVideos = \App\Models\Video::with('author', 'category')->orderBy('total_views', 'desc')->take(15)->get();

        return \Inertia\Inertia::render('Videos/Index', [
            'categories' => $categories,
            'recentVideos' => $recentVideos,
            'popularVideos' => $popularVideos,
        ]);
    }

    public function show(Request $request, $id)
    {
        $video = \App\Models\Video::with('author', 'category')->find($id);

        if ($video) {
            $viewedSessionKey = 'viewed_video_' . $video->id;
            if (!$request->session()->has($viewedSessionKey)) {
                $video->increment('total_views');
                $request->session()->put($viewedSessionKey, true);
            }
        }

        // Jika video tidak ditemukan, tampilkan dengan data kosong (komponen punya default)
        $relatedVideos = \App\Models\Video::with('author')
            ->where('id', '!=', $id)
            ->orderBy('total_views', 'desc')
            ->take(10)
            ->get();

        return \Inertia\Inertia::render('Videos/Show', [
            'video' => $video,
            'relatedVideos' => $relatedVideos,
        ]);
    }
}
