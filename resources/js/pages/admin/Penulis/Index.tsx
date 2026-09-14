import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, router, Link } from '@inertiajs/react';
import { 
    Feather, Plus, Search, Edit2, Trash2, X, Check, 
    BookOpen, CheckCircle, AlertCircle, Upload, User, ArrowLeft
} from 'lucide-react';

interface AuthorItem {
    id: number;
    name: string;
    slug: string;
    photo: string | null;
    bio: string | null;
    is_verified: boolean;
    books_count?: number;
    created_at?: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    authors: {
        data: AuthorItem[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: PaginationLinks[];
    };
    filters: {
        search: string;
    };
    stats: {
        total_authors: number;
        verified_authors: number;
        total_books: number;
    };
    auth?: any;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function PenulisIndex({ authors, filters, stats, auth, flash }: PageProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState<AuthorItem | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState<AuthorItem | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        is_verified: false,
        photo: null as File | null,
    });
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.authors.index'), { search: searchTerm }, { preserveState: true });
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        router.get(route('admin.authors.index'), {}, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingAuthor(null);
        setFormData({
            name: '',
            bio: '',
            is_verified: false,
            photo: null,
        });
        setPreviewPhoto(null);
        setFormErrors({});
        setIsModalOpen(true);
    };

    const openEditModal = (author: AuthorItem) => {
        setEditingAuthor(author);
        setFormData({
            name: author.name,
            bio: author.bio || '',
            is_verified: author.is_verified,
            photo: null,
        });
        setPreviewPhoto(author.photo || null);
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, photo: file }));
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewPhoto(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormErrors({});

        const data = new FormData();
        data.append('name', formData.name);
        data.append('bio', formData.bio || '');
        data.append('is_verified', formData.is_verified ? '1' : '0');
        if (formData.photo) {
            data.append('photo', formData.photo);
        }

        if (editingAuthor) {
            data.append('_method', 'PUT');
            router.post(route('admin.authors.update', editingAuthor.id), data, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    setFormErrors(errors);
                    setIsSubmitting(false);
                },
            });
        } else {
            router.post(route('admin.authors.store'), data, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    setFormErrors(errors);
                    setIsSubmitting(false);
                },
            });
        }
    };

    const confirmDelete = (author: AuthorItem) => {
        setAuthorToDelete(author);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (!authorToDelete) return;
        router.delete(route('admin.authors.destroy', authorToDelete.id), {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setAuthorToDelete(null);
            },
        });
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Manajemen Penulis - Talaqee" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Penulis" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                <span className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                                    <Feather size={28} />
                                </span>
                                Manajemen Penulis
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Kelola daftar penulis buku dan konten kajian Talaqee.
                            </p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition"
                        >
                            <Plus size={18} />
                            Tambah Penulis
                        </button>
                    </div>

                    {/* Flash Message */}
                    {flash?.success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                            <CheckCircle size={18} />
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                            <AlertCircle size={18} />
                            {flash.error}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Penulis</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total_authors}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <Feather size={24} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Penulis Terverifikasi</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.verified_authors}</h3>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <CheckCircle size={24} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Buku Terhubung</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total_books}</h3>
                            </div>
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <BookOpen size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Filter & Table Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari nama penulis atau bio..."
                                    className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </form>
                            <span className="text-xs text-gray-500">
                                Menampilkan {authors.from || 0} - {authors.to || 0} dari {authors.total} penulis
                            </span>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="py-3.5 px-6">Penulis</th>
                                        <th className="py-3.5 px-6">Bio</th>
                                        <th className="py-3.5 px-6 text-center">Buku</th>
                                        <th className="py-3.5 px-6 text-center">Status</th>
                                        <th className="py-3.5 px-6 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {authors.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-gray-400">
                                                <User className="mx-auto mb-2 opacity-40" size={36} />
                                                <p className="text-base font-medium text-gray-600">Belum ada data penulis</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Silakan klik "Tambah Penulis" untuk menambahkan data baru.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        authors.data.map((author) => (
                                            <tr key={author.id} className="hover:bg-gray-50/50 transition">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                                                            {author.photo ? (
                                                                <img src={author.photo} alt={author.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-sm font-bold text-gray-500 uppercase">
                                                                    {author.name.charAt(0)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 flex items-center gap-1.5">
                                                                {author.name}
                                                                {author.is_verified && (
                                                                    <CheckCircle size={15} className="text-blue-500 inline fill-blue-50" />
                                                                )}
                                                            </h4>
                                                            <p className="text-xs text-gray-400 font-mono">@{author.slug}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                                                    {author.bio || <span className="text-gray-300 italic">Tidak ada bio</span>}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                        {author.books_count ?? 0} Buku
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    {author.is_verified ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            Terverifikasi
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                            Standar
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditModal(author)}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                            title="Edit Penulis"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDelete(author)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                            title="Hapus Penulis"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {authors.links && authors.links.length > 3 && (
                            <div className="p-4 border-t border-gray-100 flex justify-center gap-1">
                                {authors.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'text-gray-600 hover:bg-gray-100'
                                                : 'text-gray-300 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal Tambah/Edit Penulis */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingAuthor ? 'Edit Data Penulis' : 'Tambah Penulis Baru'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Photo Upload & Preview */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto Profil Penulis
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
                                        {previewPhoto ? (
                                            <img src={previewPhoto} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={28} className="text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition">
                                            <Upload size={14} />
                                            Pilih Foto
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="text-[11px] text-gray-400 mt-1">Format: JPG, PNG, WEBP (Max 2MB)</p>
                                    </div>
                                </div>
                                {formErrors.photo && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.photo}</p>
                                )}
                            </div>

                            {/* Nama Penulis */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Penulis <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Contoh: Ustadz Dr. Firanda Andirja"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    required
                                />
                                {formErrors.name && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                                )}
                            </div>

                            {/* Bio Penulis */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Biografi Singkat
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.bio}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                    placeholder="Deskripsi singkat mengenai latar belakang atau karya penulis..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                />
                                {formErrors.bio && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.bio}</p>
                                )}
                            </div>

                            {/* Status Terverifikasi */}
                            <div className="flex items-center gap-3 pt-1">
                                <input
                                    type="checkbox"
                                    id="is_verified"
                                    checked={formData.is_verified}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_verified: e.target.checked }))}
                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor="is_verified" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                                    Tandai sebagai Penulis Terverifikasi
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Menyimpan...' : (editingAuthor ? 'Perbarui Penulis' : 'Simpan Penulis')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                            <AlertCircle size={24} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-gray-900">Hapus Penulis?</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Apakah Anda yakin ingin menghapus penulis <span className="font-semibold text-gray-800">"{authorToDelete?.name}"</span>? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>
                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
