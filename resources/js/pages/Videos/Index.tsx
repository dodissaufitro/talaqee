import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import {
    ArrowLeft, Bookmark, Share2, Play, Pause, Maximize2,
    ThumbsUp, Download, List, Share, Eye, Calendar, User,
    MoreVertical, ChevronDown, ChevronUp, Home, LayoutGrid,
    PlaySquare, CircleUserRound, Search, BookOpen, Heart, Activity, Globe, Users, Smile, Shield,
    Quote, ArrowRight, Star, Headphones
} from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';

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
    const { auth } = usePage<any>().props;
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
            <WebDesktopNav />

            {/* Hero Section */}
            <div className="relative bg-white pt-14 pb-[130px] overflow-hidden">
                {/* Background Image / Pattern */}
                <div className="absolute top-0 right-0 w-full md:w-[65%] h-full hidden md:block pointer-events-none">
                    <img 
                        src="/images/mosque_hero.png" 
                        alt="Mosque" 
                        className="w-full h-full object-cover object-[center_right] opacity-95"
                        style={{
                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
                            maskImage: 'linear-gradient(to right, transparent 0%, black 40%)'
                        }}
                    />
                </div>

                {/* Wavy bottom */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
                    <svg viewBox="0 0 1440 120" className="w-full h-[60px] md:h-[100px] block" preserveAspectRatio="none">
                        <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#f9fafb"></path>
                    </svg>
                </div>

                <div className="w-full px-6 md:px-10 lg:px-16 relative z-30 flex flex-col md:flex-row gap-10 items-center max-w-[1600px] mx-auto">
                    
                    {/* Left: Titles & Search */}
                    <div className="w-full md:w-1/2">
                        <h1 className="text-[40px] lg:text-[46px] font-extrabold text-[#111827] leading-tight mb-2 tracking-tight">
                            Video Kajian
                        </h1>
                        <p className="text-slate-500 text-[15px] mb-8 font-medium">
                            Tonton kajian ilmiah dari para ustadz pilihan
                        </p>

                        {/* Search Bar */}
                        <div className="relative bg-white border border-gray-200 rounded-[10px] flex items-center p-1.5 shadow-[0_2px_10px_rgb(0,0,0,0.03)] max-w-[460px]">
                            <div className="pl-3 pr-2 text-slate-400">
                                <Search size={18} strokeWidth={2.5} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari video kajian, ustadz, atau topik..."
                                className="w-full border-none focus:ring-0 text-slate-700 bg-transparent py-2 placeholder:text-slate-400 text-[14px] outline-none"
                            />
                            <button className="bg-[#6c40e6] hover:bg-[#5b32cc] text-white px-7 py-2.5 rounded-[8px] text-[14px] font-semibold transition-colors shrink-0">
                                Cari
                            </button>
                        </div>
                    </div>

                    {/* Right: Quote Block */}
                    <div className="w-full md:w-1/2 flex justify-start md:pl-10 mt-8 md:mt-0">
                        <div className="max-w-[320px]">
                            <div className="text-[#8155ff] mb-4">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 9C10 6.23858 7.76142 4 5 4C2.23858 4 0 6.23858 0 9C0 11.2312 1.45892 13.1207 3.48627 13.7915C2.65809 15.656 0.817366 17.1593 0.771965 17.1952C0.334057 17.5413 0.25875 18.1778 0.604886 18.6157C0.951022 19.0536 1.58756 19.1289 2.02547 18.7828C2.17647 18.6635 4.90807 16.4867 6.46328 13.1585C8.61111 12.027 10 9.7717 10 9ZM24 9C24 6.23858 21.7614 4 19 4C16.2386 4 14 6.23858 14 9C14 11.2312 15.4589 13.1207 17.4863 13.7915C16.6581 15.656 14.8174 17.1593 14.772 17.1952C14.3341 17.5413 14.2588 18.1778 14.6049 18.6157C14.951 19.0536 15.5876 19.1289 16.0255 18.7828C16.1765 18.6635 18.9081 16.4867 20.4633 13.1585C22.6111 12.027 24 9.7717 24 9Z" />
                                </svg>
                            </div>
                            <p className="text-[15px] font-medium text-slate-700 leading-[1.6]">
                                Barang siapa menempuh<br/>
                                jalan untuk mencari ilmu,<br/>
                                Allah akan mudahkan baginya<br/>
                                jalan menuju surga.
                            </p>
                            <p className="text-[#8155ff] font-semibold mt-4 text-[12px]">
                                (HR. Muslim)
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-6 md:px-10 lg:px-16 py-8 flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto">
                
                {/* Left Sidebar (Filters) */}
                <div className="w-full lg:w-[260px] shrink-0 space-y-8">
                    
                    {/* Kategori */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-3 text-[15px] px-1">Kategori</h3>
                        <div className="bg-white rounded-2xl py-2.5 border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] space-y-0.5">
                            <button 
                                onClick={() => setSelectedCategory('semua')}
                                className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${selectedCategory === 'semua' ? 'bg-[#f4f0ff] border-l-2 border-[#6038cc] text-[#6038cc]' : 'text-gray-600 hover:bg-gray-50 border-l-2 border-transparent'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Activity size={16} className={selectedCategory === 'semua' ? 'text-[#6038cc]' : 'text-gray-400'} strokeWidth={2.5} />
                                    <span className={`text-[13px] ${selectedCategory === 'semua' ? 'font-bold' : 'font-medium'}`}>Semua Kategori</span>
                                </div>
                                <span className={`text-[12px] font-semibold ${selectedCategory === 'semua' ? 'text-[#6038cc]' : 'text-gray-400'}`}>
                                    128
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
                                        className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${active ? 'bg-[#f4f0ff] border-l-2 border-[#6038cc] text-[#6038cc]' : 'text-gray-600 hover:bg-gray-50 border-l-2 border-transparent'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={active ? 'text-[#6038cc]' : color}>
                                                {getCategoryIcon(cat.name)}
                                            </div>
                                            <span className={`text-[13px] ${active ? 'font-bold' : 'font-medium'}`}>{cat.name}</span>
                                        </div>
                                        <span className={`text-[12px] font-semibold ${active ? 'text-[#6038cc]' : 'text-gray-400'}`}>
                                            {cat.videos_count || Math.floor(Math.random() * 30) + 5}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filter */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-3 text-[15px] px-1">Filter</h3>
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                            
                            <div className="mb-6">
                                <h4 className="text-[13px] font-bold text-gray-900 mb-3">Durasi</h4>
                                <div className="space-y-3.5">
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#6038cc] focus:ring-[#6038cc]" />
                                            <span className="text-[13px] text-gray-600 font-medium group-hover:text-gray-900">Pendek (&lt; 15 menit)</span>
                                        </div>
                                        <span className="text-[12px] text-gray-400">32</span>
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#6038cc] focus:ring-[#6038cc]" />
                                            <span className="text-[13px] text-gray-600 font-medium group-hover:text-gray-900">Sedang (15 - 60 menit)</span>
                                        </div>
                                        <span className="text-[12px] text-gray-400">68</span>
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#6038cc] focus:ring-[#6038cc]" />
                                            <span className="text-[13px] text-gray-600 font-medium group-hover:text-gray-900">Panjang (&gt; 60 menit)</span>
                                        </div>
                                        <span className="text-[12px] text-gray-400">28</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[13px] font-bold text-gray-900 mb-3">Urutkan</h4>
                                <div className="relative">
                                    <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] font-medium text-gray-700 focus:ring-[#6038cc] focus:border-[#6038cc] outline-none cursor-pointer">
                                        <option>Terbaru</option>
                                        <option>Terpopuler</option>
                                        <option>Durasi (Terpanjang)</option>
                                        <option>Durasi (Terpendek)</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Content (Video Grids) */}
                <div className="flex-1 space-y-10 min-w-0">
                    
                    {/* Terbaru Section */}
                    <section>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-[18px] font-bold text-gray-900">Terbaru</h2>
                            <Link href="#" className="flex items-center gap-1 text-[13px] font-semibold text-[#6038cc] hover:text-[#5229b9] transition-colors">
                                Lihat Semua <ArrowRight size={14} />
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-6">
                            {filteredRecentVideos.length > 0 ? filteredRecentVideos.map(video => (
                                <Link href={`/videos/${video.id}`} key={video.id} className="group flex flex-col">
                                    <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden relative mb-2.5">
                                        <img 
                                            src={getImageUrl(video.thumbnail)} 
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                            {formatDuration(video.duration || (Math.floor(Math.random() * 3000) + 600))}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-[13px] leading-snug mb-1 group-hover:text-[#6038cc] transition-colors line-clamp-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-[12px] text-gray-500 mb-0.5 line-clamp-1">{video.author?.name || 'Ustadz Anonim'}</p>
                                    <p className="text-[11px] text-gray-400 font-medium">
                                        {formatViews(video.total_views || Math.floor(Math.random() * 5000) + 100)} views • {timeAgo(video.created_at || new Date().toISOString())}
                                    </p>
                                </Link>
                            )) : (
                                Array(5).fill(null).map((_, i) => (
                                    <Link href={`/videos/${i + 1}`} key={`recent-dummy-${i}`} className="group flex flex-col">
                                        <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden relative mb-2.5">
                                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">45:12</div>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-[13px] leading-snug mb-1 group-hover:text-[#6038cc] transition-colors line-clamp-2">
                                            Tafsir Surat Al-Fatihah Ayat 1-7
                                        </h3>
                                        <p className="text-[12px] text-gray-500 mb-0.5 line-clamp-1">Ustadz Dr. Firanda Andirja, MA</p>
                                        <p className="text-[11px] text-gray-400 font-medium">2.1K views • 2 hari yang lalu</p>
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Populer Section */}
                    <section>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-[18px] font-bold text-gray-900">Populer</h2>
                            <Link href="#" className="flex items-center gap-1 text-[13px] font-semibold text-[#6038cc] hover:text-[#5229b9] transition-colors">
                                Lihat Semua <ArrowRight size={14} />
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-6">
                            {filteredPopularVideos.length > 0 ? filteredPopularVideos.map(video => (
                                <Link href={`/videos/${video.id}`} key={video.id} className="group flex flex-col">
                                    <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden relative mb-2.5">
                                        <img 
                                            src={getImageUrl(video.thumbnail)} 
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                            {formatDuration(video.duration || (Math.floor(Math.random() * 3000) + 600))}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-[13px] leading-snug mb-1 group-hover:text-[#6038cc] transition-colors line-clamp-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-[12px] text-gray-500 mb-0.5 line-clamp-1">{video.author?.name || 'Ustadz Anonim'}</p>
                                    <p className="text-[11px] text-gray-400 font-medium">
                                        {formatViews(video.total_views || Math.floor(Math.random() * 50000) + 1000)} views • {timeAgo(video.created_at || new Date().toISOString())}
                                    </p>
                                </Link>
                            )) : (
                                Array(5).fill(null).map((_, i) => (
                                    <Link href={`/videos/${i + 1}`} key={`pop-dummy-${i}`} className="group flex flex-col">
                                        <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative mb-2.5">
                                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">1:02:15</div>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-[13px] leading-snug mb-1 group-hover:text-[#6038cc] transition-colors line-clamp-2">
                                            Sirah Nabi Muhammad (Bagian 1)
                                        </h3>
                                        <p className="text-[12px] text-gray-500 mb-0.5 line-clamp-1">Ustadz Muhammad Nuzul Dzikri</p>
                                        <p className="text-[11px] text-gray-400 font-medium">6.1K views • 3 minggu lalu</p>
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
