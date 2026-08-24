import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, Bell, 
    Plus, Edit, Trash2, X, Check
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

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
    items: NavigationItem[];
    navItems: NavigationItem[];
    auth: {
        user: { name: string; email: string };
    };
    flash: { success?: string };
}

export default function NavigationIndex() {
    const { items, navItems, auth, flash } = usePage<PageProps>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        name: '',
        icon: '',
        route: '',
        order: 0,
        is_active: true as boolean,
    });

    

    const openCreateModal = () => {
        reset();
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: NavigationItem) => {
        setData({
            name: item.name,
            icon: item.icon || '',
            route: item.route || '',
            order: item.order,
            is_active: item.is_active,
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
            put(route('admin.navigation-items.update', editingId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.navigation-items.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
            destroy(route('admin.navigation-items.destroy', id));
        }
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Manajemen Navigasi - BookStore" />

            {/* Sidebar (Reused from Dashboard for consistency) */}
            <AdminSidebar activeItem="" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                    <header className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Manajemen Navigasi</h2>
                            <p className="text-gray-500 text-sm mt-1">Atur menu sidebar aplikasi</p>
                        </div>
                        <button 
                            onClick={openCreateModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <Plus size={18} />
                            Tambah Menu
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
                                    <th className="px-6 py-4 font-medium">Urutan</th>
                                    <th className="px-6 py-4 font-medium">Menu</th>
                                    <th className="px-6 py-4 font-medium">Icon</th>
                                    <th className="px-6 py-4 font-medium">Route</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-gray-600 font-medium">{item.order}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                {renderIcon(item.icon)}
                                                <span className="text-xs">{item.icon}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{item.route || '-'}</td>
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
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-gray-900">
                                {editingId ? 'Edit Menu' : 'Tambah Menu'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Lucide React Name)</label>
                                <input 
                                    type="text" 
                                    value={data.icon} 
                                    onChange={e => setData('icon', e.target.value)}
                                    className="w-full border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="e.g. LayoutDashboard"
                                />
                                {errors.icon && <p className="text-red-500 text-xs mt-1">{errors.icon}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
                                <input 
                                    type="text" 
                                    value={data.route} 
                                    onChange={e => setData('route', e.target.value)}
                                    className="w-full border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="e.g. admin.dashboard"
                                />
                                {errors.route && <p className="text-red-500 text-xs mt-1">{errors.route}</p>}
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                                    <input 
                                        type="number" 
                                        value={data.order} 
                                        onChange={e => setData('order', parseInt(e.target.value))}
                                        className="w-full border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                                <div className="flex-1 flex items-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={data.is_active} 
                                            onChange={e => setData('is_active', e.target.checked)}
                                            className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700 font-medium">Aktif</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
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
