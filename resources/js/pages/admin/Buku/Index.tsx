import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, Bell, 
    TrendingUp, ChevronDown, Plus, Search, Filter, Eye, Edit2, Trash2,
    BookMarked, Bookmark, Library
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface BookItem {
    id: number;
    title: string;
    isbn: string;
    cover: string | null;
    price: number;
    stock: number;
    author: {
        name: string;
    };
    category: {
        name: string;
    };
}

interface PageProps {
    [key: string]: unknown;
    books: {
        data: BookItem[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: any[];
    };
    stats: {
        total_buku: number;
        stok_tersedia: number;
        kategori: number;
        rak: number;
    };
    auth: {
        user: {
            name: string;
            email: string;
        }
    };
}

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
};

export default function BukuIndex() {
    const { books, stats, auth } = usePage<PageProps>().props;

    

    

    const getCategoryBadge = (category: string) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('pengembangan diri')) return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-100">{category}</span>;
        if (cat.includes('fiksi')) return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">{category}</span>;
        if (cat.includes('sejarah')) return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">{category}</span>;
        if (cat.includes('keuangan')) return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">{category}</span>;
        
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">{category}</span>;
    };

    const getStatusBadge = (stock: number) => {
        if (stock === 0) {
            return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">Habis</span>;
        }
        if (stock <= 15) {
            return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100">Stok Rendah</span>;
        }
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">Tersedia</span>;
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Buku - BookStore" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Buku" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8">
                    {/* Header */}
                    <header className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Buku</h2>
                            <p className="text-gray-500 text-sm mt-1">Dashboard <span className="mx-1">&gt;</span> Buku</p>
                        </div>
                        <div className="flex flex-col items-end gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 flex items-center gap-2 shadow-sm">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    01 Mei 2024 - 31 Mei 2024
                                </div>
                                <button className="bg-white border border-gray-200 p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 relative shadow-sm">
                                    <Bell size={20} />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                </button>
                            </div>
                            <Link href={route('admin.books.create')} className="bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2.5 px-5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
                                <Plus size={16} /> Tambah Buku
                            </Link>
                        </div>
                    </header>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Buku */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Book className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Buku</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.total_buku)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 8.3% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Stok Tersedia */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Box className="text-emerald-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Stok Tersedia</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.stok_tersedia)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 12.5% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Kategori */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Grid className="text-amber-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Kategori</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{stats.kategori}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 4.2% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Rak */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Library className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Rak</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{stats.rak}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 3.1% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 justify-between">
                            <div className="relative w-[320px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" placeholder="Cari buku, penulis, ISBN..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" />
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-44 relative">
                                    <select className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                        <option>Semua Kategori</option>
                                        <option>Pengembangan Diri</option>
                                        <option>Fiksi</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                                <div className="w-44 relative">
                                    <select className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                        <option>Semua Status</option>
                                        <option>Tersedia</option>
                                        <option>Stok Rendah</option>
                                        <option>Habis</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Filter size={16} /> Filter Lainnya
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center"></div> Reset
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto rounded-t-xl">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc]">
                                    <tr className="text-gray-500 border-b border-gray-100">
                                        <th className="py-4 px-6 font-medium">No.</th>
                                        <th className="py-4 px-6 font-medium min-w-[250px]">Buku</th>
                                        <th className="py-4 px-6 font-medium">Penulis</th>
                                        <th className="py-4 px-6 font-medium">Kategori</th>
                                        <th className="py-4 px-6 font-medium">Harga</th>
                                        <th className="py-4 px-6 font-medium text-center">Stok</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                        <th className="py-4 px-6 font-medium text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.data.length > 0 ? books.data.map((book, idx) => (
                                        <tr key={book.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6 text-gray-600">{books.from + idx}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-14 bg-indigo-900 rounded overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                                                        {book.cover ? (
                                                            <img src={book.cover.startsWith('http') || book.cover.startsWith('/') ? book.cover : `/storage/${book.cover}`} alt={book.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                                <Book size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-base">{book.title}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">ISBN: {book.isbn || '-'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-900 font-medium">{book.author?.name || '-'}</td>
                                            <td className="py-4 px-6">
                                                {getCategoryBadge(book.category?.name)}
                                            </td>
                                            <td className="py-4 px-6 font-medium text-gray-900">{formatRupiah(book.price)}</td>
                                            <td className="py-4 px-6 text-center font-medium text-gray-900">{book.stock}</td>
                                            <td className="py-4 px-6">
                                                {getStatusBadge(book.stock)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link href={route('admin.books.edit', book.id)} className="p-2 rounded-lg border border-purple-100 text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all inline-block">
                                                        <Edit2 size={16} />
                                                    </Link>
                                                    <Link href={route('admin.books.show', book.id)} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-all inline-block">
                                                        <Eye size={16} />
                                                    </Link>
                                                    <button onClick={() => { if(confirm('Hapus buku ini?')) router.delete(route('admin.books.destroy', book.id)) }} className="p-2 rounded-lg border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center text-gray-500">Belum ada data buku</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-50">
                            <span className="text-sm text-gray-500">
                                Menampilkan {books.from || 0} - {books.to || 0} dari {books.total} data
                            </span>
                            <div className="flex items-center gap-1">
                                {books.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                                            link.active
                                            ? 'bg-[#6366f1] text-white font-medium shadow-sm'
                                            : link.url
                                                ? 'text-gray-600 hover:bg-gray-100 border border-transparent'
                                                : 'text-gray-300 cursor-not-allowed'
                                        } ${link.label.includes('Previous') || link.label.includes('Next') ? 'w-auto px-2 border border-gray-200' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
