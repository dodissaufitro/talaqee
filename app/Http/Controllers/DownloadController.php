<?php

namespace App\Http\Controllers;

use App\Models\Download;
use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DownloadController extends Controller
{
    /**
     * Display a listing of user downloads.
     */
    public function index(Request $request)
    {
        $downloads = Download::where('user_id', auth()->id())
            ->where('content_type', 'book')
            ->with(['book.author', 'book.chapters'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->filter(fn($dl) => $dl->book !== null)
            ->map(function ($dl) {
                $book = $dl->book;
                $firstChapter = $book->chapters->first();
                return [
                    'id' => $dl->id,
                    'content_id' => $dl->content_id,
                    'file_path' => $dl->file_path,
                    'file_size' => $dl->file_size,
                    'file_size_formatted' => $this->formatBytes($dl->file_size),
                    'created_at' => $dl->created_at ? $dl->created_at->diffForHumans() : null,
                    'book' => [
                        'id' => $book->id,
                        'title' => $book->title,
                        'cover' => $book->cover,
                        'total_chapters' => $book->chapters->count(),
                        'first_chapter_id' => $firstChapter ? $firstChapter->id : null,
                        'author' => $book->author ? ['name' => $book->author->name] : null,
                    ]
                ];
            })
            ->values();

        $totalBytes = $downloads->sum('file_size');
        $totalFormatted = $this->formatBytes($totalBytes);

        return Inertia::render('Akun/Unduhan', [
            'downloads' => $downloads,
            'totalStorage' => $totalFormatted,
            'totalCount' => $downloads->count(),
        ]);
    }

    /**
     * Store a download for offline access.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content_type' => 'required|string|in:book,video,audio',
            'content_id' => 'required|integer',
        ]);

        $book = Book::with('chapters')->findOrFail($request->content_id);
        
        // Calculate estimated size or actual file size
        $estimatedBytes = max(1024 * 1024 * 2, $book->chapters->count() * 1024 * 350); // ~3.5MB to 15MB

        $download = Download::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'content_type' => $request->content_type,
                'content_id' => $request->content_id,
            ],
            [
                'file_path' => "offline/books/{$book->id}/package.data",
                'file_size' => $estimatedBytes,
            ]
        );

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'is_downloaded' => true,
                'message' => 'Buku berhasil diunduh untuk dibaca offline.',
            ]);
        }

        return redirect()->back()->with('success', 'Buku berhasil diunduh.');
    }

    /**
     * Remove the specified download.
     */
    public function destroy($id)
    {
        Download::where('user_id', auth()->id())
            ->where('id', $id)
            ->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'is_downloaded' => false,
                'message' => 'Unduhan buku dihapus.',
            ]);
        }

        return redirect()->back()->with('success', 'Unduhan berhasil dihapus.');
    }

    private function formatBytes($bytes, $precision = 1)
    {
        if ($bytes <= 0) return '0 KB';
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
