import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { 
    Users, CreditCard, FileText, Box, Megaphone, Settings, Bell, 
    TrendingUp, ChevronDown, Plus, Search, Filter, Eye, Edit2, Trash2,
    UserPlus, ShoppingBag, Star, Coins, X, CheckCircle2, AlertCircle,
    Phone, Mail, MapPin, Calendar, Sparkles, RefreshCw
} from 'lucide-react';

interface CustomerItem {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    city: string | null;
    status: string;
    coin_balance: number;
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
    filters?: {
        search?: string;
        status?: string;
        city?: string;
    };
    flash?: {
        success?: string | null;
        error?: string | null;
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
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return dateString;
    }
};

const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const getAvatarColorClass = (name: string) => {
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
    const { customers, stats, auth, filters = {}, flash } = usePage<PageProps>().props;

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'Semua Status');
    const [cityFilter, setCityFilter] = useState(filters.city || 'Semua Kota');

    const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<CustomerItem | null>(null);
    const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
    const [deletingCustomer, setDeletingCustomer] = useState<CustomerItem | null>(null);

    const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToastMessage({ text: flash.success, type: 'success' });
            const timer = setTimeout(() => setToastMessage(null), 4000);
            return () => clearTimeout(timer);
        } else if (flash?.error) {
            setToastMessage({ text: flash.error, type: 'error' });
            const timer = setTimeout(() => setToastMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Edit form using Inertia useForm
    const editForm = useForm({
        name: '',
        email: '',
        phone: '',
        city: '',
        status: 'Aktif',
        coin_balance: 0,
        password: '',
    });

    const openEditModal = (customer: CustomerItem) => {
        setEditingCustomer(customer);
        editForm.setData({
            name: customer.name || '',
            email: customer.email || '',
            phone: customer.phone || '',
            city: customer.city || '',
            status: customer.status || 'Aktif',
            coin_balance: Number(customer.coin_balance) || 0,
            password: '',
        });
        editForm.clearErrors();
    };

    const handleUpdateCustomer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCustomer) return;

        editForm.put(route('admin.users.update', editingCustomer.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingCustomer(null);
                if (selectedCustomerForDetail && selectedCustomerForDetail.id === editingCustomer.id) {
                    setSelectedCustomerForDetail(prev => prev ? {
                        ...prev,
                        name: editForm.data.name,
                        email: editForm.data.email,
                        phone: editForm.data.phone,
                        city: editForm.data.city,
                        status: editForm.data.status,
                        coin_balance: editForm.data.coin_balance,
                    } : null);
                }
            }
        });
    };

    const handleDeleteCustomer = () => {
        if (!deletingCustomer) return;
        router.delete(route('admin.users.destroy', deletingCustomer.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingCustomer(null);
                if (selectedCustomerForDetail?.id === deletingCustomer.id) {
                    setSelectedCustomerForDetail(null);
                }
            }
        });
    };

    const applyFilters = () => {
        router.get(route('admin.customers.index'), {
            search: searchQuery || undefined,
            status: statusFilter !== 'Semua Status' ? statusFilter : undefined,
            city: cityFilter !== 'Semua Kota' ? cityFilter : undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter('Semua Status');
        setCityFilter('Semua Kota');
        router.get(route('admin.customers.index'), {}, { replace: true });
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Pelanggan & Koin - BookStore" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Pelanggan" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Floating Toast */}
                {toastMessage && (
                    <div className="fixed top-6 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium ${
                            toastMessage.type === 'success' 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                            {toastMessage.type === 'success' ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                            )}
                            <span>{toastMessage.text}</span>
                            <button onClick={() => setToastMessage(null)} className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-8 w-full space-y-8">
                    {/* Header */}
                    <header className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Pelanggan</h2>
                            <p className="text-gray-500 text-sm mt-1">Dashboard <span className="mx-1">&gt;</span> Pelanggan & Koin Pengguna</p>
                        </div>
                        <div className="flex flex-col items-end gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 flex items-center gap-2 shadow-sm">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                </div>
                                <button className="bg-white border border-gray-200 p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 relative shadow-sm">
                                    <Bell size={20} />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                </button>
                            </div>
                            <Link 
                                href={route('admin.users.index')}
                                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2.5 px-5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Plus size={16} /> Kelola di Menu Pengguna
                            </Link>
                        </div>
                    </header>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Users className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Pelanggan</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.total_pelanggan)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> Aktif & Terdaftar
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                    <UserPlus className="text-emerald-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Pelanggan Baru</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.pelanggan_baru)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> Bulan Ini
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                    <ShoppingBag className="text-amber-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Pelanggan Aktif</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.pelanggan_aktif)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> Status Aktif
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Star className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Pelanggan Loyal</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(stats.pelanggan_loyal)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> Sering Transaksi
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
                                <input 
                                    type="text" 
                                    placeholder="Cari pelanggan (nama, email, telepon)..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 bg-white text-gray-900" 
                                />
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-44 relative">
                                    <select 
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 appearance-none bg-white"
                                    >
                                        <option value="Semua Status">Semua Status</option>
                                        <option value="Aktif">Aktif</option>
                                        <option value="Loyal">Loyal</option>
                                        <option value="Tidak Aktif">Tidak Aktif</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>

                                <button 
                                    onClick={applyFilters}
                                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
                                >
                                    <Filter size={16} /> Filter
                                </button>
                                <button 
                                    onClick={resetFilters}
                                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto rounded-t-xl border border-gray-100">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fafc]">
                                    <tr className="text-gray-500 border-b border-gray-100">
                                        <th className="py-4 px-6 font-medium w-16">No.</th>
                                        <th className="py-4 px-6 font-medium min-w-[220px]">Pelanggan</th>
                                        <th className="py-4 px-6 font-medium">Saldo Koin</th>
                                        <th className="py-4 px-6 font-medium">Kontak</th>
                                        <th className="py-4 px-6 font-medium">Kota</th>
                                        <th className="py-4 px-6 font-medium text-center">Transaksi</th>
                                        <th className="py-4 px-6 font-medium">Total Belanja</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                        <th className="py-4 px-6 font-medium text-center w-36">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.data.length > 0 ? customers.data.map((customer, idx) => (
                                        <tr 
                                            key={customer.id} 
                                            className="border-b border-gray-50 hover:bg-indigo-50/20 transition-colors cursor-pointer group"
                                            onClick={() => setSelectedCustomerForDetail(customer)}
                                        >
                                            <td className="py-4 px-6 text-gray-600">{customers.from + idx}</td>
                                            
                                            {/* Customer name & avatar */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm shrink-0 ${getAvatarColorClass(customer.name)}`}>
                                                        {getInitials(customer.name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors">{customer.name}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">Bergabung: {formatDate(customer.created_at)}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Saldo Koin */}
                                            <td className="py-4 px-6">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-amber-900 font-bold text-xs shadow-2xs">
                                                    <Coins size={14} className="text-amber-500 fill-amber-500" />
                                                    <span>{(Number(customer.coin_balance) || 0).toLocaleString('id-ID')} Koin</span>
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
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    customer.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    customer.status === 'Loyal' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                                    'bg-gray-100 text-gray-600 border border-gray-200'
                                                }`}>
                                                    {customer.status || 'Aktif'}
                                                </span>
                                            </td>
                                            
                                            {/* Actions */}
                                            <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        title="Lihat Koin & Detail"
                                                        onClick={() => setSelectedCustomerForDetail(customer)}
                                                        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 shadow-xs transition-all"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    <button 
                                                        title="Edit Pengguna & Koin"
                                                        onClick={() => openEditModal(customer)}
                                                        className="p-2 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 shadow-xs transition-all"
                                                    >
                                                        <Edit2 size={15} />
                                                    </button>
                                                    <button 
                                                        title="Hapus"
                                                        onClick={() => setDeletingCustomer(customer)}
                                                        className="p-2 rounded-lg border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 shadow-xs transition-all"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={9} className="py-12 text-center text-gray-500">Belum ada data pelanggan</td>
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

                {/* MODAL: Detail Pelanggan & Koin */}
                {selectedCustomerForDetail && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
                            onClick={() => setSelectedCustomerForDetail(null)}
                        ></div>

                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white relative">
                                <button 
                                    onClick={() => setSelectedCustomerForDetail(null)}
                                    className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white text-indigo-700 font-bold text-xl flex items-center justify-center shadow-md">
                                        {getInitials(selectedCustomerForDetail.name)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{selectedCustomerForDetail.name}</h3>
                                        <p className="text-indigo-100 text-sm flex items-center gap-1.5 mt-0.5">
                                            <Mail size={13} /> {selectedCustomerForDetail.email}
                                        </p>
                                        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
                                            {selectedCustomerForDetail.status || 'Aktif'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* GOLDEN COIN CARD */}
                                <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-yellow-500/10 border-2 border-amber-300 rounded-2xl p-5 shadow-xs">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-md text-white">
                                                <Coins size={26} className="fill-white" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Saldo Koin Pengguna</div>
                                                <div className="text-2xl font-black text-amber-950 flex items-baseline gap-1 mt-0.5">
                                                    {(Number(selectedCustomerForDetail.coin_balance) || 0).toLocaleString('id-ID')}
                                                    <span className="text-xs font-semibold text-amber-700">Koin</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const c = selectedCustomerForDetail;
                                                setSelectedCustomerForDetail(null);
                                                openEditModal(c);
                                            }}
                                            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
                                        >
                                            <Edit2 size={13} /> Edit Koin
                                        </button>
                                    </div>
                                    <p className="text-xs text-amber-800/80 mt-3 pt-2.5 border-t border-amber-200/60 flex items-center gap-1.5">
                                        <Sparkles size={13} className="text-amber-500 shrink-0" />
                                        Saldo koin siap digunakan untuk membeli bab buku & akses materi.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                            <Phone size={13} className="text-indigo-500" /> No. Telepon
                                        </div>
                                        <div className="font-semibold text-gray-900">{selectedCustomerForDetail.phone || '-'}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                            <MapPin size={13} className="text-indigo-500" /> Kota Domisili
                                        </div>
                                        <div className="font-semibold text-gray-900">{selectedCustomerForDetail.city || '-'}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                            <Calendar size={13} className="text-indigo-500" /> Terdaftar Sejak
                                        </div>
                                        <div className="font-semibold text-gray-900">{formatDate(selectedCustomerForDetail.created_at)}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                            <ShoppingBag size={13} className="text-indigo-500" /> Total Belanja
                                        </div>
                                        <div className="font-semibold text-gray-900">{formatRupiah(selectedCustomerForDetail.payments_sum_amount || 0)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <button 
                                    onClick={() => setSelectedCustomerForDetail(null)}
                                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-100 text-sm font-medium transition-colors"
                                >
                                    Tutup
                                </button>
                                <button 
                                    onClick={() => {
                                        const c = selectedCustomerForDetail;
                                        setSelectedCustomerForDetail(null);
                                        openEditModal(c);
                                    }}
                                    className="px-5 py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-semibold transition-colors shadow-xs flex items-center gap-2"
                                >
                                    <Edit2 size={15} /> Edit Data & Koin
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: Edit Pelanggan & Koin */}
                {editingCustomer && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
                            onClick={() => setEditingCustomer(null)}
                        ></div>

                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                        <Edit2 size={20} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Edit Pelanggan: {editingCustomer.name}</h3>
                                        <p className="text-xs text-gray-500">Perbarui profil dan saldo koin pelanggan</p>
                                    </div>
                                </div>
                                <button onClick={() => setEditingCustomer(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateCustomer} className="flex-1 overflow-y-auto p-6 space-y-4">
                                {/* Saldo Koin Setting */}
                                <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/5 border border-amber-300 rounded-2xl p-4">
                                    <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                                        <Coins size={16} className="text-amber-600 fill-amber-500" />
                                        Saldo Koin Pelanggan
                                    </label>
                                    <div className="relative mb-2">
                                        <input 
                                            type="number"
                                            min="0"
                                            value={editForm.data.coin_balance}
                                            onChange={(e) => editForm.setData('coin_balance', Math.max(0, parseInt(e.target.value) || 0))}
                                            className="w-full px-4 py-2 rounded-xl border border-amber-300 text-lg font-bold text-amber-950 focus:ring-amber-500 focus:border-amber-500 bg-white"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[11px] text-amber-800 font-medium">Aksi Cepat:</span>
                                        {[+10, +50, +100, +500].map(amt => (
                                            <button 
                                                key={amt}
                                                type="button"
                                                onClick={() => editForm.setData('coin_balance', editForm.data.coin_balance + amt)}
                                                className="px-2 py-0.5 bg-white border border-amber-300 text-amber-800 text-xs font-semibold rounded-md hover:bg-amber-100"
                                            >
                                                +{amt}
                                            </button>
                                        ))}
                                        <button 
                                            type="button"
                                            onClick={() => editForm.setData('coin_balance', 0)}
                                            className="px-2 py-0.5 bg-white border border-gray-300 text-red-600 text-xs font-semibold rounded-md hover:bg-red-50"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                                        <input 
                                            type="text" 
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder:text-gray-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                                        <input 
                                            type="email" 
                                            value={editForm.data.email}
                                            onChange={(e) => editForm.setData('email', e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder:text-gray-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">No. HP / WhatsApp</label>
                                        <input 
                                            type="text" 
                                            value={editForm.data.phone}
                                            onChange={(e) => editForm.setData('phone', e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Kota</label>
                                        <input 
                                            type="text" 
                                            value={editForm.data.city}
                                            onChange={(e) => editForm.setData('city', e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                                        <select 
                                            value={editForm.data.status}
                                            onChange={(e) => editForm.setData('status', e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                        >
                                            <option value="Aktif">Aktif</option>
                                            <option value="Loyal">Loyal</option>
                                            <option value="Tidak Aktif">Tidak Aktif</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setEditingCustomer(null)}
                                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="px-5 py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-semibold transition-colors shadow-xs flex items-center gap-2"
                                    >
                                        {editForm.processing ? (
                                            <>
                                                <RefreshCw size={14} className="animate-spin" /> Menyimpan...
                                            </>
                                        ) : (
                                            'Simpan Perubahan'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: Hapus Pelanggan */}
                {deletingCustomer && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
                            onClick={() => setDeletingCustomer(null)}
                        ></div>
                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Hapus Pelanggan</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Apakah Anda yakin ingin menghapus akun pelanggan <strong className="text-gray-800">{deletingCustomer.name}</strong>?
                            </p>
                            <div className="flex items-center justify-end gap-3">
                                <button onClick={() => setDeletingCustomer(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium">
                                    Batal
                                </button>
                                <button onClick={handleDeleteCustomer} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-xs">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
