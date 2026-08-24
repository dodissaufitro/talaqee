<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserRecording;
use Illuminate\Support\Facades\Storage;

class RecordingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'ayah_id' => 'required|exists:ayahs,id',
            'audio' => 'required|file|mimes:webm,mp3,mp4,wav,ogg|max:10240', // 10MB max
            'duration' => 'nullable|integer'
        ]);

        $user = auth()->user();
        $ayah = \App\Models\Ayah::find($request->ayah_id);

        $hasRecordedAyah = UserRecording::where('user_id', $user->id)
            ->where('ayah_id', $request->ayah_id)
            ->exists();

        // Hanya potong koin jika ini adalah setoran pertama untuk ayat tersebut (dan ayat > 1)
        if (!$hasRecordedAyah && $ayah && $ayah->number_in_surah > 1) {
            if ($user->coin_balance < 10) {
                return response()->json([
                    'error' => 'Saldo Koin tidak cukup. Setoran untuk Ayat 2 dan seterusnya membutuhkan 10 Koin. Silakan Top Up.'
                ], 403);
            }
            $user->coin_balance -= 10;
            $user->save();
        }

        $file = $request->file('audio');
        $fileName = 'recording_' . auth()->id() . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('recordings', $fileName, 'public');

        $recording = UserRecording::create([
            'user_id' => auth()->id(),
            'ayah_id' => $request->ayah_id,
            'file_path' => Storage::disk('public')->url($path),
            'duration' => $request->duration
        ]);

        return response()->json([
            'message' => 'Recording saved successfully',
            'recording' => $recording
        ]);
    }
}
