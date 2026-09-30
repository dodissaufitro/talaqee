<?php

namespace App\Http\Controllers;

use App\Models\ReadingProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReadingProgressController extends Controller
{
    /**
     * Display a listing of reading history for authenticated user.
     */
    public function index(Request $request)
    {
        $history = ReadingProgress::where('user_id', auth()->id())
            ->with(['book.author', 'chapter'])
            ->orderBy('last_read_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'book_id' => $item->book_id,
                    'chapter_id' => $item->chapter_id,
                    'current_page' => $item->current_page,
                    'total_page' => $item->total_page,
                    'progress_percent' => $item->progress_percent,
                    'last_read_at' => $item->last_read_at ? $item->last_read_at->diffForHumans() : null,
                    'last_read_formatted' => $item->last_read_at ? $item->last_read_at->format('d M Y, H:i') : null,
                    'book' => $item->book ? [
                        'id' => $item->book->id,
                        'title' => $item->book->title,
                        'cover' => $item->book->cover,
                        'author' => $item->book->author ? ['name' => $item->book->author->name] : null,
                    ] : null,
                    'chapter' => $item->chapter ? [
                        'id' => $item->chapter->id,
                        'chapter_number' => $item->chapter->chapter_number,
                        'title' => $item->chapter->title,
                    ] : null,
                ];
            });

        return Inertia::render('Akun/Riwayat', [
            'history' => $history,
        ]);
    }

    /**
     * Remove the specified reading history item.
     */
    public function destroy($id)
    {
        ReadingProgress::where('user_id', auth()->id())
            ->where('id', $id)
            ->delete();

        return redirect()->back()->with('success', 'Riwayat berhasil dihapus.');
    }

    /**
     * Clear all reading history for the user.
     */
    public function clearAll()
    {
        ReadingProgress::where('user_id', auth()->id())->delete();

        return redirect()->back()->with('success', 'Semua riwayat baca berhasil dibersihkan.');
    }
}
