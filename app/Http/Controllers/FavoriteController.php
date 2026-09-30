<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    /**
     * Display a listing of user favorites.
     */
    public function index(Request $request)
    {
        $favorites = Favorite::where('user_id', auth()->id())
            ->where('content_type', 'book')
            ->with(['book.author', 'book.category'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->filter(fn($fav) => $fav->book !== null)
            ->map(function ($fav) {
                $book = $fav->book;
                return [
                    'id' => $fav->id,
                    'content_id' => $fav->content_id,
                    'created_at' => $fav->created_at ? $fav->created_at->diffForHumans() : null,
                    'book' => [
                        'id' => $book->id,
                        'title' => $book->title,
                        'cover' => $book->cover,
                        'coins_price' => $book->coins_price,
                        'price' => $book->price,
                        'average_rating' => $book->average_rating,
                        'author' => $book->author ? ['name' => $book->author->name] : null,
                        'category' => $book->category ? ['name' => $book->category->name] : null,
                    ]
                ];
            })
            ->values();

        return Inertia::render('Akun/Favorit', [
            'favorites' => $favorites,
        ]);
    }

    /**
     * Toggle favorite on/off.
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'content_type' => 'required|string|in:book,video,audio',
            'content_id' => 'required|integer',
        ]);

        $userId = auth()->id();
        $contentType = $request->content_type;
        $contentId = $request->content_id;

        $existing = Favorite::where('user_id', $userId)
            ->where('content_type', $contentType)
            ->where('content_id', $contentId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'favorited' => false,
                'message' => 'Berhasil dihapus dari favorit.',
            ]);
        }

        Favorite::create([
            'user_id' => $userId,
            'content_type' => $contentType,
            'content_id' => $contentId,
        ]);

        return response()->json([
            'favorited' => true,
            'message' => 'Berhasil ditambahkan ke favorit.',
        ]);
    }

    /**
     * Remove the specified favorite.
     */
    public function destroy($id)
    {
        Favorite::where('user_id', auth()->id())
            ->where('id', $id)
            ->delete();

        return redirect()->back()->with('success', 'Buku dihapus dari favorit.');
    }
}
