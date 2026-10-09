import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import {
    Search, Star, ChevronRight, ChevronLeft,
    CheckCircle2, Clock, MapPin, Wallet, ArrowRight,
    BookOpen, Heart, Activity, Globe, Users, Smile, Shield, ShieldCheck,
    Bell, List, PlaySquare, Headphones, Play, Home, LayoutGrid, 
    CircleUserRound, Library, Bookmark, Filter, Crown, Sparkles, 
    Coins, Zap, Compass, Feather, ArrowUpRight, Loader2
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import JadwalSholat from '@/components/JadwalSholat';
import WebDesktopNav from '@/components/WebDesktopNav';

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
        id?: number;
        name: string;
    };
    is_popular?: boolean;
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

export default function Welcome({ 
    categories = [], 
    popularBooks = [], 
    koleksiBuku = [], 
    koleksiVideo = [], 
    koleksiAudio = [], 
    banners = [], 
    terakhirDibaca = null 
}: WelcomeProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [bookTab, setBookTab] = useState<'all' | 'popular' | 'latest'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    // Auto rotate banners if any
    useEffect(() => {
        if (!banners || banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    // Handle search submit from hero
    const handleHeroSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.visit(`/katalog?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.visit(route('katalog.index'));
        }
    };

    // Mobile Pagination & Loading Management for Koleksi Buku Populer (Shopee-Style Grid)
    const [visibleMobileBooksCount, setVisibleMobileBooksCount] = useState(6);
    const [isLoadingMoreMobileBooks, setIsLoadingMoreMobileBooks] = useState(false);
    const mobileLoadMoreRef = useRef<HTMLDivElement | null>(null);

    const allMobilePopularBooks = (koleksiBuku && koleksiBuku.length > 0) ? koleksiBuku : popularBooks;

    const handleLoadMoreMobileBooks = () => {
        if (isLoadingMoreMobileBooks || visibleMobileBooksCount >= allMobilePopularBooks.length) return;
        setIsLoadingMoreMobileBooks(true);
        setTimeout(() => {
            setVisibleMobileBooksCount((prev) => Math.min(prev + 6, allMobilePopularBooks.length));
            setIsLoadingMoreMobileBooks(false);
        }, 500);
    };

    useEffect(() => {
        if (!mobileLoadMoreRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoadingMoreMobileBooks && visibleMobileBooksCount < allMobilePopularBooks.length) {
                    handleLoadMoreMobileBooks();
                }
            },
            { threshold: 0.1, rootMargin: '120px' }
        );
        observer.observe(mobileLoadMoreRef.current);
        return () => observer.disconnect();
    }, [isLoadingMoreMobileBooks, visibleMobileBooksCount, allMobilePopularBooks.length]);

    // Filter books based on active tab and category
    const displayedBooks = React.useMemo(() => {
        let list = koleksiBuku.length > 0 ? koleksiBuku : popularBooks;
        
        if (bookTab === 'popular') {
            list = popularBooks.length > 0 ? popularBooks : list;
        } else if (bookTab === 'latest') {
            list = [...list].reverse();
        }

        if (selectedCategory) {
            list = list.filter(b => b.category?.name?.toLowerCase() === selectedCategory.toLowerCase());
        }

        return list.slice(0, 10);
    }, [koleksiBuku, popularBooks, bookTab, selectedCategory]);

    // Map category name to icon for visual representation
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
        if (lowerName.includes('fiksi')) return <Feather size={20} />;
        return <BookOpen size={20} />;
    };

    const getBookCoverUrl = (cover?: string) => {
        if (!cover) return "/images/placeholders/book-cover.svg";
        if (cover.startsWith('http://') || cover.startsWith('https://') || cover.startsWith('/')) {
            return cover;
        }
        return `/storage/${cover}`;
    };

    const getVideoThumbnailUrl = (thumb?: string) => {
        if (!thumb) return "/images/placeholders/video-thumb.jpg";
        if (thumb.startsWith('http://') || thumb.startsWith('https://') || thumb.startsWith('/')) {
            return thumb;
        }
        return `/storage/${thumb}`;
    };

    return (
        <>
            <Head title="Talaqee - Platform Belajar Al-Qur'an & Literasi Islami Modern" />

            {/* ══════════════════════════════════════════════════════════════
                DESKTOP WEB VERSION (md: and above)
            ══════════════════════════════════════════════════════════════ */}
            <div className="hidden md:block min-h-screen bg-[#F8FAFC] font-sans selection:bg-purple-100 selection:text-purple-900">

                {/* Top Desktop Navigation */}
                <WebDesktopNav />

                {/* ─── HERO SECTION ─── */}
                <section className="relative bg-white border-b border-gray-100 overflow-hidden">
                    {/* Background Islamic Architecture Pattern / Glow */}
                    <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none hidden lg:block opacity-30 select-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent z-10"></div>
                        <img 
                            src="/images/mosque_hero.png" 
                            alt="Mosque Silhouette" 
                            className="w-full h-full object-cover object-left-top" 
                        />
                    </div>
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl -z-10"></div>

                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 relative z-20">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            
                            {/* Left Text & Search */}
                            <div className="lg:col-span-7">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100/80 text-purple-700 text-xs font-bold mb-6 shadow-sm">
                                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                    <span>Perpustakaan & Pembelajaran Islami Digital</span>
                                </div>

                                <h1 className="text-4xl lg:text-[50px] font-black text-gray-900 leading-[1.18] tracking-tight mb-5">
                                    Tingkatkan Kualitas Ibadah & Literasi dengan{' '}
                                    <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                                        Konten Pilihan
                                    </span>
                                </h1>

                                <p className="text-gray-600 text-base lg:text-lg mb-8 max-w-xl leading-relaxed">
                                    Akses ribuan buku digital, video kajian tematik, audio talaqqi Al-Qur'an, dan bimbingan langsung dalam satu genggaman.
                                </p>

                                {/* Search Bar */}
                                <form 
                                    onSubmit={handleHeroSearch}
                                    className="bg-white p-2 rounded-2xl shadow-xl shadow-purple-900/5 border border-gray-200/80 flex items-center mb-6 max-w-xl transition-all focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-100"
                                >
                                    <div className="pl-4 pr-3 text-gray-400">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari judul buku, ustadz, atau topik kajian..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full border-none focus:ring-0 text-gray-800 bg-transparent py-2.5 placeholder:text-gray-400 text-sm font-medium outline-none"
                                    />
                                    <button 
                                        type="submit"
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-7 py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-purple-600/20 shrink-0 active:scale-95"
                                    >
                                        Cari
                                    </button>
                                </form>

                                {/* Quick Keywords */}
                                <div className="flex flex-wrap items-center gap-2 mb-8">
                                    <span className="text-xs font-bold text-gray-400">Topik Populer:</span>
                                    {['Tafsir', 'Fiqih Sholat', 'Talaqqi', 'Aqidah', 'Sirah'].map((tag) => (
                                        <Link
                                            key={tag}
                                            href={`/katalog?q=${encodeURIComponent(tag)}`}
                                            className="text-xs font-semibold px-2.5 py-1 bg-gray-100 hover:bg-purple-50 hover:text-purple-700 text-gray-600 rounded-lg transition-colors"
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>

                                {/* Trust Value Badges */}
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 max-w-xl">
                                    <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-700">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span>Shahih & Terverifikasi</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-700">
                                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            <Clock size={16} />
                                        </div>
                                        <span>Akses Tanpa Batas</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-700">
                                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                            <Wallet size={16} />
                                        </div>
                                        <span>Gratis & Koin</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Highlight Card Showcase */}
                            <div className="lg:col-span-5 flex flex-col gap-4">
                                {terakhirDibaca ? (
                                    /* Continue Reading Card if User has reading history */
                                    <div className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden border border-purple-800/40">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                        
                                        <div className="flex items-center justify-between mb-4 relative z-10">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-purple-200">
                                                <Clock className="w-3.5 h-3.5" /> Lanjutkan Membaca
                                            </span>
                                            <span className="text-xs font-semibold text-purple-300">
                                                {terakhirDibaca.progress_percent}% Selesai
                                            </span>
                                        </div>

                                        <div className="flex gap-4 items-center mb-5 relative z-10">
                                            <div className="w-20 aspect-[3/4] rounded-xl overflow-hidden bg-white/10 shrink-0 shadow-lg border border-white/20">
                                                <img 
                                                    src={getBookCoverUrl(terakhirDibaca.cover)} 
                                                    alt={terakhirDibaca.title} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-extrabold text-base text-white leading-snug line-clamp-2 mb-1">
                                                    {terakhirDibaca.title}
                                                </h3>
                                                <p className="text-xs text-purple-200/80 mb-2 truncate">
                                                    {terakhirDibaca.author}
                                                </p>
                                                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-1">
                                                    <div 
                                                        className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                                                        style={{ width: `${terakhirDibaca.progress_percent}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[11px] text-purple-300 font-medium">
                                                    {terakhirDibaca.chapter_info}
                                                </span>
                                            </div>
                                        </div>

                                        <Link 
                                            href={sessionStorage.getItem('last_book_url') || route('katalog.index')}
                                            className="w-full py-3 bg-white hover:bg-gray-100 text-purple-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                                        >
                                            <span>Lanjutkan Sekarang</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ) : (
                                    /* Featured Spotlight Card if no reading progress */
                                    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-7 text-white shadow-2xl relative overflow-hidden border border-purple-700/30">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                        
                                        <div className="flex items-center justify-between mb-5 relative z-10">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                                <Crown className="w-3.5 h-3.5" /> Buku Pilihan Pekan Ini
                                            </span>
                                            <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                                                <Star size={14} className="fill-amber-400" /> 4.9 (1.8k)
                                            </span>
                                        </div>

                                        <div className="flex gap-5 items-center mb-6 relative z-10">
                                            <div className="w-24 aspect-[3/4] rounded-xl overflow-hidden bg-white/10 shrink-0 shadow-2xl border border-white/20 transform rotate-1 hover:rotate-0 transition-transform">
                                                <img 
                                                    src={getBookCoverUrl(popularBooks[0]?.cover)} 
                                                    alt="Buku Rekomendasi" 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-extrabold text-lg text-white leading-tight line-clamp-2 mb-1.5">
                                                    {popularBooks[0]?.title || 'Tafsir & Tadabbur Al-Qur\'an'}
                                                </h3>
                                                <p className="text-xs text-purple-200/80 mb-3 truncate">
                                                    {popularBooks[0]?.author?.name || 'Kompilasi Ulama Terpercaya'}
                                                </p>
                                                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-purple-200">
                                                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>{popularBooks[0]?.coins_price ? `${popularBooks[0].coins_price} Koin` : 'Tersedia Lengkap'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Link 
                                            href={popularBooks[0]?.id ? `/buku/${popularBooks[0].id}` : route('katalog.index')}
                                            className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                                        >
                                            <span>Mulai Membaca Sekarang</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}

                                {/* Top Up Koin Quick Card */}
                                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between gap-4 hover:border-purple-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm shadow-inner shrink-0">
                                            C
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-900">Saldo Koin Anda</h4>
                                            <p className="text-sm font-extrabold text-amber-600">
                                                {user ? (user.coin_balance || 0).toLocaleString('id-ID') : 0} Koin
                                            </p>
                                        </div>
                                    </div>
                                    <Link 
                                        href="/akun/topup" 
                                        className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                                    >
                                        <span>Top Up</span>
                                        <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ─── BANNER CAROUSEL (DESKTOP) ─── */}
                {banners && banners.length > 0 && (
                    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                        <div className="relative rounded-3xl overflow-hidden shadow-md bg-gradient-to-r from-purple-800 to-indigo-900 text-white min-h-[160px] flex items-center">
                            {banners.map((banner, idx) => (
                                <div 
                                    key={banner.id}
                                    className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-between px-10 py-6 ${
                                        idx === currentBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                    }`}
                                    style={{ backgroundColor: banner.background_color || undefined }}
                                >
                                    <div className="max-w-xl z-10">
                                        {banner.subtitle && (
                                            <span className="text-xs font-bold uppercase tracking-wider text-purple-200 mb-1.5 block">
                                                {banner.subtitle}
                                            </span>
                                        )}
                                        <h3 className="text-2xl lg:text-3xl font-black mb-2 text-white">
                                            {banner.title || 'Promo Menarik Talaqee'}
                                        </h3>
                                        {banner.button_text && (
                                            <Link 
                                                href={banner.link_url || route('katalog.index')}
                                                className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-white text-purple-900 hover:bg-purple-50 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
                                            >
                                                <span>{banner.button_text}</span>
                                                <ArrowUpRight size={16} />
                                            </Link>
                                        )}
                                    </div>

                                    {banner.image_path && (
                                        <div className="h-32 w-48 shrink-0 rounded-2xl overflow-hidden shadow-lg border border-white/20 hidden md:block">
                                            <img 
                                                src={banner.image_path.startsWith('http') ? banner.image_path : `/storage/${banner.image_path}`} 
                                                alt="Banner" 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Carousel Dots */}
                            {banners.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                                    {banners.map((_, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setCurrentBannerIndex(i)}
                                            className={`h-2 rounded-full transition-all ${
                                                i === currentBannerIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ─── KATEGORI UNGGULAN (INTERACTIVE PILLS) ─── */}
                <section className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div>
                                <h3 className="text-base font-extrabold text-gray-900">Eksplorasi Berdasarkan Kategori</h3>
                                <p className="text-xs text-gray-500">Pilih topik pembahasan untuk memfilter buku di bawah</p>
                            </div>
                            <Link 
                                href={route('katalog.index')}
                                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                            >
                                <span>Semua Kategori</span>
                                <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {/* "Semua" pill */}
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs shrink-0 transition-all ${
                                    selectedCategory === null 
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' 
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
                                }`}
                            >
                                <Activity size={16} />
                                <span>Semua Topik</span>
                            </button>

                            {categories.map((cat, idx) => {
                                const isSelected = selectedCategory === cat.name;
                                const Icon = getCategoryIcon(cat.name);

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs shrink-0 transition-all ${
                                            isSelected 
                                                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' 
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
                                        }`}
                                    >
                                        <span className={isSelected ? 'text-white' : 'text-purple-600'}>
                                            {Icon}
                                        </span>
                                        <span>{cat.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ─── KOLEKSI BUKU UTAMA (GRID BUKU DENGAN TABS) ─── */}
                <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                    {selectedCategory ? `Buku Kategori: ${selectedCategory}` : 'Koleksi Buku Pilihan'}
                                </h2>
                                {selectedCategory && (
                                    <button 
                                        onClick={() => setSelectedCategory(null)}
                                        className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full hover:bg-red-100 transition-colors"
                                    >
                                        Reset Filter ×
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">
                                Beragam judul buku islami pilihan dari penulis dan penerbit terpercaya
                            </p>
                        </div>

                        {/* Tabs Filter */}
                        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-gray-200/80 shadow-sm shrink-0">
                            <button
                                onClick={() => setBookTab('all')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    bookTab === 'all' 
                                        ? 'bg-purple-600 text-white shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => setBookTab('popular')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    bookTab === 'popular' 
                                        ? 'bg-purple-600 text-white shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Terpopuler
                            </button>
                            <button
                                onClick={() => setBookTab('latest')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    bookTab === 'latest' 
                                        ? 'bg-purple-600 text-white shadow-sm' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Terbaru
                            </button>
                            <Link 
                                href={route('katalog.index')}
                                className="px-3 py-2 text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 border-l border-gray-100 pl-3"
                            >
                                <span>Lihat Semua</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Book Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {displayedBooks.map((book) => (
                            <Link 
                                href={`/buku/${book.id}`} 
                                key={book.id} 
                                className="group flex flex-col bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative"
                            >
                                {/* Cover Container */}
                                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-3 relative shadow-inner border border-gray-50">
                                    <img
                                        src={getBookCoverUrl(book.cover)}
                                        alt={book.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    
                                    {/* Price Badge */}
                                    {book.coins_price > 0 ? (
                                        <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1 shadow-md border border-amber-200">
                                            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-white text-[8px] font-black">
                                                C
                                            </div>
                                            <span className="text-[10px] font-extrabold text-amber-800">
                                                {book.coins_price}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="absolute top-2.5 right-2.5 bg-emerald-500/95 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                                            Gratis
                                        </div>
                                    )}

                                    {/* Category tag */}
                                    {book.category?.name && (
                                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                                            {book.category.name}
                                        </div>
                                    )}
                                </div>

                                {/* Content Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 
                                            className="font-bold text-sm text-gray-900 leading-snug mb-1 group-hover:text-purple-700 transition-colors line-clamp-2 min-h-[2.5rem]" 
                                            title={book.title}
                                        >
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-2 truncate">
                                            {book.author?.name || 'Penulis Tidak Diketahui'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                                            <Star size={13} className="fill-amber-400 text-amber-400" />
                                            <span>4.8</span>
                                        </div>
                                        <span className="text-[11px] font-bold text-purple-600 group-hover:underline flex items-center gap-0.5">
                                            Baca <ChevronRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {displayedBooks.length === 0 && (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h4 className="font-bold text-gray-800 text-base mb-1">Tidak Ada Buku</h4>
                            <p className="text-xs text-gray-500 mb-4">Belum ada buku untuk kategori yang dipilih.</p>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors"
                            >
                                Tampilkan Semua Buku
                            </button>
                        </div>
                    )}
                </section>

                {/* ─── VIDEO KAJIAN SECTION (DESKTOP) ─── */}
                {koleksiVideo && koleksiVideo.length > 0 && (
                    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Video Kajian Pilihan</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Simak penjelasan materi islami dari para asatidz</p>
                            </div>
                            <Link 
                                href={route('videos.index')}
                                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                            >
                                <span>Lihat Semua Video</span>
                                <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {koleksiVideo.slice(0, 3).map((video) => (
                                <Link 
                                    href={`/videos/${video.id}`} 
                                    key={video.id} 
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
                                >
                                    <div className="w-full aspect-video bg-slate-900 relative overflow-hidden">
                                        <img 
                                            src={getVideoThumbnailUrl(video.thumbnail)} 
                                            alt={video.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                                        />
                                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-white/90 text-purple-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <Play size={20} className="fill-current ml-0.5" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                                            {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-2 mb-1 group-hover:text-purple-700 transition-colors">
                                            {video.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-2">
                                            <CircleUserRound size={14} className="text-purple-500" />
                                            <span>{video.author?.name || 'Pemateri Kajian'}</span>
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ─── AUDIO TALAQQI SECTION (DESKTOP) ─── */}
                {koleksiAudio && koleksiAudio.length > 0 && (
                    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Rekaman Audio & Talaqqi</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Dengarkan lantunan ayat Al-Qur'an dan bimbingan tajwid</p>
                            </div>
                            <Link 
                                href={route('audios.index')}
                                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                            >
                                <span>Lihat Semua Audio</span>
                                <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {koleksiAudio.slice(0, 3).map((audio) => (
                                <Link 
                                    href={route('audios.index')} 
                                    key={audio.id} 
                                    className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                                        <Headphones size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm text-gray-900 truncate group-hover:text-purple-700 transition-colors mb-0.5">
                                            {audio.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 truncate mb-1">
                                            {audio.author?.name || 'Qari / Ustadz'}
                                        </p>
                                        <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full inline-block">
                                            {Math.floor(audio.duration / 60)} menit
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ─── COIN TOP UP CALL TO ACTION (CTA BANNER) ─── */}
                <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden border border-purple-800/40">
                        {/* Glowing Background Circles */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/15 rounded-full blur-2xl -ml-16 -mb-16"></div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-4 border border-amber-400/30">
                                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Koin Digital Talaqee</span>
                                </div>
                                <h2 className="text-2xl lg:text-3xl font-black mb-3 leading-tight">
                                    Buka Bab Buku Eksklusif & Nikmati Konten Premium Tanpa Batas
                                </h2>
                                <p className="text-purple-200/90 text-sm max-w-2xl leading-relaxed mb-6">
                                    Dapatkan kemudahan membaca bab buku pilihan dengan tarif terjangkau mulai dari Rp 2.500. Koin otomatis ditambahkan ke saldo Anda secara instan.
                                </p>

                                <div className="flex flex-wrap items-center gap-6 text-xs text-purple-200 font-semibold">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px]">✓</div>
                                        <span>Proses Cepat & Otomatis</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px]">✓</div>
                                        <span>Tersedia Banyak Pilihan Paket</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px]">✓</div>
                                        <span>Banyak Bonus Koin Tambahan</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 flex flex-col items-center lg:items-end">
                                <Link 
                                    href="/akun/topup" 
                                    className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-2xl font-black text-sm transition-all shadow-xl shadow-amber-500/25 active:scale-95 flex items-center gap-2.5"
                                >
                                    <Coins className="w-5 h-5 text-slate-950" />
                                    <span>Top Up Koin Sekarang</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <span className="text-[11px] text-purple-300 mt-3 font-medium">
                                    Pembayaran aman terintegrasi dengan iPaymu
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── KENAPA MEMILIH TALAQEE (FEATURES) ─── */}
                <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                            Keunggulan Platform
                        </span>
                        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mt-3 mb-3">
                            Mengapa Belajar di Talaqee?
                        </h2>
                        <p className="text-xs lg:text-sm text-gray-500 leading-relaxed">
                            Kami menggabungkan metode talaqqi tradisional dengan teknologi modern demi kemudahan belajar umat.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4 font-bold">
                                <BookOpen size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1.5">Buku Islami Lengkap</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Ribuan bab materi terstruktur dari aqidah, fiqih, tafsir, hingga adab harian.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 font-bold">
                                <PlaySquare size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1.5">Kajian Video HD</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Tonton video kajian tematik dengan audio jernih dan visual menarik kapan saja.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 font-bold">
                                <Headphones size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1.5">Talaqqi Interaktif</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Dengarkan contoh bacaan qari dan setorkan hafalan atau tilawah Anda dengan mudah.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 font-bold">
                                <ShieldCheck size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1.5">Terpercaya & Berlisensi</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Setiap konten telah melalui kurasi ketat untuk menjamin keaslian referensi ilmu.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ─── DESKTOP FOOTER ─── */}
                <footer className="w-full bg-white border-t border-gray-100 pt-16 pb-10 mt-16">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-100">
                            
                            {/* Column 1: Brand & Desc */}
                            <div className="md:col-span-4">
                                <Link href={route('home')} className="inline-block mb-4">
                                    <img src="/logo/logo_app.talaqee.png" alt="Talaqee Logo" className="h-9 w-auto object-contain" />
                                </Link>
                                <p className="text-xs text-gray-500 leading-relaxed max-w-sm mb-5">
                                    Platform pembelajaran Al-Qur'an, perpustakaan digital islami, dan audio talaqqi terpercaya untuk mendampingi langkah hijrah dan literasi Anda.
                                </p>
                                <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Pembayaran Resmi via iPaymu Gateway</span>
                                </div>
                            </div>

                            {/* Column 2: Navigasi */}
                            <div className="md:col-span-3">
                                <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-4">
                                    Navigasi Cepat
                                </h4>
                                <ul className="space-y-2.5 text-xs font-medium text-gray-600">
                                    <li>
                                        <Link href={route('home')} className="hover:text-purple-600 transition-colors">Beranda</Link>
                                    </li>
                                    <li>
                                        <Link href={route('katalog.index')} className="hover:text-purple-600 transition-colors">Katalog Buku</Link>
                                    </li>
                                    <li>
                                        <Link href={route('videos.index')} className="hover:text-purple-600 transition-colors">Video Kajian</Link>
                                    </li>
                                    <li>
                                        <Link href={route('audios.index')} className="hover:text-purple-600 transition-colors">Audio Talaqqi</Link>
                                    </li>
                                    <li>
                                        <Link href="/akun/topup" className="hover:text-purple-600 transition-colors">Top Up Koin</Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Column 3: Bantuan & Legalitas */}
                            <div className="md:col-span-2">
                                <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-4">
                                    Bantuan
                                </h4>
                                <ul className="space-y-2.5 text-xs font-medium text-gray-600">
                                    <li>
                                        <Link href={route('faq.index')} className="hover:text-purple-600 transition-colors">FAQ</Link>
                                    </li>
                                    <li>
                                        <Link href={route('refund.policy')} className="hover:text-purple-600 transition-colors">Refund Policy</Link>
                                    </li>
                                    <li>
                                        <Link href={route('terms')} className="hover:text-purple-600 transition-colors">Syarat & Ketentuan</Link>
                                    </li>
                                    <li>
                                        <Link href={route('kontak')} className="hover:text-purple-600 transition-colors">Kontak Kami</Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Column 4: Kontak & Kantor */}
                            <div className="md:col-span-3">
                                <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-4">
                                    Kantor Bisnis
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                                    Gang Mawar 26-7 RT/RW 003/008, Kel. Halim Perdana Kusuma, Kec. Makasar, Kota Jakarta Timur, DKI Jakarta 13610
                                </p>
                                <div className="space-y-1 text-xs text-gray-600 mb-3">
                                    <p><strong className="text-gray-800">WhatsApp:</strong> +62 822 8557 8390</p>
                                    <p><strong className="text-gray-800">Email:</strong> saufitrod@gmail.com</p>
                                </div>
                                <p className="text-[11px] text-gray-400">
                                    Jam Layanan: Senin – Jumat (08.00 – 17.00 WIB)
                                </p>
                            </div>

                        </div>

                        {/* Bottom Copyright */}
                        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                            <span>© 2026 Talaqee. Seluruh hak cipta dilindungi undang-undang.</span>
                            <div className="flex items-center gap-6">
                                <Link href={route('faq.index')} className="hover:text-purple-600 transition-colors">Pusat Bantuan</Link>
                                <Link href={route('terms')} className="hover:text-purple-600 transition-colors">Privasi</Link>
                                <Link href={route('kontak')} className="hover:text-purple-600 transition-colors">Customer Support</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                MOBILE VERSION (block md:hidden)
            ══════════════════════════════════════════════════════════════ */}
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
                    <form onSubmit={handleHeroSearch} className="bg-white border border-gray-200 rounded-2xl px-3.5 py-3 flex items-center gap-3 shadow-xs hover:border-gray-300 focus-within:border-[#5C5AE6] focus-within:ring-2 focus-within:ring-[#5C5AE6]/15 transition-all">
                        <Search className="w-5 h-5 text-gray-400 shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari buku, video, audio..."
                            className="flex-1 bg-transparent border-none text-[13px] font-medium placeholder:text-gray-400 focus:ring-0 p-0 text-gray-800 outline-none"
                        />
                    </form>
                </div>

                {/* Jadwal Sholat */}
                <JadwalSholat />

                {/* Rekomendasi Buku (Horizontal Scroll dengan Margin Sisi Terjaga) */}
                <div className="px-5 mb-11">
                    <div className="flex items-center justify-between mb-3.5">
                        <div>
                            <h3 className="text-[16px] font-extrabold text-gray-900 tracking-tight">Rekomendasi Buku</h3>
                            <p className="text-[11px] text-gray-500 font-medium">Buku pilihan untuk menambah wawasan</p>
                        </div>
                        <Link href={route('katalog.index')} className="text-[12px] font-bold text-[#5C5AE6] hover:text-[#4E4CD4] flex items-center gap-0.5">
                            Lihat Katalog <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto hide-scrollbar pb-3">
                        <div className="flex gap-3.5 w-max">
                            {koleksiBuku.length > 0 ? koleksiBuku.slice(0, 8).map((book) => (
                                <Link 
                                    href={`/buku/${book.id}`} 
                                    key={book.id} 
                                    className="w-[132px] flex flex-col group"
                                >
                                    <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-2 border border-gray-100 shadow-sm relative group-active:scale-95 transition-transform">
                                        <img 
                                            src={getBookCoverUrl(book.cover)} 
                                            alt={book.title} 
                                            loading="lazy" 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                        />
                                        {book.coins_price > 0 && (
                                            <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm border border-white/10">
                                                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full flex items-center justify-center text-gray-900 text-[6px] font-black">C</div>
                                                <span className="text-[9px] font-extrabold text-white">{book.coins_price}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-[12px] text-gray-900 leading-snug line-clamp-2 group-hover:text-[#5C5AE6] transition-colors">
                                        {book.title}
                                    </h4>
                                    <p className="text-[11px] font-medium text-gray-500 truncate mt-0.5">
                                        {book.author?.name || 'Penulis'}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span className="text-[10px] font-bold text-gray-700">{book.average_rating ? Number(book.average_rating).toFixed(1) : '4.9'}</span>
                                    </div>
                                </Link>
                            )) : (
                                <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-center text-gray-500 text-[11px]">
                                    Belum ada buku rekomendasi
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Video Kajian Terbaru (Horizontal Scroll dengan Margin Sisi Terjaga) */}
                <div className="px-5 mb-11">
                    <div className="flex items-center justify-between mb-3.5">
                        <div>
                            <h3 className="text-[16px] font-extrabold text-gray-900 tracking-tight">Video Kajian Pilihan</h3>
                            <p className="text-[11px] text-gray-500 font-medium">Kajian tematik dan ceramah asatidz</p>
                        </div>
                        <Link href={route('videos.index')} className="text-[12px] font-bold text-[#5C5AE6] hover:text-[#4E4CD4] flex items-center gap-0.5">
                            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto hide-scrollbar pb-3">
                        <div className="flex gap-3.5 w-max">
                            {koleksiVideo.length > 0 ? koleksiVideo.slice(0, 6).map((video) => (
                                <Link 
                                    href={`/videos/${video.id}`} 
                                    key={video.id} 
                                    className="w-[210px] flex flex-col group"
                                >
                                    <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden relative mb-2 shadow-xs border border-gray-100">
                                        <img src={getVideoThumbnailUrl(video.thumbnail)} alt={video.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                                                <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                            {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-[12px] text-gray-900 leading-snug line-clamp-2 group-hover:text-[#5C5AE6] transition-colors">
                                        {video.title}
                                    </h4>
                                    <p className="text-[11px] font-medium text-gray-500 truncate mt-0.5">
                                        {video.author?.name || 'Ustadz Talaqee'}
                                    </p>
                                </Link>
                            )) : (
                                <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-center text-gray-500 text-[11px]">
                                    Belum ada video kajian
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Koleksi Buku Populer (Grid 2 Kolom ala Shopee Modern dengan Infinite Scroll & Skeleton Shimmer) */}
                <div className="mb-12">
                    <div className="px-5 flex items-center justify-between mb-3.5">
                        <div>
                            <h3 className="text-[16px] font-extrabold text-gray-900 tracking-tight">Koleksi Buku Populer</h3>
                            <p className="text-[11px] text-gray-500 font-medium">Buku terlengkap untuk referensi belajar</p>
                        </div>
                        <Link href={route('katalog.index')} className="text-[12px] font-bold text-[#5C5AE6] hover:text-[#4E4CD4] flex items-center gap-0.5">
                            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    
                    {/* Masonry / Waterfall Staggered 2-Column Grid ala Shopee */}
                    {allMobilePopularBooks.length > 0 ? (
                        <div className="px-5 grid grid-cols-2 gap-3.5 items-start">
                            {/* Kolom 1 (Kiri) */}
                            <div className="flex flex-col gap-3.5">
                                {allMobilePopularBooks.slice(0, visibleMobileBooksCount).filter((_, idx) => idx % 2 === 0).map((book) => (
                                    <Link 
                                        href={`/buku/${book.id}`} 
                                        key={book.id} 
                                        className="group flex flex-col w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-[#5C5AE6]/20 active:scale-[0.98] transition-all duration-200"
                                    >
                                        {/* Cover Full-Bleed ala Shopee */}
                                        <div className="w-full aspect-[3/4] bg-gray-100 relative overflow-hidden">
                                            <img 
                                                src={getBookCoverUrl(book.cover)} 
                                                alt={book.title} 
                                                loading="lazy" 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                            />
                                            {/* Spine subtle shadow on left */}
                                            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />

                                            {/* Floating Badge ala Shopee (Koin / Gratis) */}
                                            {book.coins_price > 0 ? (
                                                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm border border-white/10">
                                                    <div className="w-2.5 h-2.5 bg-amber-400 rounded-full flex items-center justify-center text-gray-900 text-[6px] font-black">C</div>
                                                    <span className="text-[9px] font-extrabold text-white">{book.coins_price}</span>
                                                </div>
                                            ) : (
                                                <div className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
                                                    Gratis
                                                </div>
                                            )}

                                            {/* Kategori Badge di pojok kanan atas */}
                                            {book.category?.name && (
                                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-gray-700 text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-xs max-w-[75px] truncate border border-black/5">
                                                    {book.category.name}
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Body ala Shopee (Natural Height) */}
                                        <div className="p-2.5 flex flex-col bg-white">
                                            <h4 className="font-bold text-[12px] text-gray-900 leading-snug line-clamp-2 group-hover:text-[#5C5AE6] transition-colors">
                                                {book.title}
                                            </h4>
                                            <p className="text-[10px] font-medium text-gray-500 truncate mt-0.5">
                                                {book.author?.name || 'Penulis'}
                                            </p>

                                            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-50">
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-700">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    <span>{book.average_rating ? Number(book.average_rating).toFixed(1) : '4.9'}</span>
                                                </div>
                                                <span className="text-[10px] font-extrabold text-[#5C5AE6]">
                                                    {book.coins_price > 0 ? `${book.coins_price} Koin` : 'Gratis'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {isLoadingMoreMobileBooks && (
                                    <div className="flex flex-col w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs animate-pulse">
                                        <div className="w-full aspect-[3/4] bg-gray-200" />
                                        <div className="p-2.5 flex flex-col gap-2">
                                            <div className="h-3.5 bg-gray-200 rounded-md w-4/5" />
                                            <div className="h-3 bg-gray-100 rounded-md w-1/2" />
                                            <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-50">
                                                <div className="h-3 bg-gray-100 rounded w-10" />
                                                <div className="h-3 bg-gray-200 rounded w-8" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Kolom 2 (Kanan) */}
                            <div className="flex flex-col gap-3.5">
                                {allMobilePopularBooks.slice(0, visibleMobileBooksCount).filter((_, idx) => idx % 2 === 1).map((book) => (
                                    <Link 
                                        href={`/buku/${book.id}`} 
                                        key={book.id} 
                                        className="group flex flex-col w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-[#5C5AE6]/20 active:scale-[0.98] transition-all duration-200"
                                    >
                                        {/* Cover Full-Bleed ala Shopee */}
                                        <div className="w-full aspect-[3/4] bg-gray-100 relative overflow-hidden">
                                            <img 
                                                src={getBookCoverUrl(book.cover)} 
                                                alt={book.title} 
                                                loading="lazy" 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                            />
                                            {/* Spine subtle shadow on left */}
                                            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />

                                            {/* Floating Badge ala Shopee (Koin / Gratis) */}
                                            {book.coins_price > 0 ? (
                                                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm border border-white/10">
                                                    <div className="w-2.5 h-2.5 bg-amber-400 rounded-full flex items-center justify-center text-gray-900 text-[6px] font-black">C</div>
                                                    <span className="text-[9px] font-extrabold text-white">{book.coins_price}</span>
                                                </div>
                                            ) : (
                                                <div className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
                                                    Gratis
                                                </div>
                                            )}

                                            {/* Kategori Badge di pojok kanan atas */}
                                            {book.category?.name && (
                                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-gray-700 text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-xs max-w-[75px] truncate border border-black/5">
                                                    {book.category.name}
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Body ala Shopee (Natural Height) */}
                                        <div className="p-2.5 flex flex-col bg-white">
                                            <h4 className="font-bold text-[12px] text-gray-900 leading-snug line-clamp-2 group-hover:text-[#5C5AE6] transition-colors">
                                                {book.title}
                                            </h4>
                                            <p className="text-[10px] font-medium text-gray-500 truncate mt-0.5">
                                                {book.author?.name || 'Penulis'}
                                            </p>

                                            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-50">
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-700">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    <span>{book.average_rating ? Number(book.average_rating).toFixed(1) : '4.9'}</span>
                                                </div>
                                                <span className="text-[10px] font-extrabold text-[#5C5AE6]">
                                                    {book.coins_price > 0 ? `${book.coins_price} Koin` : 'Gratis'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {isLoadingMoreMobileBooks && (
                                    <div className="flex flex-col w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs animate-pulse">
                                        <div className="w-full aspect-[3/4] bg-gray-200" />
                                        <div className="p-2.5 flex flex-col gap-2">
                                            <div className="h-3.5 bg-gray-200 rounded-md w-4/5" />
                                            <div className="h-3 bg-gray-100 rounded-md w-1/2" />
                                            <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-50">
                                                <div className="h-3 bg-gray-100 rounded w-10" />
                                                <div className="h-3 bg-gray-200 rounded w-8" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="mx-5 bg-gray-50 border border-gray-100 rounded-xl p-6 text-center text-gray-500 text-xs">
                            Belum ada buku
                        </div>
                    )}

                    {/* Infinite Scroll Trigger Sentinel */}
                    <div ref={mobileLoadMoreRef} className="h-1 w-full" />

                    {/* Action Bar / Loading Status */}
                    <div className="px-5 mt-4 text-center">
                        {isLoadingMoreMobileBooks ? (
                            <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-[#5C5AE6]">
                                <Loader2 className="w-4 h-4 animate-spin text-[#5C5AE6]" />
                                <span>Memuat buku lainnya...</span>
                            </div>
                        ) : visibleMobileBooksCount < allMobilePopularBooks.length ? (
                            <button
                                onClick={handleLoadMoreMobileBooks}
                                className="w-full bg-[#EEF2FF] hover:bg-[#E0E7FF] active:scale-[0.99] text-[#5C5AE6] font-bold text-[12px] py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                            >
                                Muat Lebih Banyak Buku
                            </button>
                        ) : (
                            <div className="py-2 flex flex-col items-center gap-2">
                                <span className="text-[11px] font-medium text-gray-400">
                                    Semua buku populer telah dimuat ({allMobilePopularBooks.length} buku)
                                </span>
                                <Link 
                                    href={route('katalog.index')} 
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5C5AE6] bg-[#5C5AE6]/8 px-3 py-1.5 rounded-full hover:bg-[#5C5AE6]/15 transition-colors"
                                >
                                    Jelajahi Seluruh Katalog Buku <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Mobile */}
                <div className="px-5 mb-8 text-center border-t border-gray-100 pt-6">
                    <p className="text-xs font-bold text-gray-800 mb-1">Talaqee</p>
                    <p className="text-[11px] text-gray-500 leading-tight mb-2 max-w-xs mx-auto">
                        Gang Mawar 26-7 RT/RW 003/008, Kel. Halim Perdana Kusuma, Kec. Makasar, Jakarta Timur 13610
                    </p>
                    <p className="text-[11px] text-gray-500 mb-3">
                        WhatsApp: +62 822 8557 8390 • Email: saufitrod@gmail.com
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-3 text-[11px] font-bold text-gray-500">
                        <Link href={route('faq.index')} className="hover:text-[#5C5AE6]">FAQ</Link>
                        <Link href={route('refund.policy')} className="hover:text-[#5C5AE6]">Refund Policy</Link>
                        <Link href={route('terms')} className="hover:text-[#5C5AE6]">Syarat & Ketentuan</Link>
                        <Link href={route('kontak')} className="hover:text-[#5C5AE6]">Kontak</Link>
                    </div>
                    <p className="text-[10px] text-gray-400">© 2026 Talaqee. All rights reserved.</p>
                </div>

                {/* Bottom Navigation Mobile (Clean Native Talaqee Style) */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F1F5F9] md:max-w-md md:mx-auto z-50">
                    <div className="flex justify-around items-center h-[70px] pb-2">
                        {[
                            { id: 'home', label: 'Beranda', icon: Home, active: true, route: '/' },
                            { id: 'alquran', label: "Al-Qur'an", icon: BookOpen, route: '/alquran' },
                            { id: 'katalog', label: 'Katalog', icon: LayoutGrid, route: '/katalog' },
                            { id: 'audio', label: 'Audio', icon: Headphones, route: '/audios' },
                            { id: 'akun', label: 'Akun', icon: CircleUserRound, route: (typeof auth !== 'undefined' && auth?.user) ? '/akun' : '/login' }
                        ].map((item) => (
                            <Link prefetch="hover" href={item.route} key={item.id} className="flex flex-col items-center justify-center w-[20%] gap-1 relative mt-1">
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
