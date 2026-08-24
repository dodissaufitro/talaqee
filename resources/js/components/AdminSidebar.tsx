import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import * as LucideIcons from 'lucide-react';
import { ChevronDown, BookOpen, Book, LogOut } from 'lucide-react';

interface AdminSidebarProps {
    activeItem: string;
    auth: {
        user: {
            name: string;
            email: string;
        }
    }
}

export const adminNavItems = [
    { name: 'Ke Landing Page', icon: 'Globe', route: 'home' },
    { name: 'Dashboard', icon: 'LayoutDashboard', route: 'admin.dashboard' },
    { name: 'Penjualan', icon: 'ShoppingCart', route: 'admin.sales.index' },
    { name: 'Buku', icon: 'Book', route: 'admin.books.index' },
    { name: 'Kategori', icon: 'Grid', route: 'admin.categories.index' },
    { name: 'Pelanggan', icon: 'Users', route: 'admin.customers.index' },
    { name: 'Transaksi', icon: 'CreditCard', route: 'admin.transactions.index' },
    { name: 'Laporan', icon: 'FileText', route: 'admin.reports.index' },
    { name: 'Stok', icon: 'Box', route: 'admin.stock.index' },
    { name: 'Promosi', icon: 'Megaphone', route: 'admin.promotions.index' },
    { name: 'Pengguna', icon: 'UserCircle', route: 'admin.users.index' },
    { name: 'Video Kajian', icon: 'PlaySquare', route: 'admin.videos.index' },
    { name: 'Rekaman Audio', icon: 'Mic', route: 'admin.setoran.index' },
    { name: 'FAQ', icon: 'HelpCircle', route: 'admin.faqs.index' },
    { name: 'Refund Policy', icon: 'ShieldCheck', route: 'admin.refund-policy.index' },
    { name: 'Pengaturan', icon: 'Settings', route: 'admin.settings.index' },
];

export default function AdminSidebar({ activeItem, auth }: AdminSidebarProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const renderIcon = (iconName: string, active: boolean) => {
        const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Circle;
        return <IconComponent size={20} className={active ? 'text-blue-600' : 'text-gray-400'} />;
    };

    return (
        <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col h-full shrink-0 overflow-y-auto">
            <div className="p-6 flex items-center gap-3">
                <Link href={route('home')} className="block">
                    <img src="/logo/logo_app.talaqee.png" alt="Talaqee Logo" className="h-12 w-auto object-contain" />
                </Link>
            </div>

            <div className="px-4 py-2 space-y-1">
                {adminNavItems.map((item, idx) => {
                    let active = item.name === activeItem; // fallback
                    
                    if (item.route && typeof route !== 'undefined') {
                        if (route().current(item.route)) {
                            active = true;
                        } else if (item.route.endsWith('.index')) {
                            const pattern = item.route.replace('.index', '.*');
                            if (route().current(pattern)) {
                                active = true;
                            }
                        }
                    }

                    return (
                        <Link 
                            key={idx} 
                            href={item.route ? route(item.route) : '#'}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                active 
                                ? 'bg-blue-50 text-blue-600' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {renderIcon(item.icon, active)}
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 mt-auto">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl text-center relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 text-indigo-100 opacity-50">
                        <BookOpen size={80} />
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-indigo-500">
                            <Book size={24} />
                        </div>
                        <h3 className="text-sm font-medium text-gray-800 mb-1">Tingkatkan penjualan toko</h3>
                        <p className="text-xs text-gray-500 mb-4">Kelola toko buku Anda dengan lebih maksimal.</p>
                        <button className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                            Upgrade Sekarang
                        </button>
                    </div>
                </div>

                <div className="relative mt-6">
                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-gray-100 rounded-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] py-2 z-50">
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button" 
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                            >
                                <LogOut size={16} />
                                Keluar
                            </Link>
                        </div>
                    )}
                    <div 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center justify-between cursor-pointer group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.user?.name || 'User')}&background=e2e8f0`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{auth?.user?.name || 'User'}</h4>
                                <p className="text-xs text-gray-500 truncate w-32">{auth?.user?.email || ''}</p>
                            </div>
                        </div>
                        <ChevronDown size={16} className={`text-gray-400 group-hover:text-blue-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>
        </aside>
    );
}
