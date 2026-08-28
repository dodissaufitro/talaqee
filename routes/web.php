<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Models\Category;
use App\Models\Book;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Admin\NavigationItemController;
use App\Http\Controllers\Admin\PlaceholderController;

Route::get('/', function () {
    $categories = \Illuminate\Support\Facades\Cache::remember('homepage_categories', 3600, function () {
        return Category::all();
    });
    $popularBooks = \Illuminate\Support\Facades\Cache::remember('homepage_popular_books', 1800, function () {
        return Book::with(['author', 'category'])->latest()->take(10)->get();
    });

    $koleksiBuku = \Illuminate\Support\Facades\Cache::remember('homepage_koleksi_buku', 1800, function () {
        return Book::with('author')->take(4)->get();
    });
    $koleksiVideo = \Illuminate\Support\Facades\Cache::remember('homepage_koleksi_video', 1800, function () {
        return \App\Models\Video::with('author')->take(3)->get();
    });
    $koleksiAudio = \Illuminate\Support\Facades\Cache::remember('homepage_koleksi_audio', 1800, function () {
        return \App\Models\Audio::take(3)->get();
    });
    
    $banners = \Illuminate\Support\Facades\Cache::remember('homepage_banners', 3600, function () {
        return \App\Models\Banner::where('is_active', true)
                    ->orderBy('sort_order')
                    ->get();
    });
    
    $terakhirDibaca = null;
    if (auth()->check()) {
        $progress = \App\Models\ReadingProgress::where('user_id', auth()->id())
            ->orderBy('last_read_at', 'desc')
            ->first();
            
        if ($progress) {
            $book = Book::with('author')->find($progress->book_id);
            if ($book) {
                $terakhirDibaca = [
                    'title' => $book->title,
                    'author' => $book->author ? $book->author->name : 'Tidak Diketahui',
                    'cover' => $book->cover,
                    'progress_percent' => $progress->progress_percent,
                    'chapter_info' => $progress->chapter_id ? 'Bab ' . $progress->chapter_id : 'Pendahuluan'
                ];
            }
        }
    }

    return Inertia::render('welcome', [
        'categories' => $categories,
        'popularBooks' => $popularBooks,
        'koleksiBuku' => $koleksiBuku,
        'koleksiVideo' => $koleksiVideo,
        'koleksiAudio' => $koleksiAudio,
        'banners' => $banners,
        'terakhirDibaca' => $terakhirDibaca
    ]);
})->name('home');

Route::get('/buku/{id}', function ($id) {
    $book = \App\Models\Book::with(['author', 'reviews.user'])->findOrFail($id);
    $chapters = \App\Models\BookChapter::where('book_id', $book->id)
        ->orderBy('chapter_number', 'asc')
        ->get();
        
    $purchasedChapterIds = auth()->check() 
        ? \Illuminate\Support\Facades\DB::table('book_purchases')
            ->where('user_id', auth()->id())
            ->where('book_id', $book->id)
            ->pluck('chapter_id')
            ->toArray()
        : [];
        
    return Inertia::render('Book/Show', [
        'book' => $book,
        'chapters' => $chapters,
        'purchased_chapter_ids' => $purchasedChapterIds
    ]);
})->name('buku.show');

    // Book Read
    Route::get('/buku/{book}/read/{chapter}', function ($book, $chapterId) {
        $purchasedChapterIds = auth()->check() 
            ? \Illuminate\Support\Facades\DB::table('book_purchases')
                ->where('user_id', auth()->id())
                ->where('book_id', $book)
                ->pluck('chapter_id')
                ->toArray()
            : [];
            
        $chapter = \App\Models\BookChapter::where('book_id', $book)->findOrFail($chapterId);
            
        return Inertia::render('Book/Read', [
            'book_id' => $book,
            'chapter_id' => $chapterId,
            'chapter' => $chapter,
            'purchased_chapter_ids' => $purchasedChapterIds
        ]);
    })->name('buku.read');



Route::get('/faq', [\App\Http\Controllers\FaqController::class, 'index'])->name('faq.index');
Route::get('/refund-policy', function () {
    $page = \App\Models\Page::where('slug', 'refund-policy')->first();
    return Inertia::render('RefundPolicy', [
        'policyContent' => $page ? $page->content : ''
    ]);
})->name('refund.policy');
Route::get('/katalog', [\App\Http\Controllers\KatalogController::class, 'index'])->name('katalog.index');

Route::get('/videos', [\App\Http\Controllers\VideoPageController::class, 'index'])->name('videos.index');

Route::middleware(['auth'])->group(function () {
    Route::get('/akun', function () {
        return Inertia::render('Akun/Index');
    })->name('akun.index');

    Route::get('/audios', [\App\Http\Controllers\AudioPageController::class, 'index'])->name('audios.index');

    Route::get('/akun/edit-profil', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('akun.edit-profil');
    Route::put('/akun/edit-profil', [\App\Http\Controllers\ProfileController::class, 'update'])->name('akun.edit-profil.update');

    // Notifications
    Route::post('/notifications/{notification}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');

    // Unlock Chapter
    Route::post('/buku/{book}/chapter/{chapter}/unlock', [\App\Http\Controllers\ChapterPurchaseController::class, 'unlock'])->name('chapter.unlock');

    // Review Book
    Route::post('/buku/{book}/review', [\App\Http\Controllers\ReviewController::class, 'store'])->name('review.store');

    // Akun Top Up (iPaymu)
    Route::post('/akun/topup/checkout', [\App\Http\Controllers\TopUpController::class, 'checkout'])->name('topup.checkout');
    Route::get('/akun/topup/success', [\App\Http\Controllers\TopUpController::class, 'success'])->name('topup.success');
    Route::get('/akun/topup/cancel', [\App\Http\Controllers\TopUpController::class, 'cancel'])->name('topup.cancel');
    Route::post('/akun/topup/callback', [\App\Http\Controllers\TopUpController::class, 'callback'])->name('topup.callback');

    Route::get('/akun/topup', function () {
        return Inertia::render('Akun/TopUp');
    })->name('akun.topup');

    // Katalog (Index Buku)
    Route::get('/katalog/buku', [\App\Http\Controllers\BookController::class, 'index'])->name('katalog.buku');

    Route::get('/videos/{id}', [\App\Http\Controllers\VideoPageController::class, 'show'])->name('videos.show');

    Route::middleware([\App\Http\Middleware\EnsureIsAdmin::class])->group(function () {
        Route::redirect('/admin', '/admin/dashboard');
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::resource('admin/navigation-items', NavigationItemController::class, ['names' => 'admin.navigation-items'])->except(['create', 'show', 'edit']);
        Route::resource('admin/banners', \App\Http\Controllers\Admin\BannerController::class, ['names' => 'admin.banners'])->except(['create', 'show', 'edit']);
        Route::post('admin/videos/upload-chunk', [\App\Http\Controllers\Admin\VideoController::class, 'uploadChunk'])->name('admin.videos.upload-chunk');
        Route::resource('admin/videos', \App\Http\Controllers\Admin\VideoController::class, ['names' => 'admin.videos'])->except(['create', 'show', 'edit']);
        
        Route::get('/admin/setoran', [\App\Http\Controllers\Admin\SetoranController::class, 'index'])->name('admin.setoran.index');
        Route::post('/admin/setoran/{recording}/comment', [\App\Http\Controllers\Admin\SetoranController::class, 'comment'])->name('admin.setoran.comment');

        // Placeholder routes for navigation items
        Route::get('/admin/sales', [\App\Http\Controllers\PaymentController::class, 'index'])->name('admin.sales.index');
        Route::get('/admin/books', [\App\Http\Controllers\BookController::class, 'index'])->name('admin.books.index');
        Route::get('/admin/books/create', [\App\Http\Controllers\BookController::class, 'create'])->name('admin.books.create');
        Route::post('/admin/books', [\App\Http\Controllers\BookController::class, 'store'])->name('admin.books.store');
        Route::get('/admin/books/{book}', [\App\Http\Controllers\BookController::class, 'show'])->name('admin.books.show');
        Route::get('/admin/books/{book}/edit', [\App\Http\Controllers\BookController::class, 'edit'])->name('admin.books.edit');
        Route::put('/admin/books/{book}', [\App\Http\Controllers\BookController::class, 'update'])->name('admin.books.update');
        Route::delete('/admin/books/{book}', [\App\Http\Controllers\BookController::class, 'destroy'])->name('admin.books.destroy');
        Route::get('/admin/books/{book}/chapters/create', [\App\Http\Controllers\BookChapterController::class, 'create'])->name('admin.books.chapters.create');
        Route::post('/admin/books/{book}/chapters', [\App\Http\Controllers\BookChapterController::class, 'store'])->name('admin.books.chapters.store');
        Route::get('/admin/books/{book}/chapters/{chapter}/edit', [\App\Http\Controllers\BookChapterController::class, 'edit'])->name('admin.books.chapters.edit');
        Route::put('/admin/books/{book}/chapters/{chapter}', [\App\Http\Controllers\BookChapterController::class, 'update'])->name('admin.books.chapters.update');
        Route::delete('/admin/books/{book}/chapters/{chapter}', [\App\Http\Controllers\BookChapterController::class, 'destroy'])->name('admin.books.chapters.destroy');
        Route::get('/admin/categories', [\App\Http\Controllers\CategoryController::class, 'index'])->name('admin.categories.index');
        Route::get('/admin/categories/create', [\App\Http\Controllers\CategoryController::class, 'create'])->name('admin.categories.create');
        Route::post('/admin/categories', [\App\Http\Controllers\CategoryController::class, 'store'])->name('admin.categories.store');
        Route::get('/admin/categories/{category}', [\App\Http\Controllers\CategoryController::class, 'show'])->name('admin.categories.show');
        Route::get('/admin/categories/{category}/edit', [\App\Http\Controllers\CategoryController::class, 'edit'])->name('admin.categories.edit');
        Route::put('/admin/categories/{category}', [\App\Http\Controllers\CategoryController::class, 'update'])->name('admin.categories.update');
        Route::delete('/admin/categories/{category}', [\App\Http\Controllers\CategoryController::class, 'destroy'])->name('admin.categories.destroy');
        Route::get('/admin/customers', [\App\Http\Controllers\CustomerController::class, 'index'])->name('admin.customers.index');
        Route::get('/admin/transactions', [\App\Http\Controllers\TransactionController::class, 'index'])->name('admin.transactions.index');
        Route::get('/admin/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('admin.reports.index');
        Route::get('/admin/stock', [PlaceholderController::class, 'show'])->name('admin.stock.index');
        Route::get('/admin/promotions', [\App\Http\Controllers\PromotionController::class, 'index'])->name('admin.promotions.index');
        Route::get('/admin/users', [\App\Http\Controllers\UserController::class, 'index'])->name('admin.users.index');
    // Faq
    Route::resource('/admin/faqs', \App\Http\Controllers\Admin\FaqController::class)->except(['create', 'show', 'edit'])->names([
        'index' => 'admin.faqs.index',
        'store' => 'admin.faqs.store',
        'update' => 'admin.faqs.update',
        'destroy' => 'admin.faqs.destroy',
    ]);

    // Refund Policy
    Route::get('/admin/refund-policy', [\App\Http\Controllers\Admin\RefundPolicyController::class, 'index'])->name('admin.refund-policy.index');
    Route::post('/admin/refund-policy', [\App\Http\Controllers\Admin\RefundPolicyController::class, 'update'])->name('admin.refund-policy.update');

    // Settings
    Route::get('/admin/settings', [\App\Http\Controllers\SettingController::class, 'index'])->name('admin.settings.index');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// Google Login
Route::get('auth/google', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'redirect'])->name('google.login');
Route::get('auth/google/callback', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'callback'])->name('google.callback');

// OTP Routes
Route::get('auth/google/otp', [\App\Http\Controllers\Auth\OtpController::class, 'show'])->name('google.otp.form');
Route::post('auth/google/otp', [\App\Http\Controllers\Auth\OtpController::class, 'verify'])->name('google.otp.verify');

// Alquran Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/alquran', [\App\Http\Controllers\QuranController::class, 'index'])->name('alquran.index');
    Route::get('/alquran/{surah}', [\App\Http\Controllers\QuranController::class, 'show'])->name('alquran.show');
    Route::post('/alquran/recording', [\App\Http\Controllers\RecordingController::class, 'store'])->name('alquran.recording.store');
});

