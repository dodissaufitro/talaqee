import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Heart, Star, BookOpen, ChevronRight } from 'lucide-react';

interface FavoriteBook {
    id: number;
    content_id: number;
    created_at: string | null;
    book: {
        id: number;
        title: string;
        cover: string | null;
        coins_price: number;
        price: number;
        average_rating: number;
        author?: { name: string } | null;
        category?: { name: string } | null;
    };
}

interface FavoritProps {
    favorites: FavoriteBook[];
}

export default function Favorit({ favorites: initialFavorites = [] }: FavoritProps) {
    const [favorites, setFavorites] = useState<FavoriteBook[]>(initialFavorites);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const handleRemoveFavorite = async (favId: number, bookId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setRemovingId(favId);

        // Optimistic UI update
        setFavorites(prev => prev.filter(f => f.id !== favId));

        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content 
            || decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '');

        try {
            await fetch('/favorit/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-XSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    content_type: 'book',
                    content_id: bookId
                })
            });
        } catch (err) {
            // Rollback if failed
            setFavorites(initialFavorites);
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-[#7e57c2] selection:text-white">
            <Head title="Favorit Saya - Talaqee" />

            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-5 py-4 border-b border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => window.history.back()} 
                        className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-[17px] font-extrabold text-gray-900 leading-tight">Favorit Saya</h1>
                        <p className="text-[11px] font-medium text-gray-500">{favorites.length} buku tersimpan</p>
                    </div>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-5 pt-4">
                {favorites.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-4 shadow-sm">
                            <Heart className="w-10 h-10 stroke-[1.5]" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-1">Belum Ada Buku Favorit</h3>
                        <p className="text-xs text-gray-500 max-w-xs mb-6 leading-relaxed">
                            Simpan buku yang kamu suka dengan menekan ikon bookmark atau favorit agar mudah ditemukan kembali.
                        </p>
                        <Link 
                            href="/katalog" 
                            className="bg-[#5C5AE6] hover:bg-[#4E4CD4] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Jelajahi Katalog Buku</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {favorites.map((fav) => {
                            const book = fav.book;
                            if (!book) return null;

                            return (
                                <Link 
                                    href={`/buku/${book.id}`} 
                                    key={fav.id} 
                                    className="group flex flex-col w-full bg-white rounded-2xl p-2.5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all relative overflow-hidden"
                                >
                                    {/* Book Cover Container */}
                                    <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-2 border border-gray-50 shadow-inner relative">
                                        <img 
                                            src={book.cover ? (book.cover.startsWith('http') || book.cover.startsWith('/') ? book.cover : `/storage/${book.cover}`) : "/images/placeholders/book-cover.svg"} 
                                            alt={book.title} 
                                            loading="lazy" 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                        />
                                        
                                        {/* Remove from favorites quick button */}
                                        <button 
                                            onClick={(e) => handleRemoveFavorite(fav.id, book.id, e)}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-rose-500 shadow-sm border border-black/5 hover:scale-110 active:scale-95 transition-all"
                                            title="Hapus dari favorit"
                                        >
                                            <Heart className="w-4 h-4 fill-rose-500" />
                                        </button>

                                        {/* Category Badge */}
                                        {book.category && (
                                            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                                                {book.category.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Book Info */}
                                    <h4 className="font-extrabold text-[12px] text-gray-900 leading-[1.35] mb-0.5 line-clamp-2 min-h-[32px] group-hover:text-[#5C5AE6] transition-colors">
                                        {book.title}
                                    </h4>
                                    <p className="text-[10px] font-medium text-gray-500 truncate mb-2">
                                        {book.author?.name || 'Penulis Tidak Diketahui'}
                                    </p>

                                    {/* Price and Rating */}
                                    <div className="flex items-center justify-between mt-auto pt-1 border-t border-gray-50">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                            <span className="text-[10px] font-bold text-gray-700">
                                                {Number(book.average_rating) > 0 ? Number(book.average_rating).toFixed(1) : '5.0'}
                                            </span>
                                        </div>
                                        {book.coins_price > 0 ? (
                                            <div className="flex items-center gap-1">
                                                <div className="w-3.5 h-3.5 bg-[#FBBF24] rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-sm">C</div>
                                                <span className="font-extrabold text-[11px] text-gray-900">{book.coins_price}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                                Gratis
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
