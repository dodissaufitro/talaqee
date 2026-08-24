import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, Bell, 
    Plus, Edit, Trash2, X, Check, Image as ImageIcon
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Banner {
    id: number;
    title: string | null;
    subtitle: string | null;
    button_text: string | null;
    link_url: string | null;
    background_color: string | null;
    image_path: string;
    sort_order: number;
    is_active: boolean;
}

interface NavigationItem {
    id: number;
    name: string;
    icon: string;
    route: string | null;
    order: number;
    is_active: boolean;
}

interface PageProps {
    [key: string]: unknown;
    banners: Banner[];
    navItems: NavigationItem[];
    auth: {
        user: { name: string; email: string };
    };
    flash: { success?: string };
}

export default function BannersIndex() {
    const { banners, navItems, auth, flash } = usePage<PageProps>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, reset, processing, errors } = useForm({
        _method: 'POST',
        title: '',
        subtitle: '',
        button_text: '',
        link_url: '',
        background_color: 'bg-blue-50',
        sort_order: 0,
        is_active: true as boolean,
        image: null as File | null,
    });

    

    const openCreateModal = () => {
        reset();
        setData('_method', 'POST');
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: Banner) => {
        setData({
            _method: 'PUT',
            title: item.title || '',
            subtitle: item.subtitle || '',
            button_text: item.button_text || '',
            link_url: item.link_url || '',
            background_color: item.background_color || 'bg-blue-50',
            sort_order: item.sort_order,
            is_active: item.is_active,
            image: null,
        });
        setEditingId(item.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingId) {
            post(route('admin.banners.update', editingId), {
                forceFormData: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.banners.store'), {
                forceFormData: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus banner ini?')) {
            useForm().delete(route('admin.banners.destroy', id));
        }
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Manajemen Banner - BookStore" />

            {/* Sidebar (Reused from Dashboard for consistency) */}
            <AdminSidebar activeItem="" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                    <header className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Manajemen Banner</h2>
                            <p className="text-gray-500 text-sm mt-1">Atur banner promosi di halaman utama</p>
                        </div>
                        <button 
                            onClick={openCreateModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <Plus size={18} />
                            Tambah Banner
                        </button>
                    </header>

                    {flash.success && (
                        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-2">
                            <Check size={18} />
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr className="text-gray-500">
                                    <th className="px-6 py-4 font-medium">Gambar</th>
                                    <th className="px-6 py-4 font-medium">Judul</th>
                                    <th className="px-6 py-4 font-medium">Urutan</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {banners.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="w-24 h-12 bg-gray-100 rounded overflow-hidden relative border border-gray-200">
                                                <img src={item.image_path.startsWith('http') || item.image_path.startsWith('/') ? item.image_path : `/storage/${item.image_path}`} alt="Banner" className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div dangerouslySetInnerHTML={{ __html: item.title || 'Tanpa Judul' }} className="line-clamp-2" />
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{item.sort_order}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                {item.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {banners.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Belum ada banner.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden my-8">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-lg text-gray-900">
                                {editingId ? 'Edit Banner' : 'Tambah Banner'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Banner</label>
                                <input 
                                    type="file" 
                                    onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                                    accept="image/*"
                                    required={!editingId} // Require image only on create
                                />
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                                {editingId && <p className="text-xs text-gray-500 mt-1">Kosongkan jika tidak ingin mengubah gambar.</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul (Bisa pakai tag HTML seperti &lt;br&gt; atau &lt;span&gt;)</label>
                                <input 
                                    type="text" 
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Judul (Deskripsi)</label>
                                <textarea 
                                    value={data.subtitle} 
                                    onChange={e => setData('subtitle', e.target.value)}
                                    className="w-full border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm h-20"
                                />
                                {errors.subtitle && <p className="text-red-500 text-xs mt-1">{errors.subtitle}</p>}
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teks Tombol</label>
                                    <input 
                                        type="text" 
                                        value={data.button_text} 
                                        onChange={e => setData('button_text', e.target.value)}
                                        className="w-full border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Cari Buku"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link Tombol / Banner</label>
                                    <input 
                                        type="text" 
                                        value={data.link_url} 
                                        onChange={e => setData('link_url', e.target.value)}
                                        className="w-full border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="/katalog"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warna Background (Tailwind Class)</label>
                                    <input 
                                        type="text" 
                                        value={data.background_color} 
                                        onChange={e => setData('background_color', e.target.value)}
                                        className="w-full border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="bg-blue-50"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Urutan (Sort Order)</label>
                                    <input 
                                        type="number" 
                                        value={data.sort_order} 
                                        onChange={e => setData('sort_order', parseInt(e.target.value))}
                                        className="w-full border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer mt-2">
                                    <input 
                                        type="checkbox" 
                                        checked={data.is_active} 
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">Banner Aktif</span>
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
