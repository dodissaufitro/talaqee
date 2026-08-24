<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NavigationItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlaceholderController extends Controller
{
    public function show(Request $request)
    {
        // Get the active navigation items for the sidebar
        $navItems = NavigationItem::where('is_active', true)->orderBy('order')->get();

        // Determine the page title based on the route name
        $routeName = $request->route()->getName();
        $title = 'Manajemen Data';

        // Find the corresponding navigation item name
        $navItem = NavigationItem::where('route', $routeName)->first();
        if ($navItem) {
            $title = $navItem->name;
        }

        return Inertia::render('admin/Placeholder', [
            'navItems' => $navItems,
            'pageTitle' => $title
        ]);
    }
}
