import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, ArrowLeft,
    Bell, TrendingUp, ChevronDown, CheckCircle, Upload, Eye, List, Plus, Edit2, Trash2
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Book {
    id: number;
    title: string;
    cover: string;
    author: { name: string };k
    category: { name: string };
    is_active: boolean;
    is_free: boolean;
    coin_per_chapter: number;
    total_chapters: number;
    rating: number;
    description: string;
    total_reads?: number;
}

interface Chapter {
    id: number;
    book_id: number;
    chapter_number: number;
    title: string;
    is_free: boolean;
    is_active: boolean;
    coin_price: number;
}

interface PageProps {
    [key: string]: unknown;
    book: Book;
    chapters: Chapter[];
    salesData: {
        total_sales: number;
        total_purchases: number;
    };
}

export default function BukuShow() {
    const { book, chapters, salesData } = usePage<PageProps>().props;

    const handleDeleteChapter = (chapterId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus bab ini?')) {
            router.delete(route('admin.books.chapters.destroy', [book.id, chapterId]));
        }
    };

    

    

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title={`Detail Buku - ${book.title}`} />

            {/* Sidebar */}
            <AdminSidebar activeItem="Buku" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8">
                    {/* Header */}
                    <header className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Link href={route('admin.books.index')} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 transition">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Detail Buku</h2>
                                <p className="text-gray-500 text-sm mt-1">Informasi lengkap buku beserta statistiknya.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link href={route('admin.books.edit', book.id)} className="px-5 py-2.5 bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100 font-medium rounded-xl transition-colors">
                                Edit Buku
                            </Link>
                        </div>
                    </header>

                    {/* Book Overview */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-64 shrink-0">
                                <div className="aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                                    {book.cover ? (
                                        <img src={book.cover.startsWith('http') || book.cover.startsWith('/') ? book.cover : `/storage/${book.cover}`} alt={book.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <Book size={64} className="text-gray-300" />
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h1>
                                    <p className="text-gray-500 font-medium flex items-center gap-2">
                                        <span>Oleh {book.author?.name || 'Tidak diketahui'}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-xs">{book.category?.name || 'Uncategorized'}</span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-100">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Status</p>
                                        <p className="font-medium text-gray-900">{book.is_active ? 'Aktif' : 'Tidak Aktif'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Koin per Bab</p>
                                        <p className="font-medium text-gray-900">{book.is_free ? 'Gratis' : book.coin_per_chapter}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Bab</p>
                                        <p className="font-medium text-gray-900">{book.total_chapters || 0} Bab</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Rating</p>
                                        <p className="font-medium text-gray-900 flex items-center gap-1">
                                            <Star size={16} className="text-amber-400 fill-amber-400" /> {book.rating || 0}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-2">Deskripsi</h3>
                                    <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                        {book.description || 'Belum ada deskripsi untuk buku ini.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                                <TrendingUp size={24} className="text-green-600" />
                            </div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Pendapatan Buku</p>
                            <h3 className="text-2xl font-bold text-gray-900">{formatRupiah(salesData.total_sales)}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                <ShoppingCart size={24} className="text-blue-600" />
                            </div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Total Pembelian Bab</p>
                            <h3 className="text-2xl font-bold text-gray-900">{salesData.total_purchases} x</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                                <Eye size={24} className="text-purple-600" />
                            </div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Total Dibaca</p>
                            <h3 className="text-2xl font-bold text-gray-900">{book.total_reads || 0} kali</h3>
                        </div>
                    </div>

                    {/* Chapters Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Daftar Bab</h3>
                                <p className="text-sm text-gray-500">Kelola bab untuk buku ini.</p>
                            </div>
                            <Link 
                                href={route('admin.books.chapters.create', book.id)} 
                                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Plus size={16} /> Tambah Bab
                            </Link>
                        </div>
                        
                        {chapters && chapters.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-[#f8fafc]">
                                        <tr className="text-gray-500 border-b border-gray-100">
                                            <th className="py-4 px-6 font-medium w-16">Bab</th>
                                            <th className="py-4 px-6 font-medium">Judul Bab</th>
                                            <th className="py-4 px-6 font-medium">Harga Koin</th>
                                            <th className="py-4 px-6 font-medium text-center">Status</th>
                                            <th className="py-4 px-6 font-medium text-center w-32">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chapters.map((chapter) => (
                                            <tr key={chapter.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-6 font-semibold text-gray-600">{chapter.chapter_number}</td>
                                                <td className="py-4 px-6 text-gray-900 font-medium">
                                                    {chapter.title}
                                                    {chapter.is_free && <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-600 uppercase">Gratis</span>}
                                                </td>
                                                <td className="py-4 px-6 text-gray-600">{chapter.coin_price} Koin</td>
                                                <td className="py-4 px-6 text-center">
                                                    {chapter.is_active ? (
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">Aktif</span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-100">Nonaktif</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link 
                                                            href={route('admin.books.chapters.edit', [book.id, chapter.id])} 
                                                            className="p-2 rounded-lg border border-purple-100 text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all"
                                                        >
                                                            <Edit2 size={16} />
                                                        </Link>
                                                        <button 
                                                            onClick={() => handleDeleteChapter(chapter.id)} 
                                                            className="p-2 rounded-lg border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
                                <List className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                <h3 className="text-sm font-medium text-gray-900">Belum ada bab</h3>
                                <p className="text-sm text-gray-500 mt-1">Buku ini belum memiliki bab apapun.</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
