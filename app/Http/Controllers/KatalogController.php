<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Book;

class KatalogController extends Controller
{
    public function index()
    {
        $categories = \Illuminate\Support\Facades\Cache::remember('katalog_categories', 3600, function () {
            return Category::all();
        });
        $popularBooks = \Illuminate\Support\Facades\Cache::remember('katalog_popular_books', 1800, function () {
            return Book::with(['author', 'category'])->withAvg('reviews', 'rating')->where('is_popular', true)->take(20)->get();
        });
        $bukuTerbaru = \Illuminate\Support\Facades\Cache::remember('katalog_buku_terbaru', 1800, function () {
            return Book::with(['author', 'category'])->withAvg('reviews', 'rating')->latest()->take(40)->get();
        });

        return Inertia::render('Katalog/Index', [
            'categories' => $categories,
            'popularBooks' => $popularBooks,
            'bukuTerbaru' => $bukuTerbaru
        ]);
    }
}
