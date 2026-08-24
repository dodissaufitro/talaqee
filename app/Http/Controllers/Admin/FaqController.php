<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::orderBy('order', 'asc')->get();
        return Inertia::render('admin/Faq/Index', [
            'faqs' => $faqs
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'order' => 'integer',
            'is_active' => 'boolean'
        ]);

        Faq::create($validated);

        return redirect()->back()->with('success', 'FAQ berhasil ditambahkan');
    }

    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'order' => 'integer',
            'is_active' => 'boolean'
        ]);

        $faq->update($validated);

        return redirect()->back()->with('success', 'FAQ berhasil diperbarui');
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();
        return redirect()->back()->with('success', 'FAQ berhasil dihapus');
    }
}
