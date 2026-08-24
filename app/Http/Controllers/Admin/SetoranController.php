<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserRecording;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SetoranController extends Controller
{
    public function index()
    {
        $recordings = UserRecording::with(['user', 'ayah.surah'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('admin/Setoran/Index', [
            'recordings' => $recordings
        ]);
    }

    public function comment(Request $request, UserRecording $recording)
    {
        $request->validate([
            'admin_comment_text' => 'nullable|string',
            'admin_comment_audio' => 'nullable|file|mimes:webm,mp3,mp4,wav,ogg|max:10240',
        ]);

        $data = [];
        if ($request->has('admin_comment_text')) {
            $data['admin_comment_text'] = $request->admin_comment_text;
        }

        if ($request->hasFile('admin_comment_audio')) {
            $file = $request->file('admin_comment_audio');
            $fileName = 'admin_comment_' . $recording->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('recordings/comments', $fileName, 'public');
            $data['admin_comment_audio_path'] = \Illuminate\Support\Facades\Storage::disk('public')->url($path);
        }

        $recording->update($data);

        \App\Models\Notification::create([
            'user_id' => $recording->user_id,
            'title' => 'Balasan Setoran',
            'message' => 'Super Admin telah memberikan evaluasi pada rekaman hafalan Anda.',
            'type' => 'setoran_reply',
            'action_url' => '/audios',
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Comment saved successfully',
            'recording' => $recording
        ]);
    }
}
