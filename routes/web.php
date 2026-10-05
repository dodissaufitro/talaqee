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
        return Book::with(['author', 'category'])->withAvg('reviews', 'rating')->latest()->take(10)->get();
    });

    $koleksiBuku = \Illuminate\Support\Facades\Cache::remember('homepage_koleksi_buku', 1800, function () {
        return Book::with('author')->withAvg('reviews', 'rating')->latest()->take(15)->get();
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
    $book = \App\Models\Book::with([
        'author', 
        'category',
        'reviews' => fn($q) => $q->where('is_active', true)->with('user:id,name,avatar')->latest()->take(20)
    ])->findOrFail($id);

    $chapters = \App\Models\BookChapter::where('book_id', $book->id)
        ->select('id', 'book_id', 'chapter_number', 'title', 'page_count', 'coin_price', 'is_free', 'is_active')
        ->orderBy('chapter_number', 'asc')
        ->get();
        
    $purchasedChapterIds = auth()->check() 
        ? \Illuminate\Support\Facades\DB::table('book_purchases')
            ->where('user_id', auth()->id())
            ->where('book_id', $book->id)
            ->pluck('chapter_id')
            ->toArray()
        : [];
        
    if (auth()->check()) {
        session(['last_book_url' => "/buku/{$id}"]);
    }

    $isFavorited = auth()->check() 
        ? \App\Models\Favorite::where('user_id', auth()->id())
            ->where('content_type', 'book')
            ->where('content_id', $book->id)
            ->exists()
        : false;

    $isDownloaded = auth()->check() 
        ? \App\Models\Download::where('user_id', auth()->id())
            ->where('content_type', 'book')
            ->where('content_id', $book->id)
            ->exists()
        : false;

    return Inertia::render('Book/Show', [
        'book' => $book,
        'chapters' => $chapters,
        'purchased_chapter_ids' => $purchasedChapterIds,
        'is_favorited' => $isFavorited,
        'is_downloaded' => $isDownloaded,
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
            
        $bookModel = \App\Models\Book::with('author')->findOrFail($book);
        $chapter = \App\Models\BookChapter::where('book_id', $book)->findOrFail($chapterId);
        
        $isPurchased = in_array($chapter->id, $purchasedChapterIds);
        $chapter->is_locked = !$chapter->is_free && !$isPurchased;
        
        $allChapters = \App\Models\BookChapter::where('book_id', $book)
            ->where('is_active', true)
            ->orderBy('chapter_number', 'asc')
            ->select('id', 'chapter_number', 'title', 'is_free', 'coin_price')
            ->get();
            
        if (auth()->check()) {
            session(['last_book_url' => "/buku/{$book}/read/{$chapterId}"]);
            \App\Models\ReadingProgress::updateOrCreate(
                ['user_id' => auth()->id(), 'book_id' => $bookModel->id],
                [
                    'chapter_id' => $chapter->id,
                    'last_read_at' => now(),
                    'progress_percent' => 0
                ]
            );
        }

        $isFavorited = auth()->check() 
            ? \App\Models\Favorite::where('user_id', auth()->id())
                ->where('content_type', 'book')
                ->where('content_id', $bookModel->id)
                ->exists()
            : false;

        return Inertia::render('Book/Read', [
            'book' => $bookModel,
            'book_id' => (int) $book,
            'chapter_id' => (int) $chapterId,
            'chapter' => $chapter,
            'chapters' => $allChapters,
            'purchased_chapter_ids' => $purchasedChapterIds,
            'is_favorited' => $isFavorited,
        ]);
    })->name('buku.read');



Route::get('/faq', [\App\Http\Controllers\FaqController::class, 'index'])->name('faq.index');
Route::get('/refund-policy', function () {
    $page = \App\Models\Page::where('slug', 'refund-policy')->first();
    return Inertia::render('RefundPolicy', [
        'policyContent' => $page ? $page->content : ''
    ]);
})->name('refund.policy');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

Route::get('/kontak', function () {
    return Inertia::render('Contact');
})->name('kontak');

Route::get('/katalog', [\App\Http\Controllers\KatalogController::class, 'index'])->name('katalog.index');

Route::get('/videos', [\App\Http\Controllers\VideoPageController::class, 'index'])->name('videos.index');
Route::get('/audios', [\App\Http\Controllers\AudioPageController::class, 'index'])->name('audios.index');

// iPaymu Webhook Callback (Must be outside auth middleware)
Route::post('/akun/topup/callback', [\App\Http\Controllers\TopUpController::class, 'callback'])->name('topup.callback');

Route::middleware(['auth'])->group(function () {
    Route::get('/akun', function () {
        $hasActiveSub = auth()->user()->activeSubscription()->exists();
        return Inertia::render('Akun/Index', [
            'hasActiveSubscription' => $hasActiveSub,
        ]);
    })->name('akun.index');

    Route::get('/akun/edit-profil', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('akun.edit-profil');
    Route::put('/akun/edit-profil', [\App\Http\Controllers\ProfileController::class, 'update'])->name('akun.edit-profil.update');

    // Riwayat Baca
    Route::get('/akun/riwayat', [\App\Http\Controllers\ReadingProgressController::class, 'index'])->name('riwayat.index');
    Route::delete('/akun/riwayat/clear', [\App\Http\Controllers\ReadingProgressController::class, 'clearAll'])->name('riwayat.clear');
    Route::delete('/akun/riwayat/{id}', [\App\Http\Controllers\ReadingProgressController::class, 'destroy'])->name('riwayat.destroy');

    // Favorit Saya
    Route::get('/akun/favorit', [\App\Http\Controllers\FavoriteController::class, 'index'])->name('favorit.index');
    Route::post('/favorit/toggle', [\App\Http\Controllers\FavoriteController::class, 'toggle'])->name('favorit.toggle');
    Route::delete('/favorit/{id}', [\App\Http\Controllers\FavoriteController::class, 'destroy'])->name('favorit.destroy');

    // Unduhan Saya
    Route::get('/akun/unduhan', [\App\Http\Controllers\DownloadController::class, 'index'])->name('unduhan.index');
    Route::post('/unduhan', [\App\Http\Controllers\DownloadController::class, 'store'])->name('unduhan.store');
    Route::delete('/unduhan/{id}', [\App\Http\Controllers\DownloadController::class, 'destroy'])->name('unduhan.destroy');

    // Keamanan Akun
    Route::get('/akun/keamanan', [\App\Http\Controllers\Settings\PasswordController::class, 'editKeamanan'])->name('akun.keamanan');
    Route::put('/akun/keamanan/password', [\App\Http\Controllers\Settings\PasswordController::class, 'updateKeamanan'])->name('akun.keamanan.update');

    // Langganan Premium
    Route::get('/akun/langganan', [\App\Http\Controllers\SubscriptionController::class, 'index'])->name('langganan.index');
    Route::post('/akun/langganan/subscribe', [\App\Http\Controllers\SubscriptionController::class, 'store'])->name('langganan.subscribe');
    Route::post('/akun/langganan/cancel', [\App\Http\Controllers\SubscriptionController::class, 'cancel'])->name('langganan.cancel');

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

    Route::get('/akun/topup', [\App\Http\Controllers\TopUpController::class, 'index'])->name('akun.topup');

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
        Route::post('/admin/authors/quick-store', [\App\Http\Controllers\AuthorController::class, 'quickStore'])->name('admin.authors.quick-store');
        Route::resource('/admin/authors', \App\Http\Controllers\AuthorController::class)->except(['create', 'show', 'edit'])->names([
            'index' => 'admin.authors.index',
            'store' => 'admin.authors.store',
            'update' => 'admin.authors.update',
            'destroy' => 'admin.authors.destroy',
        ]);
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
        Route::post('/admin/users', [\App\Http\Controllers\UserController::class, 'store'])->name('admin.users.store');
        Route::put('/admin/users/{user}', [\App\Http\Controllers\UserController::class, 'update'])->name('admin.users.update');
        Route::delete('/admin/users/{user}', [\App\Http\Controllers\UserController::class, 'destroy'])->name('admin.users.destroy');
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

    // Icons
    Route::resource('/admin/icons', \App\Http\Controllers\Admin\IconController::class)->except(['create', 'show', 'edit'])->names([
        'index' => 'admin.icons.index',
        'store' => 'admin.icons.store',
        'update' => 'admin.icons.update',
        'destroy' => 'admin.icons.destroy',
    ]);

    // Settings
    Route::get('/admin/settings', [\App\Http\Controllers\SettingController::class, 'index'])->name('admin.settings.index');

    // Coin Packages (Khusus Super Admin)
    Route::middleware([\App\Http\Middleware\EnsureIsSuperAdmin::class])->group(function () {
        Route::resource('/admin/coin-packages', \App\Http\Controllers\CoinPackageController::class)->except(['create', 'show', 'edit'])->names([
            'index' => 'admin.coin-packages.index',
            'store' => 'admin.coin-packages.store',
            'update' => 'admin.coin-packages.update',
            'destroy' => 'admin.coin-packages.destroy',
        ]);
    });
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
Route::post('auth/google/native', [\App\Http\Controllers\Auth\GoogleAuthController::class, 'nativeLogin'])->name('google.native.login');

// Alquran Routes
Route::get('/alquran', [\App\Http\Controllers\QuranController::class, 'index'])->name('alquran.index');
Route::get('/alquran/{surah}', [\App\Http\Controllers\QuranController::class, 'show'])->name('alquran.show');

Route::middleware(['auth'])->group(function () {
    Route::post('/alquran/recording', [\App\Http\Controllers\RecordingController::class, 'store'])->name('alquran.recording.store');
});

