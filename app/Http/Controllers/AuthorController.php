<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AuthorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $authorsQuery = Author::withCount('books');

        if ($search) {
            $authorsQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('bio', 'like', "%{$search}%");
            });
        }

        $authors = $authorsQuery->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        $totalAuthors = Author::count();
        $verifiedAuthors = Author::where('is_verified', true)->count();
        $totalBooks = Book::count();

        return Inertia::render('admin/Penulis/Index', [
            'authors' => $authors,
            'filters' => [
                'search' => $search ?? '',
            ],
            'stats' => [
                'total_authors' => $totalAuthors,
                'verified_authors' => $verifiedAuthors,
                'total_books' => $totalBooks,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'is_verified' => 'boolean',
            'photo' => 'nullable|image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        $validated['is_verified'] = $request->boolean('is_verified', false);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('authors', 'public');
            $validated['photo'] = '/storage/' . $path;
        }

        $author = Author::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'author' => $author,
                'message' => 'Penulis berhasil ditambahkan.',
            ]);
        }

        return redirect()->back()->with('success', 'Penulis berhasil ditambahkan.');
    }

    /**
     * Quick store for AJAX call in book create/edit modal.
     */
    public function quickStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        $validated['is_verified'] = false;

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('authors', 'public');
            $validated['photo'] = '/storage/' . $path;
        }

        $author = Author::create($validated);

        return response()->json([
            'success' => true,
            'author' => $author,
            'message' => 'Penulis baru berhasil ditambahkan.',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Author $author)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'is_verified' => 'boolean',
            'photo' => 'nullable|image|max:2048',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . $author->id;
        $validated['is_verified'] = $request->boolean('is_verified', false);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('authors', 'public');
            $validated['photo'] = '/storage/' . $path;
        }

        $author->update($validated);

        return redirect()->back()->with('success', 'Data penulis berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Author $author)
    {
        $author->delete();

        return redirect()->back()->with('success', 'Penulis berhasil dihapus.');
    }
}
