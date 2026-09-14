import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, ArrowLeft, Upload, Globe, UserCircle, Plus, Trash2, ChevronDown, ChevronUp, File, X, CheckCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Author {
    id: number;
    name: string;
}

interface PageProps {
    [key: string]: unknown;
    book: any;
    categories: Category[];
    authors: Author[];
    errors: Record<string, string>;
    auth?: {
        user?: {
            name?: string;
            email?: string;
        }
    };
}

export default function BukuEdit() {
    const { book, categories, authors, errors, auth } = usePage<PageProps>().props;

    const [authorList, setAuthorList] = useState<Author[]>(authors || []);
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
    const [newAuthorName, setNewAuthorName] = useState('');
    const [newAuthorBio, setNewAuthorBio] = useState('');
    const [authorSubmitting, setAuthorSubmitting] = useState(false);
    const [authorModalError, setAuthorModalError] = useState('');
    const [authorSuccessMsg, setAuthorSuccessMsg] = useState('');

    const [values, setValues] = useState({
        title: book.title || '',
        category_id: book.category_id || '',
        author_id: book.author_id || '',
        description: book.description || '',
        coin_per_chapter: book.coin_per_chapter || '10',
        is_free: !!book.is_free,
        is_featured: !!book.is_featured,
        is_popular: !!book.is_popular,
        is_active: !!book.is_active,
        cover: null as File | null,
    });

    const [chapters, setChapters] = useState<any[]>(book.chapters && book.chapters.length > 0 ? 
        book.chapters.map((c: any) => ({ 
            id: c.id, 
            title: c.title, 
            content: c.content || '', 
            coin_price: c.coin_price ?? '', 
            doc_file: null as File | null,
            isExpanded: false 
        })) : 
        []
    );

    const handleAddChapter = () => {
        setChapters([...chapters, { id: null, title: '', content: '', coin_price: '', doc_file: null, isExpanded: true }]);
    };

    const handleQuickAddAuthor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAuthorName.trim()) {
            setAuthorModalError('Nama penulis wajib diisi');
            return;
        }

        setAuthorSubmitting(true);
        setAuthorModalError('');

        try {
            const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content
                || (document.cookie.match(/(^|;\s*)XSRF-TOKEN=([^;]+)/)?.[2] ? decodeURIComponent(document.cookie.match(/(^|;\s*)XSRF-TOKEN=([^;]+)/)![2]) : '');

            const response = await fetch(route('admin.authors.quick-store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                body: JSON.stringify({
                    name: newAuthorName,
                    bio: newAuthorBio,
                }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                const created = data.author;
                setAuthorList(prev => [...prev, { id: created.id, name: created.name }]);
                setValues(prev => ({ ...prev, author_id: String(created.id) }));
                setIsAuthorModalOpen(false);
                setNewAuthorName('');
                setNewAuthorBio('');
                setAuthorSuccessMsg(`Penulis "${created.name}" berhasil ditambahkan dan dipilih!`);
                setTimeout(() => setAuthorSuccessMsg(''), 4000);
            } else {
                setAuthorModalError(data.message || data.errors?.name?.[0] || 'Gagal menambahkan penulis');
            }
        } catch (err: any) {
            setAuthorModalError('Terjadi kesalahan saat menyimpan penulis.');
        } finally {
            setAuthorSubmitting(false);
        }
    };

    const handleRemoveChapter = (index: number) => {
        const newChapters = chapters.filter((_: any, i: number) => i !== index);
        setChapters(newChapters);
    };

    const handleChapterChange = (index: number, field: string, value: any) => {
        const newChapters = [...chapters];
        newChapters[index] = { ...newChapters[index], [field]: value };
        setChapters(newChapters);
    };

    const handleChapterFileChange = (index: number, file: File | null) => {
        if (!file) {
            const newChapters = [...chapters];
            newChapters[index] = { ...newChapters[index], doc_file: null };
            setChapters(newChapters);
            return;
        }

        // Jika file .txt, baca langsung teksnya ke content
        if (file.name.endsWith('.txt') || file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const newChapters = [...chapters];
                newChapters[index] = { 
                    ...newChapters[index], 
                    doc_file: file,
                    content: text || newChapters[index].content 
                };
                setChapters(newChapters);
            };
            reader.readAsText(file);
        } else {
            const newChapters = [...chapters];
            newChapters[index] = { ...newChapters[index], doc_file: file };
            setChapters(newChapters);
        }
    };

    const toggleChapterExpand = (index: number) => {
        const newChapters = [...chapters];
        newChapters[index] = { ...newChapters[index], isExpanded: !newChapters[index].isExpanded };
        setChapters(newChapters);
    };

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

        // Append chapters as a JSON string and individual chapter Word/Text files
        const cleanChapters = chapters
            .map((c: any, index: number) => {
                if (c.doc_file) {
                    formData.append(`chapter_doc_${index}`, c.doc_file);
                }
                return {
                    id: c.id,
                    title: c.title,
                    content: c.content,
                    coin_price: c.coin_price,
                    has_doc: !!c.doc_file,
                };
            })
            .filter((c: any) => c.title || c.content || c.has_doc);

        formData.append('chapters', JSON.stringify(cleanChapters));

        formData.append('_method', 'put'); // For Laravel to process as PUT with multipart/form-data

        router.post(route('admin.books.update', book.id), formData, {
            forceFormData: true,
        });
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title={`Edit Buku - ${book.title}`} />

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
                                <h2 className="text-3xl font-bold text-gray-900">Edit Buku</h2>
                                <p className="text-gray-500 text-sm mt-1">Perbarui informasi buku di bawah ini.</p>
                            </div>
                        </div>
                    </header>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Buku *</label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        value={values.title} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        required
                                        placeholder="Masukkan judul buku"
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Koin per Bab</label>
                                    <input 
                                        type="number" 
                                        name="coin_per_chapter" 
                                        value={values.coin_per_chapter} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        min="0"
                                    />
                                    {errors.coin_per_chapter && <p className="text-red-500 text-xs mt-1">{errors.coin_per_chapter}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <select 
                                        name="category_id" 
                                        value={values.category_id} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-sm font-medium text-gray-700">Penulis</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAuthorModalError('');
                                                setIsAuthorModalOpen(true);
                                            }}
                                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
                                        >
                                            <Plus size={14} />
                                            Tambah Penulis Baru
                                        </button>
                                    </div>
                                    <select 
                                        name="author_id" 
                                        value={values.author_id} 
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                    >
                                        <option value="">Pilih Penulis</option>
                                        {authorList.map(author => (
                                            <option key={author.id} value={author.id}>{author.name}</option>
                                        ))}
                                    </select>
                                    {authorSuccessMsg && (
                                        <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1 font-medium">
                                            <CheckCircle size={13} /> {authorSuccessMsg}
                                        </p>
                                    )}
                                    {errors.author_id && <p className="text-red-500 text-xs mt-1">{errors.author_id}</p>}
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
                                    placeholder="Tuliskan deskripsi singkat buku"
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Buku</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl relative group">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label htmlFor="cover-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none hover:text-blue-500">
                                                <span>Upload file</span>
                                                <input id="cover-upload" name="cover" type="file" className="sr-only" onChange={handleChange} accept="image/*" />
                                            </label>
                                            <p className="pl-1">atau drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                                        {book.cover && !values.cover && (
                                            <div className="mt-2 text-sm text-gray-500">
                                                Cover saat ini: <img src={book.cover.startsWith('http') || book.cover.startsWith('/') ? book.cover : `/storage/${book.cover}`} alt="Cover" className="h-12 inline ml-2 rounded" />
                                            </div>
                                        )}
                                        {values.cover && <p className="text-sm font-semibold text-green-600 mt-2">File terpilih: {values.cover.name}</p>}
                                    </div>
                                </div>
                                {errors.cover && <p className="text-red-500 text-xs mt-1">{errors.cover}</p>}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <h3 className="text-sm font-bold text-gray-900 mb-2">Pengaturan Tambahan</h3>
                                
                                <div className="flex items-center">
                                    <input type="checkbox" id="is_free" name="is_free" checked={values.is_free} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="is_free" className="ml-2 text-sm font-medium text-gray-700">Gratis (Buku ini gratis untuk dibaca)</label>
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" id="is_featured" name="is_featured" checked={values.is_featured} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="is_featured" className="ml-2 text-sm font-medium text-gray-700">Featured (Tampilkan di unggulan)</label>
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" id="is_popular" name="is_popular" checked={values.is_popular} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="is_popular" className="ml-2 text-sm font-medium text-gray-700">Populer</label>
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" id="is_active" name="is_active" checked={values.is_active} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">Aktif (Tersedia untuk pembaca)</label>
                                </div>
                            </div>

                            {/* Tambahan Bab Massal (Dynamic Form Builder) */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-8 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <BookOpen size={20} className="text-blue-600" />
                                            Daftar Bab
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">Kelola bab buku di sini.</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleAddChapter}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium rounded-lg transition-colors"
                                    >
                                        <Plus size={18} />
                                        Tambah Bab
                                    </button>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    {chapters.length === 0 && (
                                        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                                            Belum ada bab yang ditambahkan. Klik "Tambah Bab" untuk mulai mengisi.
                                        </div>
                                    )}
                                    {chapters.map((chapter: any, index: number) => (
                                        <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all">
                                            {/* Accordion Header */}
                                            <div 
                                                className="flex items-center justify-between p-4 bg-gray-50/80 cursor-pointer hover:bg-gray-100/80 transition-colors"
                                                onClick={() => toggleChapterExpand(index)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                                                        {index + 1}
                                                    </span>
                                                    <h4 className="font-semibold text-gray-900">
                                                        {chapter.title || `Bab ${index + 1}`}
                                                    </h4>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveChapter(index); }}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hapus Bab"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <div className="p-1.5 text-gray-400">
                                                        {chapter.isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Accordion Body */}
                                            {chapter.isExpanded && (
                                                <div className="p-5 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Bab</label>
                                                            <input 
                                                                type="text" 
                                                                value={chapter.title} 
                                                                onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                                                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                                placeholder={`Contoh: Bab ${index + 1}: Pendahuluan`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Koin (Kosongkan jika mengikuti buku)</label>
                                                            <input 
                                                                type="number" 
                                                                value={chapter.coin_price} 
                                                                onChange={(e) => handleChapterChange(index, 'coin_price', e.target.value)}
                                                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                                placeholder="Contoh: 10 atau 0 (gratis)"
                                                                min="0"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Upload Dokumen Word / Teks */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Import Dokumen Word (.docx) atau Teks (.txt) <span className="text-gray-400 font-normal">(Opsional)</span>
                                                            </label>
                                                            <span className="text-xs text-blue-600 font-medium">Teks diekstrak otomatis</span>
                                                        </div>
                                                        {chapter.doc_file ? (
                                                            <div className="flex items-center justify-between p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                                                        <FileText size={18} />
                                                                    </div>
                                                                    <div className="truncate">
                                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                                            {chapter.doc_file.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {(chapter.doc_file.size / 1024).toFixed(1)} KB • Dokumen baru siap diproses
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleChapterFileChange(index, null)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                                                                    title="Hapus file baru"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-blue-50/30 transition-all group">
                                                                <div className="flex items-center gap-2 text-gray-500 group-hover:text-blue-600">
                                                                    <Upload size={16} />
                                                                    <span className="text-xs font-medium">Pilih file Word (.docx) atau Teks (.txt) baru</span>
                                                                </div>
                                                                <p className="text-[11px] text-gray-400 mt-0.5">Isi naskah akan diekstrak langsung ke teks bab</p>
                                                                <input
                                                                    type="file"
                                                                    accept=".docx,.txt,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                                                                    className="hidden"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0] || null;
                                                                        handleChapterFileChange(index, file);
                                                                    }}
                                                                />
                                                            </label>
                                                        )}
                                                    </div>

                                                    {/* Isi Teks Bab */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Isi Teks Bab Buku *
                                                            </label>
                                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                                <span>{chapter.content ? chapter.content.trim().split(/\s+/).filter(Boolean).length : 0} kata</span>
                                                            </div>
                                                        </div>
                                                        <textarea 
                                                            value={chapter.content} 
                                                            onChange={(e) => handleChapterChange(index, 'content', e.target.value)}
                                                            rows={6}
                                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y font-serif text-sm leading-relaxed"
                                                            placeholder="Ketik atau tempelkan (paste) isi naskah bab buku di sini. Teks akan tampil rapi saat dibaca..."
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link href={route('admin.books.index')} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">
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

            {/* Quick Modal Tambah Penulis */}
            {isAuthorModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Tambah Penulis Baru</h3>
                            <button
                                type="button"
                                onClick={() => setIsAuthorModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleQuickAddAuthor} className="p-6 space-y-4">
                            {authorModalError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                                    {authorModalError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Penulis <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newAuthorName}
                                    onChange={(e) => setNewAuthorName(e.target.value)}
                                    placeholder="Contoh: Ustadz Dr. Firanda Andirja"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Biografi Singkat (Opsional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={newAuthorBio}
                                    onChange={(e) => setNewAuthorBio(e.target.value)}
                                    placeholder="Deskripsi singkat mengenai penulis..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAuthorModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={authorSubmitting}
                                    className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition disabled:opacity-50"
                                >
                                    {authorSubmitting ? 'Menyimpan...' : 'Simpan & Pilih'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
