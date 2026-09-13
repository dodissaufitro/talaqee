<?php

namespace App\Http\Controllers;

use App\Models\BookChapter;
use Illuminate\Http\Request;

use App\Models\Book;

class BookChapterController extends Controller
{
    public function create(Book $book)
    {
        return \Inertia\Inertia::render('admin/Buku/Chapters/Create', [
            'book' => $book
        ]);
    }

    public function store(Request $request, Book $book)
    {
        $validated = $request->validate([
            'chapter_number' => 'required|integer|min:1',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'doc_file' => 'nullable|file|mimes:docx,txt|max:20480',
            'pdf_file' => 'nullable|file|mimes:pdf|max:51200',
            'page_count' => 'nullable|integer|min:0',
            'coin_price' => 'required|integer|min:0',
            'is_free' => 'boolean',
            'is_active' => 'boolean'
        ]);

        // Default checkbox values to false if not present
        $validated['is_free'] = $request->boolean('is_free');
        $validated['is_active'] = $request->has('is_active') ? $request->boolean('is_active') : true;

        // Ekstraksi teks dari file Word / Teks jika diunggah
        if ($request->hasFile('doc_file')) {
            $extractedText = $this->extractTextFromFile($request->file('doc_file'));
            if (!empty($extractedText)) {
                $validated['content'] = $extractedText;
            }
        }

        // Estimasi jumlah halaman jika 0 atau belum diisi (rata-rata 250 kata per halaman)
        if (empty($validated['page_count']) || (int)$validated['page_count'] === 0) {
            $words = str_word_count(strip_tags($validated['content'] ?? ''));
            $validated['page_count'] = max(1, (int)ceil($words / 250));
        }

        if ($request->hasFile('pdf_file')) {
            $path = $request->file('pdf_file')->store('chapters', 'public');
            $validated['pdf_file'] = '/storage/' . $path;
        }

        unset($validated['doc_file']);

        $book->chapters()->create($validated);

        return redirect()->route('admin.books.show', $book->id)->with('success', 'Bab teks berhasil ditambahkan.');
    }

    public function edit(Book $book, BookChapter $chapter)
    {
        return \Inertia\Inertia::render('admin/Buku/Chapters/Edit', [
            'book' => $book,
            'chapter' => $chapter
        ]);
    }

    public function update(Request $request, Book $book, BookChapter $chapter)
    {
        $validated = $request->validate([
            'chapter_number' => 'required|integer|min:1',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'doc_file' => 'nullable|file|mimes:docx,txt|max:20480',
            'pdf_file' => 'nullable|file|mimes:pdf|max:51200',
            'page_count' => 'nullable|integer|min:0',
            'coin_price' => 'required|integer|min:0',
            'is_free' => 'boolean',
            'is_active' => 'boolean'
        ]);
        
        $validated['is_free'] = $request->boolean('is_free');
        $validated['is_active'] = $request->has('is_active') ? $request->boolean('is_active') : true;

        // Ekstraksi teks dari file Word / Teks jika diunggah
        if ($request->hasFile('doc_file')) {
            $extractedText = $this->extractTextFromFile($request->file('doc_file'));
            if (!empty($extractedText)) {
                $validated['content'] = $extractedText;
            }
        }

        // Estimasi jumlah halaman jika 0 atau belum diisi
        if (empty($validated['page_count']) || (int)$validated['page_count'] === 0) {
            $words = str_word_count(strip_tags($validated['content'] ?? ''));
            $validated['page_count'] = max(1, (int)ceil($words / 250));
        }

        if ($request->hasFile('pdf_file')) {
            $path = $request->file('pdf_file')->store('chapters', 'public');
            $validated['pdf_file'] = '/storage/' . $path;
        }

        unset($validated['doc_file']);

        $chapter->update($validated);

        return redirect()->route('admin.books.show', $book->id)->with('success', 'Bab teks berhasil diperbarui.');
    }

    /**
     * Ekstrak teks bersih dari dokumen Word (.docx) atau berkas Teks (.txt)
     */
    private function extractTextFromFile($file): ?string
    {
        $extension = strtolower($file->getClientOriginalExtension());

        if ($extension === 'txt') {
            return file_get_contents($file->getRealPath());
        }

        if ($extension === 'docx') {
            $zip = new \ZipArchive();
            if ($zip->open($file->getRealPath()) === true) {
                $xml = $zip->getFromName('word/document.xml');
                $zip->close();
                if ($xml) {
                    $xml = str_replace(['</w:p>', '<w:br/>', '<w:br>', '<w:cr/>'], ["\n\n", "\n", "\n", "\n"], $xml);
                    $text = strip_tags($xml);
                    $decoded = html_entity_decode($text, ENT_QUOTES | ENT_XML1, 'UTF-8');
                    $lines = explode("\n", $decoded);
                    $cleaned = array_map(function ($line) {
                        return trim(preg_replace('/[ \t]+/', ' ', $line));
                    }, $lines);
                    return trim(implode("\n", $cleaned));
                }
            }
        }

        return null;
    }

    public function destroy(Book $book, BookChapter $chapter)
    {
        $chapter->delete();
        return redirect()->route('admin.books.show', $book->id)->with('success', 'Bab berhasil dihapus.');
    }
}
