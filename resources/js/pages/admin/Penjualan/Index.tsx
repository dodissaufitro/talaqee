import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, Bell, 
    TrendingUp, ChevronDown, Plus, Search, Filter, Eye, MoreVertical
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Payment {
    id: number;
    invoice_number: string;
    created_at: string;
    amount: number;
    payment_method: string;
    status: string;
    user: {
        name: string;
        email: string;
    };
}

interface PageProps {
    [key: string]: unknown;
    payments: {
        data: Payment[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: any[];
    };
    stats: {
        total_penjualan: number;
        total_terjual: number;
        total_pelanggan: number;
        avg_transaction: number;
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
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export default function PenjualanIndex() {
    const { payments, stats, auth } = usePage<PageProps>().props;

    

    

    const getPaymentIcon = (method: string) => {
        if (!method) return <CreditCard size={16} className="text-gray-500" />;
        const m = method.toLowerCase();
        if (m.includes('transfer') || m.includes('bank')) return <CreditCard size={16} className="text-blue-600" />;
        if (m.includes('qris')) return <Grid size={16} className="text-gray-800" />;
        if (m.includes('wallet') || m.includes('tunai')) return <CreditCard size={16} className="text-emerald-600" />;
        return <CreditCard size={16} className="text-gray-500" />;
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
            case 'selesai':
                return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">Selesai</span>;
            case 'pending':
                return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">Pending</span>;
            case 'failed':
            case 'dibatalkan':
            case 'cancelled':
            case 'expired':
                return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">Dibatalkan</span>;
            default:
                return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">{status}</span>;
        }
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Penjualan - BookStore" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Penjualan" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8">
                    {/* Header */}
                    <header className="flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Penjualan</h2>
                            <p className="text-gray-500 text-sm mt-1">Dashboard <span className="mx-1">&gt;</span> Penjualan</p>
                        </div>
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
                    </header>

                    {/* Stats Section */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Stats */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                        <ShoppingCart className="text-purple-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">Total Penjualan</p>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{formatRupiah(stats.total_penjualan)}</h3>
                                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                            <TrendingUp size={14} /> 12.5% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Book className="text-emerald-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">Total Terjual</p>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.total_terjual)} Buku</h3>
                                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                            <TrendingUp size={14} /> 8.3% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Users className="text-amber-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">Total Pelanggan</p>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.total_pelanggan)}</h3>
                                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                            <TrendingUp size={14} /> 15.7% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Action Stats */}
                        <div className="lg:w-80 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                            <button className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 mb-6">
                                <Plus size={18} /> Tambah Penjualan
                            </button>
                            <div className="flex items-start gap-4 border-t border-gray-100 pt-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <TrendingUp className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs font-medium mb-1">Rata-rata per Transaksi</p>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{formatRupiah(stats.avg_transaction)}</h3>
                                    <p className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={12} /> 5.2% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="relative flex-1 min-w-[250px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" placeholder="Cari transaksi, pelanggan, atau buku..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" />
                            </div>
                            <div className="w-48 relative">
                                <select className="w-full pl-4 pr-10 py-2.5 rounded-xl border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                    <option>Semua Status</option>
                                    <option>Selesai</option>
                                    <option>Pending</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                            <div className="w-48 relative">
                                <select className="w-full pl-4 pr-10 py-2.5 rounded-xl border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                    <option>Semua Metode</option>
                                    <option>Transfer Bank</option>
                                    <option>QRIS</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                            <div className="relative w-48">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <input type="text" placeholder="Pilih Tanggal" className="w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-200 text-sm text-gray-600" />
                            </div>
                            <button className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <Filter size={16} /> Filter
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto rounded-t-xl">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc]">
                                    <tr className="text-gray-500 border-b border-gray-100">
                                        <th className="py-4 px-6 font-medium">No. Transaksi</th>
                                        <th className="py-4 px-6 font-medium">Tanggal</th>
                                        <th className="py-4 px-6 font-medium">Pelanggan</th>
                                        <th className="py-4 px-6 font-medium">Total</th>
                                        <th className="py-4 px-6 font-medium">Metode Pembayaran</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                        <th className="py-4 px-6 font-medium text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.data.length > 0 ? payments.data.map((payment) => (
                                        <tr key={payment.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6 font-medium text-indigo-600">{payment.invoice_number}</td>
                                            <td className="py-4 px-6 text-gray-600">{formatDate(payment.created_at)}</td>
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="font-medium text-gray-900">{payment.user?.name || 'Unknown User'}</p>
                                                    <p className="text-xs text-gray-500">{payment.user?.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-medium text-gray-900">{formatRupiah(payment.amount)}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    {getPaymentIcon(payment.payment_method)}
                                                    <span className="text-gray-600">{payment.payment_method || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {getStatusBadge(payment.status)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-white shadow-sm transition-all">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-white shadow-sm transition-all">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-gray-500">Belum ada data transaksi</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-50">
                            <span className="text-sm text-gray-500">
                                Menampilkan {payments.from || 0} - {payments.to || 0} dari {payments.total} data
                            </span>
                            <div className="flex items-center gap-1">
                                {payments.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                                            link.active
                                            ? 'bg-blue-600 text-white font-medium shadow-sm'
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
