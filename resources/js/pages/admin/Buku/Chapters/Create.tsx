import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, ArrowLeft, Upload, Globe, UserCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Book {
    id: number;
    title: string;
}

interface PageProps {
    [key: string]: unknown;
    book: Book;
    errors: Record<string, string>;
}

export default function ChapterCreate() {
    const { book, errors } = usePage<PageProps>().props;

    const [values, setValues] = useState({
        chapter_number: '',
        title: '',
        description: '',
        content: '',
        page_count: 0,
        coin_price: 10,
        is_free: false,
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

        // Parse numbers
        const dataToSubmit = {
            ...values,
            chapter_number: parseInt(values.chapter_number.toString() || '1', 10),
            page_count: parseInt(values.page_count.toString() || '0', 10),
            coin_price: parseInt(values.coin_price.toString() || '0', 10),
        };

        router.post(route('admin.books.chapters.store', book.id), dataToSubmit);
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title={`Tambah Bab - ${book.title}`} />

            {/* Sidebar */}
            <AdminSidebar activeItem="Buku" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8">
                    {/* Header */}
                    <header className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Link href={route('admin.books.show', book.id)} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 transition">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Tambah Bab Baru</h2>
                                <p className="text-gray-500 text-sm mt-1">Menambahkan bab untuk buku: <span className="font-semibold">{book.title}</span></p>
                            </div>
                        </div>
                    </header>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Bab *</label>
                                    <input 
                                        type="number" 
                                        name="chapter_number" 
                                        value={values.chapter_number} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        required
                                        min="1"
                                        placeholder="Contoh: 1"
                                    />
                                    {errors.chapter_number && <p className="text-red-500 text-xs mt-1">{errors.chapter_number}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Bab *</label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        value={values.title} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        required
                                        placeholder="Contoh: Pendahuluan"
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Halaman</label>
                                    <input 
                                        type="number" 
                                        name="page_count" 
                                        value={values.page_count} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        min="0"
                                    />
                                    {errors.page_count && <p className="text-red-500 text-xs mt-1">{errors.page_count}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Koin)</label>
                                    <input 
                                        type="number" 
                                        name="coin_price" 
                                        value={values.coin_price} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        min="0"
                                    />
                                    {errors.coin_price && <p className="text-red-500 text-xs mt-1">{errors.coin_price}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat (Opsional)</label>
                                <textarea 
                                    name="description" 
                                    value={values.description} 
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                    placeholder="Tuliskan deskripsi singkat bab"
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Konten Bab</label>
                                <textarea 
                                    name="content" 
                                    value={values.content} 
                                    onChange={handleChange}
                                    rows={10}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                                    placeholder="Tuliskan seluruh isi bab di sini..."
                                ></textarea>
                                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <h3 className="text-sm font-bold text-gray-900 mb-2">Pengaturan Tambahan</h3>
                                
                                <div className="flex items-center">
                                    <input type="checkbox" id="is_free" name="is_free" checked={values.is_free} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="is_free" className="ml-2 text-sm font-medium text-gray-700">Gratis (Bab ini gratis untuk dibaca)</label>
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" id="is_active" name="is_active" checked={values.is_active} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">Aktif (Tersedia untuk pembaca)</label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link href={route('admin.books.show', book.id)} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">
                                    Batal
                                </Link>
                                <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-blue-600/20">
                                    Simpan Bab
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
