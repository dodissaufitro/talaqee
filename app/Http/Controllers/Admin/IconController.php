<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Icon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IconController extends Controller
{
    public function index(Request $request)
    {
        $query = Icon::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('label', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $icons = $query->orderBy('category')->orderBy('name')->paginate(24)->withQueryString();
        $categories = Icon::select('category')->distinct()->pluck('category')->filter()->values();
        
        $stats = [
            'total' => Icon::count(),
            'active' => Icon::where('is_active', true)->count(),
            'categories_count' => $categories->count(),
        ];

        return Inertia::render('admin/Icons/Index', [
            'icons' => $icons,
            'categories' => $categories,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search ?? '',
                'category' => $request->category ?? 'all',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:icons,name',
            'label' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'svg' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if (empty($validated['category'])) {
            $validated['category'] = 'Umum';
        }

        Icon::create($validated);

        return redirect()->back()->with('success', 'Ikon berhasil ditambahkan.');
    }

    public function update(Request $request, Icon $icon)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:icons,name,' . $icon->id,
            'label' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'svg' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if (empty($validated['category'])) {
            $validated['category'] = 'Umum';
        }

        $icon->update($validated);

        return redirect()->back()->with('success', 'Ikon berhasil diperbarui.');
    }

    public function destroy(Icon $icon)
    {
        $icon->delete();

        return redirect()->back()->with('success', 'Ikon berhasil dihapus.');
    }
}
