import { Link, usePage, router } from '@inertiajs/react';
import { 
    Search, ChevronDown, User, Heart, ShieldCheck, LogOut, 
    BookOpen, HelpCircle, FileText, Phone, Coins, Sparkles
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import NotificationBell from '@/components/NotificationBell';

export default function WebDesktopNav() {
    const { auth } = usePage<any>().props;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false);

    const userMenuRef = useRef<HTMLDivElement>(null);
    const infoMenuRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (infoMenuRef.current && !infoMenuRef.current.contains(event.target as Node)) {
                setIsInfoMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.visit(`/katalog?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.visit(route('katalog.index'));
        }
    };

    const isSuperAdminOrEditor = Boolean(
        user?.is_super_admin || 
        (Array.isArray(user?.roles) && (user.roles.includes('super_admin') || user.roles.includes('editor')))
    );

    return (
        <header className="hidden md:block bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-6">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-8 shrink-0">
                        <Link href={route('home')} className="flex items-center gap-3 group">
                            <img 
                                src="/logo/logo_app.talaqee.png" 
                                alt="Talaqee Logo" 
                                className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
                            />
                        </Link>

                        {/* Primary Navigation Links */}
                        <nav className="flex items-center gap-1 lg:gap-2 text-sm font-semibold">
                            <Link 
                                href={route('home')} 
                                className={`px-3.5 py-2 rounded-xl transition-all ${
                                    route().current('home') 
                                        ? 'text-purple-700 bg-purple-50 font-bold' 
                                        : 'text-gray-600 hover:text-purple-700 hover:bg-gray-50'
                                }`}
                            >
                                Beranda
                            </Link>

                            <Link 
                                href={route('katalog.index')} 
                                className={`px-3.5 py-2 rounded-xl transition-all ${
                                    route().current('katalog.*') 
                                        ? 'text-purple-700 bg-purple-50 font-bold' 
                                        : 'text-gray-600 hover:text-purple-700 hover:bg-gray-50'
                                }`}
                            >
                                Katalog Buku
                            </Link>

                            <Link 
                                href={route('videos.index')} 
                                className={`px-3.5 py-2 rounded-xl transition-all ${
                                    route().current('videos.*') 
                                        ? 'text-purple-700 bg-purple-50 font-bold' 
                                        : 'text-gray-600 hover:text-purple-700 hover:bg-gray-50'
                                }`}
                            >
                                Video Kajian
                            </Link>

                            <Link 
                                href={route('audios.index')} 
                                className={`px-3.5 py-2 rounded-xl transition-all ${
                                    route().current('audios.*') 
                                        ? 'text-purple-700 bg-purple-50 font-bold' 
                                        : 'text-gray-600 hover:text-purple-700 hover:bg-gray-50'
                                }`}
                            >
                                Rekaman Audio
                            </Link>

                            <Link 
                                href={route('faq.index')} 
                                className={`px-3.5 py-2 rounded-xl transition-all ${
                                    route().current('faq.*') 
                                        ? 'text-purple-700 bg-purple-50 font-bold' 
                                        : 'text-gray-600 hover:text-purple-700 hover:bg-gray-50'
                                }`}
                            >
                                FAQ
                            </Link>

                            {/* Dropdown Menu for Additional Legal & Info Pages */}
                            <div className="relative" ref={infoMenuRef}>
                                <button
                                    onClick={() => setIsInfoMenuOpen(!isInfoMenuOpen)}
                                    className={`flex items-center gap-1 px-3.5 py-2 rounded-xl transition-all ${
                                        route().current('refund.policy') || route().current('terms') || route().current('kontak')
                                            ? 'text-purple-700 bg-purple-50 font-bold'
                                            : 'text-gray-600 hover:text-purple-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>Info</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isInfoMenuOpen ? 'rotate-180 text-purple-600' : ''}`} />
                                </button>

                                {isInfoMenuOpen && (
                                    <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <Link 
                                            href={route('refund.policy')} 
                                            onClick={() => setIsInfoMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                        >
                                            <FileText className="w-4 h-4 text-purple-600" />
                                            Kebijakan Refund
                                        </Link>
                                        <Link 
                                            href={route('terms')} 
                                            onClick={() => setIsInfoMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                        >
                                            <FileText className="w-4 h-4 text-purple-600" />
                                            Syarat & Ketentuan
                                        </Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Link 
                                            href={route('kontak')} 
                                            onClick={() => setIsInfoMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                        >
                                            <Phone className="w-4 h-4 text-emerald-600" />
                                            Hubungi Kami
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {/* Quick Search Input */}
                        <form onSubmit={handleSearch} className="relative hidden xl:block w-56">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Cari buku atau kajian..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-gray-200 rounded-full focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-gray-50/70 hover:bg-white focus:bg-white transition-all placeholder:text-gray-400"
                            />
                        </form>

                        {user ? (
                            <div className="flex items-center gap-3">
                                {/* Coin Balance Pill */}
                                <Link 
                                    href="/akun/topup" 
                                    className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200/80 px-3.5 py-1.5 rounded-full transition-all group shadow-sm active:scale-95"
                                    title="Klik untuk Top Up Koin"
                                >
                                    <div className="w-5 h-5 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-full flex items-center justify-center text-white text-[11px] font-black shadow-sm group-hover:rotate-12 transition-transform">
                                        C
                                    </div>
                                    <span className="text-xs font-extrabold text-amber-800">
                                        {(user.coin_balance || 0).toLocaleString('id-ID')}
                                    </span>
                                    <span className="text-[10px] font-bold text-amber-600 bg-white/80 px-1.5 py-0.5 rounded-full">
                                        +Top Up
                                    </span>
                                </Link>

                                {/* Notification Bell */}
                                <NotificationBell />

                                {/* User Dropdown */}
                                <div className="relative" ref={userMenuRef}>
                                    <button 
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full hover:bg-gray-100/80 transition-all border border-transparent hover:border-gray-200"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden">
                                            {user.avatar ? (
                                                <img 
                                                    src={user.avatar.startsWith('http') ? user.avatar : `/storage/${user.avatar}`} 
                                                    alt={user.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                user.name ? user.name.charAt(0).toUpperCase() : 'U'
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-gray-800 max-w-[100px] truncate hidden lg:inline-block">
                                            {user.name}
                                        </span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                                                <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                                                <div className="mt-2 flex items-center gap-1.5">
                                                    <div className="w-3.5 h-3.5 bg-amber-400 text-white rounded-full flex items-center justify-center text-[8px] font-black">C</div>
                                                    <span className="text-xs font-bold text-amber-700">Saldo: {(user.coin_balance || 0).toLocaleString('id-ID')} Koin</span>
                                                </div>
                                            </div>

                                            <div className="py-1">
                                                <Link 
                                                    href={route('akun.index')} 
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                                >
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    Akun & Pengaturan Profil
                                                </Link>

                                                <Link 
                                                    href="/akun/topup" 
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                                >
                                                    <Coins className="w-4 h-4 text-amber-500" />
                                                    Top Up Koin Talaqee
                                                </Link>

                                                {isSuperAdminOrEditor && (
                                                    <Link 
                                                        href={route('admin.dashboard')} 
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                        className="flex items-center justify-between px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50/70 hover:bg-purple-100 transition-colors"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                                                            Dashboard Admin
                                                        </span>
                                                        <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-bold">Admin</span>
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="border-t border-gray-100 my-1"></div>

                                            <Link 
                                                href={route('logout')} 
                                                method="post" 
                                                as="button" 
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <LogOut className="w-4 h-4 text-red-500" />
                                                Keluar dari Akun
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2.5">
                                <Link 
                                    href={route('login')} 
                                    className="px-4 py-2 text-xs font-bold text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all"
                                >
                                    Masuk
                                </Link>
                                <Link 
                                    href={route('register')} 
                                    className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl transition-all shadow-md shadow-purple-500/20 active:scale-95"
                                >
                                    Daftar Gratis
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
