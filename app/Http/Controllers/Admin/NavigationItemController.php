<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NavigationItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NavigationItemController extends Controller
{
    public function index()
    {
        $items = NavigationItem::orderBy('order')->get();
        // We also need the current active items for the sidebar.
        $navItems = NavigationItem::where('is_active', true)->orderBy('order')->get();

        return Inertia::render('admin/navigation/Index', [
            'items' => $items,
            'navItems' => $navItems
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'route' => 'nullable|string|max:255',
            'order' => 'required|integer',
            'is_active' => 'boolean'
        ]);

        NavigationItem::create($validated);

        return redirect()->back()->with('success', 'Menu navigasi berhasil ditambahkan.');
    }

    public function update(Request $request, NavigationItem $navigationItem)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'route' => 'nullable|string|max:255',
            'order' => 'required|integer',
            'is_active' => 'boolean'
        ]);

        $navigationItem->update($validated);

        return redirect()->back()->with('success', 'Menu navigasi berhasil diubah.');
    }

    public function destroy(NavigationItem $navigationItem)
    {
        $navigationItem->delete();

        return redirect()->back()->with('success', 'Menu navigasi berhasil dihapus.');
    }
}
