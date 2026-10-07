import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { 
    Users, CreditCard, Box, Settings, ChevronDown, 
    Bell, Calendar, Shield, DownloadCloud, User, Plus, Search, Filter, Edit2, Trash2, Key, CheckCircle2,
    X, Check, Coins, Eye, Phone, MapPin, Mail, AlertCircle, RefreshCw, Lock, Sparkles, ArrowRight
} from 'lucide-react';

interface UserRole {
    id?: number;
    name: string;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    city?: string | null;
    status?: string | null;
    coin_balance: number;
    avatar?: string | null;
    created_at: string;
    roles: UserRole[];
}

interface PageProps {
    [key: string]: unknown;
    users: {
        data: UserItem[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    roles: Array<{
        id: number;
        name: string;
        users_count: number;
        permissions: Array<{ name: string }>;
    }>;
    filters?: {
        search?: string;
        role?: string;
        status?: string;
    };
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    auth: {
        user: {
            id?: number;
            name: string;
            email: string;
            roles?: string[];
            is_super_admin?: boolean;
        }
    };
}

const MODULES = [
    'Dashboard', 'Penjualan', 'Buku', 'Kategori', 'Pelanggan', 
    'Transaksi', 'Laporan', 'Stok', 'Promosi', 'Pengaturan', 'Pengguna'
];

export default function PenggunaIndex() {
    const { users, roles, auth, filters = {}, flash } = usePage<PageProps>().props;

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedRoleFilter, setSelectedRoleFilter] = useState(filters.role || '');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState(filters.status || '');

    // Modals state
    const [selectedUserForDetail, setSelectedUserForDetail] = useState<UserItem | null>(null);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');

    // Toast state
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

    // Form for editing user
    const editForm = useForm({
        name: '',
        email: '',
        phone: '',
        city: '',
        status: 'Aktif',
        role: '',
        coin_balance: 0,
        password: '',
    });

    // Form for creating new user
    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        city: '',
        status: 'Aktif',
        role: 'user',
        coin_balance: 0,
    });

    // Populate edit form when an user is selected for editing
    const openEditModal = (user: UserItem) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            city: user.city || '',
            status: user.status || 'Aktif',
            role: user.roles?.[0]?.name || '',
            coin_balance: Number(user.coin_balance) || 0,
            password: '',
        });
        editForm.clearErrors();
    };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        editForm.put(route('admin.users.update', editingUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingUser(null);
                // Also update detail modal if it's currently open for this user
                if (selectedUserForDetail && selectedUserForDetail.id === editingUser.id) {
                    setSelectedUserForDetail(prev => prev ? {
                        ...prev,
                        name: editForm.data.name,
                        email: editForm.data.email,
                        phone: editForm.data.phone,
                        city: editForm.data.city,
                        status: editForm.data.status,
                        coin_balance: editForm.data.coin_balance,
                        roles: editForm.data.role ? [{ name: editForm.data.role }] : prev.roles
                    } : null);
                }
            }
        });
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            }
        });
    };

    const handleDeleteUser = () => {
        if (!deletingUser) return;
        router.delete(route('admin.users.destroy', deletingUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingUser(null);
                if (selectedUserForDetail?.id === deletingUser.id) {
                    setSelectedUserForDetail(null);
                }
            }
        });
    };

    // Filter submit
    const applyFilters = () => {
        router.get(route('admin.users.index'), {
            search: searchQuery || undefined,
            role: selectedRoleFilter || undefined,
            status: selectedStatusFilter || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedRoleFilter('');
        setSelectedStatusFilter('');
        router.get(route('admin.users.index'), {}, { replace: true });
    };

    // State for Permissions Matrix
    const [permissionsMatrix, setPermissionsMatrix] = useState<Record<string, { view: boolean, create: boolean, update: boolean, delete: boolean }>>(
        MODULES.reduce((acc, mod) => {
            acc[mod] = { view: false, create: false, update: false, delete: false };
            return acc;
        }, {} as Record<string, { view: boolean, create: boolean, update: boolean, delete: boolean }>)
    );

    const togglePermission = (moduleName: string, action: 'view' | 'create' | 'update' | 'delete') => {
        setPermissionsMatrix(prev => ({
            ...prev,
            [moduleName]: {
                ...prev[moduleName],
                [action]: !prev[moduleName][action]
            }
        }));
    };

    const toggleRow = (moduleName: string) => {
        setPermissionsMatrix(prev => {
            const row = prev[moduleName];
            const allChecked = row.view && row.create && row.update && row.delete;
            return {
                ...prev,
                [moduleName]: {
                    view: !allChecked,
                    create: !allChecked,
                    update: !allChecked,
                    delete: !allChecked
                }
            };
        });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Manajemen Pengguna & Koin - BookStore" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Pengguna" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Floating Toast Notification */}
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
                            <button 
                                onClick={() => setToastMessage(null)}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-8 w-full space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Pengaturan & Pengguna</h2>
                            <p className="text-gray-500 text-sm mt-1">Kelola data pengguna, hak akses, dan saldo koin pengguna aplikasi</p>
                        </div>
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
                    </div>

                    {/* Top Navigation Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-2 flex overflow-x-auto">
                        <Link href={route('admin.settings.index')} className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <User size={18} />
                            <span className="font-medium text-sm">Profil Toko</span>
                        </Link>
                        <Link href={route('admin.settings.index')} className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <Settings size={18} />
                            <span className="font-medium text-sm">Umum</span>
                        </Link>
                        <Link href={route('admin.settings.index')} className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <CreditCard size={18} />
                            <span className="font-medium text-sm">Pembayaran</span>
                        </Link>
                        <Link href={route('admin.settings.index')} className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <Box size={18} />
                            <span className="font-medium text-sm">Pengiriman</span>
                        </Link>
                        <Link href={route('admin.settings.index')} className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <Bell size={18} />
                            <span className="font-medium text-sm">Notifikasi</span>
                        </Link>
                        <Link href={route('admin.settings.index')} className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <Shield size={18} />
                            <span className="font-medium text-sm">Keamanan</span>
                        </Link>
                        <Link href={route('admin.settings.index')} className="flex items-center gap-2 py-3 px-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg cursor-pointer transition-colors shrink-0">
                            <DownloadCloud size={18} />
                            <span className="font-medium text-sm">Backup & Restore</span>
                        </Link>
                        <div className="flex items-center gap-2 py-3 px-4 border-b-2 border-[#6366f1] text-[#6366f1] cursor-pointer shrink-0">
                            <Users size={18} />
                            <span className="font-medium text-sm">Pengguna</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        
                        {/* Users Table Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900 text-lg">Daftar Pengguna</h3>
                                        <span className="bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full text-xs">
                                            {users.total} Pengguna
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-0.5">
                                        Klik baris pengguna untuk melihat rincian saldo koin, atau klik tombol edit untuk mengubah data dan saldo koin
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2 shrink-0"
                                    >
                                        <Plus size={16} /> Tambah Pengguna
                                    </button>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-gray-50/70 rounded-xl border border-gray-100">
                                <div className="relative flex-1 min-w-[240px]">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Cari nama, email, no hp, kota..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder:text-gray-400" 
                                    />
                                </div>

                                <div className="w-44">
                                    <select 
                                        value={selectedRoleFilter}
                                        onChange={(e) => setSelectedRoleFilter(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                    >
                                        <option value="">Semua Role</option>
                                        {roles.map(r => (
                                            <option key={r.id} value={r.name}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-36">
                                    <select 
                                        value={selectedStatusFilter}
                                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="Aktif">Aktif</option>
                                        <option value="Nonaktif">Nonaktif</option>
                                        <option value="Loyal">Loyal</option>
                                    </select>
                                </div>

                                <button 
                                    onClick={applyFilters}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                                >
                                    <Filter size={15} /> Filter
                                </button>

                                {(searchQuery || selectedRoleFilter || selectedStatusFilter) && (
                                    <button 
                                        onClick={resetFilters}
                                        className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1"
                                    >
                                        Reset Filter
                                    </button>
                                )}
                            </div>
                            
                            {/* Table */}
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-100 uppercase text-xs tracking-wider">
                                        <tr>
                                            <th className="py-3.5 px-6 font-semibold">Pengguna</th>
                                            <th className="py-3.5 px-6 font-semibold">Role Akses</th>
                                            <th className="py-3.5 px-6 font-semibold">Saldo Koin</th>
                                            <th className="py-3.5 px-6 font-semibold">Kontak & Kota</th>
                                            <th className="py-3.5 px-6 font-semibold">Status</th>
                                            <th className="py-3.5 px-6 font-semibold text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.data.length > 0 ? (
                                            users.data.map(user => (
                                                <tr 
                                                    key={user.id} 
                                                    className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                                                    onClick={() => setSelectedUserForDetail(user)}
                                                >
                                                    {/* User Info */}
                                                    <td className="py-3.5 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <img 
                                                                    src={user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `/storage/${user.avatar}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&bold=true`} 
                                                                    alt={user.name} 
                                                                    className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-white" 
                                                                />
                                                                <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                                                                    <span className={`block w-2.5 h-2.5 rounded-full ${user.status === 'Aktif' || !user.status ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                                                                    <span>{user.name}</span>
                                                                    <span className="text-[10px] text-gray-400 font-normal">#{user.id}</span>
                                                                </div>
                                                                <div className="text-xs text-gray-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Roles */}
                                                    <td className="py-3.5 px-6">
                                                        <div className="flex gap-1.5 flex-wrap">
                                                            {user.roles && user.roles.length > 0 ? user.roles.map((role, idx) => (
                                                                <span key={idx} className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                                                                    role.name.toLowerCase().includes('super') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                                                                    role.name.toLowerCase().includes('admin') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                                    'bg-slate-100 text-slate-700 border border-slate-200'
                                                                }`}>
                                                                    {role.name}
                                                                </span>
                                                            )) : (
                                                                <span className="text-gray-400 italic text-xs">Pengguna (User)</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Saldo Koin */}
                                                    <td className="py-3.5 px-6">
                                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-amber-900 font-bold text-xs shadow-xs hover:border-amber-300 transition-colors">
                                                            <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center">
                                                                <Coins size={13} className="text-amber-600 fill-amber-500" />
                                                            </div>
                                                            <span>{(Number(user.coin_balance) || 0).toLocaleString('id-ID')} Koin</span>
                                                        </div>
                                                    </td>

                                                    {/* Kontak & Kota */}
                                                    <td className="py-3.5 px-6 text-xs text-gray-600">
                                                        <div>{user.phone || '-'}</div>
                                                        <div className="text-gray-400">{user.city || '-'}</div>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="py-3.5 px-6">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                            user.status === 'Aktif' || !user.status ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Aktif' || !user.status ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                            {user.status || 'Aktif'}
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="py-3.5 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <button 
                                                                title="Lihat Detail & Saldo Koin"
                                                                onClick={() => setSelectedUserForDetail(user)}
                                                                className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                            <button 
                                                                title="Edit Pengguna & Koin"
                                                                onClick={() => openEditModal(user)}
                                                                className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button 
                                                                title="Hapus Pengguna"
                                                                onClick={() => setDeletingUser(user)}
                                                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="py-12 text-center text-gray-400">
                                                    Tidak ada data pengguna yang sesuai dengan filter pencarian.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-2 gap-4">
                                <span className="text-sm text-gray-500">
                                    Menampilkan {users.from || 0} - {users.to || 0} dari {users.total} pengguna
                                </span>
                                <div className="flex items-center gap-1">
                                    {users.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`h-8 min-w-[32px] px-2 flex items-center justify-center rounded-lg text-xs transition-colors ${
                                                link.active
                                                ? 'bg-[#6366f1] text-white font-medium shadow-sm'
                                                : link.url
                                                    ? 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                                                    : 'text-gray-300 cursor-not-allowed border border-transparent'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Roles Table Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Role & Hak Akses</h3>
                                    <p className="text-gray-500 text-sm mt-0.5">Kelola tipe role dan izin fitur (permissions)</p>
                                </div>
                                <button 
                                    onClick={() => setIsRoleModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Key size={16} /> Tambah Role
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {roles.map(role => (
                                    <div key={role.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-gray-50/30">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                    {role.name}
                                                    {role.name.toLowerCase().includes('super') && <Shield size={14} className="text-indigo-500" />}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-0.5">{role.users_count} pengguna memiliki role ini</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="text-xs font-medium text-gray-700 mb-2">Hak Akses:</div>
                                            {role.permissions && role.permissions.length > 0 ? (
                                                <div className="flex flex-col gap-1.5">
                                                    {role.permissions.slice(0, 4).map((perm, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                                            <span className="capitalize">{perm.name}</span>
                                                        </div>
                                                    ))}
                                                    {role.permissions.length > 4 && (
                                                        <div className="text-xs text-indigo-500 font-medium pl-6 pt-1">
                                                            + {role.permissions.length - 4} akses lainnya
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-400 italic">Semua akses (Super User)</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* MODAL 1: Detail Pengguna & Koin (Muncul saat Pengguna di-klik) */}
                {selectedUserForDetail && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
                            onClick={() => setSelectedUserForDetail(null)}
                        ></div>

                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {/* Modal Header Banner */}
                            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white relative">
                                <button 
                                    onClick={() => setSelectedUserForDetail(null)}
                                    className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex items-center gap-4">
                                    <img 
                                        src={selectedUserForDetail.avatar ? (selectedUserForDetail.avatar.startsWith('http') ? selectedUserForDetail.avatar : `/storage/${selectedUserForDetail.avatar}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUserForDetail.name)}&background=ffffff&color=4f46e5&bold=true`} 
                                        alt={selectedUserForDetail.name} 
                                        className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-md" 
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold text-white">{selectedUserForDetail.name}</h3>
                                            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                                                ID: {selectedUserForDetail.id}
                                            </span>
                                        </div>
                                        <p className="text-indigo-100 text-sm mt-0.5 flex items-center gap-1.5">
                                            <Mail size={14} className="opacity-80" />
                                            {selectedUserForDetail.email}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                selectedUserForDetail.status === 'Aktif' || !selectedUserForDetail.status ? 'bg-emerald-400/20 text-emerald-100' : 'bg-red-400/20 text-red-100'
                                            }`}>
                                                {selectedUserForDetail.status || 'Aktif'}
                                            </span>
                                            {selectedUserForDetail.roles?.map((r, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
                                                    {r.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-6">
                                {/* HIGHLIGHTED COIN CARD */}
                                <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-yellow-500/10 border-2 border-amber-300/80 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                                    <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                                        <Coins size={140} className="text-amber-600" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-white">
                                                <Coins size={28} className="fill-white" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Saldo Koin Pengguna</div>
                                                <div className="text-3xl font-black text-amber-900 tracking-tight flex items-baseline gap-1.5 mt-0.5">
                                                    {(Number(selectedUserForDetail.coin_balance) || 0).toLocaleString('id-ID')}
                                                    <span className="text-sm font-semibold text-amber-700">Koin Talaqee</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => {
                                                const u = selectedUserForDetail;
                                                setSelectedUserForDetail(null);
                                                openEditModal(u);
                                            }}
                                            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-xs shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
                                        >
                                            <Edit2 size={13} />
                                            Edit Koin
                                        </button>
                                    </div>

                                    <p className="text-xs text-amber-800/80 mt-3.5 border-t border-amber-200/60 pt-3 flex items-center gap-1.5">
                                        <Sparkles size={13} className="text-amber-500 shrink-0" />
                                        Koin dapat digunakan pengguna untuk membuka chapter buku berbayar & fitur premium aplikasi.
                                    </p>
                                </div>

                                {/* Informasi Pengguna Lainnya */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                            <Phone size={14} className="text-indigo-500" />
                                            <span>Nomor Telepon</span>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {selectedUserForDetail.phone || '-'}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                            <MapPin size={14} className="text-indigo-500" />
                                            <span>Kota Domisili</span>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {selectedUserForDetail.city || '-'}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                            <Calendar size={14} className="text-indigo-500" />
                                            <span>Bergabung Sejak</span>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {formatDate(selectedUserForDetail.created_at)}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                            <Shield size={14} className="text-indigo-500" />
                                            <span>Role Utama</span>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {selectedUserForDetail.roles?.[0]?.name || 'User (Umum)'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <button 
                                    onClick={() => setSelectedUserForDetail(null)}
                                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-100 text-sm font-medium transition-colors"
                                >
                                    Tutup
                                </button>
                                
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => {
                                            const u = selectedUserForDetail;
                                            setSelectedUserForDetail(null);
                                            openEditModal(u);
                                        }}
                                        className="px-5 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <Edit2 size={16} /> Edit Data & Koin Pengguna
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 2: Edit Data Pengguna & Koin */}
                {editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
                            onClick={() => setEditingUser(null)}
                        ></div>

                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                        <Edit2 size={20} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Edit Pengguna: {editingUser.name}</h3>
                                        <p className="text-xs text-gray-500">Perbarui informasi akun dan sesuaikan saldo koin pengguna</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setEditingUser(null)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Form Body */}
                            <form onSubmit={handleUpdateUser} className="flex-1 overflow-y-auto p-6 space-y-5">
                                {/* SECTION KOIN PENGGUNA */}
                                <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/5 border border-amber-300 rounded-2xl p-5 shadow-xs">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-bold text-amber-900 flex items-center gap-2">
                                            <Coins size={18} className="text-amber-600 fill-amber-500" />
                                            Saldo Koin Pengguna <span className="text-red-500">*</span>
                                        </label>
                                        <span className="text-xs text-amber-700 font-medium">Bisa diubah langsung oleh Superadmin</span>
                                    </div>

                                    <div className="relative mb-3">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                                            <span className="text-amber-600 font-bold text-sm">🪙 Koin:</span>
                                        </div>
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={editForm.data.coin_balance}
                                            onChange={(e) => editForm.setData('coin_balance', Math.max(0, parseInt(e.target.value) || 0))}
                                            className="w-full pl-22 pr-4 py-2.5 rounded-xl border border-amber-300 text-lg font-bold text-amber-950 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-xs"
                                        />
                                    </div>

                                    {editForm.errors.coin_balance && (
                                        <p className="text-xs text-red-600 mb-2">{editForm.errors.coin_balance}</p>
                                    )}

                                    {/* Quick Increment Buttons */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs text-amber-800 font-medium">Aksi Cepat:</span>
                                        {[+10, +50, +100, +500].map(amount => (
                                            <button 
                                                key={amount}
                                                type="button"
                                                onClick={() => editForm.setData('coin_balance', editForm.data.coin_balance + amount)}
                                                className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                                            >
                                                +{amount} Koin
                                            </button>
                                        ))}
                                        <button 
                                            type="button"
                                            onClick={() => editForm.setData('coin_balance', 0)}
                                            className="px-2.5 py-1 bg-white hover:bg-red-50 border border-gray-300 text-red-600 text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                                        >
                                            Reset ke 0
                                        </button>
                                    </div>
                                </div>

                                {/* Form Fields Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900 placeholder:text-gray-400"
                                            required
                                        />
                                        {editForm.errors.name && <p className="text-xs text-red-600 mt-1">{editForm.errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Alamat Email <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="email" 
                                            value={editForm.data.email}
                                            onChange={(e) => editForm.setData('email', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900 placeholder:text-gray-400"
                                            required
                                        />
                                        {editForm.errors.email && <p className="text-xs text-red-600 mt-1">{editForm.errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            No. Telepon / WhatsApp
                                        </label>
                                        <input 
                                            type="text" 
                                            value={editForm.data.phone}
                                            onChange={(e) => editForm.setData('phone', e.target.value)}
                                            placeholder="Contoh: 08123456789"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900 placeholder:text-gray-400"
                                        />
                                        {editForm.errors.phone && <p className="text-xs text-red-600 mt-1">{editForm.errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Kota / Wilayah
                                        </label>
                                        <input 
                                            type="text" 
                                            value={editForm.data.city}
                                            onChange={(e) => editForm.setData('city', e.target.value)}
                                            placeholder="Contoh: Jakarta Timur"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900 placeholder:text-gray-400"
                                        />
                                        {editForm.errors.city && <p className="text-xs text-red-600 mt-1">{editForm.errors.city}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Role Akses
                                        </label>
                                        <select 
                                            value={editForm.data.role}
                                            onChange={(e) => editForm.setData('role', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900"
                                        >
                                            <option value="">Pilih Role</option>
                                            {roles.map(r => (
                                                <option key={r.id} value={r.name}>{r.name}</option>
                                            ))}
                                        </select>
                                        {editForm.errors.role && <p className="text-xs text-red-600 mt-1">{editForm.errors.role}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Status Pengguna
                                        </label>
                                        <select 
                                            value={editForm.data.status}
                                            onChange={(e) => editForm.setData('status', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900"
                                        >
                                            <option value="Aktif">Aktif</option>
                                            <option value="Nonaktif">Nonaktif</option>
                                            <option value="Loyal">Loyal</option>
                                            <option value="Pending">Pending</option>
                                        </select>
                                        {editForm.errors.status && <p className="text-xs text-red-600 mt-1">{editForm.errors.status}</p>}
                                    </div>
                                </div>

                                {/* Password Reset (Optional) */}
                                <div className="border-t border-gray-100 pt-4">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <Lock size={14} className="text-gray-400" />
                                        Password Baru (Opsional)
                                    </label>
                                    <input 
                                        type="password" 
                                        value={editForm.data.password}
                                        onChange={(e) => editForm.setData('password', e.target.value)}
                                        placeholder="Kosongkan jika tidak ingin mengubah password pengguna"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900 placeholder:text-gray-400"
                                    />
                                    <p className="text-[11px] text-gray-400 mt-1">Hanya isi jika ingin mereset password akun pengguna ini secara langsung.</p>
                                    {editForm.errors.password && <p className="text-xs text-red-600 mt-1">{editForm.errors.password}</p>}
                                </div>

                                {/* Modal Footer */}
                                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-semibold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {editForm.processing ? (
                                            <>
                                                <RefreshCw size={16} className="animate-spin" /> Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={16} /> Simpan Perubahan
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 3: Tambah Pengguna Baru */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
                            onClick={() => setIsCreateModalOpen(false)}
                        ></div>

                        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                        <Plus size={20} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Tambah Pengguna Baru</h3>
                                        <p className="text-xs text-gray-500">Buat akun pengguna baru dan tetapkan role serta saldo awal koin</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Form Body */}
                            <form onSubmit={handleCreateUser} className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            value={createForm.data.name}
                                            onChange={(e) => createForm.setData('name', e.target.value)}
                                            placeholder="Nama lengkap"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900 placeholder:text-gray-400"
                                            required
                                        />
                                        {createForm.errors.name && <p className="text-xs text-red-600 mt-1">{createForm.errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="email" 
                                            value={createForm.data.email}
                                            onChange={(e) => createForm.setData('email', e.target.value)}
                                            placeholder="alamat@email.com"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900 placeholder:text-gray-400"
                                            required
                                        />
                                        {createForm.errors.email && <p className="text-xs text-red-600 mt-1">{createForm.errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="password" 
                                            value={createForm.data.password}
                                            onChange={(e) => createForm.setData('password', e.target.value)}
                                            placeholder="Minimal 6 karakter"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900 placeholder:text-gray-400"
                                            required
                                        />
                                        {createForm.errors.password && <p className="text-xs text-red-600 mt-1">{createForm.errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Saldo Awal Koin
                                        </label>
                                        <div className="relative">
                                            <Coins size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 fill-amber-500" />
                                            <input 
                                                type="number" 
                                                min="0"
                                                value={createForm.data.coin_balance}
                                                onChange={(e) => createForm.setData('coin_balance', Math.max(0, parseInt(e.target.value) || 0))}
                                                placeholder="0"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900 placeholder:text-gray-400"
                                            />
                                        </div>
                                        {createForm.errors.coin_balance && <p className="text-xs text-red-600 mt-1">{createForm.errors.coin_balance}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            No. Telepon / WhatsApp
                                        </label>
                                        <input 
                                            type="text" 
                                            value={createForm.data.phone}
                                            onChange={(e) => createForm.setData('phone', e.target.value)}
                                            placeholder="08xxxxxxxxxx"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900 placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Kota
                                        </label>
                                        <input 
                                            type="text" 
                                            value={createForm.data.city}
                                            onChange={(e) => createForm.setData('city', e.target.value)}
                                            placeholder="Kota tempat tinggal"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900 placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Role Pengguna
                                        </label>
                                        <select 
                                            value={createForm.data.role}
                                            onChange={(e) => createForm.setData('role', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900"
                                        >
                                            {roles.map(r => (
                                                <option key={r.id} value={r.name}>{r.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Status
                                        </label>
                                        <select 
                                            value={createForm.data.status}
                                            onChange={(e) => createForm.setData('status', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-xs bg-white text-gray-900"
                                        >
                                            <option value="Aktif">Aktif</option>
                                            <option value="Nonaktif">Nonaktif</option>
                                            <option value="Loyal">Loyal</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-semibold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {createForm.processing ? 'Menambahkan...' : 'Tambah Pengguna'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 4: Hapus Pengguna Confirmation */}
                {deletingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
                            onClick={() => setDeletingUser(null)}
                        ></div>

                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Hapus Pengguna</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Apakah Anda yakin ingin menghapus akun pengguna <strong className="text-gray-800">{deletingUser.name}</strong> ({deletingUser.email})? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex items-center justify-end gap-3">
                                <button 
                                    onClick={() => setDeletingUser(null)}
                                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleDeleteUser}
                                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow-sm"
                                >
                                    Hapus Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 5: Role Creation Modal */}
                {isRoleModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity"
                            onClick={() => setIsRoleModalOpen(false)}
                        ></div>
                        
                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                        <Key size={20} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Tambah Role Baru</h3>
                                        <p className="text-xs text-gray-500">Konfigurasi hak akses per modul untuk role ini</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsRoleModalOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="px-6 py-6 overflow-y-auto bg-gray-50/30">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Role <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: Manajer Operasional" 
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-[#6366f1] focus:border-[#6366f1] shadow-sm bg-white text-gray-900 placeholder:text-gray-400"
                                        value={newRoleName}
                                        onChange={(e) => setNewRoleName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium text-gray-700">Matriks Hak Akses</label>
                                        <span className="text-xs text-gray-500">Centang kotak untuk memberikan izin</span>
                                    </div>
                                    
                                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50/80 text-gray-600 border-b border-gray-200">
                                                <tr>
                                                    <th className="py-3 px-6 font-semibold w-1/3">Modul / Controller</th>
                                                    <th className="py-3 px-4 font-semibold text-center w-32">View (Read)</th>
                                                    <th className="py-3 px-4 font-semibold text-center w-32">Create</th>
                                                    <th className="py-3 px-4 font-semibold text-center w-32">Update</th>
                                                    <th className="py-3 px-4 font-semibold text-center w-32">Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {MODULES.map((mod) => {
                                                    const perms = permissionsMatrix[mod];
                                                    const allChecked = perms.view && perms.create && perms.update && perms.delete;
                                                    
                                                    return (
                                                        <tr key={mod} className="hover:bg-indigo-50/30 transition-colors">
                                                            <td className="py-3 px-6">
                                                                <div className="flex items-center gap-3">
                                                                    <div 
                                                                        onClick={() => toggleRow(mod)}
                                                                        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                                                                            allChecked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white hover:border-indigo-400'
                                                                        }`}
                                                                    >
                                                                        {allChecked && <Check size={12} className="text-white" />}
                                                                    </div>
                                                                    <span className="font-medium text-gray-800">{mod}</span>
                                                                </div>
                                                            </td>
                                                            
                                                            {['view', 'create', 'update', 'delete'].map((action) => {
                                                                const checked = perms[action as keyof typeof perms];
                                                                return (
                                                                    <td key={`${mod}-${action}`} className="py-3 px-4 text-center">
                                                                        <div className="flex justify-center">
                                                                            <div 
                                                                                onClick={() => togglePermission(mod, action as 'view' | 'create' | 'update' | 'delete')}
                                                                                className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-all ${
                                                                                    checked 
                                                                                    ? 'bg-indigo-600 border-indigo-600 shadow-sm' 
                                                                                    : 'border-2 border-gray-300 bg-white hover:border-indigo-400'
                                                                                }`}
                                                                            >
                                                                                {checked && <Check size={14} className="text-white" />}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 shrink-0 rounded-b-2xl">
                                <button 
                                    onClick={() => setIsRoleModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm"
                                >
                                    Batal
                                </button>
                                <button 
                                    className="px-5 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                                    onClick={() => {
                                        setIsRoleModalOpen(false);
                                    }}
                                >
                                    <CheckCircle2 size={16} /> Simpan Role
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
