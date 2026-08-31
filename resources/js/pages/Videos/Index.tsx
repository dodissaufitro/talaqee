import { Head, Link } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import {
    ArrowLeft, Bookmark, Share2, Play, Pause, Maximize2,
    ThumbsUp, Download, List, Share, Eye, Calendar, User,
    MoreVertical, ChevronDown, ChevronUp, Home, LayoutGrid,
    PlaySquare, CircleUserRound, Search, BookOpen, Heart, Activity, Globe, Users, Smile, Shield,
    Quote, ArrowRight, Star, Headphones
} from 'lucide-react';

interface Author {
    name: string;
}

interface Video {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    video_url: string;
    duration: number;
    total_views: number;
    created_at: string;
    likes_count?: number;
    author?: Author;
    category?: Category;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    videos_count?: number;
}

interface VideoProps {
    categories: Category[];
    recentVideos: Video[];
    popularVideos: Video[];
}

export default function VideoIndex({ categories, recentVideos, popularVideos }: VideoProps) {
    const getImageUrl = (path?: string | null, fallback: string = '/images/placeholders/video-thumb.svg') => {
        if (!path) return fallback;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    const [selectedCategory, setSelectedCategory] = useState<string>('semua');
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(26);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const dummyList = [
        { num: 2, title: 'Sabar dalam Menghadapi Ujian', speaker: 'Ust. Hanan Attaki, Lc', views: '15.2K', duration: '28:40', img: '/images/katalog/video2.png' },
        { num: 3, title: 'Ikhlas dalam Beramal', speaker: 'Ust. Hanan Attaki, Lc', views: '9.8K', duration: '29:10', img: '/images/katalog/video3.png' },
    ];

    const currentVideo = recentVideos[0] || {
        id: 1,
        title: 'Menjaga Hati Agar Tetap Tenang',
        description: 'Hati yang tenang adalah kunci hidup bahagia. Dalam kajian ini, kita akan membahas bagaimana cara menjaga hati dari kegelisahan dan bagaimana cara untuk selalu bersyukur kepada Allah SWT.',
        thumbnail: '/images/katalog/video1.png',
        video_url: '',
        duration: 1935,
        total_views: 12500,
        created_at: '2024-05-12T00:00:00Z',
        likes_count: 0,
        author: { id: 1, name: 'Ust. Hanan Attaki, Lc' },
        category: { id: 1, name: 'Kajian', slug: 'kajian' },
    };

    
    // Helper untuk memformat durasi (misal: 45:12)
    const formatDuration = (seconds: number) => {
        if (!seconds) return '00:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        
        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Helper untuk memformat views (misal: 2.1K)
    const formatViews = (views: number) => {
        if (!views) return '0';
        if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
        if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
        return views.toString();
    };

    // Helper untuk time ago simpel
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
        
        if (diffInDays === 0) return 'Hari ini';
        if (diffInDays === 1) return 'Kemarin';
        if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`;
        return `${Math.floor(diffInDays / 30)} bulan lalu`;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '12 Mei 2024';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getCategoryIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('aqidah')) return <Shield size={16} />;
        if (lowerName.includes('fiqih')) return <BookOpen size={16} />;
        if (lowerName.includes('tafsir')) return <BookOpen size={16} />;
        if (lowerName.includes('hadits')) return <BookOpen size={16} />;
        if (lowerName.includes('akhlak')) return <Heart size={16} />;
        if (lowerName.includes('sejarah')) return <Globe size={16} />;
        if (lowerName.includes('motivasi')) return <Star size={16} />; // Wait, Star is not imported, let's use Activity
        if (lowerName.includes('keluarga')) return <Users size={16} />;
        if (lowerName.includes('anak')) return <Smile size={16} />;
        return <BookOpen size={16} />;
    };

    const filteredRecentVideos = recentVideos.filter(v => {
        const matchesCategory = selectedCategory === 'semua' || v.category?.slug === selectedCategory;
        const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || (v.author?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const filteredPopularVideos = popularVideos.filter(v => {
        const matchesCategory = selectedCategory === 'semua' || v.category?.slug === selectedCategory;
        const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || (v.author?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <>
            {/* ─── MOBILE ─── */}

            <div className="block md:hidden bg-white min-h-screen pb-20 font-sans">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-white">
                    <div className="flex items-center gap-4">
                        <Link href="/videos" className="w-8 h-8 flex items-center justify-center -ml-2">
                            <ArrowLeft className="w-[22px] h-[22px] text-gray-800" strokeWidth={2} />
                        </Link>
                        <span className="text-[16px] font-extrabold text-gray-900 tracking-tight">
                            {currentVideo.category?.name || 'Kajian Islam'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setBookmarked(!bookmarked)}>
                            <Bookmark
                                className="w-[22px] h-[22px]"
                                strokeWidth={2}
                                style={{ color: bookmarked ? '#2563EB' : '#374151', fill: bookmarked ? '#2563EB' : 'none' }}
                            />
                        </button>
                        <button>
                            <Share2 className="w-[22px] h-[22px] text-gray-700" strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Video Player */}
                <div className="relative bg-black w-full" style={{ aspectRatio: '16/9' }}>
                    <video 
                        ref={videoRef}
                        src={currentVideo.video_url ? (currentVideo.video_url.startsWith('http') ? currentVideo.video_url : `/storage/${currentVideo.video_url}`) : "https://www.w3schools.com/html/mov_bbb.mp4"}
                        poster={getImageUrl(currentVideo.thumbnail, '/images/katalog/video1.png')}
                        controls={isPlaying}
                        className="w-full h-full object-contain"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                    
                    {/* Custom Play Button Overlay (hides when playing natively) */}
                    {!isPlaying && (
                        <button
                            className="absolute inset-0 flex items-center justify-center bg-black/20"
                            onClick={togglePlay}
                        >
                            <div className="w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:scale-110 transition-transform">
                                <Play className="w-7 h-7 text-white ml-1" fill="white" />
                            </div>
                        </button>
                    )}

                    {/* Invisible overlay to allow clicking the video body to pause, leaving bottom 64px for native controls */}
                    {isPlaying && (
                        <div 
                            className="absolute inset-0 bottom-16 cursor-pointer" 
                            onClick={togglePlay} 
                        />
                    )}
                </div>

                {/* Video Info */}
                <div className="px-5 pt-5 pb-4">
                    <span className="text-[12px] font-bold text-[#8B5CF6] tracking-tight">
                        {currentVideo.category?.name || 'Kajian'}
                    </span>
                    <h1 className="text-[19px] font-extrabold text-gray-900 leading-tight mt-1 mb-3">
                        {currentVideo.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <div className="w-[18px] h-[18px] rounded-full bg-blue-500 flex items-center justify-center">
                                <User className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                            </div>
                            <span className="text-[12px] text-gray-600 font-medium">
                                {currentVideo.author?.name || 'Ust. Hanan Attaki, Lc'}
                            </span>
                        </div>
                        <span className="text-gray-300 mx-0.5">·</span>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[11px] text-gray-500 font-medium">{formatDate(currentVideo.created_at)}</span>
                        </div>
                        <span className="text-gray-300 mx-0.5">·</span>
                        <div className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[11px] text-gray-500 font-medium">
                                {formatViews(currentVideo.total_views || 0)} ditonton
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between px-7 py-3">
                    {[
                        { icon: <ThumbsUp className="w-5 h-5" strokeWidth={1.5} style={{ fill: liked ? '#374151' : 'none', color: '#374151' }} />, label: formatViews((currentVideo.likes_count || 0) + (liked ? 1 : 0)), action: () => setLiked(!liked) },
                        { icon: <Download className="w-5 h-5 text-gray-700" strokeWidth={1.5} />, label: 'Unduh', action: () => {} },
                        { icon: <List className="w-5 h-5 text-gray-700" strokeWidth={1.5} />, label: 'Simpan', action: () => {} },
                        { icon: <Share className="w-5 h-5 text-gray-700" strokeWidth={1.5} />, label: 'Bagikan', action: () => {} },
                    ].map((btn, i) => (
                        <button key={i} onClick={btn.action} className="flex flex-col items-center gap-2 group">
                            <div className="w-[52px] h-[52px] rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                                {btn.icon}
                            </div>
                            <span className="text-[11px] font-medium text-gray-600">{btn.label}</span>
                        </button>
                    ))}
                </div>



                {/* Deskripsi */}
                <div className="px-5 mb-6">
                    <h2 className="text-[15px] font-extrabold text-gray-900 mb-2.5">Deskripsi</h2>
                    <p className="text-[12px] text-gray-600 leading-[1.6]">
                        {showFullDesc
                            ? (currentVideo.description || 'Hati yang tenang adalah kunci hidup bahagia. Dalam kajian ini, kita akan membahas bagaimana cara menjaga hati dari kegelisahan dan bagaimana cara untuk selalu bersyukur kepada Allah SWT.')
                            : ((currentVideo.description?.slice(0, 120) || 'Hati yang tenang adalah kunci hidup bahagia. Dalam kajian ini, kita akan membahas bagaimana cara menjaga hati dari kegelisahan...'))}
                        {!showFullDesc && (
                            <button onClick={() => setShowFullDesc(true)} className="text-[#3B82F6] font-bold ml-1 inline-flex items-center gap-0.5">
                                Selengkapnya <ChevronDown className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </button>
                        )}
                        {showFullDesc && (
                            <button onClick={() => setShowFullDesc(false)} className="text-[#3B82F6] font-bold ml-1 inline-flex items-center gap-0.5">
                                Sembunyikan <ChevronUp className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </button>
                        )}
                    </p>
                </div>

                {/* Search Bar Mobile */}
                <div className="px-5 mb-4">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Cari kajian atau ustadz..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-[13px] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors" 
                        />
                    </div>
                </div>

                {/* Daftar Kajian */}
                <div className="px-5 py-2">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-[15px] font-extrabold text-gray-900">Daftar Kajian</h2>
                        <button className="text-[12px] font-bold text-[#3B82F6]">
                            10 Video
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Currently playing */}
                        <div className="flex items-center gap-3 bg-[#F8FAFF] p-2.5 rounded-[16px] border border-blue-50/50 -mx-2">
                            <div className="relative shrink-0 w-[110px] h-[66px] rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                                <img src={getImageUrl(currentVideo.thumbnail, '/images/katalog/video1.png')} alt={currentVideo.title} className="w-full h-full object-cover opacity-90" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-lg border border-blue-400/30">
                                        <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                    32:15
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 pr-1">
                                <p className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2">1. {currentVideo.title}</p>
                                <span className="inline-block mt-1 text-[11px] font-bold text-[#2563EB]">Sedang Diputar</span>
                            </div>
                            <button className="shrink-0 p-2"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                        </div>

                        {/* Related videos */}
                        {filteredRecentVideos.slice(1).map((v, i) => (
                            <Link href={`/videos/${v.id}`} key={v.id} className="flex items-center gap-3 px-0.5 group">
                                <div className="relative shrink-0 w-[110px] h-[66px] rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                                    <img src={getImageUrl(v.thumbnail, '/images/katalog/video2.png')} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">{formatDuration(v.duration || 1800)}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 mb-1">{i + 2}. {v.title}</p>
                                    <p className="text-[11px] text-gray-500 font-medium">{v.author?.name || 'Ust. Hanan Attaki, Lc'}</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">{formatViews(v.total_views || 5000)} ditonton</p>
                                </div>
                                <button className="shrink-0 p-2" onClick={(e) => e.preventDefault()}><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-around items-center h-[70px] pb-2">
                        {[
                            { id: 'home', label: 'Beranda', icon: Home, route: '/' },
                            { id: 'katalog', label: 'Kategori', icon: LayoutGrid, route: '/katalog' },
                            { id: 'video', label: 'Video Saya', icon: PlaySquare, route: '/videos', active: true },
                            { id: 'rekaman', label: 'Rekaman', icon: Headphones, route: '/audios' },
                            { id: 'akun', label: 'Akun', icon: CircleUserRound, route: (typeof auth !== 'undefined' && auth?.user) ? '/akun' : '/login' },
                        ].map((item) => (
                            <Link prefetch={['mount', 'hover']} href={item.route} key={item.id} className="flex flex-col items-center justify-center w-16 gap-1.5 relative mt-1">
                                {item.active ? (
                                    <>
                                        <div className="w-10 h-10 flex items-center justify-center">
                                            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-sm shadow-blue-200">
                                                <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-blue-600">{item.label}</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 flex items-center justify-center">
                                            <item.icon className="w-[22px] h-[22px] text-gray-400 stroke-[1.5]" />
                                        </div>
                                        <span className="text-[10px] font-medium text-gray-500">{item.label}</span>
                                    </>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            
            {/* ─── DESKTOP ─── */}
            <div className="hidden md:block min-h-screen bg-gray-50 font-sans selection:bg-[#7e57c2] selection:text-white">
            <Head title="Video Kajian - Talaqee" />

            {/* Top Navigation */}
            <nav className="bg-white sticky top-0 z-50">
                <div className="w-full px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href={route('home')} className="flex items-center gap-2">
                        <img src="/logo/logo_app.talaqee.png" alt="Talaqee Logo" className="h-10 w-auto object-contain" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
                        <Link href={route('home')} className="text-gray-600 hover:text-[#7e57c2] transition-colors">Beranda</Link>
                        <Link href={route('katalog.index')} className="text-gray-600 hover:text-[#7e57c2] transition-colors">Katalog</Link>
                        <Link href={route('videos.index')} className="text-[#7e57c2] border-b-2 border-[#7e57c2] py-4">Video Kajian</Link>
                        <Link href={route('audios.index')} className="text-gray-600 hover:text-[#7e57c2] transition-colors">Rekaman Audio</Link>
                        <Link href="#" className="text-gray-600 hover:text-[#7e57c2] transition-colors">Tentang Kami</Link>
                        <Link href={route('faq.index')} className="text-gray-600 hover:text-[#7e57c2] transition-colors">FAQ</Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Cari video..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 w-48 lg:w-64 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-[#7e57c2] focus:ring-1 focus:ring-[#7e57c2] bg-gray-50 transition-all"
                            />
                        </div>
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
            <div className="relative bg-white overflow-hidden pb-10">
                {/* Background Image / Pattern */}
                <div className="absolute top-0 right-0 w-3/4 h-full hidden md:block">
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10"></div>
                    <img src="/images/mosque_hero.png" alt="Islamic Mosque Background" className="w-full h-full object-cover object-left-top opacity-70" />
                </div>

                <div className="w-full px-6 md:px-12 lg:px-20 pt-16 pb-8 relative z-20 flex flex-col md:flex-row gap-12 items-center">
                    
                    {/* Left: Titles & Search */}
                    <div className="w-full md:w-1/2">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1f2937] leading-tight mb-3">
                            Video Kajian
                        </h1>
                        <p className="text-gray-600 text-lg mb-8">
                            Tonton kajian ilmiah dari para ustadz pilihan
                        </p>

                        {/* Search Bar */}
                        <div className="relative bg-white p-2 rounded-2xl shadow-lg shadow-gray-200/50 flex items-center border border-gray-100 max-w-xl">
                            <div className="pl-4 pr-3 text-gray-400">
                                <Search size={20} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari video kajian, ustadz, atau topik..."
                                className="w-full border-none focus:ring-0 text-gray-700 bg-transparent py-3 placeholder:text-gray-400 text-base"
                            />
                            <button className="bg-[#7e57c2] hover:bg-[#6b48a8] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shrink-0">
                                Cari
                            </button>
                        </div>
                    </div>

                    {/* Right: Quote Block */}
                    <div className="w-full md:w-1/2 flex justify-end">
                        <div className="max-w-md">
                            <Quote size={40} className="text-[#7e57c2] opacity-40 mb-4" />
                            <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed">
                                Barang siapa menempuh jalan untuk mencari ilmu, Allah akan mudahkan baginya jalan menuju surga.
                            </p>
                            <p className="text-[#7e57c2] font-semibold mt-4 text-sm">
                                (HR. Muslim)
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Main Content (2 Columns) */}
            <div className="w-full px-6 md:px-12 lg:px-20 py-12 flex flex-col md:flex-row gap-10">
                
                {/* Left Sidebar (Filters) */}
                <div className="w-full md:w-64 shrink-0 space-y-8">
                    
                    {/* Kategori */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 px-2">Kategori</h3>
                        <div className="space-y-1">
                            <button 
                                onClick={() => setSelectedCategory('semua')}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${selectedCategory === 'semua' ? 'bg-[#f3eefe] text-[#7e57c2] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Activity size={16} className={selectedCategory === 'semua' ? 'text-[#7e57c2]' : 'text-gray-400'} />
                                    <span className="text-sm">Semua Kategori</span>
                                </div>
                                <span className={`text-xs ${selectedCategory === 'semua' ? 'text-[#7e57c2]' : 'text-gray-400'}`}>
                                    {categories.reduce((acc, curr) => acc + (curr.videos_count || 0), 0) + 128} {/* 128 is dummy total */}
                                </span>
                            </button>

                            {categories.map((cat, idx) => {
                                const active = selectedCategory === cat.slug;
                                const colors = [
                                    'text-emerald-500', 'text-blue-500', 'text-orange-500', 'text-teal-500',
                                    'text-rose-500', 'text-indigo-500', 'text-amber-500', 'text-sky-500', 'text-fuchsia-500'
                                ];
                                const color = colors[idx % colors.length];

                                return (
                                    <button 
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.slug)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${active ? 'bg-[#f3eefe] text-[#7e57c2] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={active ? 'text-[#7e57c2]' : color}>
                                                {getCategoryIcon(cat.name)}
                                            </div>
                                            <span className="text-sm">{cat.name}</span>
                                        </div>
                                        <span className={`text-xs ${active ? 'text-[#7e57c2]' : 'text-gray-400'}`}>
                                            {cat.videos_count || Math.floor(Math.random() * 30) + 5}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 px-2">Filter</h3>
                        
                        <div className="mb-6 px-2">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Durasi</h4>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7e57c2] focus:ring-[#7e57c2]" />
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900">Pendek (&lt; 15 menit)</span>
                                    </div>
                                    <span className="text-xs text-gray-400">32</span>
                                </label>
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7e57c2] focus:ring-[#7e57c2]" />
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900">Sedang (15 - 60 menit)</span>
                                    </div>
                                    <span className="text-xs text-gray-400">68</span>
                                </label>
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7e57c2] focus:ring-[#7e57c2]" />
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900">Panjang (&gt; 60 menit)</span>
                                    </div>
                                    <span className="text-xs text-gray-400">28</span>
                                </label>
                            </div>
                        </div>

                        <div className="px-2">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Urutkan</h4>
                            <div className="relative">
                                <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:ring-[#7e57c2] focus:border-[#7e57c2] outline-none cursor-pointer">
                                    <option>Terbaru</option>
                                    <option>Terpopuler</option>
                                    <option>Durasi (Terpanjang)</option>
                                    <option>Durasi (Terpendek)</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Content (Video Grids) */}
                <div className="flex-1 space-y-12">
                    
                    {/* Terbaru Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Terbaru</h2>
                            <Link href="#" className="flex items-center gap-1 text-sm font-semibold text-[#7e57c2] hover:text-[#6b48a8] transition-colors">
                                Lihat Semua <ArrowRight size={16} />
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {filteredRecentVideos.length > 0 ? filteredRecentVideos.map(video => (
                                <Link href={`/videos/${video.id}`} key={video.id} className="group flex flex-col">
                                    <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden relative mb-3">
                                        <img 
                                            src={getImageUrl(video.thumbnail)} 
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                                            {formatDuration(video.duration || (Math.floor(Math.random() * 3000) + 600))}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-[#7e57c2] transition-colors line-clamp-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-1 line-clamp-1">{video.author?.name || 'Ustadz Anonim'}</p>
                                    <p className="text-[11px] text-gray-400">
                                        {formatViews(video.total_views || Math.floor(Math.random() * 5000) + 100)} views • {timeAgo(video.created_at || new Date().toISOString())}
                                    </p>
                                </Link>
                            )) : (
                                Array(4).fill(null).map((_, i) => (
                                    <Link href={`/videos/${i + 1}`} key={`recent-dummy-${i}`} className="group flex flex-col">
                                        <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden relative mb-3">
                                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">45:12</div>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-[#7e57c2] transition-colors line-clamp-2">
                                            Tafsir Surat Al-Fatihah Ayat 1-7
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-1 line-clamp-1">Ustadz Dr. Firanda Andirja, MA</p>
                                        <p className="text-[11px] text-gray-400">2.1K views • 2 hari yang lalu</p>
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Populer Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Populer</h2>
                            <Link href="#" className="flex items-center gap-1 text-sm font-semibold text-[#7e57c2] hover:text-[#6b48a8] transition-colors">
                                Lihat Semua <ArrowRight size={16} />
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {filteredPopularVideos.length > 0 ? filteredPopularVideos.map(video => (
                                <Link href={`/videos/${video.id}`} key={video.id} className="group flex flex-col">
                                    <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden relative mb-3">
                                        <img 
                                            src={getImageUrl(video.thumbnail)} 
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                                            {formatDuration(video.duration || (Math.floor(Math.random() * 3000) + 600))}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-[#7e57c2] transition-colors line-clamp-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-1 line-clamp-1">{video.author?.name || 'Ustadz Anonim'}</p>
                                    <p className="text-[11px] text-gray-400">
                                        {formatViews(video.total_views || Math.floor(Math.random() * 50000) + 1000)} views • {timeAgo(video.created_at || new Date().toISOString())}
                                    </p>
                                </Link>
                            )) : (
                                Array(4).fill(null).map((_, i) => (
                                    <Link href={`/videos/${i + 1}`} key={`pop-dummy-${i}`} className="group flex flex-col">
                                        <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative mb-3">
                                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">1:02:15</div>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-[#7e57c2] transition-colors line-clamp-2">
                                            Sirah Nabi Muhammad (Bagian 1)
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-1 line-clamp-1">Ustadz Muhammad Nuzul Dzikri</p>
                                        <p className="text-[11px] text-gray-400">6.1K views • 3 minggu lalu</p>
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>

                </div>

            </div>
        </div>
        </>
    );
}
