import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, ArrowLeft, Upload, Globe, UserCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface PageProps {
    [key: string]: unknown;
    errors: Record<string, string>;
}

export default function KategoriCreate() {
    const { errors } = usePage<PageProps>().props;

    const [values, setValues] = useState({
        name: '',
        description: '',
        icon: '',
        color: '',
        is_active: true,
    });

    

    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setValues(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                setValues(prev => ({ ...prev, [name]: files[0] }));
            }
        } else {
            setValues(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                // handle boolean values for formData
                if (typeof value === 'boolean') {
                    formData.append(key, value ? '1' : '0');
                } else {
                    formData.append(key, value as any);
                }
            }
        });

        router.post(route('admin.categories.store'), formData, {
            forceFormData: true,
        });
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Tambah Kategori - BookStore" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Kategori" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8">
                    {/* Header */}
                    <header className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Link href={route('admin.categories.index')} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 transition">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Tambah Kategori Baru</h2>
                                <p className="text-gray-500 text-sm mt-1">Lengkapi informasi di bawah untuk menambahkan kategori.</p>
                            </div>
                        </div>
                    </header>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori *</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={values.name} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        required
                                        placeholder="Masukkan nama kategori"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ikon (Lucide)</label>
                                    <input 
                                        type="text" 
                                        name="icon" 
                                        value={values.icon} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="Contoh: Book, Tag, Compass"
                                    />
                                    {errors.icon && <p className="text-red-500 text-xs mt-1">{errors.icon}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warna</label>
                                    <input 
                                        type="text" 
                                        name="color" 
                                        value={values.color} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                        placeholder="Contoh: blue, red, emerald"
                                    />
                                    {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea 
                                    name="description" 
                                    value={values.description} 
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                    placeholder="Tuliskan deskripsi singkat kategori"
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <h3 className="text-sm font-bold text-gray-900 mb-2">Pengaturan Tambahan</h3>
                                
                                <div className="flex items-center">
                                    <input type="checkbox" id="is_active" name="is_active" checked={values.is_active} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">Aktif (Tersedia untuk pembaca)</label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link href={route('admin.categories.index')} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">
                                    Batal
                                </Link>
                                <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-blue-600/20">
                                    Simpan Kategori
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
