import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, useForm, router, Link } from '@inertiajs/react';
import * as LucideIcons from 'lucide-react';
import { 
    Plus, Search, Edit2, Trash2, X, Check, Sparkles, Filter, 
    Layers, Tag, Info, AlertCircle 
} from 'lucide-react';

interface IconItem {
    id: number;
    name: string;
    label: string | null;
    category: string | null;
    svg: string | null;
    is_active: boolean;
    created_at?: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    icons: {
        data: IconItem[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: PaginationLinks[];
    };
    categories: string[];
    stats: {
        total: number;
        active: number;
        categories_count: number;
    };
    filters: {
        search: string;
        category: string;
    };
    auth?: any;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function IconsIndex({ icons, categories, stats, filters, auth, flash }: PageProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIcon, setEditingIcon] = useState<IconItem | null>(null);

    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        name: '',
        label: '',
        category: 'Umum',
        svg: '',
        is_active: true as boolean,
    });

    const renderIcon = (iconName: string, size = 24, className = '') => {
        if (!iconName) return <Tag size={size} className={className} />;
        const Component = (LucideIcons as any)[iconName];
        if (!Component) return <Tag size={size} className={className} />;
        return <Component size={size} className={className} />;
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.icons.index'), {
            search: searchTerm,
            category: filters.category,
        }, { preserveState: true });
    };

    const handleCategoryFilter = (cat: string) => {
        router.get(route('admin.icons.index'), {
            search: searchTerm,
            category: cat,
        }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingIcon(null);
        reset();
        setData({
            name: '',
            label: '',
            category: 'Umum',
            svg: '',
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (icon: IconItem) => {
        setEditingIcon(icon);
        setData({
            name: icon.name,
            label: icon.label || '',
            category: icon.category || 'Umum',
            svg: icon.svg || '',
            is_active: !!icon.is_active,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingIcon(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingIcon) {
            put(route('admin.icons.update', editingIcon.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.icons.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ikon "${name}"?`)) {
            destroy(route('admin.icons.destroy', id));
        }
    };

    const isValidLucide = (name: string) => {
        return !!(LucideIcons as any)[name];
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Manajemen Ikon - Talaqee" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Ikon" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8 max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                    <Sparkles size={24} />
                                </span>
                                Manajemen Ikon
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Kelola daftar ikon visual yang dapat digunakan pada Kategori, Menu Navigasi, dan fitur lainnya.
                            </p>
                        </div>

                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm shadow-blue-600/20 active:scale-95 shrink-0"
                        >
                            <Plus size={18} />
                            Tambah Ikon
                        </button>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400">Total Koleksi Ikon</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.total}</h3>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Check size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400">Ikon Aktif</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.active}</h3>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Layers size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-400">Kelompok Kategori</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.categories_count}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                            <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari ikon berdasarkan nama atau label..."
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                                />
                            </form>

                            {/* Category Filter Pills */}
                            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
                                <button
                                    onClick={() => handleCategoryFilter('all')}
                                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                                        filters.category === 'all'
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Semua ({stats.total})
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryFilter(cat)}
                                        className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                                            filters.category === cat
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Icons Grid */}
                        {icons.data.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-2">
                                {icons.data.map((icon) => {
                                    const valid = isValidLucide(icon.name);
                                    return (
                                        <div 
                                            key={icon.id}
                                            className="group relative bg-white border border-gray-100 hover:border-blue-200 hover:shadow-md rounded-2xl p-4 flex flex-col items-center text-center transition-all"
                                        >
                                            {/* Action Buttons */}
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-lg shadow-xs">
                                                <button
                                                    onClick={() => openEditModal(icon)}
                                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded"
                                                    title="Edit Ikon"
                                                >
                                                    <Edit2 size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(icon.id, icon.name)}
                                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded"
                                                    title="Hapus Ikon"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>

                                            {/* Icon Preview */}
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100/50 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                                                {renderIcon(icon.name, 28)}
                                            </div>

                                            {/* Info */}
                                            <h4 className="font-semibold text-gray-900 text-sm truncate w-full" title={icon.name}>
                                                {icon.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 truncate w-full mt-0.5">
                                                {icon.label || '-'}
                                            </p>

                                            <div className="mt-3 flex items-center gap-1.5 flex-wrap justify-center">
                                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                                                    {icon.category || 'Umum'}
                                                </span>
                                                {!icon.is_active && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-50 text-red-600 font-medium">
                                                        Nonaktif
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-16 text-center text-gray-400 space-y-3">
                                <Sparkles size={40} className="mx-auto text-gray-300" />
                                <h3 className="text-base font-semibold text-gray-700">Tidak ada ikon ditemukan</h3>
                                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                                    Coba ubah kata kunci pencarian atau tambahkan ikon baru ke dalam tabel.
                                </p>
                                <button
                                    onClick={openCreateModal}
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    <Plus size={16} />
                                    Tambah Ikon Baru
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {icons.links && icons.links.length > 3 && (
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                <p className="text-xs text-gray-500">
                                    Menampilkan {icons.from || 0} - {icons.to || 0} dari {icons.total} ikon
                                </p>
                                <div className="flex items-center gap-1">
                                    {icons.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-blue-600 text-white shadow-xs'
                                                    : !link.url
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                <Sparkles size={20} className="text-blue-600" />
                                {editingIcon ? 'Edit Ikon' : 'Tambah Ikon Baru'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Live Icon Preview Box */}
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 shadow-xs">
                                    {renderIcon(data.name, 28)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        {data.name || 'Pratinjau Ikon'}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {data.name ? (isValidLucide(data.name) ? 'Ikon Lucide valid ✓' : 'Ikon kustom / belum terdaftar di Lucide') : 'Ketikkan nama ikon Lucide'}
                                    </p>
                                </div>
                            </div>

                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Ikon Lucide *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Book, Bookmark, Compass, Heart"
                                    required
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                <p className="text-[11px] text-gray-400 mt-1">
                                    Gunakan nama ikon persis seperti di <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">lucide.dev/icons</a> (PascalCase).
                                </p>
                            </div>

                            {/* Label Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Label Tampilan (Deskripsi)
                                </label>
                                <input
                                    type="text"
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    placeholder="Contoh: Buku Bacaan, Penanda, Kompas"
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                                />
                                {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label}</p>}
                            </div>

                            {/* Category Select / Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kategori Pengelompokan
                                </label>
                                <input
                                    type="text"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    placeholder="Contoh: Edukasi, Agama, Media, Umum, Bisnis"
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                                />
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="icon_is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="icon_is_active" className="text-sm font-medium text-gray-700 select-none">
                                    Aktifkan ikon (dapat dipilih di kategori & menu)
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-sm shadow-blue-600/20 disabled:opacity-50"
                                >
                                    {editingIcon ? 'Simpan Perubahan' : 'Tambah Ikon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
