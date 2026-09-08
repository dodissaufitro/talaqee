import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, ArrowLeft, Upload, Globe, UserCircle, CheckCircle, X
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Book {
    id: number;
    title: string;
}

interface Chapter {
    id: number;
    chapter_number: number;
    title: string;
    description: string | null;
    content: string | null;
    pdf_file?: string | null;
    page_count: number;
    coin_price: number;
    is_free: boolean;
    is_active: boolean;
}

interface PageProps {
    [key: string]: unknown;
    book: Book;
    chapter: Chapter;
    errors: Record<string, string>;
    auth?: {
        user?: {
            name?: string;
            email?: string;
        }
    };
}

export default function ChapterEdit() {
    const { book, chapter, errors, auth } = usePage<PageProps>().props;

    const [values, setValues] = useState({
        chapter_number: chapter.chapter_number,
        title: chapter.title,
        description: chapter.description || '',
        content: chapter.content || '',
        pdf_file: null as File | null,
        page_count: chapter.page_count,
        coin_price: chapter.coin_price,
        is_free: chapter.is_free,
        is_active: chapter.is_active,
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
        formData.append('_method', 'put');
        formData.append('chapter_number', (values.chapter_number || '1').toString());
        formData.append('title', values.title || '');
        formData.append('description', values.description || '');
        formData.append('content', values.content || '');
        formData.append('page_count', (values.page_count || 0).toString());
        formData.append('coin_price', (values.coin_price || 0).toString());
        formData.append('is_free', values.is_free ? '1' : '0');
        formData.append('is_active', values.is_active ? '1' : '0');

        if (values.pdf_file) {
            formData.append('pdf_file', values.pdf_file);
        }

        router.post(route('admin.books.chapters.update', [book.id, chapter.id]), formData);
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title={`Edit Bab - ${book.title}`} />

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
                                <h2 className="text-3xl font-bold text-gray-900">Edit Bab</h2>
                                <p className="text-gray-500 text-sm mt-1">Mengedit bab <span className="font-semibold">{chapter.title}</span> untuk buku: <span className="font-semibold">{book.title}</span></p>
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

                            {/* Upload PDF Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload File PDF Bab <span className="text-blue-600 font-normal">(Direkomendasikan)</span>
                                </label>
                                {values.pdf_file ? (
                                    <div className="flex items-center justify-between p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                                <FileText size={20} />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {(values.pdf_file as File).name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {((values.pdf_file as File).size / 1024 / 1024).toFixed(2)} MB • File baru siap diupdate
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setValues(prev => ({ ...prev, pdf_file: null }))}
                                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                                            title="Batal upload file baru"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : chapter.pdf_file ? (
                                    <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                                <FileText size={20} />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5 truncate">
                                                    <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                                                    PDF saat ini telah tersimpan
                                                </p>
                                                <a 
                                                    href={chapter.pdf_file} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="text-xs text-blue-600 hover:underline inline-block mt-0.5"
                                                >
                                                    Lihat file PDF bab ↗
                                                </a>
                                            </div>
                                        </div>
                                        <label className="cursor-pointer px-3.5 py-2 bg-white border border-gray-200 hover:border-blue-400 rounded-xl text-xs font-medium text-gray-700 hover:text-blue-600 transition-colors shrink-0">
                                            Ganti PDF
                                            <input
                                                type="file"
                                                name="pdf_file"
                                                accept="application/pdf,.pdf"
                                                className="hidden"
                                                onChange={handleChange}
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-blue-50/30 transition-all group">
                                        <div className="flex items-center gap-2 text-gray-500 group-hover:text-blue-600">
                                            <Upload size={20} />
                                            <span className="text-sm font-medium">Pilih file dokumen PDF bab</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Format .pdf (Maksimal 50MB)</p>
                                        <input
                                            type="file"
                                            name="pdf_file"
                                            accept="application/pdf,.pdf"
                                            className="hidden"
                                            onChange={handleChange}
                                        />
                                    </label>
                                )}
                                {errors.pdf_file && <p className="text-red-500 text-xs mt-1">{errors.pdf_file}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Konten Bab / Catatan Tambahan (Opsional)
                                </label>
                                <textarea 
                                    name="content" 
                                    value={values.content} 
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                                    placeholder="Tuliskan isi bab atau ringkasan jika tidak menggunakan PDF..."
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
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
