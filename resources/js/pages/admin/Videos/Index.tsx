import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, Bell, 
    Plus, Edit, Trash2, X, Check, Image as ImageIcon, Video as VideoIcon
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useUploadStore } from '@/stores/useUploadStore';

interface Video {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    video_url: string;
    duration: number;
    description: string | null;
    coin_reward: number;
    is_featured: boolean;
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
    videos: Video[];
    navItems: NavigationItem[];
    auth: {
        user: { name: string; email: string };
    };
    flash: { success?: string };
}

export default function VideosIndex() {
    const { videos, navItems, auth, flash } = usePage<PageProps>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, reset, processing, errors } = useForm({
        _method: 'POST',
        title: '',
        description: '',
        duration: 0,
        coin_reward: 0,
        is_featured: false as boolean,
        is_active: true as boolean,
        video_file: null as File | null,
        thumbnail: null as File | null,
    });
    
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const { startUpload } = useUploadStore();

    

    const openCreateModal = () => {
        reset();
        setData('_method', 'POST');
        setEditingId(null);
        setSelectedVideo(null);
        setEditingId(null);
        setSelectedVideo(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: Video) => {
        setData({
            _method: 'PUT',
            title: item.title || '',
            description: item.description || '',
            duration: item.duration,
            coin_reward: item.coin_reward,
            is_featured: item.is_featured,
            is_active: item.is_active,
            video_file: null,
            thumbnail: null,
        });
        setEditingId(item.id);
        setSelectedVideo(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let payload: any = { ...data };
        
        const url = editingId ? route('admin.videos.update', editingId) : route('admin.videos.store');
        
        if (selectedVideo) {
            startUpload(selectedVideo, payload, {
                chunkUrl: route('admin.videos.upload-chunk'),
                submitUrl: url
            });
            closeModal();
            return;
        }
        
        router.post(url, payload, {
            forceFormData: true,
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus video ini?')) {
            router.delete(route('admin.videos.destroy', id));
        }
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Manajemen Video Kajian - BookStore" />

            {/* Sidebar (Reused from Dashboard for consistency) */}
            <AdminSidebar activeItem="" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                    <header className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Manajemen Video Kajian</h2>
                            <p className="text-gray-500 text-sm mt-1">Atur dan upload video kajian</p>
                        </div>
                        <button 
                            onClick={openCreateModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <Plus size={18} />
                            Tambah Video
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
                                    <th className="px-6 py-4 font-medium">Thumbnail</th>
                                    <th className="px-6 py-4 font-medium">Judul</th>
                                    <th className="px-6 py-4 font-medium">Video</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {videos && videos.length > 0 ? videos.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden relative border border-gray-200">
                                                {item.thumbnail ? (
                                                    <img src={item.thumbnail.startsWith('http') || item.thumbnail.startsWith('/') ? item.thumbnail : `/storage/${item.thumbnail}`} alt="Thumbnail" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <ImageIcon size={24} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {item.title}
                                            <div className="text-xs text-gray-500 font-normal mt-1 flex gap-2">
                                                <span>Durasi: {item.duration}s</span>
                                                <span>•</span>
                                                <span>Koin: {item.coin_reward}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.video_url && (
                                                <a href={`/storage/${item.video_url}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                    <VideoIcon size={14} /> Lihat
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium w-max ${item.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                                {item.is_featured && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium w-max bg-yellow-50 text-yellow-600">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
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
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Belum ada video.
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
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-lg text-gray-900">
                                {editingId ? 'Edit Video' : 'Tambah Video'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">File Video Asli (MP4/MKV)</label>
                                <input 
                                    type="file" 
                                    onChange={e => {
                                        const file = e.target.files ? e.target.files[0] : null;
                                        setSelectedVideo(file);
                                        if (file) {
                                            const video = document.createElement('video');
                                            video.preload = 'metadata';
                                            video.onloadedmetadata = () => {
                                                window.URL.revokeObjectURL(video.src);
                                                setData('duration', Math.round(video.duration));
                                            };
                                            video.src = URL.createObjectURL(file);
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-xl p-1 bg-white cursor-pointer transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    accept="video/*"
                                    required={!editingId && !selectedVideo}
                                />
                                {errors.video_file && <p className="text-red-500 text-xs mt-1">{errors.video_file}</p>}
                                {editingId && <p className="text-xs text-gray-500 mt-1">Kosongkan jika tidak ingin mengubah video.</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">File Thumbnail (Opsional)</label>
                                <input 
                                    type="file" 
                                    onChange={e => setData('thumbnail', e.target.files ? e.target.files[0] : null)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-xl p-1 bg-white cursor-pointer transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    accept="image/*"
                                />
                                {errors.thumbnail && <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>}
                                {editingId && <p className="text-xs text-gray-500 mt-1">Kosongkan jika tidak ingin mengubah thumbnail.</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Video</label>
                                <input 
                                    type="text" 
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-2.5 transition-all shadow-sm"
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea 
                                    value={data.description} 
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3 transition-all shadow-sm h-28 resize-none"
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Detik)</label>
                                    <input 
                                        type="number" 
                                        value={data.duration} 
                                        onChange={e => setData('duration', parseInt(e.target.value))}
                                        className="w-full border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-2.5 transition-all shadow-sm"
                                    />
                                    {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reward Koin</label>
                                    <input 
                                        type="number" 
                                        value={data.coin_reward} 
                                        onChange={e => setData('coin_reward', parseInt(e.target.value))}
                                        className="w-full border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-2.5 transition-all shadow-sm"
                                    />
                                    {errors.coin_reward && <p className="text-red-500 text-xs mt-1">{errors.coin_reward}</p>}
                                </div>
                            </div>
                            
                            <div className="flex gap-6 mt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={data.is_active} 
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">Video Aktif</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={data.is_featured} 
                                        onChange={e => setData('is_featured', e.target.checked)}
                                        className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">Jadikan Featured</span>
                                </label>
                            </div>

                            <div className="pt-4 flex justify-end items-center border-t border-gray-100 gap-3">
                                <button type="button" onClick={closeModal} className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white border-2 border-gray-100 hover:bg-gray-50 rounded-xl transition-all">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-200 disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan Video'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
