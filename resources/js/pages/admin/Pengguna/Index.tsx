import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, Users, 
    CreditCard, Box, Settings, ChevronDown, 
    Bell, Calendar, Shield, DownloadCloud, User, Plus, Search, Filter, Edit2, Trash2, Key, CheckCircle2,
    X, Check
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface PageProps {
    [key: string]: unknown;
    users: {
        data: Array<{
            id: number;
            name: string;
            email: string;
            status: string;
            created_at: string;
            roles: Array<{ name: string }>;
        }>;
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
    auth: {
        user: {
            name: string;
            email: string;
        }
    };
}

const MODULES = [
    'Dashboard', 'Penjualan', 'Buku', 'Kategori', 'Pelanggan', 
    'Transaksi', 'Laporan', 'Stok', 'Promosi', 'Pengaturan', 'Pengguna'
];

export default function PenggunaIndex() {
    const { users, roles, auth } = usePage<PageProps>().props;

    // State for Modal
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    
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

    

    

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Pengguna - BookStore" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Pengguna" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
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
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Daftar Pengguna</h3>
                                    <p className="text-gray-500 text-sm mt-0.5">Kelola akun dan role akses pengguna aplikasi</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input type="text" placeholder="Cari pengguna..." className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 w-64" />
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Filter size={16} /> Filter
                                    </button>
                                    <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                                        <Plus size={16} /> Tambah Pengguna
                                    </button>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                                        <tr>
                                            <th className="py-3 px-6 font-medium">Pengguna</th>
                                            <th className="py-3 px-6 font-medium">Role Akses</th>
                                            <th className="py-3 px-6 font-medium">Status</th>
                                            <th className="py-3 px-6 font-medium text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {users.data.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-10 h-10 rounded-full" />
                                                        <div>
                                                            <div className="font-medium text-gray-900">{user.name}</div>
                                                            <div className="text-xs text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6">
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {user.roles.length > 0 ? user.roles.map((role, idx) => (
                                                            <span key={idx} className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                                                                role.name === 'Super Admin' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                                                role.name === 'Admin' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                                'bg-slate-50 text-slate-600 border border-slate-200'
                                                            }`}>
                                                                {role.name}
                                                            </span>
                                                        )) : (
                                                            <span className="text-gray-400 italic text-xs">Tanpa Role</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        user.status === 'Aktif' || !user.status ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Aktif' || !user.status ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                        {user.status || 'Aktif'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-6 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button className="p-1.5 rounded-md text-indigo-500 hover:bg-indigo-50 transition-colors">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <div className="flex items-center justify-between pt-4 mt-2">
                                <span className="text-sm text-gray-500">
                                    Menampilkan {users.from || 0} - {users.to || 0} dari {users.total} pengguna
                                </span>
                                <div className="flex items-center gap-1">
                                    {users.links.map((link, idx) => (
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
                                                    {role.name === 'Super Admin' && <Shield size={14} className="text-indigo-500" />}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-0.5">{role.users_count} pengguna memiliki role ini</p>
                                            </div>
                                            <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="text-xs font-medium text-gray-700 mb-2">Hak Akses:</div>
                                            {role.permissions.length > 0 ? (
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

                {/* Role Creation Modal */}
                {isRoleModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                            onClick={() => setIsRoleModalOpen(false)}
                        ></div>
                        
                        {/* Modal Content */}
                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {/* Modal Header */}
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

                            {/* Modal Body */}
                            <div className="px-6 py-6 overflow-y-auto bg-gray-50/30">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Role <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: Manajer Operasional" 
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-[#6366f1] focus:border-[#6366f1] shadow-sm bg-white"
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

                            {/* Modal Footer */}
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
                                        // TODO: Implement save to backend
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
