import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    ShoppingCart, Bell, TrendingUp, ChevronDown, Plus, Search, Filter, 
    Eye, Banknote, Wallet, Landmark, QrCode, Calendar, RefreshCw, X, CheckCircle2,
    Clock, AlertCircle, User, CreditCard
} from 'lucide-react';

interface TransactionItem {
    id: number;
    invoice_number: string;
    created_at: string;
    paid_at?: string | null;
    items_count?: number;
    amount: number;
    payment_method: string;
    payment_reference?: string | null;
    status: string;
    notes?: string | null;
    user?: {
        id?: number;
        name: string;
        email?: string;
        phone: string | null;
    } | null;
    coin_package?: {
        id?: number;
        name: string;
        coin_amount: number;
        price: number;
    } | null;
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
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    stats: {
        total_transaksi: number;
        total_pendapatan: number;
        total_belanja: number;
        rata_rata: number;
    };
    filters?: {
        search?: string;
        status?: string;
        method?: string;
    };
    auth: {
        user: {
            name: string;
            email: string;
        }
    };
    flash?: {
        success?: string;
        error?: string;
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

const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    return `${day}, ${time}`;
};

const getMethodIcon = (method: string) => {
    const m = (method || '').toLowerCase();
    if (m.includes('bank') || m.includes('bca') || m.includes('mandiri') || m.includes('bni') || m.includes('bri') || m.includes('va')) {
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
    if (m.includes('wallet') || m.includes('ovo') || m.includes('dana') || m.includes('shopeepay') || m.includes('gopay')) {
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
        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
            <CreditCard size={16} className="text-indigo-600" />
        </div>
    );
};

export default function TransaksiIndex() {
    const { transactions, stats, filters = {}, auth, flash } = usePage<PageProps>().props;

    const [isSyncing, setIsSyncing] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'Semua Status');
    const [methodFilter, setMethodFilter] = useState(filters.method || 'Semua Metode');
    const [selectedTrx, setSelectedTrx] = useState<TransactionItem | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.transactions.index'),
            {
                search: search || undefined,
                status: statusFilter !== 'Semua Status' ? statusFilter : undefined,
                method: methodFilter !== 'Semua Metode' ? methodFilter : undefined,
            },
            { preserveState: true }
        );
    };

    const handleFilterChange = (newStatus?: string, newMethod?: string) => {
        const s = newStatus !== undefined ? newStatus : statusFilter;
        const m = newMethod !== undefined ? newMethod : methodFilter;
        if (newStatus !== undefined) setStatusFilter(newStatus);
        if (newMethod !== undefined) setMethodFilter(newMethod);

        router.get(
            route('admin.transactions.index'),
            {
                search: search || undefined,
                status: s !== 'Semua Status' ? s : undefined,
                method: m !== 'Semua Metode' ? m : undefined,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setStatusFilter('Semua Status');
        setMethodFilter('Semua Metode');
        router.get(route('admin.transactions.index'));
    };

    const handleSync = () => {
        setIsSyncing(true);
        router.post(
            route('admin.transactions.sync'),
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsSyncing(false),
            }
        );
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Transaksi - Talaqee Admin" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Transaksi" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8">
                    {/* Flash Message */}
                    {flash?.success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-emerald-600" />
                                <span className="text-sm font-medium">{flash.success}</span>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Transaksi</h2>
                            <p className="text-gray-500 text-sm mt-1">Dashboard <span className="mx-1">&gt;</span> Transaksi Pembayaran & iPaymu</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                                title="Sinkronkan data transaksi dari API iPaymu"
                            >
                                <RefreshCw size={16} className={`text-indigo-600 ${isSyncing ? 'animate-spin' : ''}`} />
                                {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan iPaymu'}
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
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Transaksi Berhasil</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{new Intl.NumberFormat('id-ID').format(stats.total_transaksi)}</h3>
                                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> Terverifikasi iPaymu
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
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatRupiah(stats.total_pendapatan)}</h3>
                                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> Status Sukses / Paid
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Nilai Transaksi */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Wallet className="text-amber-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Nilai Tagihan</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatRupiah(stats.total_belanja)}</h3>
                                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                        Semua status tercatat
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
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatRupiah(stats.rata_rata)}</h3>
                                    <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                                        Per transaksi sukses
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        {/* Filters */}
                        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4 mb-6 justify-between">
                            <div className="relative w-full sm:w-[320px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari invoice, pelanggan, atau iPaymu ID..." 
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400" 
                                />
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                                <div className="w-40 relative">
                                    <select 
                                        value={statusFilter}
                                        onChange={(e) => handleFilterChange(e.target.value, undefined)}
                                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="Semua Status">Semua Status</option>
                                        <option value="Selesai">Selesai (Paid)</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Dibatalkan">Dibatalkan</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>

                                <div className="w-44 relative">
                                    <select 
                                        value={methodFilter}
                                        onChange={(e) => handleFilterChange(undefined, e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="Semua Metode">Semua Metode</option>
                                        <option value="iPaymu">iPaymu</option>
                                        <option value="QRIS">QRIS</option>
                                        <option value="VA">Virtual Account</option>
                                        <option value="Simulasi">Simulasi</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>

                                <button 
                                    type="submit" 
                                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                                >
                                    <Filter size={16} /> Filter
                                </button>

                                {(search || statusFilter !== 'Semua Status' || methodFilter !== 'Semua Metode') && (
                                    <button 
                                        type="button" 
                                        onClick={handleReset}
                                        className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Table */}
                        <div className="overflow-x-auto rounded-t-xl">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc]">
                                    <tr className="text-gray-500 border-b border-gray-100">
                                        <th className="py-4 px-6 font-medium">No. Invoice & Ref</th>
                                        <th className="py-4 px-6 font-medium">Tanggal</th>
                                        <th className="py-4 px-6 font-medium">Pelanggan</th>
                                        <th className="py-4 px-6 font-medium">Item / Paket</th>
                                        <th className="py-4 px-6 font-medium">Total</th>
                                        <th className="py-4 px-6 font-medium">Metode Pembayaran</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                        <th className="py-4 px-6 font-medium text-center w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.length > 0 ? transactions.data.map((transaction) => (
                                        <tr key={transaction.id} className="border-b border-gray-50 hover:bg-indigo-50/20 transition-colors">
                                            <td className="py-4 px-6">
                                                <p className="text-indigo-600 font-semibold">{transaction.invoice_number}</p>
                                                {transaction.payment_reference && (
                                                    <p className="text-xs text-gray-400 font-mono mt-0.5">Trx ID: #{transaction.payment_reference}</p>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {formatDateTime(transaction.created_at)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="text-gray-900 font-medium text-sm">{transaction.user?.name || 'Pelanggan'}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{transaction.user?.email || transaction.user?.phone || '-'}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                {transaction.coin_package ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                                        <Wallet size={12} />
                                                        {transaction.coin_package.name} ({transaction.coin_package.coin_amount} Koin)
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-700 text-xs">
                                                        {transaction.notes || (transaction.items_count ? `${transaction.items_count} Item` : 'Top Up Koin')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-gray-900">
                                                {formatRupiah(transaction.amount)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2.5">
                                                    {getMethodIcon(transaction.payment_method || '')}
                                                    <div>
                                                        <p className="text-gray-800 text-sm font-medium">{transaction.payment_method || 'iPaymu'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {transaction.status === 'paid' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                                                        <CheckCircle2 size={12} />
                                                        Berhasil
                                                    </span>
                                                )}
                                                {transaction.status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                                                        <Clock size={12} />
                                                        Pending
                                                    </span>
                                                )}
                                                {transaction.status === 'cancelled' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                                                        <AlertCircle size={12} />
                                                        Dibatalkan
                                                    </span>
                                                )}
                                                {!['paid', 'pending', 'cancelled'].includes(transaction.status) && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                        {transaction.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <button 
                                                    onClick={() => setSelectedTrx(transaction)}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 shadow-sm transition-all"
                                                    title="Lihat Detail Transaksi"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <ShoppingCart size={32} className="text-gray-300" />
                                                    <p className="font-medium text-gray-600">Belum ada data transaksi yang sesuai</p>
                                                    <p className="text-xs text-gray-400">Klik "Sinkronkan iPaymu" di atas untuk mengambil data transaksi terbaru dari iPaymu.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 mt-2 border-t border-gray-50 gap-4">
                            <span className="text-sm text-gray-500">
                                Menampilkan {transactions.from || 0} - {transactions.to || 0} dari {transactions.total} data
                            </span>
                            <div className="flex items-center gap-1">
                                {transactions.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded-lg text-sm transition-colors ${
                                            link.active
                                            ? 'bg-indigo-600 text-white font-medium shadow-sm'
                                            : link.url
                                                ? 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                                                : 'text-gray-300 cursor-not-allowed pointer-events-none'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Transaction Detail Modal */}
            {selectedTrx && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Detail Transaksi</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{selectedTrx.invoice_number}</p>
                            </div>
                            <button
                                onClick={() => setSelectedTrx(null)}
                                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Tagihan</span>
                                    <p className="text-2xl font-bold text-gray-900 mt-0.5">{formatRupiah(selectedTrx.amount)}</p>
                                </div>
                                <div>
                                    {selectedTrx.status === 'paid' && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                            <CheckCircle2 size={14} /> Berhasil (Paid)
                                        </span>
                                    )}
                                    {selectedTrx.status === 'pending' && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                                            <Clock size={14} /> Pending
                                        </span>
                                    )}
                                    {selectedTrx.status === 'cancelled' && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                            <AlertCircle size={14} /> Dibatalkan
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-xs text-gray-400 font-medium">Pelanggan</span>
                                    <p className="font-semibold text-gray-800 mt-0.5">{selectedTrx.user?.name || '-'}</p>
                                    <p className="text-xs text-gray-500">{selectedTrx.user?.email || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 font-medium">Metode Pembayaran</span>
                                    <p className="font-semibold text-gray-800 mt-0.5">{selectedTrx.payment_method || 'iPaymu'}</p>
                                    {selectedTrx.payment_reference && (
                                        <p className="text-xs text-indigo-600 font-mono">iPaymu Trx #{selectedTrx.payment_reference}</p>
                                    )}
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 font-medium">Waktu Transaksi</span>
                                    <p className="font-semibold text-gray-800 mt-0.5">{formatDateTime(selectedTrx.created_at)}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 font-medium">Waktu Pembayaran</span>
                                    <p className="font-semibold text-gray-800 mt-0.5">{formatDateTime(selectedTrx.paid_at)}</p>
                                </div>
                            </div>

                            {selectedTrx.coin_package && (
                                <div className="border border-purple-100 bg-purple-50/50 p-3.5 rounded-xl">
                                    <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Rincian Paket Koin</span>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-sm font-medium text-gray-800">{selectedTrx.coin_package.name}</span>
                                        <span className="text-sm font-bold text-purple-700">+{selectedTrx.coin_package.coin_amount} Koin</span>
                                    </div>
                                </div>
                            )}

                            {selectedTrx.notes && (
                                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                                    <span className="font-semibold text-gray-600">Catatan:</span> {selectedTrx.notes}
                                </div>
                            )}
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setSelectedTrx(null)}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
