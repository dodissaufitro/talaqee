<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RefundPolicyController extends Controller
{
    public function index()
    {
        $page = Page::firstOrCreate(
            ['slug' => 'refund-policy'],
            [
                'title' => 'Refund Policy',
                'content' => ''
            ]
        );

        return Inertia::render('admin/RefundPolicy/Index', [
            'page' => $page
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'content' => 'nullable|string',
        ]);

        $page = Page::where('slug', 'refund-policy')->firstOrFail();
        $page->update([
            'content' => $validated['content'] ?? ''
        ]);

        return redirect()->back()->with('success', 'Refund Policy berhasil diperbarui');
    }
}
