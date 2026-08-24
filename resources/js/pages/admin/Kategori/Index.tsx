import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, Bell, 
    TrendingUp, ChevronDown, Plus, Search, Filter, Eye, Edit2, Trash2,
    Tag, GraduationCap, Landmark, Lightbulb, Atom, Baby, MoreHorizontal, LayoutGrid
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface CategoryItem {
    id: number;
    name: string;
    description: string;
    icon: string;
    color: string;
    is_active: boolean;
    books_count: number;
}

interface PageProps {
    [key: string]: unknown;
    categories: {
        data: CategoryItem[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: any[];
    };
    stats: {
        total_kategori: number;
        kategori_aktif: number;
        kategori_nonaktif: number;
        total_buku: number;
    };
    auth: {
        user: {
            name: string;
            email: string;
        }
    };
}

export default function KategoriIndex() {
    const { categories, stats, auth } = usePage<PageProps>().props;

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(route('admin.categories.destroy', id));
        }
    };

    

    

    const renderCategoryIcon = (iconName: string) => {
        const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Tag;
        return <IconComponent size={18} className="text-white" />;
    };

    const getIconColorClass = (color: string) => {
        // Map from Tailwind text/bg colors to the solid background for the icon circle
        if (color?.includes('indigo')) return 'bg-indigo-500';
        if (color?.includes('emerald') || color?.includes('green')) return 'bg-emerald-500';
        if (color?.includes('amber') || color?.includes('yellow')) return 'bg-amber-500';
        if (color?.includes('pink')) return 'bg-pink-400';
        if (color?.includes('blue')) return 'bg-blue-500';
        if (color?.includes('purple')) return 'bg-purple-500';
        if (color?.includes('orange')) return 'bg-orange-500';
        return 'bg-gray-400';
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Kategori - BookStore" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Kategori" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8">
                    {/* Header */}
                    <header className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Kategori</h2>
                            <p className="text-gray-500 text-sm mt-1">Dashboard <span className="mx-1">&gt;</span> Kategori</p>
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
                            <Link href={route('admin.categories.create')} className="bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2.5 px-5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
                                <Plus size={16} /> Tambah Kategori
                            </Link>
                        </div>
                    </header>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Kategori */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Tag className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Kategori</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{stats.total_kategori}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 4.2% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Kategori Aktif */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                    <BookOpen className="text-emerald-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Kategori Aktif</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{stats.kategori_aktif}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 8.3% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Kategori Nonaktif */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Box className="text-amber-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Kategori Nonaktif</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{stats.kategori_nonaktif}</h3>
                                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 transform rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> 33.3% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Total Buku Semua Kategori */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <LayoutGrid className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Buku di Semua Kategori</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.total_buku)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 12.5% <span className="text-gray-400 font-normal">dari periode lalu</span>
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
                                <input type="text" placeholder="Cari kategori..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" />
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-44 relative">
                                    <select className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                        <option>Semua Status</option>
                                        <option>Aktif</option>
                                        <option>Nonaktif</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Filter size={16} /> Filter
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
                                        <th className="py-4 px-6 font-medium w-16">No.</th>
                                        <th className="py-4 px-6 font-medium min-w-[200px]">Kategori</th>
                                        <th className="py-4 px-6 font-medium min-w-[300px]">Deskripsi</th>
                                        <th className="py-4 px-6 font-medium text-center">Jumlah Buku</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                        <th className="py-4 px-6 font-medium text-center w-36">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.data.length > 0 ? categories.data.map((category, idx) => (
                                        <tr key={category.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6 text-gray-600">{categories.from + idx}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0 ${getIconColorClass(category.color)}`}>
                                                        {renderCategoryIcon(category.icon)}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{category.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600 leading-relaxed">
                                                {category.description || '-'}
                                            </td>
                                            <td className="py-4 px-6 text-center font-medium text-gray-900">
                                                {category.books_count}
                                            </td>
                                            <td className="py-4 px-6">
                                                {category.is_active ? (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">Aktif</span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-100">Nonaktif</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link href={route('admin.categories.edit', category.id)} className="p-2 rounded-lg border border-purple-100 text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all">
                                                        <Edit2 size={16} />
                                                    </Link>
                                                    <Link href={route('admin.categories.show', category.id)} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                                                        <Eye size={16} />
                                                    </Link>
                                                    <button onClick={() => handleDelete(category.id)} className="p-2 rounded-lg border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-gray-500">Belum ada data kategori</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-50">
                            <span className="text-sm text-gray-500">
                                Menampilkan {categories.from || 0} - {categories.to || 0} dari {categories.total} data
                            </span>
                            <div className="flex items-center gap-1">
                                {categories.links.map((link, idx) => (
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
