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
        $popularBooks = Book::with(['author', 'category'])->where('is_popular', true)->take(20)->get();
        $bukuTerbaru = Book::with(['author', 'category'])->latest()->take(40)->get();

        return Inertia::render('Katalog/Index', [
            'categories' => $categories,
            'popularBooks' => $popularBooks,
            'bukuTerbaru' => $bukuTerbaru
        ]);
    }
}
