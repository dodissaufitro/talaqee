import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, Bell, 
    TrendingUp, ChevronDown, Plus, Search, Filter, Eye, Edit2, Trash2,
    UserPlus, ShoppingBag, Star
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface CustomerItem {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    city: string | null;
    status: string;
    created_at: string;
    payments_count: number;
    payments_sum_amount: number | null;
}

interface PageProps {
    [key: string]: unknown;
    customers: {
        data: CustomerItem[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: any[];
    };
    stats: {
        total_pelanggan: number;
        pelanggan_baru: number;
        pelanggan_aktif: number;
        pelanggan_loyal: number;
    };
    auth: {
        user: {
            name: string;
            email: string;
        }
    };
}

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const getAvatarColorClass = (name: string) => {
    // Determine color based on first letter to have consistent colors
    const initial = name.charAt(0).toUpperCase();
    const colors = [
        'bg-purple-100 text-purple-600',
        'bg-emerald-100 text-emerald-600',
        'bg-amber-100 text-amber-600',
        'bg-blue-100 text-blue-600',
        'bg-pink-100 text-pink-600',
        'bg-indigo-100 text-indigo-600',
        'bg-rose-100 text-rose-600',
        'bg-cyan-100 text-cyan-600',
    ];
    const index = initial.charCodeAt(0) % colors.length;
    return colors[index];
};

export default function PelangganIndex() {
    const { customers, stats, auth } = usePage<PageProps>().props;

    

    

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Pelanggan - BookStore" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Pelanggan" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8">
                    {/* Header */}
                    <header className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Pelanggan</h2>
                            <p className="text-gray-500 text-sm mt-1">Dashboard <span className="mx-1">&gt;</span> Pelanggan</p>
                        </div>
                        <div className="flex flex-col items-end gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 flex items-center gap-2 shadow-sm">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    01 Mei 2024 - 31 Mei 2024
                                </div>
                                <button className="bg-white border border-gray-200 p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 relative shadow-sm">
                                    <Bell size={20} />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                </button>
                            </div>
                            <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2.5 px-5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
                                <Plus size={16} /> Tambah Pelanggan
                            </button>
                        </div>
                    </header>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Pelanggan */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Users className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Pelanggan</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.total_pelanggan)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 12.5% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Pelanggan Baru */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                    <UserPlus className="text-emerald-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Pelanggan Baru</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.pelanggan_baru)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 8.7% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Pelanggan Aktif */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                    <ShoppingBag className="text-amber-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Pelanggan Aktif</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.pelanggan_aktif)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 9.3% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Pelanggan Loyal */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Star className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Pelanggan Loyal</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.pelanggan_loyal)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 15.2% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 justify-between">
                            <div className="relative w-[320px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" placeholder="Cari pelanggan (nama, email, telepon)..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" />
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-44 relative">
                                    <select className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                        <option>Semua Status</option>
                                        <option>Aktif</option>
                                        <option>Loyal</option>
                                        <option>Tidak Aktif</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                                <div className="w-44 relative">
                                    <select className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                        <option>Semua Kota</option>
                                        <option>Jakarta</option>
                                        <option>Bandung</option>
                                        <option>Surabaya</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Filter size={16} /> Filter
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center"></div> Reset
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto rounded-t-xl">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc]">
                                    <tr className="text-gray-500 border-b border-gray-100">
                                        <th className="py-4 px-6 font-medium w-16">No.</th>
                                        <th className="py-4 px-6 font-medium min-w-[250px]">Pelanggan</th>
                                        <th className="py-4 px-6 font-medium">Kontak</th>
                                        <th className="py-4 px-6 font-medium">Kota</th>
                                        <th className="py-4 px-6 font-medium text-center">Total Transaksi</th>
                                        <th className="py-4 px-6 font-medium">Total Belanja</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                        <th className="py-4 px-6 font-medium text-center w-36">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.data.length > 0 ? customers.data.map((customer, idx) => (
                                        <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6 text-gray-600">{customers.from + idx}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm shrink-0 ${getAvatarColorClass(customer.name)}`}>
                                                        {getInitials(customer.name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm leading-tight">{customer.name}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">Bergabung: {formatDate(customer.created_at)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="text-gray-900 font-medium text-sm leading-tight">{customer.phone || '-'}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{customer.email}</p>
                                            </td>
                                            <td className="py-4 px-6 text-gray-900 font-medium">
                                                {customer.city || '-'}
                                            </td>
                                            <td className="py-4 px-6 text-center font-medium text-gray-900">
                                                {customer.payments_count || 0}
                                            </td>
                                            <td className="py-4 px-6 font-medium text-gray-900">
                                                {formatRupiah(customer.payments_sum_amount || 0)}
                                            </td>
                                            <td className="py-4 px-6">
                                                {customer.status === 'Aktif' && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">Aktif</span>
                                                )}
                                                {customer.status === 'Loyal' && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">Loyal</span>
                                                )}
                                                {customer.status === 'Tidak Aktif' && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">Tidak Aktif</span>
                                                )}
                                                {(!customer.status || !['Aktif', 'Loyal', 'Tidak Aktif'].includes(customer.status)) && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">{customer.status || 'Aktif'}</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="p-2 rounded-lg border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center text-gray-500">Belum ada data pelanggan</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-50">
                            <span className="text-sm text-gray-500">
                                Menampilkan {customers.from || 0} - {customers.to || 0} dari {customers.total} data
                            </span>
                            <div className="flex items-center gap-1">
                                {customers.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                                            link.active
                                            ? 'bg-[#6366f1] text-white font-medium shadow-sm'
                                            : link.url
                                                ? 'text-gray-600 hover:bg-gray-100 border border-transparent'
                                                : 'text-gray-300 cursor-not-allowed'
                                        } ${link.label.includes('Previous') || link.label.includes('Next') ? 'w-auto px-2 border border-gray-200' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
