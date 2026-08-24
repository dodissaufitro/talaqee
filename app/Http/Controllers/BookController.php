<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $books = Book::with(['author', 'category'])->paginate(10);
        $totalBooks = Book::count();
        $totalStock = Book::sum('stock');
        $totalCategories = \App\Models\Category::count();
        $totalShelves = 15; // dummy

        return \Inertia\Inertia::render('admin/Buku/Index', [
            'books' => $books,
            'stats' => [
                'total_buku' => $totalBooks,
                'stok_tersedia' => $totalStock,
                'kategori' => $totalCategories,
                'rak' => $totalShelves
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = \App\Models\Category::all();
        $authors = \App\Models\Author::all();
        return \Inertia\Inertia::render('admin/Buku/Create', [
            'categories' => $categories,
            'authors' => $authors
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'author_id' => 'nullable|exists:authors,id',
            'description' => 'nullable|string',
            'coin_per_chapter' => 'nullable|integer|min:0',
            'is_free' => 'boolean',
            'is_featured' => 'boolean',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
            'cover' => 'nullable|image|max:2048',
            'chapters' => 'nullable|string'
        ]);

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']) . '-' . uniqid();
        
        if ($request->hasFile('cover')) {
            $path = $request->file('cover')->store('covers', 'public');
            $validated['cover'] = '/storage/' . $path;
        }

        $book = Book::create($validated);

        if ($request->filled('chapters')) {
            $chapters = json_decode($request->chapters, true);
            if (is_array($chapters)) {
                foreach ($chapters as $index => $chapter) {
                    if (!empty($chapter['title']) && !empty($chapter['content'])) {
                        $coinPrice = isset($chapter['coin_price']) && $chapter['coin_price'] !== '' 
                            ? (int)$chapter['coin_price'] 
                            : ($book->coin_per_chapter ?? 10);
                        $isFree = $coinPrice == 0;

                        $book->chapters()->create([
                            'chapter_number' => $index + 1,
                            'title' => $chapter['title'],
                            'content' => $chapter['content'],
                            'coin_price' => $coinPrice,
                            'is_free' => $isFree,
                            'is_active' => true,
                        ]);
                    }
                }
            }
        }

        return redirect()->route('admin.books.index')->with('success', 'Buku beserta bab berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        $book->load(['author', 'category', 'purchases', 'chapters']);
        $salesData = [
            'total_sales' => $book->purchases()->sum('coin_price') ?? 0,
            'total_purchases' => $book->purchases()->count(),
        ];
        return \Inertia\Inertia::render('admin/Buku/Show', [
            'book' => $book,
            'chapters' => $book->chapters,
            'salesData' => $salesData
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        $book->load('chapters');
        $categories = \App\Models\Category::all();
        $authors = \App\Models\Author::all();
        return \Inertia\Inertia::render('admin/Buku/Edit', [
            'book' => $book,
            'categories' => $categories,
            'authors' => $authors
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'author_id' => 'nullable|exists:authors,id',
            'description' => 'nullable|string',
            'coin_per_chapter' => 'nullable|integer|min:0',
            'is_free' => 'boolean',
            'is_featured' => 'boolean',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
            'cover' => 'nullable|image|max:2048',
            'chapters' => 'nullable|string'
        ]);

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['title']) . '-' . $book->id;
        
        if ($request->hasFile('cover')) {
            $path = $request->file('cover')->store('covers', 'public');
            $validated['cover'] = '/storage/' . $path;
        }

        unset($validated['chapters']);
        $book->update($validated);

        if ($request->filled('chapters')) {
            $chapters = json_decode($request->chapters, true);
            if (is_array($chapters)) {
                $existingChapterIds = [];
                foreach ($chapters as $index => $chapterData) {
                    if (!empty($chapterData['title']) && !empty($chapterData['content'])) {
                        $coinPrice = isset($chapterData['coin_price']) && $chapterData['coin_price'] !== '' 
                            ? (int)$chapterData['coin_price'] 
                            : ($book->coin_per_chapter ?? 10);
                        $isFree = $coinPrice == 0;

                        if (isset($chapterData['id']) && $chapterData['id']) {
                            // Update existing
                            $chapter = $book->chapters()->find($chapterData['id']);
                            if ($chapter) {
                                $chapter->update([
                                    'chapter_number' => $index + 1,
                                    'title' => $chapterData['title'],
                                    'content' => $chapterData['content'],
                                    'coin_price' => $coinPrice,
                                    'is_free' => $isFree,
                                ]);
                                $existingChapterIds[] = $chapter->id;
                            }
                        } else {
                            // Create new
                            $newChapter = $book->chapters()->create([
                                'chapter_number' => $index + 1,
                                'title' => $chapterData['title'],
                                'content' => $chapterData['content'],
                                'coin_price' => $coinPrice,
                                'is_free' => $isFree,
                                'is_active' => true,
                            ]);
                            $existingChapterIds[] = $newChapter->id;
                        }
                    }
                }
                // Optionally delete chapters that were removed from the UI
                $book->chapters()->whereNotIn('id', $existingChapterIds)->delete();
            }
        } else if ($request->has('chapters') && empty($request->chapters)) {
            // If chapters is explicitly empty string/array, delete all chapters
            $book->chapters()->delete();
        }

        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        $book->delete();
        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil dihapus.');
    }
}
