import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, Bell, 
    TrendingUp, ChevronDown, Plus, Search, Filter, Eye, MoreVertical,
    Banknote, Wallet, Landmark, QrCode, Calendar
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface TransactionItem {
    id: number;
    invoice_number: string;
    created_at: string;
    items_count: number;
    amount: number;
    payment_method: string;
    status: string;
    user: {
        name: string;
        phone: string | null;
    };
}

interface PageProps {
    [key: string]: unknown;
    transactions: {
        data: TransactionItem[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: any[];
    };
    stats: {
        total_transaksi: number;
        total_pendapatan: number;
        total_belanja: number;
        rata_rata: number;
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

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    return `${day}, ${time}`;
};

const getMethodIcon = (method: string) => {
    const m = method.toLowerCase();
    if (m.includes('bank') || m.includes('bca') || m.includes('mandiri')) {
        return (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Landmark size={16} className="text-blue-600" />
            </div>
        );
    }
    if (m.includes('qris')) {
        return (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                <QrCode size={16} className="text-gray-700" />
            </div>
        );
    }
    if (m.includes('wallet') || m.includes('ovo') || m.includes('dana')) {
        return (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <Wallet size={16} className="text-white" />
            </div>
        );
    }
    if (m.includes('tunai') || m.includes('cash')) {
        return (
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Banknote size={16} className="text-emerald-600" />
            </div>
        );
    }
    return (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <CreditCard size={16} className="text-gray-600" />
        </div>
    );
};

export default function TransaksiIndex() {
    const { transactions, stats, auth } = usePage<PageProps>().props;

    

    

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Transaksi - BookStore" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Transaksi" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8">
                    {/* Header */}
                    <header className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Transaksi</h2>
                            <p className="text-gray-500 text-sm mt-1">Dashboard <span className="mx-1">&gt;</span> Transaksi</p>
                        </div>
                        <div className="flex flex-col items-end gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 flex items-center gap-2 shadow-sm">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    01 Mei 2024 - 31 Mei 2024
                                </div>
                                <button className="bg-white border border-gray-200 p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 relative shadow-sm">
                                    <Bell size={20} />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                </button>
                            </div>
                            <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2.5 px-5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
                                <Plus size={16} /> Tambah Transaksi
                            </button>
                        </div>
                    </header>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Transaksi */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                    <ShoppingCart className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Transaksi</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.total_transaksi)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 12.5% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Total Pendapatan */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Banknote className="text-emerald-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Pendapatan</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{formatRupiah(stats.total_pendapatan)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 14.3% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Total Belanja */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Wallet className="text-amber-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Belanja</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{formatRupiah(stats.total_belanja)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 10.1% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Rata-rata Transaksi */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <TrendingUp className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Rata-rata Transaksi</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{formatRupiah(stats.rata_rata)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 5.2% <span className="text-gray-400 font-normal">dari periode lalu</span>
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
                                <input type="text" placeholder="Cari transaksi, pelanggan, atau no. invoice..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" />
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-40 relative">
                                    <select className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                        <option>Semua Status</option>
                                        <option>Selesai</option>
                                        <option>Pending</option>
                                        <option>Dibatalkan</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                                <div className="w-44 relative">
                                    <select className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                        <option>Semua Metode</option>
                                        <option>Transfer Bank BCA</option>
                                        <option>QRIS</option>
                                        <option>OVO</option>
                                        <option>Tunai</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                                <div className="w-44 relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    <input type="text" placeholder="Pilih Tanggal" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white" />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Filter size={16} /> Filter
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto rounded-t-xl">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc]">
                                    <tr className="text-gray-500 border-b border-gray-100">
                                        <th className="py-4 px-6 font-medium">No. Invoice</th>
                                        <th className="py-4 px-6 font-medium">Tanggal</th>
                                        <th className="py-4 px-6 font-medium">Pelanggan</th>
                                        <th className="py-4 px-6 font-medium text-center">Jumlah Item</th>
                                        <th className="py-4 px-6 font-medium">Total</th>
                                        <th className="py-4 px-6 font-medium">Metode Pembayaran</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                        <th className="py-4 px-6 font-medium text-center w-32">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.length > 0 ? transactions.data.map((transaction, idx) => (
                                        <tr key={transaction.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6 text-indigo-600 font-medium">{transaction.invoice_number}</td>
                                            <td className="py-4 px-6 text-gray-600">{formatDateTime(transaction.created_at)}</td>
                                            <td className="py-4 px-6">
                                                <p className="text-gray-900 font-medium text-sm">{transaction.user?.name || '-'}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{transaction.user?.phone || '-'}</p>
                                            </td>
                                            <td className="py-4 px-6 text-center text-gray-900 font-medium">
                                                {transaction.items_count} Buku
                                            </td>
                                            <td className="py-4 px-6 font-medium text-gray-900">
                                                {formatRupiah(transaction.amount)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    {getMethodIcon(transaction.payment_method || '')}
                                                    <span className="text-gray-700 text-sm">{transaction.payment_method || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {transaction.status === 'paid' && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">Selesai</span>
                                                )}
                                                {transaction.status === 'pending' && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-500 border border-orange-100">Pending</span>
                                                )}
                                                {transaction.status === 'cancelled' && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-100">Dibatalkan</span>
                                                )}
                                                {!['paid', 'pending', 'cancelled'].includes(transaction.status) && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">{transaction.status}</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center text-gray-500">Belum ada data transaksi</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-50">
                            <span className="text-sm text-gray-500">
                                Menampilkan {transactions.from || 0} - {transactions.to || 0} dari {transactions.total} data
                            </span>
                            <div className="flex items-center gap-1">
                                {transactions.links.map((link, idx) => (
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
