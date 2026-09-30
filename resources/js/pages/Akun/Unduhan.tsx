import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft, Download, Trash2, BookOpen, HardDrive, 
    CheckCircle2, ChevronRight, AlertCircle, FileText
} from 'lucide-react';

interface DownloadItem {
    id: number;
    content_id: number;
    file_path: string;
    file_size: number;
    file_size_formatted: string;
    created_at: string | null;
    book: {
        id: number;
        title: string;
        cover: string | null;
        total_chapters: number;
        first_chapter_id: number | null;
        author?: { name: string } | null;
    } | null;
}

interface UnduhanProps {
    downloads: DownloadItem[];
    totalStorage: string;
    totalCount: number;
}

export default function Unduhan({ 
    downloads: initialDownloads = [], 
    totalStorage = '0 KB', 
    totalCount = 0 
}: UnduhanProps) {
    const [downloads, setDownloads] = useState<DownloadItem[]>(initialDownloads);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDeleteDownload = (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDeletingId(id);

        router.delete(`/unduhan/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDownloads(prev => prev.filter(item => item.id !== id));
            },
            onFinish: () => setDeletingId(null)
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-[#7e57c2] selection:text-white">
            <Head title="Unduhan Saya - Talaqee" />

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
                        <h1 className="text-[17px] font-extrabold text-gray-900 leading-tight">Unduhan Saya</h1>
                        <p className="text-[11px] font-medium text-gray-500">{downloads.length} buku tersimpan offline</p>
                    </div>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-5 pt-4 space-y-4">
                {/* Storage Info Card */}
                {downloads.length > 0 && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/80 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                                <HardDrive className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-900">Penyimpanan Terpakai</h3>
                                <p className="text-[11px] text-gray-500">{downloads.length} buku tersimpan offline</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-base font-black text-emerald-700">{totalStorage}</span>
                            <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Siap dibaca
                            </div>
                        </div>
                    </div>
                )}

                {downloads.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-4 shadow-sm">
                            <Download className="w-10 h-10 stroke-[1.5]" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-1">Belum Ada Unduhan</h3>
                        <p className="text-xs text-gray-500 max-w-xs mb-6 leading-relaxed">
                            Unduh buku agar kamu dapat membacanya kapan saja tanpa khawatir kehabisan kuota atau koneksi internet.
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
                        {downloads.map((item) => {
                            const book = item.book;
                            if (!book) return null;

                            const targetUrl = book.first_chapter_id 
                                ? `/buku/${book.id}/read/${book.first_chapter_id}`
                                : `/buku/${book.id}`;

                            return (
                                <div 
                                    key={item.id}
                                    className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex gap-3.5 relative overflow-hidden group"
                                >
                                    {/* Cover */}
                                    <Link href={targetUrl} className="w-[72px] aspect-[3/4] shrink-0 rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 relative block">
                                        <img 
                                            src={book.cover ? (book.cover.startsWith('http') || book.cover.startsWith('/') ? book.cover : `/storage/${book.cover}`) : "/images/placeholders/book-cover.svg"} 
                                            alt={book.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute bottom-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle2 className="w-2.5 h-2.5" />
                                        </div>
                                    </Link>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <Link href={targetUrl} className="block">
                                                    <h3 className="font-extrabold text-[14px] text-gray-900 leading-snug line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                                        {book.title}
                                                    </h3>
                                                </Link>
                                                <button 
                                                    onClick={(e) => handleDeleteDownload(item.id, e)}
                                                    disabled={deletingId === item.id}
                                                    title="Hapus unduhan"
                                                    className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1 rounded-md transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <p className="text-[11px] font-medium text-gray-500 mb-1.5 truncate">
                                                {book.author?.name || 'Penulis Tidak Diketahui'}
                                            </p>

                                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-2">
                                                <span>{book.total_chapters} Bab Tersimpan</span>
                                                <span>•</span>
                                                <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                                    {item.file_size_formatted}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bottom Action */}
                                        <div className="pt-1 border-t border-gray-50 flex items-center justify-between">
                                            <span className="text-[10px] font-medium text-gray-400">
                                                {item.created_at || 'Baru saja'}
                                            </span>
                                            <Link 
                                                href={targetUrl}
                                                className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm transition-colors"
                                            >
                                                <span>Baca Offline</span>
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
        </div>
    );
}
