<?php

namespace App\Http\Controllers;

use App\Models\BookChapter;
use Illuminate\Http\Request;

use App\Models\Book;

class BookChapterController extends Controller
{
    public function create(Book $book)
    {
        return \Inertia\Inertia::render('admin/Buku/Chapters/Create', [
            'book' => $book
        ]);
    }

    public function store(Request $request, Book $book)
    {
        $validated = $request->validate([
            'chapter_number' => 'required|integer|min:1',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'page_count' => 'required|integer|min:0',
            'coin_price' => 'required|integer|min:0',
            'is_free' => 'boolean',
            'is_active' => 'boolean'
        ]);

        // Default checkbox values to false if not present
        $validated['is_free'] = $request->boolean('is_free');
        $validated['is_active'] = $request->has('is_active') ? $request->boolean('is_active') : true;

        $book->chapters()->create($validated);

        return redirect()->route('admin.books.show', $book->id)->with('success', 'Bab berhasil ditambahkan.');
    }

    public function edit(Book $book, BookChapter $chapter)
    {
        return \Inertia\Inertia::render('admin/Buku/Chapters/Edit', [
            'book' => $book,
            'chapter' => $chapter
        ]);
    }

    public function update(Request $request, Book $book, BookChapter $chapter)
    {
        $validated = $request->validate([
            'chapter_number' => 'required|integer|min:1',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'page_count' => 'required|integer|min:0',
            'coin_price' => 'required|integer|min:0',
            'is_free' => 'boolean',
            'is_active' => 'boolean'
        ]);
        
        $validated['is_free'] = $request->boolean('is_free');
        $validated['is_active'] = $request->has('is_active') ? $request->boolean('is_active') : true;

        $chapter->update($validated);

        return redirect()->route('admin.books.show', $book->id)->with('success', 'Bab berhasil diperbarui.');
    }

    public function destroy(Book $book, BookChapter $chapter)
    {
        $chapter->delete();
        return redirect()->route('admin.books.show', $book->id)->with('success', 'Bab berhasil dihapus.');
    }
}
