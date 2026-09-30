import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, Trash2, Clock, BookOpen, ChevronRight, 
    BookMarked, AlertCircle
} from 'lucide-react';

interface HistoryItem {
    id: number;
    book_id: number;
    chapter_id: number | null;
    current_page: number;
    total_page: number;
    progress_percent: number;
    last_read_at: string | null;
    last_read_formatted: string | null;
    book: {
        id: number;
        title: string;
        cover: string | null;
        author?: { name: string } | null;
    } | null;
    chapter: {
        id: number;
        chapter_number: number;
        title: string;
    } | null;
}

interface RiwayatProps {
    history: HistoryItem[];
}

export default function Riwayat({ history = [] }: RiwayatProps) {
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDeleteItem = (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDeletingId(id);
        router.delete(`/akun/riwayat/${id}`, {
            preserveScroll: true,
            onFinish: () => setDeletingId(null)
        });
    };

    const handleClearAll = () => {
        router.delete('/akun/riwayat/clear', {
            preserveScroll: true,
            onFinish: () => setShowConfirmClear(false)
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-[#7e57c2] selection:text-white">
            <Head title="Riwayat Baca - Talaqee" />

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
                        <h1 className="text-[17px] font-extrabold text-gray-900 leading-tight">Riwayat Baca</h1>
                        <p className="text-[11px] font-medium text-gray-500">{history.length} buku terakhir dibaca</p>
                    </div>
                </div>

                {history.length > 0 && (
                    <button 
                        onClick={() => setShowConfirmClear(true)}
                        className="text-[12px] font-bold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Semua</span>
                    </button>
                )}
            </div>

            <div className="max-w-xl mx-auto px-5 pt-4">
                {history.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mb-4 shadow-sm">
                            <Clock className="w-10 h-10 stroke-[1.5]" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-1">Belum Ada Riwayat Baca</h3>
                        <p className="text-xs text-gray-500 max-w-xs mb-6 leading-relaxed">
                            Buku atau bab yang baru saja kamu baca akan muncul di sini agar kamu bisa langsung melanjutkan membaca kapan pun.
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
                    <div className="space-y-3">
                        {history.map((item) => {
                            const book = item.book;
                            if (!book) return null;

                            const targetUrl = item.chapter_id 
                                ? `/buku/${item.book_id}/read/${item.chapter_id}`
                                : `/buku/${item.book_id}`;

                            return (
                                <div 
                                    key={item.id} 
                                    className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex gap-3.5 relative overflow-hidden group"
                                >
                                    {/* Book Cover */}
                                    <Link href={targetUrl} className="w-[72px] aspect-[3/4] shrink-0 rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 relative block">
                                        <img 
                                            src={book.cover ? (book.cover.startsWith('http') || book.cover.startsWith('/') ? book.cover : `/storage/${book.cover}`) : "/images/placeholders/book-cover.svg"} 
                                            alt={book.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </Link>

                                    {/* Book and Progress Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <Link href={targetUrl} className="block">
                                                    <h3 className="font-extrabold text-[14px] text-gray-900 leading-snug line-clamp-1 group-hover:text-[#5C5AE6] transition-colors">
                                                        {book.title}
                                                    </h3>
                                                </Link>
                                                <button 
                                                    onClick={(e) => handleDeleteItem(item.id, e)}
                                                    disabled={deletingId === item.id}
                                                    title="Hapus dari riwayat"
                                                    className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1 rounded-md transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <p className="text-[11px] font-medium text-gray-500 mb-2 truncate">
                                                {book.author?.name || 'Penulis Tidak Diketahui'}
                                            </p>

                                            {item.chapter ? (
                                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold mb-2">
                                                    <BookMarked className="w-3 h-3 shrink-0" />
                                                    <span className="truncate max-w-[180px]">
                                                        Bab {item.chapter.chapter_number}: {item.chapter.title}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 text-[10px] font-semibold mb-2">
                                                    <BookOpen className="w-3 h-3" />
                                                    <span>Mulai Membaca</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bottom Action & Timestamp */}
                                        <div className="pt-1 border-t border-gray-50 flex items-center justify-between">
                                            <span className="text-[10px] font-medium text-gray-400">
                                                {item.last_read_at || 'Baru saja'}
                                            </span>
                                            <Link 
                                                href={targetUrl}
                                                className="inline-flex items-center gap-1 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5C5AE6] text-[11px] font-bold px-3 py-1 rounded-lg transition-colors"
                                            >
                                                <span>Lanjutkan</span>
                                                <ChevronRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Clear All Confirmation Modal */}
            {showConfirmClear && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-extrabold text-gray-900 mb-1">Hapus Semua Riwayat?</h3>
                        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                            Seluruh daftar buku yang pernah kamu baca akan dibersihkan dari akun ini. Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setShowConfirmClear(false)}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleClearAll}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition"
                            >
                                Hapus Semua
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
