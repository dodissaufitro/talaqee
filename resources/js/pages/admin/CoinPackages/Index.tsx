import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminSidebar from '@/components/AdminSidebar';
import { 
    Coins, Plus, Edit, Trash2, Search, Sparkles, CheckCircle2, 
    XCircle, ShieldCheck, Tag, Info, AlertCircle, ArrowUpDown
} from 'lucide-react';

export interface CoinPackage {
    id: number;
    name: string;
    coin_amount: number;
    price: number | string;
    bonus_coin: number;
    is_popular: boolean;
    badge_label: string | null;
    badge_color: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

interface PageProps {
    packages: CoinPackage[];
    auth: any;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function CoinPackagesIndex({ packages = [], auth }: PageProps) {
    const { flash } = usePage<any>().props;
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<CoinPackage | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm<{
        name: string;
        coin_amount: number;
        price: number;
        bonus_coin: number;
        is_popular: boolean;
        badge_label: string;
        badge_color: string;
        is_active: boolean;
    }>({
        name: '',
        coin_amount: 100,
        price: 5000,
        bonus_coin: 0,
        is_popular: false,
        badge_label: '',
        badge_color: 'amber',
        is_active: true,
    });

    const openModal = (pkg: CoinPackage | null = null) => {
        clearErrors();
        if (pkg) {
            setEditingPackage(pkg);
            setData({
                name: pkg.name,
                coin_amount: Number(pkg.coin_amount),
                price: Number(pkg.price),
                bonus_coin: Number(pkg.bonus_coin || 0),
                is_popular: Boolean(pkg.is_popular),
                badge_label: pkg.badge_label || '',
                badge_color: pkg.badge_color || 'amber',
                is_active: Boolean(pkg.is_active),
            });
        } else {
            setEditingPackage(null);
            reset();
            setData({
                name: '',
                coin_amount: 100,
                price: 5000,
                bonus_coin: 0,
                is_popular: false,
                badge_label: '',
                badge_color: 'amber',
                is_active: true,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPackage(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPackage) {
            put(route('admin.coin-packages.update', editingPackage.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.coin-packages.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (pkg: CoinPackage) => {
        if (confirm(`Apakah Anda yakin ingin menghapus "${pkg.name}" (${pkg.coin_amount} koin)?`)) {
            destroy(route('admin.coin-packages.destroy', pkg.id));
        }
    };

    const toggleStatus = (pkg: CoinPackage) => {
        router.put(route('admin.coin-packages.update', pkg.id), {
            name: pkg.name,
            coin_amount: pkg.coin_amount,
            price: pkg.price,
            bonus_coin: pkg.bonus_coin,
            is_popular: pkg.is_popular,
            badge_label: pkg.badge_label || '',
            badge_color: pkg.badge_color || 'amber',
            is_active: !pkg.is_active,
        }, {
            preserveScroll: true,
        });
    };

    const filteredPackages = packages.filter(pkg => {
        const matchesSearch = pkg.name.toLowerCase().includes(search.toLowerCase()) || 
            String(pkg.coin_amount).includes(search) ||
            String(pkg.price).includes(search);
        
        if (filterStatus === 'active') return matchesSearch && pkg.is_active;
        if (filterStatus === 'inactive') return matchesSearch && !pkg.is_active;
        return matchesSearch;
    });

    const activeCount = packages.filter(p => p.is_active).length;
    const popularCount = packages.filter(p => p.is_popular).length;

    // Helper color classes for badges
    const getBadgeClasses = (color: string | null) => {
        switch (color) {
            case 'emerald':
                return 'bg-emerald-500 text-white';
            case 'blue':
                return 'bg-blue-500 text-white';
            case 'purple':
            case 'indigo':
                return 'bg-indigo-600 text-white';
            case 'rose':
            case 'red':
                return 'bg-rose-500 text-white';
            case 'amber':
            default:
                return 'bg-amber-500 text-white';
        }
    };

    return (
        <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden selection:bg-purple-100 selection:text-purple-900">
            <Head title="Kelola Paket Koin - Admin Talaqee" />
            <AdminSidebar activeItem="Paket Koin" auth={auth} />

            <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
                <div className="p-8 max-w-7xl mx-auto w-full">
                    {/* Flash Notice */}
                    {flash?.success && (
                        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                <span className="font-semibold">{flash.success}</span>
                            </div>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 text-sm p-4 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                                <span className="font-semibold">{flash.error}</span>
                            </div>
                        </div>
                    )}

                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
                                    <Coins className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-extrabold text-gray-900">Kelola Paket Koin</h1>
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                            <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Kelola varian paket koin dan harga yang tersedia untuk pembelian oleh pengguna
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => openModal()}
                                className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shrink-0 transition-all shadow-md shadow-purple-600/20 active:scale-[0.98]"
                            >
                                <Plus className="w-4 h-4" /> Tambah Paket Koin
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                                <Coins className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Total Paket</p>
                                <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Paket Aktif</p>
                                <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Paket Populer / Unggulan</p>
                                <p className="text-2xl font-bold text-purple-600">{popularCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama, koin, atau harga..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-xs text-gray-500 font-medium mr-1">Status:</span>
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    filterStatus === 'all'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Semua ({packages.length})
                            </button>
                            <button
                                onClick={() => setFilterStatus('active')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    filterStatus === 'active'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Aktif ({activeCount})
                            </button>
                            <button
                                onClick={() => setFilterStatus('inactive')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    filterStatus === 'inactive'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Nonaktif ({packages.length - activeCount})
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="py-4 px-6">Nama Paket</th>
                                        <th className="py-4 px-6 text-center">Jumlah Koin</th>
                                        <th className="py-4 px-6 text-center">Bonus Koin</th>
                                        <th className="py-4 px-6">Harga (Rp)</th>
                                        <th className="py-4 px-6 text-center">Badge / Label</th>
                                        <th className="py-4 px-6 text-center">Status</th>
                                        <th className="py-4 px-6 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {filteredPackages.length > 0 ? (
                                        filteredPackages.map((pkg) => (
                                            <tr key={pkg.id} className="hover:bg-gray-50/60 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-amber-100/70 flex items-center justify-center text-amber-700 font-extrabold shadow-inner shrink-0">
                                                            C
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 flex items-center gap-2">
                                                                {pkg.name}
                                                                {pkg.is_popular && (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                                                        <Sparkles className="w-2.5 h-2.5" /> Populer
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-gray-400">ID #{pkg.id}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6 text-center">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 font-extrabold text-sm">
                                                        <Coins className="w-4 h-4 text-amber-500" />
                                                        {Number(pkg.coin_amount).toLocaleString('id-ID')}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-6 text-center">
                                                    {pkg.bonus_coin > 0 ? (
                                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                                            +{Number(pkg.bonus_coin).toLocaleString('id-ID')}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">-</span>
                                                    )}
                                                </td>

                                                <td className="py-4 px-6 font-extrabold text-gray-900">
                                                    Rp {Number(pkg.price).toLocaleString('id-ID')}
                                                    <div className="text-[11px] font-normal text-gray-400">
                                                        ≈ Rp {(Number(pkg.price) / (Number(pkg.coin_amount) + Number(pkg.bonus_coin || 0))).toFixed(1)} / koin
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6 text-center">
                                                    {pkg.badge_label ? (
                                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm ${getBadgeClasses(pkg.badge_color)}`}>
                                                            {pkg.badge_label}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">-</span>
                                                    )}
                                                </td>

                                                <td className="py-4 px-6 text-center">
                                                    <button
                                                        onClick={() => toggleStatus(pkg)}
                                                        title="Klik untuk mengubah status aktif/nonaktif"
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                                            pkg.is_active 
                                                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        <span className={`w-2 h-2 rounded-full ${pkg.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                                        {pkg.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </button>
                                                </td>

                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openModal(pkg)}
                                                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                            title="Edit Paket"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(pkg)}
                                                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Hapus Paket"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                                                        <Coins className="w-6 h-6" />
                                                    </div>
                                                    <p className="font-semibold text-gray-700">Tidak ada paket koin ditemukan</p>
                                                    <p className="text-xs text-gray-400 mt-1">Coba sesuaikan pencarian atau tambahkan paket koin baru.</p>
                                                    <button
                                                        onClick={() => openModal()}
                                                        className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" /> Tambah Paket Koin Baru
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah / Edit Paket Koin */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-gray-100">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 font-bold">
                                    <Coins className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {editingPackage ? 'Edit Paket Koin' : 'Tambah Paket Koin Baru'}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {editingPackage ? 'Perbarui informasi dan harga paket koin' : 'Tentukan jumlah koin dan tarif pembelian'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={closeModal} 
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                                {/* Nama Paket */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Nama Paket <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Paket 100 Koin, Paket Populer..."
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all"
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* Jumlah Koin & Bonus Koin */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Jumlah Koin <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="100"
                                                value={data.coin_amount}
                                                onChange={e => setData('coin_amount', parseInt(e.target.value) || 0)}
                                                className="w-full pl-4 pr-10 py-2.5 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none font-bold transition-all"
                                                required
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-amber-400 text-white rounded-full flex items-center justify-center text-[11px] font-extrabold shadow-sm">
                                                C
                                            </div>
                                        </div>
                                        {errors.coin_amount && <p className="text-red-500 text-xs mt-1">{errors.coin_amount}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Bonus Koin (Opsional)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={data.bonus_coin}
                                            onChange={e => setData('bonus_coin', parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all"
                                        />
                                        {errors.bonus_coin && <p className="text-red-500 text-xs mt-1">{errors.bonus_coin}</p>}
                                    </div>
                                </div>

                                {/* Harga */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Harga (Rupiah) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="5000"
                                            value={data.price}
                                            onChange={e => setData('price', parseFloat(e.target.value) || 0)}
                                            className="w-full pl-12 pr-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none font-bold transition-all"
                                            required
                                        />
                                    </div>
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                    
                                    {data.coin_amount > 0 && data.price > 0 && (
                                         <p className="text-xs text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg mt-1.5 font-medium">
                                            Nilai konversi: ≈ Rp {(Number(data.price) / (Number(data.coin_amount) + Number(data.bonus_coin || 0))).toFixed(1)} per 1 Koin
                                        </p>
                                    )}
                                </div>

                                {/* Badge Label & Badge Color */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Badge / Tag Label (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: Popular, Best Value, Promo..."
                                            value={data.badge_label}
                                            onChange={e => setData('badge_label', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Warna Badge
                                        </label>
                                        <select
                                            value={data.badge_color}
                                            onChange={e => setData('badge_color', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all"
                                        >
                                            <option value="amber">Kuning / Emas (Amber)</option>
                                            <option value="emerald">Hijau (Emerald)</option>
                                            <option value="indigo">Ungu (Indigo)</option>
                                            <option value="blue">Biru (Blue)</option>
                                            <option value="rose">Merah (Rose)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Checkbox Options: Popular & Status */}
                                <div className="pt-2 border-t border-gray-100 space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={data.is_popular}
                                            onChange={e => setData('is_popular', e.target.checked)}
                                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-gray-900">Tandai sebagai Paket Populer</span>
                                            <p className="text-xs text-gray-500">Paket ini akan diberi penanda khusus rekomendasi</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={e => setData('is_active', e.target.checked)}
                                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-gray-900">Status Aktif</span>
                                            <p className="text-xs text-gray-500">Tampilkan paket ini di halaman Top Up pengguna</p>
                                        </div>
                                    </label>
                                </div>

                                {/* Live Preview Card */}
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Tampilan di Halaman Top Up (Preview)
                                    </p>
                                    <div className="max-w-[200px] mx-auto relative rounded-[16px] border-2 border-purple-500 bg-white p-4 shadow-sm text-center">
                                        {data.badge_label && (
                                            <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm ${getBadgeClasses(data.badge_color)}`}>
                                                {data.badge_label}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-center gap-1.5 mb-1.5 mt-1">
                                            <span className="text-2xl font-black text-gray-900">
                                                {data.coin_amount || 0}
                                            </span>
                                            <div className="w-5 h-5 bg-[#FBBF24] rounded-full flex items-center justify-center shadow-sm">
                                                <span className="text-white text-[12px] font-extrabold">C</span>
                                            </div>
                                        </div>
                                        {data.bonus_coin > 0 && (
                                            <p className="text-[10px] font-bold text-emerald-600 mb-1">
                                                +{data.bonus_coin} Koin Bonus
                                            </p>
                                        )}
                                        <div className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
                                            Rp {Number(data.price || 0).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-md shadow-purple-600/20 disabled:opacity-50 active:scale-[0.98]"
                                >
                                    {processing ? 'Menyimpan...' : (editingPackage ? 'Simpan Perubahan' : 'Tambah Paket')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
