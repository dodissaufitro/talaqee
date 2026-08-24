<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\NavigationItem;

class VideoController extends Controller
{
    public function index()
    {
        $videos = Video::orderBy('created_at', 'desc')->get();
        $navItems = NavigationItem::orderBy('order')->get();
        
        return Inertia::render('admin/Videos/Index', [
            'videos' => $videos,
            'navItems' => $navItems,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'video_file' => 'nullable|file|mimes:mp4,mkv,avi,webm|max:1048576', // max 1GB
            'temp_video_path' => 'nullable|string',
            'original_extension' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'duration' => 'nullable|integer',
            'description' => 'nullable|string',
            'coin_reward' => 'nullable|integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $video = new Video();
        $video->title = $request->title;
        $video->slug = \Illuminate\Support\Str::slug($request->title) . '-' . time();
        $video->duration = $request->duration ?? 0;
        $video->description = $request->description;
        $video->coin_reward = $request->coin_reward ?? 0;
        $video->is_featured = $request->boolean('is_featured');
        $video->is_active = $request->boolean('is_active', true);

        if ($request->hasFile('video_file')) {
            $videoPath = $request->file('video_file')->store('videos', 'public');
            $video->video_url = $videoPath;
        } elseif ($request->filled('temp_video_path')) {
            $tempPath = $request->temp_video_path;
            $extension = $request->original_extension ?? 'mp4';
            $newPath = 'videos/' . uniqid() . '_' . time() . '.' . $extension;
            Storage::disk('public')->move($tempPath, $newPath);
            $video->video_url = $newPath;
        }

        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails/videos', 'public');
            $video->thumbnail = $thumbnailPath;
        }

        $video->save();

        return redirect()->back()->with('success', 'Video berhasil ditambahkan.');
    }

    public function update(Request $request, Video $video)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'video_file' => 'nullable|file|mimes:mp4,mkv,avi,webm|max:1048576',
            'temp_video_path' => 'nullable|string',
            'original_extension' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'duration' => 'nullable|integer',
            'description' => 'nullable|string',
            'coin_reward' => 'nullable|integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $video->title = $request->title;
        // Don't change slug on update usually, unless requested
        $video->duration = $request->duration ?? $video->duration;
        $video->description = $request->description;
        $video->coin_reward = $request->coin_reward ?? 0;
        $video->is_featured = $request->boolean('is_featured');
        $video->is_active = $request->boolean('is_active', true);

        if ($request->hasFile('video_file')) {
            if ($video->video_url) {
                Storage::disk('public')->delete($video->video_url);
            }
            $videoPath = $request->file('video_file')->store('videos', 'public');
            $video->video_url = $videoPath;
        } elseif ($request->filled('temp_video_path')) {
            if ($video->video_url) {
                Storage::disk('public')->delete($video->video_url);
            }
            $tempPath = $request->temp_video_path;
            $extension = $request->original_extension ?? 'mp4';
            $newPath = 'videos/' . uniqid() . '_' . time() . '.' . $extension;
            Storage::disk('public')->move($tempPath, $newPath);
            $video->video_url = $newPath;
        }

        if ($request->hasFile('thumbnail')) {
            if ($video->thumbnail && Storage::disk('public')->exists($video->thumbnail)) {
                Storage::disk('public')->delete($video->thumbnail);
            }
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails/videos', 'public');
            $video->thumbnail = $thumbnailPath;
        }

        $video->save();

        return redirect()->back()->with('success', 'Video berhasil diperbarui.');
    }

    public function destroy(Video $video)
    {
        if ($video->video_url && Storage::disk('public')->exists($video->video_url)) {
            Storage::disk('public')->delete($video->video_url);
        }

        if ($video->thumbnail && Storage::disk('public')->exists($video->thumbnail)) {
            Storage::disk('public')->delete($video->thumbnail);
        }

        $video->delete();

        return redirect()->back()->with('success', 'Video berhasil dihapus.');
    }

    public function uploadChunk(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
            'file_id' => 'required|string',
            'chunk_index' => 'required|integer',
            'total_chunks' => 'required|integer',
        ]);

        $fileId = $request->file_id;
        $chunkIndex = $request->chunk_index;
        $totalChunks = $request->total_chunks;

        $tempPath = 'temp_uploads/' . $fileId;
        Storage::disk('public')->makeDirectory($tempPath);
        
        $chunkFile = $request->file('file');
        Storage::disk('public')->putFileAs($tempPath, $chunkFile, $chunkIndex . '.part');

        // Check if all chunks are uploaded
        $files = Storage::disk('public')->files($tempPath);
        if (count($files) === (int)$totalChunks) {
            $finalPath = 'temp_uploads/' . $fileId . '_final.tmp';
            $finalFullPath = Storage::disk('public')->path($finalPath);
            
            $out = fopen($finalFullPath, 'wb');
            for ($i = 0; $i < $totalChunks; $i++) {
                $chunkFullPath = Storage::disk('public')->path($tempPath . '/' . $i . '.part');
                $in = fopen($chunkFullPath, 'rb');
                while ($buff = fread($in, 4096)) {
                    fwrite($out, $buff);
                }
                fclose($in);
                unlink($chunkFullPath);
            }
            fclose($out);
            
            Storage::disk('public')->deleteDirectory($tempPath);
            
            return response()->json([
                'success' => true,
                'temp_video_path' => $finalPath
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Chunk uploaded'
        ]);
    }
}
