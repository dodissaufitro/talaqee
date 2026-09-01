import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Bookmark, Share2, MoreVertical,
    Star, BookOpen, ChevronDown, ChevronRight,
    Info, Check, Lock, Play, CircleUserRound,
    Home, LayoutGrid, Library, PlaySquare, Headphones
} from 'lucide-react';

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
}

export default function Show({ book, chapters = [], purchased_chapter_ids = [] }: BookShowProps) {
    const { auth, flash } = usePage<any>().props;
    const coinBalance = auth?.user?.coin_balance || 0;
    
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; chapterId: number | null }>({ isOpen: false, chapterId: null });
    const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

    useEffect(() => {
        if (flash?.error) {
            setErrorModal({ isOpen: true, message: flash.error });
        }
    }, [flash]);
    
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [selectedCoinPackage, setSelectedCoinPackage] = useState<number | null>(250);
    const [userRating, setUserRating] = useState(5);
    const [reviewText, setReviewText] = useState('');

    const displayChapters = chapters;

    const handleUnlockClick = (chapterId: number) => {
        if (!auth?.user) {
            window.location.href = '/login';
            return;
        }
        setConfirmModal({ isOpen: true, chapterId });
    };

    const proceedUnlock = () => {
        if (confirmModal.chapterId !== null) {
            router.post(`/buku/${book.id}/chapter/${confirmModal.chapterId}/unlock`, {}, {
                preserveScroll: true
            });
            setConfirmModal({ isOpen: false, chapterId: null });
        }
    };

    return (
        <div className="min-h-screen bg-white pb-32 relative overflow-x-hidden font-sans">
            <Head title={book.title || 'Laut Bercerita'} />

            {/* Error Modal */}
            {errorModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-[320px] p-6 shadow-2xl scale-in-95 duration-200 text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-600 font-bold text-2xl">!</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-2">Gagal</h3>
                        <p className="text-sm text-gray-500 mb-6">{errorModal.message}</p>
                        <button 
                            onClick={() => setErrorModal({ isOpen: false, message: '' })}
                            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-[320px] p-6 shadow-2xl scale-in-95 duration-200 text-center">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-2">Buka Bab Ini?</h3>
                        <p className="text-sm text-gray-500 mb-6">Anda akan menggunakan koin Anda untuk membuka bab ini. Lanjutkan?</p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setConfirmModal({ isOpen: false, chapterId: null })}
                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={proceedUnlock}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                            >
                                Ya, Buka
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top App Bar */}
            <div className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => window.history.back()} className="p-1 -ml-1 text-gray-800">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="font-extrabold text-gray-900 text-lg line-clamp-1">{book.title || 'Laut Bercerita'}</h1>
                </div>
                <div className="flex items-center gap-4 text-gray-800">
                    <button><Bookmark className="w-5 h-5" /></button>
                    <button><Share2 className="w-5 h-5" /></button>
                    <button className="-mr-1"><MoreVertical className="w-5 h-5" /></button>
                </div>
            </div>

            {/* Book Info Section */}
            <div className="px-5 pt-5 pb-5">
                <div className="flex gap-4 mb-4">
                    {/* Cover */}
                    <div className="w-[120px] shrink-0 relative rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] bg-gray-100 border border-gray-50">
                        <img
                            src={book.cover ? (book.cover.startsWith('http') || book.cover.startsWith('/') ? book.cover : `/storage/${book.cover}`) : "/images/placeholders/book-cover.svg"}
                            alt={book.title || 'Laut Bercerita'}
                            className="w-full h-auto object-cover aspect-[2/3]"
                        />
                        {/* Fiksi badge inside cover top-left */}
                        <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-white tracking-wide">
                            {book.category?.name?.toUpperCase() || 'FIKSI'}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col pt-0.5">
                        <h2 className="text-[18px] font-extrabold text-gray-900 leading-tight mb-1">{book.title || 'Laut Bercerita'}</h2>
                        <p className="text-[12px] font-medium text-blue-600 mb-2">{book.author?.name || 'Leila S. Chudori'}</p>

                        <div className="flex items-center gap-1.5 mb-2.5">
                            <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                            <span className="text-[13px] font-bold text-gray-900">{Number(book.average_rating) > 0 ? Number(book.average_rating).toFixed(1) : '0.0'}</span>
                            <span className="text-[12px] text-gray-500">({book.reviews ? book.reviews.length : 0} ulasan)</span>
                        </div>

                        <div className="text-[12px] text-gray-600 leading-relaxed relative">
                            <p className={isDescriptionExpanded ? '' : 'line-clamp-3'}>
                                {book.description || 'Sebuah kisah tentang persahabatan, cinta, dan perjuangan mencari kebenaran di tengah situasi yang penuh tekanan.'}
                            </p>
                            <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="text-blue-600 font-medium flex items-center gap-1 mt-1"
                            >
                                {isDescriptionExpanded ? 'Sembunyikan' : 'Selengkapnya'} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Contoh Baca Gratis Button */}
                <button className="w-full mt-3 border border-gray-200 rounded-xl py-2.5 px-4 flex items-center justify-between shadow-sm bg-white hover:bg-gray-50">
                    <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="text-[13px] font-bold text-blue-600">Contoh Baca Gratis</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            {/* Divider */}
            <div className="w-full h-1 bg-gray-50"></div>

            {/* Coins Section */}
            <div className="px-5 py-5 mb-1">
                <div className="flex mb-5">
                    {/* Koin Saya */}
                    <div className="w-[125px] shrink-0 border-r border-gray-100 pr-4 mr-4">
                        <p className="text-[12px] font-medium text-gray-900 mb-3">Koin Saya</p>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">C</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{coinBalance}</span>
                            <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center ml-auto shadow-sm">
                                <span className="text-orange-500 text-sm font-bold leading-none mb-0.5">+</span>
                            </div>
                        </div>
                        <button className="text-[11px] font-medium text-blue-600 flex items-center gap-0.5">
                            Riwayat Transaksi <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Top Up Scroll */}
                    <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-gray-500 leading-none relative z-10">Top Up Koin</p>
                        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1 pt-2.5 -mt-1.5">
                            {/* Card 1 */}
                            <div 
                                onClick={() => setSelectedCoinPackage(100)}
                                className={`shrink-0 w-[85px] p-2 border rounded-xl flex flex-col items-center shadow-sm cursor-pointer transition-colors ${selectedCoinPackage === 100 ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 bg-white'}`}
                            >
                                <div className="flex items-center gap-1.5 mb-1 mt-0.5">
                                    <span className="text-[16px] font-bold text-gray-900">100</span>
                                    <div className="w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center"><span className="text-[8px] text-white font-bold">C</span></div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium">Rp 5.000</span>
                            </div>
                            {/* Card 2 (Popular) */}
                            <div 
                                onClick={() => setSelectedCoinPackage(250)}
                                className={`shrink-0 w-[85px] p-2 border rounded-xl flex flex-col items-center relative shadow-sm cursor-pointer transition-colors ${selectedCoinPackage === 250 ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 bg-white'}`}
                            >
                                <div className="absolute -top-2.5 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">Popular</div>
                                <div className="flex items-center gap-1.5 mb-1 mt-0.5">
                                    <span className="text-[16px] font-bold text-gray-900">250</span>
                                    <div className="w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center"><span className="text-[8px] text-white font-bold">C</span></div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium">Rp 10.000</span>
                            </div>
                            {/* Card 3 */}
                            <div 
                                onClick={() => setSelectedCoinPackage(500)}
                                className={`shrink-0 w-[85px] p-2 border rounded-xl flex flex-col items-center shadow-sm cursor-pointer transition-colors ${selectedCoinPackage === 500 ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 bg-white'}`}
                            >
                                <div className="flex items-center gap-1.5 mb-1 mt-0.5">
                                    <span className="text-[16px] font-bold text-gray-900">500</span>
                                    <div className="w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center"><span className="text-[8px] text-white font-bold">C</span></div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium">Rp 20.000</span>
                            </div>
                        </div>
                        <Link href="/akun/topup" className="text-[11px] font-medium text-blue-600 flex items-center gap-0.5 justify-center w-full mt-3 hover:text-blue-700 transition-colors">
                            Lihat Semua Paket <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>

                {/* Banner Info */}
                <div className="bg-blue-50/50 rounded-xl p-3 flex items-center justify-between border border-blue-100/50">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 shrink-0 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-white font-bold text-[11px] italic">i</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-gray-800 leading-tight">1 bab dapat dibuka menggunakan 10 koin</p>
                            <p className="text-[10px] text-gray-500 mt-1">Buka dan baca kapan saja selama tidak direset.</p>
                        </div>
                    </div>
                    <button className="shrink-0 bg-white border border-gray-100 shadow-sm rounded-lg px-2.5 py-1 text-[10px] font-bold text-blue-600">
                        Cara Kerja
                    </button>
                </div>
            </div>

            {/* Divider */}
            <div className="w-full h-1 bg-gray-50"></div>

            {/* Chapters List */}
            <div className="px-5 py-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] font-extrabold text-gray-900">Daftar Bab</h3>
                    <span className="text-[11px] text-gray-500 font-medium">Total 379 Bab</span>
                </div>

                <div className="flex flex-col gap-2.5">
                    {displayChapters.map((chapter) => {
                        const isPurchased = purchased_chapter_ids.map(String).includes(String(chapter.id));
                        const canRead = chapter.is_free || isPurchased;

                        return canRead ? (
                            <Link href={`/buku/${book.id}/read/${chapter.id}`} key={chapter.id} className={`flex items-center gap-3 p-3.5 rounded-xl border ${chapter.is_free ? 'bg-white border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-gray-50' : 'bg-emerald-50/30 border-emerald-100/50 hover:bg-emerald-100/30'}`}>
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
                            <div key={chapter.id} className="flex items-center gap-3 p-3.5 rounded-xl border bg-blue-50/30 border-blue-100/50 hover:bg-blue-100/30 cursor-pointer" onClick={() => handleUnlockClick(chapter.id)}>
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
                    })}

                    {/* Bundle Unlock */}
                    <div className="mt-3 p-4 border border-purple-100 bg-white rounded-xl flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden">
                        {/* Soft purple gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/80 to-transparent"></div>
                        
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-9 h-9 rounded-full border border-purple-200 bg-white flex items-center justify-center shrink-0">
                                <Lock className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <h4 className="text-[13px] font-extrabold text-gray-900 leading-tight mb-0.5">Bab 7 dan seterusnya</h4>
                                <p className="text-[11px] text-gray-500">373 bab</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end relative z-10">
                            <button className="border border-purple-300 bg-white text-purple-600 rounded-full px-3.5 py-1.5 flex items-center gap-1.5 shadow-sm hover:bg-purple-50">
                                <span className="text-[11px] font-bold">Beli Semua Bab</span>
                                <div className="w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center"><span className="text-[8px] text-white font-bold">C</span></div>
                                <span className="text-[12px] font-bold">3.000</span>
                            </button>
                            <span className="text-[10px] font-medium text-purple-600 mt-1.5 mr-1">Hemat 25%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-2 bg-white pt-6 px-5 pb-8 mb-20 shadow-sm border-t border-gray-100">
                <h3 className="text-[16px] font-extrabold text-gray-900 mb-4">Ulasan Pengguna</h3>

                {/* Review Form (if logged in) */}
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
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setUserRating(star)}
                                        className="p-1 focus:outline-none"
                                    >
                                        <Star className={`w-6 h-6 ${star <= userRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-[11px] font-medium text-gray-700 mb-1.5">Komentar</label>
                            <textarea 
                                name="review" 
                                rows={3} 
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 resize-none focus:ring-1 focus:ring-blue-500 outline-none" 
                                placeholder="Tuliskan pendapat Anda tentang buku ini..." 
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[12px] px-5 py-2.5 rounded-lg transition-colors w-full sm:w-auto text-center shadow-sm">
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

                {/* List Reviews */}
                <div className="space-y-4">
                    {book.reviews && book.reviews.length > 0 ? (
                        book.reviews.map((rev: any) => (
                            <div key={rev.id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden shrink-0 shadow-sm">
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
                            <Link prefetch={['mount', 'hover']} href={item.route} key={item.id} className="flex flex-col items-center justify-center w-16 gap-1 relative mt-1">
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
            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
}
