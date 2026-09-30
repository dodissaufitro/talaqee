import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Bookmark, Share2, MoreVertical,
    Star, BookOpen, ChevronDown, ChevronRight,
    Info, Check, Lock, Play, CircleUserRound,
    Home, LayoutGrid, Library, PlaySquare, Headphones,
    Download, Heart, Loader2, Users, BookMarked, ChevronLeft
} from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';
import WebFooter from '@/components/WebFooter';

interface Author {
    name: string;
}

interface Book {
    id: number;
    title: string;
    description: string;
    cover: string;
    rating: number;
    total_reviews: number;
    average_rating?: number;
    reviews?: any[];
    author?: Author;
    category?: { name: string };
}

interface Chapter {
    id: number;
    chapter_number: number;
    title: string;
    page_count: number;
    coin_price: number;
    is_free: boolean;
}

interface BookShowProps {
    book: Book;
    chapters: Chapter[];
    purchased_chapter_ids?: number[];
    is_favorited?: boolean;
    is_downloaded?: boolean;
}

export default function Show({ 
    book, 
    chapters = [], 
    purchased_chapter_ids = [],
    is_favorited: initialFavorited = false,
    is_downloaded: initialDownloaded = false,
}: BookShowProps) {
    const { auth, flash } = usePage<any>().props;
    const coinBalance = auth?.user?.coin_balance || 0;
    
    const [isFavorited, setIsFavorited] = useState(initialFavorited);
    const [isDownloaded, setIsDownloaded] = useState(initialDownloaded);
    const [isDownloading, setIsDownloading] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; chapterId: number | null }>({ isOpen: false, chapterId: null });
    const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

    useEffect(() => {
        if (flash?.error) {
            setErrorModal({ isOpen: true, message: flash.error });
        }
    }, [flash]);
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('last_book_url', window.location.pathname);
        }
    }, [book?.id]);

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [userRating, setUserRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [activeTab, setActiveTab] = useState<'chapters' | 'reviews'>('chapters');

    const displayChapters = chapters;

    const coverUrl = book.cover 
        ? (book.cover.startsWith('http') || book.cover.startsWith('/') ? book.cover : `/storage/${book.cover}`) 
        : "/images/placeholders/book-cover.svg";

    const handleToggleFavorite = async () => {
        if (!auth?.user) {
            window.location.href = '/login';
            return;
        }
        const nextState = !isFavorited;
        setIsFavorited(nextState);
        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content 
            || decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '');

        try {
            const res = await fetch('/favorit/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-XSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ content_type: 'book', content_id: book.id })
            });
            const data = await res.json();
            setToastMessage(data.message || (nextState ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit'));
            setTimeout(() => setToastMessage(null), 2500);
        } catch (e) {
            setIsFavorited(!nextState);
        }
    };

    const handleDownloadBook = async () => {
        if (!auth?.user) {
            window.location.href = '/login';
            return;
        }
        if (isDownloaded) {
            setToastMessage('Buku ini sudah tersimpan di Unduhan Saya.');
            setTimeout(() => setToastMessage(null), 2500);
            return;
        }
        setIsDownloading(true);
        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content 
            || decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '');

        try {
            const res = await fetch('/unduhan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-XSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ content_type: 'book', content_id: book.id })
            });
            const data = await res.json();
            setIsDownloaded(true);
            setToastMessage(data.message || 'Buku berhasil diunduh untuk dibaca offline!');
            setTimeout(() => setToastMessage(null), 3000);
        } catch (e) {
            setToastMessage('Gagal mengunduh buku.');
            setTimeout(() => setToastMessage(null), 2500);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleUnlockClick = (chapterId: number) => {
        if (!auth?.user) {
            window.location.href = '/login';
            return;
        }

        const targetChapter = chapters.find((c) => c.id === chapterId);
        const requiredCoin = targetChapter?.coin_price ?? 10;

        if (coinBalance < requiredCoin) {
            const returnUrl = `/buku/${book.id}`;
            sessionStorage.setItem('last_book_url', returnUrl);
            router.visit(`/akun/topup?return_url=${encodeURIComponent(returnUrl)}`);
            return;
        }

        setConfirmModal({ isOpen: true, chapterId });
    };

    const proceedUnlock = () => {
        if (confirmModal.chapterId !== null) {
            const targetChapter = chapters.find((c) => c.id === confirmModal.chapterId);
            const requiredCoin = targetChapter?.coin_price ?? 10;

            if (coinBalance < requiredCoin) {
                setConfirmModal({ isOpen: false, chapterId: null });
                const returnUrl = `/buku/${book.id}`;
                sessionStorage.setItem('last_book_url', returnUrl);
                router.visit(`/akun/topup?return_url=${encodeURIComponent(returnUrl)}`);
                return;
            }

            router.post(`/buku/${book.id}/chapter/${confirmModal.chapterId}/unlock`, {}, {
                preserveScroll: true
            });
            setConfirmModal({ isOpen: false, chapterId: null });
        }
    };

    const ChaptersList = () => (
        <div className="flex flex-col gap-2">
            {displayChapters.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                    Belum ada bab yang tersedia.
                </div>
            ) : (
                displayChapters.map((chapter) => {
                    const isPurchased = purchased_chapter_ids.map(String).includes(String(chapter.id));
                    const canRead = chapter.is_free || isPurchased;

                    return canRead ? (
                        <Link href={`/buku/${book.id}/read/${chapter.id}`} key={chapter.id} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:shadow-sm ${chapter.is_free ? 'bg-white border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-gray-50' : 'bg-emerald-50/30 border-emerald-100/50 hover:bg-emerald-100/30'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 ${chapter.is_free ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-600 text-white'}`}>
                                {chapter.chapter_number}
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                                <h4 className="text-[13px] font-extrabold text-gray-900 leading-tight mb-0.5 truncate">{chapter.title}</h4>
                                <p className="text-[11px] text-gray-500">{chapter.page_count} halaman</p>
                            </div>
                            <div className="shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col items-center text-right">
                                        <span className="text-[10px] font-bold text-emerald-600">Gratis</span>
                                        <span className="text-[10px] font-bold text-emerald-600 leading-none">Dibuka</span>
                                    </div>
                                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div key={chapter.id} className="flex items-center gap-3 p-3.5 rounded-xl border bg-blue-50/30 border-blue-100/50 hover:bg-blue-100/30 cursor-pointer transition-all hover:shadow-sm" onClick={() => handleUnlockClick(chapter.id)}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 bg-blue-600 text-white">
                                {chapter.chapter_number}
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                                <h4 className="text-[13px] font-extrabold text-gray-900 leading-tight mb-0.5 truncate">{chapter.title}</h4>
                                <p className="text-[11px] text-gray-500">{chapter.page_count} halaman</p>
                            </div>
                            <div className="shrink-0">
                                <button className="bg-white border border-blue-200 text-blue-600 rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm pointer-events-none">
                                    <span className="text-[11px] font-bold">Buka</span>
                                    <div className="w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center"><span className="text-[8px] text-white font-bold">C</span></div>
                                    <span className="text-[12px] font-bold">{chapter.coin_price}</span>
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );

    const ReviewsSection = () => (
        <div>
            {auth?.user ? (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    router.post(`/buku/${book.id}/review`, {
                        rating: userRating,
                        review: reviewText
                    }, { preserveScroll: true, onSuccess: () => { setReviewText(''); setUserRating(5); } });
                }} className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="text-[13px] font-bold text-gray-900 mb-3">Tulis Ulasan Anda</h4>
                    <div className="mb-3">
                        <label className="block text-[11px] font-medium text-gray-700 mb-1.5">Penilaian Anda</label>
                        <div className="flex items-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => setUserRating(star)} className="p-1 focus:outline-none">
                                    <Star className={`w-6 h-6 ${star <= userRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-[11px] font-medium text-gray-700 mb-1.5">Komentar</label>
                        <textarea 
                            name="review" rows={3} value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 resize-none focus:ring-1 focus:ring-blue-500 outline-none" 
                            placeholder="Tuliskan pendapat Anda tentang buku ini..." required
                        ></textarea>
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[12px] px-5 py-2.5 rounded-lg transition-colors shadow-sm">
                        Kirim Ulasan
                    </button>
                </form>
            ) : (
                <div className="mb-6 bg-blue-50/50 rounded-xl p-5 text-center border border-blue-100">
                    <p className="text-[13px] text-blue-800 font-medium mb-3">Silakan masuk (login) untuk memberikan ulasan.</p>
                    <Link href="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-[12px] px-5 py-2 rounded-lg transition-colors shadow-sm">
                        Masuk Sekarang
                    </Link>
                </div>
            )}

            <div className="space-y-4">
                {book.reviews && book.reviews.length > 0 ? (
                    book.reviews.map((rev: any) => (
                        <div key={rev.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden shrink-0 shadow-sm">
                                    <img src={`https://ui-avatars.com/api/?name=${rev.user?.name || 'User'}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h5 className="text-[13px] font-bold text-gray-900 leading-tight">{rev.user?.name || 'Pengguna anonim'}</h5>
                                    <div className="flex items-center gap-0.5 mt-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                                        ))}
                                    </div>
                                </div>
                                <div className="ml-auto text-[10px] text-gray-400 font-medium">
                                    {new Date(rev.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year:'numeric'})}
                                </div>
                            </div>
                            <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">{rev.review}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Star className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-[13px] font-medium text-gray-900 mb-1">Belum ada ulasan</p>
                        <p className="text-[11px] text-gray-500">Jadilah yang pertama mengulas buku ini!</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Head title={book.title || 'Detail Buku'} />

            {/* Toast Feedback */}
            {toastMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-gray-900/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Error Modal */}
            {errorModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-[360px] p-6 shadow-2xl text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-600 font-bold text-2xl">!</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-2">Gagal</h3>
                        <p className="text-sm text-gray-500 mb-6">{errorModal.message}</p>
                        <button onClick={() => setErrorModal({ isOpen: false, message: '' })} className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors">
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-[360px] p-6 shadow-2xl text-center">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-2">Buka Bab Ini?</h3>
                        <p className="text-sm text-gray-500 mb-6">Anda akan menggunakan koin Anda untuk membuka bab ini. Lanjutkan?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmModal({ isOpen: false, chapterId: null })} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
                                Batal
                            </button>
                            <button onClick={proceedUnlock} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                                Ya, Buka
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===================== MOBILE VIEW ===================== */}
            <div className="block md:hidden min-h-screen bg-white pb-32 relative overflow-x-hidden font-sans">
                {/* Top App Bar */}
                <div className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.history.back()} className="p-1 -ml-1 text-gray-800">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="font-extrabold text-gray-900 text-lg line-clamp-1">{book.title || 'Detail Buku'}</h1>
                    </div>
                    <div className="flex items-center gap-3 text-gray-800">
                        <button onClick={handleToggleFavorite} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors" title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}>
                            <Heart className={`w-5 h-5 transition-transform active:scale-125 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`} />
                        </button>
                        <button onClick={handleDownloadBook} disabled={isDownloading} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors" title={isDownloaded ? 'Tersimpan di Unduhan' : 'Unduh untuk baca offline'}>
                            {isDownloading ? <Loader2 className="w-5 h-5 animate-spin text-emerald-600" /> : <Download className={`w-5 h-5 ${isDownloaded ? 'text-emerald-600 fill-emerald-100' : 'text-gray-700'}`} />}
                        </button>
                        <button className="-mr-1 p-1.5"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Book Info Section */}
                <div className="px-5 pt-5 pb-5">
                    <div className="flex gap-4 mb-4">
                        <div className="w-[120px] shrink-0 relative rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] bg-gray-100 border border-gray-50">
                            <img src={coverUrl} alt={book.title} className="w-full h-auto object-cover aspect-[2/3]" />
                            <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-white tracking-wide">
                                {book.category?.name?.toUpperCase() || 'BUKU'}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col pt-0.5">
                            <h2 className="text-[18px] font-extrabold text-gray-900 leading-tight mb-1">{book.title}</h2>
                            <p className="text-[12px] font-medium text-blue-600 mb-2">{book.author?.name || 'Penulis'}</p>
                            <div className="flex items-center gap-1.5 mb-2.5">
                                <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                                <span className="text-[13px] font-bold text-gray-900">{Number(book.average_rating) > 0 ? Number(book.average_rating).toFixed(1) : '0.0'}</span>
                                <span className="text-[12px] text-gray-500">({book.reviews ? book.reviews.length : 0} ulasan)</span>
                            </div>
                            <div className="text-[12px] text-gray-600 leading-relaxed relative">
                                <p className={isDescriptionExpanded ? '' : 'line-clamp-3'}>{book.description || 'Tidak ada deskripsi.'}</p>
                                <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="text-blue-600 font-medium flex items-center gap-1 mt-1">
                                    {isDescriptionExpanded ? 'Sembunyikan' : 'Selengkapnya'} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                        <Link 
                            href={displayChapters.length > 0 ? `/buku/${book.id}/read/${displayChapters[0].id}` : `/buku/${book.id}`}
                            className="flex-1 border border-gray-200 rounded-xl py-2.5 px-4 flex items-center justify-between shadow-sm bg-white hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-2.5">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <span className="text-[13px] font-bold text-blue-600">{displayChapters.length > 0 ? 'Mulai Membaca' : 'Contoh Baca'}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </Link>
                        <button 
                            onClick={handleDownloadBook} disabled={isDownloading}
                            className={`px-4 rounded-xl py-2.5 flex items-center gap-2 text-[12px] font-bold transition-all shadow-sm ${isDownloaded ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                        >
                            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> : <Download className={`w-4 h-4 ${isDownloaded ? 'text-emerald-600' : 'text-gray-500'}`} />}
                            <span>{isDownloaded ? 'Tersimpan' : 'Unduh'}</span>
                        </button>
                    </div>
                </div>

                <div className="w-full h-1 bg-gray-50"></div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-5 pt-4">
                    <button onClick={() => setActiveTab('chapters')} className={`pb-3 mr-6 text-[13px] font-bold border-b-2 transition-colors ${activeTab === 'chapters' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}>
                        Daftar Bab ({displayChapters.length})
                    </button>
                    <button onClick={() => setActiveTab('reviews')} className={`pb-3 text-[13px] font-bold border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}>
                        Ulasan ({book.reviews?.length || 0})
                    </button>
                </div>

                <div className="px-5 py-4">
                    {activeTab === 'chapters' ? <ChaptersList /> : <ReviewsSection />}
                </div>

                {/* Bottom Navigation App */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                    <div className="flex justify-around items-center h-[76px] pb-2 px-2">
                        {[
                            { id: 'home', label: 'Beranda', icon: Home, route: '/' },
                            { id: 'katalog', label: 'Katalog', icon: LayoutGrid, active: true, route: '/katalog' },
                            { id: 'video', label: 'Video Saya', icon: PlaySquare, route: '/videos' },
                            { id: 'rekaman', label: 'Rekaman', icon: Headphones, route: '/audios' },
                            { id: 'akun', label: 'Akun', icon: CircleUserRound, route: (typeof auth !== 'undefined' && auth?.user) ? '/akun' : '/login' }
                        ].map((item) => {
                            const Icon = item.icon as React.ElementType;
                            return (
                                <Link prefetch="hover" href={item.route} key={item.id} className="flex flex-col items-center justify-center w-16 gap-1 relative mt-1">
                                    {item.active ? (
                                        <>
                                            <div className="w-10 h-10 flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-blue-600 stroke-[2]" />
                                            </div>
                                            <span className="text-[10px] font-bold text-blue-600">{item.label}</span>
                                            <div className="absolute -bottom-2 w-[16px] h-[3px] bg-blue-600 rounded-full"></div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-gray-400 stroke-[1.5]" />
                                            </div>
                                            <span className="text-[10px] font-medium text-gray-500">{item.label}</span>
                                        </>
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* ===================== DESKTOP / WEB VIEW ===================== */}
            <div className="hidden md:flex flex-col min-h-screen bg-[#f8f9fb] font-sans">
                <WebDesktopNav />

                {/* Hero Banner */}
                <div className="relative bg-gradient-to-br from-[#1a1f3a] via-[#252d55] to-[#1a2547] overflow-hidden">
                    {/* Blurred Cover Background */}
                    <div 
                        className="absolute inset-0 opacity-20 bg-cover bg-center blur-2xl scale-110"
                        style={{ backgroundImage: `url(${coverUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f3a]/90 via-[#252d55]/70 to-transparent" />

                    <div className="relative z-10 max-w-6xl mx-auto px-8 py-14 flex items-end gap-8">
                        {/* Book Cover */}
                        <div className="shrink-0 w-[180px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-2 border-white/10 relative">
                            <img src={coverUrl} alt={book.title} className="w-full h-auto object-cover aspect-[2/3]" />
                            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-wider">
                                {book.category?.name?.toUpperCase() || 'BUKU'}
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="flex-1 pb-1">
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2 leading-tight">{book.title}</h1>
                            <p className="text-blue-300 font-semibold text-lg mb-4">{book.author?.name || 'Penulis'}</p>
                            
                            <div className="flex items-center gap-4 mb-5">
                                <div className="flex items-center gap-1.5">
                                    {[1,2,3,4,5].map(s => (
                                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(book.average_rating)) ? 'text-amber-400 fill-amber-400' : 'text-gray-600 fill-gray-600'}`} />
                                    ))}
                                    <span className="text-white font-bold ml-1">{Number(book.average_rating) > 0 ? Number(book.average_rating).toFixed(1) : '0.0'}</span>
                                    <span className="text-white/50 text-sm">({book.reviews?.length || 0} ulasan)</span>
                                </div>
                                <div className="w-px h-4 bg-white/20" />
                                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                                    <BookMarked className="w-4 h-4" />
                                    <span>{displayChapters.length} Bab</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                                <Link 
                                    href={displayChapters.length > 0 ? `/buku/${book.id}/read/${displayChapters[0].id}` : `/buku/${book.id}`}
                                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/40 text-sm"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Mulai Membaca
                                </Link>
                                <button 
                                    onClick={handleToggleFavorite}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm transition-all ${isFavorited ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                                >
                                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-400 text-rose-300' : ''}`} />
                                    {isFavorited ? 'Difavoritkan' : 'Favorit'}
                                </button>
                                <button 
                                    onClick={handleDownloadBook} disabled={isDownloading}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm transition-all ${isDownloaded ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                                >
                                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                    {isDownloaded ? 'Tersimpan' : 'Unduh'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="max-w-6xl mx-auto w-full px-8 py-10 flex gap-8">
                    {/* Main Column */}
                    <div className="flex-1 min-w-0">
                        {/* Description Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                            <h2 className="text-lg font-extrabold text-gray-900 mb-3">Tentang Buku</h2>
                            <p className={`text-gray-600 text-sm leading-relaxed ${isDescriptionExpanded ? '' : 'line-clamp-4'}`}>
                                {book.description || 'Tidak ada deskripsi untuk buku ini.'}
                            </p>
                            {book.description && book.description.length > 200 && (
                                <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="text-blue-600 font-semibold text-sm flex items-center gap-1 mt-2 hover:underline">
                                    {isDescriptionExpanded ? 'Sembunyikan' : 'Baca Selengkapnya'}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
                                </button>
                            )}
                        </div>

                        {/* Chapters Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-extrabold text-gray-900">Daftar Bab</h2>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">{displayChapters.length} Bab</span>
                            </div>
                            <ChaptersList />
                        </div>

                        {/* Reviews Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-extrabold text-gray-900">Ulasan Pembaca</h2>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="font-bold text-gray-900">{Number(book.average_rating) > 0 ? Number(book.average_rating).toFixed(1) : '0.0'}</span>
                                    <span className="text-gray-400 text-sm">/ 5.0</span>
                                </div>
                            </div>
                            <ReviewsSection />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-72 shrink-0">
                        {/* Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4 sticky top-24">
                            <h3 className="text-sm font-extrabold text-gray-900 mb-4">Informasi Buku</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Penulis</span>
                                    <span className="font-semibold text-gray-900 text-right">{book.author?.name || '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Kategori</span>
                                    <span className="font-semibold text-gray-900">{book.category?.name || '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Total Bab</span>
                                    <span className="font-semibold text-gray-900">{displayChapters.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Rating</span>
                                    <span className="font-semibold text-gray-900">{Number(book.average_rating) > 0 ? Number(book.average_rating).toFixed(1) : '0.0'} / 5</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Ulasan</span>
                                    <span className="font-semibold text-gray-900">{book.reviews?.length || 0} ulasan</span>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-100">
                                <Link 
                                    href={displayChapters.length > 0 ? `/buku/${book.id}/read/${displayChapters[0].id}` : `/buku/${book.id}`}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm shadow-blue-100"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Mulai Membaca
                                </Link>
                                <button
                                    onClick={handleToggleFavorite}
                                    className={`mt-2 w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl transition-colors text-sm border ${isFavorited ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                                    {isFavorited ? 'Hapus Favorit' : 'Tambah Favorit'}
                                </button>
                            </div>
                        </div>

                        {/* Back to catalog */}
                        <Link href="/katalog" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">
                            <ChevronLeft className="w-4 h-4" />
                            Kembali ke Katalog
                        </Link>
                    </div>
                </div>

                <WebFooter />
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </>
    );
}
