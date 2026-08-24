import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, Users, 
    CreditCard, Box, Settings, ChevronDown, 
    Bell, Calendar, Shield, UploadCloud, Check, ChevronRight,
    Lock, History, DownloadCloud, RotateCcw, User
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface PageProps {
    [key: string]: unknown;
    auth: {
        user: {
            name: string;
            email: string;
        }
    };
}

export default function PengaturanIndex() {
    const { auth } = usePage<PageProps>().props;
    
    // Toggle states for UI
    const [diskonOtomatis, setDiskonOtomatis] = useState(true);
    const [stokMinimum, setStokMinimum] = useState(true);
    const [modePemeliharaan, setModePemeliharaan] = useState(false);

    

    

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Pengaturan - BookStore" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Pengaturan" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Pengaturan</h2>
                            <p className="text-gray-500 text-sm mt-1">Kelola pengaturan aplikasi dan akun Anda</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 flex items-center gap-2 shadow-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                01 Mei 2024 - 31 Mei 2024
                                <ChevronDown size={16} className="text-gray-400 ml-2" />
                            </div>
                            <button className="bg-white border border-gray-200 p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 relative shadow-sm">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                        </div>
                    </div>

                    {/* Top Navigation Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-2 flex overflow-x-auto">
                        <div className="flex items-center gap-2 py-3 px-4 border-b-2 border-[#6366f1] text-[#6366f1] cursor-pointer shrink-0">
                            <User size={18} />
                            <span className="font-medium text-sm">Profil Toko</span>
                        </div>
                        <div className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <Settings size={18} />
                            <span className="font-medium text-sm">Umum</span>
                        </div>
                        <div className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <CreditCard size={18} />
                            <span className="font-medium text-sm">Pembayaran</span>
                        </div>
                        <div className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <Box size={18} />
                            <span className="font-medium text-sm">Pengiriman</span>
                        </div>
                        <div className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <Bell size={18} />
                            <span className="font-medium text-sm">Notifikasi</span>
                        </div>
                        <div className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <Shield size={18} />
                            <span className="font-medium text-sm">Keamanan</span>
                        </div>
                        <div className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <DownloadCloud size={18} />
                            <span className="font-medium text-sm">Backup & Restore</span>
                        </div>
                        <Link href={route('admin.users.index')} className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <Users size={18} />
                            <span className="font-medium text-sm">Pengguna</span>
                        </Link>
                    </div>

                    {/* Main Settings Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Kolom 1: Informasi Toko */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-6">Informasi Toko</h3>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Logo Toko</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-[#6366f1] rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-[#4f46e5]">
                                            <BookOpen size={36} className="text-white" />
                                        </div>
                                        <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center py-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-center">
                                            <UploadCloud size={20} className="text-gray-400 mb-1" />
                                            <p className="text-xs text-gray-600 font-medium">Klik atau seret file ke sini</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG maksimal 2MB</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2">Rekomendasi ukuran 512x512px</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Nama Toko</label>
                                    <input type="text" defaultValue="BookStore" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:ring-[#6366f1] focus:border-[#6366f1]" />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Nama Pemilik</label>
                                    <input type="text" defaultValue="Super Admin" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:ring-[#6366f1] focus:border-[#6366f1]" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Toko</label>
                                        <input type="email" defaultValue="info@bookstore.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:ring-[#6366f1] focus:border-[#6366f1]" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">No. Telepon</label>
                                        <input type="text" defaultValue="0812-3456-7890" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:ring-[#6366f1] focus:border-[#6366f1]" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Alamat Toko</label>
                                    <textarea rows={3} defaultValue="Jl. Merdeka No. 123, Jakarta Pusat,&#10;DKI Jakarta, Indonesia - 10110" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:ring-[#6366f1] focus:border-[#6366f1] resize-none"></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Deskripsi Toko</label>
                                    <textarea rows={2} defaultValue="Toko buku online terpercaya dengan koleksi lengkap dan harga terbaik." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:ring-[#6366f1] focus:border-[#6366f1] resize-none"></textarea>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2 px-5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>

                        {/* Kolom 2: Pengaturan Umum */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-6">Pengaturan Umum</h3>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Mata Uang</label>
                                    <div className="relative">
                                        <select className="w-full px-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 appearance-none bg-white focus:ring-[#6366f1] focus:border-[#6366f1]">
                                            <option>Rupiah (Rp)</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Bahasa</label>
                                    <div className="relative">
                                        <select className="w-full px-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 appearance-none bg-white focus:ring-[#6366f1] focus:border-[#6366f1]">
                                            <option>Indonesia</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Zona Waktu</label>
                                    <div className="relative">
                                        <select className="w-full px-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 appearance-none bg-white focus:ring-[#6366f1] focus:border-[#6366f1]">
                                            <option>Asia/Jakarta (WIB)</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Format Tanggal</label>
                                    <div className="relative">
                                        <select className="w-full px-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 appearance-none bg-white focus:ring-[#6366f1] focus:border-[#6366f1]">
                                            <option>DD MMM YYYY (31 Mei 2024)</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Jumlah Item per Halaman</label>
                                    <div className="relative">
                                        <select className="w-full px-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 appearance-none bg-white focus:ring-[#6366f1] focus:border-[#6366f1]">
                                            <option>10</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setDiskonOtomatis(!diskonOtomatis)}>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Aktifkan Diskon Otomatis</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Sistem akan menghitung diskon secara otomatis</p>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full transition-colors relative ${diskonOtomatis ? 'bg-[#6366f1]' : 'bg-gray-200'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${diskonOtomatis ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setStokMinimum(!stokMinimum)}>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Aktifkan Stok Minimum</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Beritahu jika stok berada di bawah minimum</p>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full transition-colors relative ${stokMinimum ? 'bg-[#6366f1]' : 'bg-gray-200'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${stokMinimum ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => setModePemeliharaan(!modePemeliharaan)}>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Mode Pemeliharaan</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Toko tidak dapat diakses oleh pelanggan</p>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full transition-colors relative ${modePemeliharaan ? 'bg-[#6366f1]' : 'bg-gray-200'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${modePemeliharaan ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2 px-5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>

                        {/* Kolom 3: Pengaturan Notifikasi */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                            <h3 className="font-bold text-gray-900 mb-6">Pengaturan Notifikasi</h3>
                            
                            <div className="space-y-6 flex-1">
                                {/* Checkbox Items */}
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded bg-[#6366f1] flex items-center justify-center shrink-0 mt-0.5 cursor-pointer">
                                        <Check size={14} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Notifikasi Penjualan Baru</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">Dapatkan notifikasi saat ada penjualan baru</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded bg-[#6366f1] flex items-center justify-center shrink-0 mt-0.5 cursor-pointer">
                                        <Check size={14} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Notifikasi Stok Menipis</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">Dapatkan notifikasi ketika stok hampir habis</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded bg-[#6366f1] flex items-center justify-center shrink-0 mt-0.5 cursor-pointer">
                                        <Check size={14} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Notifikasi Pembayaran</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">Dapatkan notifikasi untuk pembayaran masuk</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded bg-[#6366f1] flex items-center justify-center shrink-0 mt-0.5 cursor-pointer">
                                        <Check size={14} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Notifikasi Promosi</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">Dapatkan info promo dan update terbaru</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded bg-[#6366f1] flex items-center justify-center shrink-0 mt-0.5 cursor-pointer">
                                        <Check size={14} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Notifikasi Sistem</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">Notifikasi penting dari sistem</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="mb-4">
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Notifikasi</label>
                                        <input type="email" defaultValue="admin@bookstore.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:ring-[#6366f1] focus:border-[#6366f1]" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1.5">No. WhatsApp (Opsional)</label>
                                        <input type="text" defaultValue="0812-3456-7890" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:ring-[#6366f1] focus:border-[#6366f1]" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-start">
                                <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2 px-5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Row: Keamanan & Backup */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        
                        {/* Keamanan Akun */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-6">Keamanan Akun</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                                            <Lock size={20} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Password</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Ubah password akun Anda secara berkala</p>
                                        </div>
                                    </div>
                                    <button className="text-indigo-600 border border-indigo-200 bg-white hover:bg-indigo-50 py-1.5 px-4 rounded-lg text-xs font-medium transition-colors">
                                        Ubah Password
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                                            <Shield size={20} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Autentikasi 2 Faktor</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Tambahkan lapisan keamanan untuk akun Anda</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-md text-xs font-medium">Aktif</span>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                                            <History size={20} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Aktivitas Login</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Lihat riwayat aktivitas login akun Anda</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Backup & Restore */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-6">Backup & Restore</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                                            <DownloadCloud size={20} className="text-indigo-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Backup Otomatis</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Backup data secara otomatis setiap hari</p>
                                        </div>
                                    </div>
                                    <span className="text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-md text-xs font-medium">Aktif</span>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                                            <DownloadCloud size={20} className="text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Backup Manual</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Download backup data saat ini</p>
                                        </div>
                                    </div>
                                    <button className="text-indigo-600 border border-indigo-200 bg-white hover:bg-indigo-50 py-1.5 px-4 rounded-lg text-xs font-medium transition-colors">
                                        Backup Sekarang
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                                            <RotateCcw size={20} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Restore Data</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Pulihkan data dari file backup</p>
                                        </div>
                                    </div>
                                    <button className="text-indigo-600 border border-indigo-200 bg-white hover:bg-indigo-50 py-1.5 px-4 rounded-lg text-xs font-medium transition-colors">
                                        Restore
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </main>
        </div>
    );
}
