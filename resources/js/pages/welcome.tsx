import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import {
    Search, Star, ChevronRight,
    CheckCircle2, Clock, MapPin, Wallet, ArrowRight,
    BookOpen, Heart, Activity, Globe, Users, Smile, Shield,
    Bell, List, PlaySquare, Headphones, Play, Home, LayoutGrid, CircleUserRound, Library, MoreVertical, Bookmark, Filter, Crown, ChevronLeft, ShoppingCart
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import JadwalSholat from '@/components/JadwalSholat';

interface Book {
    id: number;
    title: string;
    description: string;
    cover: string;
    price: number;
    coins_price: number;
    average_rating?: number;
    reviews?: any[];
    author?: {
        name: string;
    };
    category?: {
        name: string;
    };
}

interface Video {
    id: number;
    title: string;
    duration: number;
    thumbnail: string;
    author?: { name: string };
}

interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
    color?: string | null;
}

interface Audio {
    id: number;
    title: string;
    duration: number;
    cover?: string;
    author?: { name: string };
}

interface TerakhirDibaca {
    title: string;
    author: string;
    cover: string;
    progress_percent: number;
    chapter_info: string;
}

interface Banner {
    id: number;
    title: string | null;
    subtitle: string | null;
    button_text: string | null;
    image_path: string;
    link_url: string | null;
    background_color: string;
}

interface WelcomeProps {
    categories: Category[];
    popularBooks: Book[];
    koleksiBuku?: Book[];
    koleksiVideo?: Video[];
    koleksiAudio?: Audio[];
    banners?: Banner[];
    terakhirDibaca?: TerakhirDibaca | null;
}

export default function Welcome({ categories, popularBooks, koleksiBuku = [], koleksiVideo = [], koleksiAudio = [], banners = [], terakhirDibaca = null }: WelcomeProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Map category name to icon for a better visual representation if icon string is missing
    const getCategoryIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('aqidah')) return <Shield size={20} />;
        if (lowerName.includes('fiqih')) return <BookOpen size={20} />;
        if (lowerName.includes('tafsir')) return <BookOpen size={20} />;
        if (lowerName.includes('hadits')) return <BookOpen size={20} />;
        if (lowerName.includes('akhlak')) return <Heart size={20} />;
        if (lowerName.includes('sejarah')) return <Globe size={20} />;
        if (lowerName.includes('motivasi')) return <Star size={20} />;
        if (lowerName.includes('keluarga')) return <Users size={20} />;
        if (lowerName.includes('anak')) return <Smile size={20} />;
        return <BookOpen size={20} />;
    };

    return (
        <>
            <Head title="Talaqee - Katalog Islami" />
            <div className="hidden md:block min-h-screen bg-gray-50 font-sans selection:bg-[#7e57c2] selection:text-white">

                {/* Top Navigation */}
                <nav className="bg-white sticky top-0 z-50">
                    <div className="w-full px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
                        {/* Logo */}
                        <Link href={route('home')} className="flex items-center gap-2">
                            <img src="/logo/logo_app.talaqee.png" alt="Talaqee Logo" className="h-10 w-auto object-contain" />
                        </Link>

                        <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
                            <Link href={route('home')} className="text-gray-600 hover:text-[#7e57c2] transition-colors">Beranda</Link>
                            <Link href={route('katalog.index')} className="text-[#7e57c2] border-b-2 border-[#7e57c2] py-4">Katalog</Link>
                            <Link href={route('videos.index')} className="text-gray-600 hover:text-[#7e57c2] transition-colors">Video Kajian</Link>
                            <Link href={route('audios.index')} className="text-gray-600 hover:text-[#7e57c2] transition-colors">Rekaman Audio</Link>
                            <Link href="#" className="text-gray-600 hover:text-[#7e57c2] transition-colors">Tentang Kami</Link>
                            <Link href={route('faq.index')} className="text-gray-600 hover:text-[#7e57c2] transition-colors">FAQ</Link>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            <button className="text-gray-500 hover:text-gray-900 transition-colors p-2">
                                <Search size={20} />
                            </button>
                            <Link href={route('login')} className="px-5 py-2.5 text-sm font-semibold text-[#7e57c2] bg-white border-2 border-[#f3eefe] hover:bg-[#f3eefe] rounded-xl transition-colors">
                                Masuk
                            </Link>
                            <Link href={route('register')} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#7e57c2] hover:bg-[#6b48a8] rounded-xl transition-colors shadow-sm shadow-indigo-200">
                                Daftar Gratis
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative bg-white overflow-hidden">
                    {/* Background Image / Pattern */}
                    <div className="absolute top-0 right-0 w-3/4 h-full hidden md:block">
                        {/* Gradient mask to blend the image seamlessly to white on the left */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10"></div>
                        <img src="/images/mosque_hero.png" alt="Islamic Mosque Background" className="w-full h-full object-cover object-left-top opacity-90" />
                    </div>

                    <div className="w-full px-6 md:px-12 lg:px-20 pt-20 pb-28 relative z-20 flex flex-col md:flex-row items-center">
                        <div className="w-full md:w-3/5 lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f3eefe] text-[#7e57c2] text-xs font-semibold mb-6">
                                Katalog Islami Terlengkap
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-6">
                                Temukan Ribuan Konten<br />
                                Berkualitas untuk<br />
                                <span className="text-[#7e57c2]">Perjalanan Ilmu Anda</span>
                            </h1>
                            <p className="text-gray-600 text-lg mb-10 max-w-lg leading-relaxed">
                                Buku, video, audio, dan berbagai konten islami pilihan untuk menambah ilmu dan mendekatkan diri kepada Allah.
                            </p>

                            {/* Search Bar */}
                            <div className="relative bg-white p-2 rounded-2xl shadow-lg shadow-gray-200/50 flex items-center border border-gray-100 mb-8 max-w-2xl">
                                <div className="pl-4 pr-3 text-gray-400">
                                    <Search size={22} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari buku, video, audio, atau topik kajian..."
                                    className="w-full border-none focus:ring-0 text-gray-700 bg-transparent py-3 placeholder:text-gray-400 text-base"
                                />
                                <button className="bg-[#7e57c2] hover:bg-[#6b48a8] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shrink-0">
                                    Cari
                                </button>
                            </div>

                            {/* Features List */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="text-[#7e57c2]"><CheckCircle2 size={16} /></div>
                                    Konten Terpercaya
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-[#7e57c2]"><Clock size={16} /></div>
                                    Update Setiap Hari
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-[#7e57c2]"><MapPin size={16} /></div>
                                    Akses di Mana Saja
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-[#7e57c2]"><Wallet size={16} /></div>
                                    Gratis & Berbayar
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Floating Container */}
                <div className="w-full px-6 md:px-12 lg:px-20 -mt-12 relative z-30 mb-16">
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-4 border border-gray-100 flex items-center justify-between overflow-x-auto gap-4 scrollbar-hide">

                        {/* Active All item */}
                        <div className="flex flex-col items-center gap-3 min-w-[80px] cursor-pointer group">
                            <div className="w-14 h-14 rounded-full bg-[#f3eefe] text-[#7e57c2] flex items-center justify-center transition-transform group-hover:scale-105">
                                <Activity size={24} />
                            </div>
                            <span className="text-xs font-bold text-[#7e57c2] border-b-2 border-[#7e57c2] pb-1">Semua</span>
                        </div>

                        {categories.slice(0, 9).map((cat, idx) => {
                            const Icon = getCategoryIcon(cat.name);
                            const colors = [
                                'bg-emerald-50 text-emerald-500', 'bg-blue-50 text-blue-500',
                                'bg-orange-50 text-orange-500', 'bg-teal-50 text-teal-500',
                                'bg-rose-50 text-rose-500', 'bg-indigo-50 text-indigo-500',
                                'bg-amber-50 text-amber-500', 'bg-sky-50 text-sky-500', 'bg-fuchsia-50 text-fuchsia-500'
                            ];
                            const color = colors[idx % colors.length];

                            return (
                                <div key={cat.id} className="flex flex-col items-center gap-3 min-w-[80px] cursor-pointer group">
                                    <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center transition-transform group-hover:scale-105`}>
                                        {Icon}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900">{cat.name}</span>
                                </div>
                            )
                        })}

                        {/* View All */}
                        <div className="flex flex-col items-center gap-3 min-w-[80px] cursor-pointer group">
                            <div className="w-14 h-14 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center transition-transform group-hover:scale-105">
                                <ArrowRight size={24} />
                            </div>
                            <span className="text-xs font-semibold text-[#7e57c2]">Lihat Semua</span>
                        </div>
                    </div>
                </div>

                {/* Popular Books Section */}
                <div className="w-full px-6 md:px-12 lg:px-20 pb-24">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Koleksi Semua Buku</h2>
                        <Link href="#" className="flex items-center gap-1 text-sm font-semibold text-[#7e57c2] hover:text-[#6b48a8] transition-colors">
                            Lihat Semua Buku <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {popularBooks.map((book, idx) => (
                                <Link href={`/buku/${book.id}`} key={idx} className="group cursor-pointer block">
                                    {/* Book Cover Container */}
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative bg-gray-100 shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                                        <img
                                            src={book.cover ? (book.cover.startsWith('http') || book.cover.startsWith('/') ? book.cover : `/storage/${book.cover}`) : "/images/placeholders/book-cover.svg"}
                                            alt={book.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {/* Subtle overlay on hover */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>

                                    {/* Book Info */}
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight mb-1 group-hover:text-[#7e57c2] transition-colors line-clamp-1" title={book.title}>
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-3">{book.author?.name || 'Penulis Tidak Diketahui'}</p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                                                <Star size={14} className="fill-amber-500" />
                                                <span>4.8 <span className="text-gray-400 font-normal">(1.245)</span></span>
                                            </div>

                                            {/* Price / Free Badge */}
                                            {book.price === 0 || !book.price ? (
                                                <div className="px-2.5 py-1 bg-[#f3eefe] text-[#7e57c2] text-xs font-bold rounded-lg">
                                                    Gratis
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-lg border border-amber-100">
                                                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-white text-[8px]">
                                                        C
                                                    </div>
                                                    {book.coins_price || 10}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            {/* Fallback if no books to show layout nicely */}
                            {popularBooks.length === 0 && Array(5).fill(null).map((_, idx) => (
                                <div key={`empty-${idx}`} className="group cursor-pointer">
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative bg-gray-100 border border-gray-100 flex items-center justify-center">
                                        <BookOpen size={48} className="text-gray-300" />
                                    </div>
                                    <div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-100 rounded w-1/2 mb-3"></div>
                                        <div className="flex items-center justify-between">
                                            <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                                            <div className="h-5 bg-gray-100 rounded-lg w-1/4"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Next Button Arrow (Floating right) */}
                        <button className="absolute -right-5 top-[40%] -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#7e57c2] hover:bg-gray-50 transition-colors z-10 hidden lg:flex">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── MOBILE VIEW (BookStore Beranda) ─── */}
            <div className="block md:hidden bg-white min-h-screen pb-24 font-sans selection:bg-blue-600 selection:text-white">

                {/* Header Profile */}
                <div className="px-5 pt-6 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-sm border-2 border-white overflow-hidden">
                            {user && user.avatar ? (
                                <img src={user.avatar.startsWith('http') ? user.avatar : `/storage/${user.avatar}`} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <CircleUserRound className="w-6 h-6 stroke-[1.5]" />
                            )}
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-500 font-medium mb-0.5">Assalamualaikum,</p>
                            <h1 className="text-[16px] font-extrabold text-gray-900 leading-tight line-clamp-1">{user ? user.name : 'Sahabat Ilmu'}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {user && (
                            <Link href="/akun/topup" className="flex items-center gap-1.5 bg-[#FFFBEB] border border-[#FEF3C7] px-2.5 py-1.5 rounded-full shadow-sm hover:bg-yellow-50 transition-colors">
                                <div className="w-4 h-4 bg-[#F59E0B] rounded-full flex items-center justify-center text-white text-[9px] font-bold">C</div>
                                <span className="text-[11px] font-bold text-[#D97706]">{user.coin_balance || 0}</span>
                            </Link>
                        )}
                        <NotificationBell />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-5 mb-5">
                    <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari buku, video, audio..."
                            className="flex-1 bg-transparent border-none text-[13px] font-medium placeholder:text-gray-400 focus:ring-0 p-0 text-gray-700 outline-none"
                        />
                    </div>
                </div>



                {/* Jadwal Sholat */}
                <JadwalSholat />

                {/* Buku Rekomendasi */}
                <div className="mb-8">
                    <div className="px-5 flex items-center justify-between mb-4">
                        <h3 className="text-[15px] font-bold text-gray-900">Rekomendasi Buku</h3>
                        <Link href={route('katalog.index')} className="text-[11px] font-bold text-blue-600 flex items-center gap-0.5">
                            Lihat Katalog <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="px-5 grid grid-cols-4 gap-2.5 pb-2">
                        {koleksiBuku.length > 0 ? koleksiBuku.slice(0, 4).map((book) => (
                            <Link href={`/buku/${book.id}`} key={book.id} className="flex flex-col w-full block">
                                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-2 border border-gray-100 shadow-sm relative">
                                    <img src={book.cover ? (book.cover.startsWith('http') || book.cover.startsWith('/') ? book.cover : `/storage/${book.cover}`) : "/images/placeholders/book-cover.svg"} alt={book.title} className="w-full h-full object-cover" />
                                    {book.coins_price > 0 && (
                                        <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm rounded-full px-1 py-0.5 flex items-center gap-0.5 shadow-sm">
                                            <div className="w-2 h-2 bg-[#FBBF24] rounded-full flex items-center justify-center text-white text-[4px] font-bold">C</div>
                                            <span className="text-[7px] font-bold text-gray-900">{book.coins_price}</span>
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-bold text-[9px] text-gray-900 leading-[1.3] mb-1 line-clamp-2 min-h-[24px]">{book.title}</h4>
                                <p className="text-[8px] font-medium text-gray-500 truncate">{book.author?.name || 'Penulis'}</p>
                            </Link>
                        )) : (
                            <div className="col-span-4 w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-center text-gray-500 text-[11px]">
                                Belum ada buku rekomendasi
                            </div>
                        )}
                    </div>
                </div>

                {/* Video Kajian Terbaru */}
                <div className="mb-8">
                    <div className="px-5 flex items-center justify-between mb-4">
                        <h3 className="text-[15px] font-bold text-gray-900">Video Kajian Terbaru</h3>
                        <Link href={route('videos.index')} className="text-[11px] font-bold text-blue-600 flex items-center gap-0.5">
                            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="px-5 grid grid-cols-3 gap-2 pb-2">
                        {koleksiVideo.length > 0 ? koleksiVideo.slice(0, 3).map((video) => (
                            <Link href={`/videos/${video.id}`} key={video.id} className="flex flex-col group block w-full">
                                <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative mb-1.5 shadow-sm border border-gray-100">
                                    <img src={video.thumbnail ? (video.thumbnail.startsWith('http') || video.thumbnail.startsWith('/') ? video.thumbnail : `/storage/${video.thumbnail}`) : "/images/placeholders/video-thumb.jpg"} alt={video.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                        <div className="w-6 h-6 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                            <Play className="w-2.5 h-2.5 ml-0.5 fill-current" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm text-white text-[7px] font-bold px-1 py-0.5 rounded">
                                        {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                                    </div>
                                </div>
                                <h4 className="font-bold text-[9px] text-gray-900 leading-[1.3] mb-0.5 line-clamp-2">{video.title}</h4>
                                <p className="text-[7px] font-medium text-gray-500 truncate">{video.author?.name || 'Ustadz'}</p>
                            </Link>
                        )) : (
                            <div className="col-span-3 w-full bg-gray-50 border border-gray-100 rounded-xl p-6 text-center text-gray-500 text-[12px]">
                                Belum ada video kajian
                            </div>
                        )}
                    </div>
                </div>

                {/* Koleksi Buku */}
                <div className="mb-10">
                    <div className="px-5 flex items-center justify-between mb-4">
                        <h3 className="text-[15px] font-bold text-gray-900">Koleksi Buku</h3>
                        <Link href={route('katalog.index')} className="text-[11px] font-bold text-blue-600 flex items-center gap-0.5">
                            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    
                    <div className="px-5 grid grid-cols-5 gap-x-2 gap-y-4">
                        {koleksiBuku.length > 0 ? koleksiBuku.slice(0, 15).map((book) => (
                            <Link href={`/buku/${book.id}`} key={book.id} className="flex flex-col w-full block">
                                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-2 border border-gray-100 shadow-sm relative">
                                    <img src={book.cover ? (book.cover.startsWith('http') || book.cover.startsWith('/') ? book.cover : `/storage/${book.cover}`) : "/images/placeholders/book-cover.svg"} alt={book.title} className="w-full h-full object-cover" />
                                    {book.coins_price > 0 && (
                                        <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm rounded-full px-1 py-0.5 flex items-center gap-0.5 shadow-sm">
                                            <div className="w-2 h-2 bg-[#FBBF24] rounded-full flex items-center justify-center text-white text-[4px] font-bold">C</div>
                                            <span className="text-[7px] font-bold text-gray-900">{book.coins_price}</span>
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-bold text-[9px] text-gray-900 leading-[1.3] mb-1 line-clamp-2 min-h-[24px]">{book.title}</h4>
                                <p className="text-[8px] font-medium text-gray-500 truncate">{book.author?.name || 'Penulis'}</p>
                            </Link>
                        )) : (
                            <div className="col-span-3 w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-center text-gray-500 text-[11px]">
                                Belum ada buku
                            </div>
                        )}
                    </div>
                </div>




                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F1F5F9] md:max-w-md md:mx-auto z-50">
                    <div className="flex justify-around items-center h-[70px] pb-2">
                        {[
                            { id: 'home', label: 'Beranda', icon: Home, active: true, route: '/' },
                            { id: 'katalog', label: 'Katalog', icon: LayoutGrid, route: '/katalog' },
                            { id: 'video', label: 'Video Saya', icon: PlaySquare, route: '/videos' },
                            { id: 'rekaman', label: 'Rekaman', icon: Headphones, route: '/audios' },
                            { id: 'akun', label: 'Akun', icon: CircleUserRound, route: '/akun' }
                        ].map((item) => (
                            <Link prefetch={['mount', 'hover']} href={item.route} key={item.id} className="flex flex-col items-center justify-center w-16 gap-1 relative mt-1">
                                {item.active ? (
                                    <>
                                        <div className="w-10 h-10 flex items-center justify-center">
                                            <item.icon className="w-6 h-6 text-[#5C5AE6] stroke-[2]" />
                                        </div>
                                        <span className="text-[10px] font-bold text-[#5C5AE6]">{item.label}</span>
                                        <div className="absolute -bottom-2 w-[16px] h-[3px] bg-[#5C5AE6] rounded-full"></div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 flex items-center justify-center">
                                            <item.icon className="w-6 h-6 text-[#94A3B8] stroke-[1.5]" />
                                        </div>
                                        <span className="text-[10px] font-medium text-[#64748B]">{item.label}</span>
                                    </>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}} />
            </div>
        </>
    );
}
