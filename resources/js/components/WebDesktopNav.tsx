import { Link, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import React, { useState } from 'react';

export default function WebDesktopNav() {
    const { auth } = usePage<any>().props;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <nav className="hidden md:block bg-white sticky top-0 z-50 shadow-sm shadow-gray-100">
            <div className="w-full px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href={route('home')} className="flex items-center gap-2">
                    <img src="/logo/logo_app.talaqee.png" alt="Talaqee Logo" className="h-10 w-auto object-contain" />
                </Link>

                <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
                    <Link href={route('home')} className={route().current('home') ? "text-[#7e57c2] border-b-2 border-[#7e57c2] py-4" : "text-gray-600 hover:text-[#7e57c2] transition-colors"}>Beranda</Link>
                    <Link href={route('katalog.index')} className={route().current('katalog.*') ? "text-[#7e57c2] border-b-2 border-[#7e57c2] py-4" : "text-gray-600 hover:text-[#7e57c2] transition-colors"}>Katalog</Link>
                    <Link href={route('videos.index')} className={route().current('videos.*') ? "text-[#7e57c2] border-b-2 border-[#7e57c2] py-4" : "text-gray-600 hover:text-[#7e57c2] transition-colors"}>Video Kajian</Link>
                    <Link href={route('audios.index')} className={route().current('audios.*') ? "text-[#7e57c2] border-b-2 border-[#7e57c2] py-4" : "text-gray-600 hover:text-[#7e57c2] transition-colors"}>Rekaman Audio</Link>
                    <Link href={route('faq.index')} className={route().current('faq.*') ? "text-[#7e57c2] border-b-2 border-[#7e57c2] py-4" : "text-gray-600 hover:text-[#7e57c2] transition-colors"}>FAQ</Link>
                    <Link href={route('refund.policy')} className={route().current('refund.policy') ? "text-[#7e57c2] border-b-2 border-[#7e57c2] py-4" : "text-gray-600 hover:text-[#7e57c2] transition-colors"}>Refund Policy</Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Cari..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 w-48 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-[#7e57c2] focus:ring-1 focus:ring-[#7e57c2] bg-gray-50 transition-all"
                        />
                    </div>
                    
                    {user ? (
                        <Link href={route('dashboard')} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#7e57c2] hover:bg-[#6b48a8] rounded-xl transition-colors shadow-sm shadow-indigo-200">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="px-5 py-2.5 text-sm font-semibold text-[#7e57c2] bg-white border-2 border-[#f3eefe] hover:bg-[#f3eefe] rounded-xl transition-colors">
                                Masuk
                            </Link>
                            <Link href={route('register')} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#7e57c2] hover:bg-[#6b48a8] rounded-xl transition-colors shadow-sm shadow-indigo-200">
                                Daftar Gratis
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
