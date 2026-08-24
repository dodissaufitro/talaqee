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
        $categories = Category::all();
        $popularBooks = Book::with(['author', 'category'])->where('is_popular', true)->get();
        $bukuTerbaru = Book::with(['author', 'category'])->latest()->get();

        return Inertia::render('Katalog/Index', [
            'categories' => $categories,
            'popularBooks' => $popularBooks,
            'bukuTerbaru' => $bukuTerbaru
        ]);
    }
}
