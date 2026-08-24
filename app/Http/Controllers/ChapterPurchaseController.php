<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookChapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChapterPurchaseController extends Controller
{
    public function unlock(Request $request, Book $book, BookChapter $chapter)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login')->with('error', 'Anda harus login terlebih dahulu untuk membuka bab ini.');
        }

        // 1. Cek apakah chapter ini milik buku yang benar
        if ($chapter->book_id !== $book->id) {
            return back()->with('error', 'Bab tidak valid.');
        }

        // 2. Cek apakah bab ini gratis
        if ($chapter->is_free) {
            return redirect()->route('buku.read', ['book' => $book->id, 'chapter' => $chapter->id]);
        }

        // 3. Cek apakah user sudah membeli bab ini
        $alreadyPurchased = DB::table('book_purchases')
            ->where('user_id', $user->id)
            ->where('chapter_id', $chapter->id)
            ->exists();

        if ($alreadyPurchased) {
            return redirect()->route('buku.read', ['book' => $book->id, 'chapter' => $chapter->id]);
        }

        // 4. Cek koin cukup atau tidak
        $price = $chapter->coin_price;

        if ($user->coin_balance < $price) {
            return back()->with('error', 'Koin Anda tidak mencukupi untuk membuka bab ini.');
        }

        try {
            DB::beginTransaction();

            $balanceBefore = $user->coin_balance;
            $balanceAfter = $balanceBefore - $price;

            // Potong saldo
            $user->coin_balance = $balanceAfter;
            $user->save();

            // Simpan ke book_purchases
            DB::table('book_purchases')->insert([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'chapter_id' => $chapter->id,
                'coin_price' => $price,
                'purchased_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Catat history coin transaction
            DB::table('coin_transactions')->insert([
                'user_id' => $user->id,
                'type' => 'purchase',
                'amount' => $price,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'reference_type' => 'book_chapter',
                'reference_id' => $chapter->id,
                'description' => 'Membeli bab: ' . $chapter->title,
                'transaction_number' => 'TRX-' . strtoupper(uniqid()),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();

            return back()->with('success', 'Berhasil membuka bab baru!');
                             
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Terjadi kesalahan sistem saat memproses koin.');
        }
    }
}
