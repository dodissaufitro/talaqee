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

        // Unset chapters from book data to prevent unknown column error
        unset($validated['chapters']);

        $book = Book::create($validated);

        // Notifikasi ke semua user
        $users = \App\Models\User::all();
        foreach($users as $u) {
            \App\Models\Notification::create([
                'user_id' => $u->id,
                'title' => 'Buku Baru: ' . $book->title,
                'message' => 'Buku baru telah ditambahkan ke katalog. Baca sekarang!',
                'type' => 'new_book',
                'action_url' => '/buku/' . $book->id,
                'is_read' => false
            ]);
        }

        if ($request->filled('chapters')) {
            $chapters = json_decode($request->chapters, true);
            if (is_array($chapters)) {
                foreach ($chapters as $index => $chapter) {
                    $hasTitle = !empty($chapter['title']);
                    $hasContent = !empty($chapter['content']);
                    $hasPdf = $request->hasFile("chapter_pdf_{$index}");

                    if ($hasTitle || $hasContent || $hasPdf) {
                        $coinPrice = isset($chapter['coin_price']) && $chapter['coin_price'] !== '' 
                            ? (int)$chapter['coin_price'] 
                            : ($book->coin_per_chapter ?? 10);
                        $isFree = $coinPrice == 0;

                        $pdfPath = null;
                        if ($hasPdf) {
                            $stored = $request->file("chapter_pdf_{$index}")->store('chapters', 'public');
                            $pdfPath = '/storage/' . $stored;
                        }

                        $book->chapters()->create([
                            'chapter_number' => $index + 1,
                            'title' => !empty($chapter['title']) ? $chapter['title'] : 'Bab ' . ($index + 1),
                            'content' => $chapter['content'] ?? null,
                            'pdf_file' => $pdfPath,
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
                    $hasTitle = !empty($chapterData['title']);
                    $hasContent = !empty($chapterData['content']);
                    $hasPdf = $request->hasFile("chapter_pdf_{$index}");
                    $existingPdf = $chapterData['pdf_file'] ?? null;

                    if ($hasTitle || $hasContent || $hasPdf || $existingPdf) {
                        $coinPrice = isset($chapterData['coin_price']) && $chapterData['coin_price'] !== '' 
                            ? (int)$chapterData['coin_price'] 
                            : ($book->coin_per_chapter ?? 10);
                        $isFree = $coinPrice == 0;

                        $pdfPath = $existingPdf;
                        if ($hasPdf) {
                            $stored = $request->file("chapter_pdf_{$index}")->store('chapters', 'public');
                            $pdfPath = '/storage/' . $stored;
                        }

                        if (isset($chapterData['id']) && $chapterData['id']) {
                            // Update existing
                            $chapter = $book->chapters()->find($chapterData['id']);
                            if ($chapter) {
                                $updateData = [
                                    'chapter_number' => $index + 1,
                                    'title' => !empty($chapterData['title']) ? $chapterData['title'] : 'Bab ' . ($index + 1),
                                    'content' => $chapterData['content'] ?? null,
                                    'coin_price' => $coinPrice,
                                    'is_free' => $isFree,
                                ];
                                if ($pdfPath !== null) {
                                    $updateData['pdf_file'] = $pdfPath;
                                }
                                $chapter->update($updateData);
                                $existingChapterIds[] = $chapter->id;
                            }
                        } else {
                            // Create new
                            $newChapter = $book->chapters()->create([
                                'chapter_number' => $index + 1,
                                'title' => !empty($chapterData['title']) ? $chapterData['title'] : 'Bab ' . ($index + 1),
                                'content' => $chapterData['content'] ?? null,
                                'pdf_file' => $pdfPath,
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
