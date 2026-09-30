import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useRef, useMemo } from 'react';
import {
    ArrowLeft, Bookmark, Share2, Play, Pause, Maximize2,
    ThumbsUp, Download, List, Share, Eye, Calendar, User,
    MoreVertical, ChevronDown, ChevronUp, Home, LayoutGrid,
    PlaySquare, CircleUserRound, Search, BookOpen, Heart, Activity, Globe, Users, Smile, Shield,
    Quote, ArrowRight, Star, Headphones, Clock, Sparkles, Filter, CheckCircle,
    SlidersHorizontal, Layers, X, RotateCcw, Flame
} from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';
import WebFooter from '@/components/WebFooter';

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
    const getImageUrl = (path?: string | null, fallback: string = '/images/katalog/video1.png') => {
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

    // Desktop filters & state
    const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
    const [desktopSort, setDesktopSort] = useState<'newest' | 'popular' | 'duration_desc' | 'duration_asc'>('newest');
    const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'recent'>('all');

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
        if (!dateString) return 'Baru saja';
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
        
        if (diffInDays <= 0) return 'Hari ini';
        if (diffInDays === 1) return 'Kemarin';
        if (diffInDays < 7) return `${diffInDays} hari lalu`;
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
        if (lowerName.includes('fiqih')) return <CheckCircle size={16} />;
        if (lowerName.includes('tafsir')) return <BookOpen size={16} />;
        if (lowerName.includes('hadits')) return <BookOpen size={16} />;
        if (lowerName.includes('akhlak') || lowerName.includes('tazkiyah')) return <Heart size={16} />;
        if (lowerName.includes('sejarah') || lowerName.includes('sirah')) return <Globe size={16} />;
        if (lowerName.includes('motivasi')) return <Star size={16} />;
        if (lowerName.includes('keluarga')) return <Users size={16} />;
        if (lowerName.includes('anak')) return <Smile size={16} />;
        return <BookOpen size={16} />;
    };

    // Filtered recent videos for mobile section
    const filteredRecentVideos = useMemo(() => {
        return recentVideos.filter(v => {
            const matchesCategory = selectedCategory === 'semua' || v.category?.slug === selectedCategory;
            const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || (v.author?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [recentVideos, selectedCategory, searchQuery]);

    // Combine all unique videos
    const allVideos = useMemo(() => {
        const map = new Map<number, Video>();
        [...recentVideos, ...popularVideos].forEach(v => {
            if (!map.has(v.id)) map.set(v.id, v);
        });
        return Array.from(map.values());
    }, [recentVideos, popularVideos]);

    // Duration counts
    const durationCounts = useMemo(() => {
        return {
            all: allVideos.length,
            short: allVideos.filter(v => (v.duration || 0) < 900).length,
            medium: allVideos.filter(v => (v.duration || 0) >= 900 && (v.duration || 0) <= 3600).length,
            long: allVideos.filter(v => (v.duration || 0) > 3600).length,
        };
    }, [allVideos]);

    // Filter & Sort video collection for desktop
    const filteredDesktopVideos = useMemo(() => {
        return allVideos.filter(v => {
            // Category filter
            const matchesCategory = selectedCategory === 'semua' || v.category?.slug === selectedCategory;
            
            // Search query filter
            const q = searchQuery.trim().toLowerCase();
            const matchesSearch = !q || 
                v.title.toLowerCase().includes(q) || 
                (v.author?.name || '').toLowerCase().includes(q) ||
                (v.category?.name || '').toLowerCase().includes(q) ||
                (v.description || '').toLowerCase().includes(q);

            // Duration filter
            let matchesDuration = true;
            const dur = v.duration || 0;
            if (durationFilter === 'short') matchesDuration = dur < 900;
            else if (durationFilter === 'medium') matchesDuration = dur >= 900 && dur <= 3600;
            else if (durationFilter === 'long') matchesDuration = dur > 3600;

            return matchesCategory && matchesSearch && matchesDuration;
        }).sort((a, b) => {
            const effectiveSort = activeTab === 'popular' ? 'popular' : (activeTab === 'recent' ? 'newest' : desktopSort);
            if (effectiveSort === 'popular') {
                return (b.total_views || 0) - (a.total_views || 0);
            }
            if (effectiveSort === 'newest') {
                return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
            }
            if (effectiveSort === 'duration_desc') {
                return (b.duration || 0) - (a.duration || 0);
            }
            if (effectiveSort === 'duration_asc') {
                return (a.duration || 0) - (b.duration || 0);
            }
            return 0;
        });
    }, [allVideos, selectedCategory, searchQuery, durationFilter, desktopSort, activeTab]);

    const spotlightVideo = popularVideos[0] || allVideos[0] || currentVideo;

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
                            <Link prefetch="hover" href={item.route} key={item.id} className="flex flex-col items-center justify-center w-16 gap-1.5 relative mt-1">
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
            <div className="hidden md:block min-h-screen bg-[#F8FAFC] font-sans selection:bg-purple-600 selection:text-white">
                <Head title="Video Kajian - Talaqee" />

                {/* Top Navigation */}
                <WebDesktopNav />

                {/* ─── HERO SPOTLIGHT SECTION ─── */}
                <div className="relative bg-gradient-to-br from-[#0B091A] via-[#151030] to-[#0A0E1A] text-white pt-10 pb-16 overflow-hidden border-b border-purple-950/40">
                    {/* Ambient Glow Lights */}
                    <div className="absolute -top-28 -left-28 w-96 h-96 bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />
                    <div className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-400/10 rounded-full blur-[110px] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                        {/* Top Bar / Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold tracking-wide">
                                    <Sparkles size={13} className="text-purple-300" />
                                    MULTIMEDIA KAJIAN SUNNAH
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-300 font-medium">
                                    {allVideos.length}+ Video Kajian Ilmiah Terstruktur
                                </span>
                            </div>

                            <div className="hidden sm:flex items-center gap-5 text-xs text-gray-300">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle size={14} className="text-emerald-400" />
                                    <span>Pemateri Terpercaya</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} className="text-amber-400" />
                                    <span>Akses 24/7 Gratis</span>
                                </div>
                            </div>
                        </div>

                        {/* Spotlight Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            {/* Left Column: Spotlight Info & Live Search */}
                            <div className="lg:col-span-7 space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                                            <Flame size={12} className="text-amber-400" />
                                            Kajian Pilihan
                                        </span>
                                        {spotlightVideo.category && (
                                            <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-gray-200 text-[11px] font-semibold">
                                                {spotlightVideo.category.name}
                                            </span>
                                        )}
                                    </div>

                                    <h1 className="text-3xl lg:text-4xl xl:text-[40px] font-black tracking-tight text-white leading-tight mb-3">
                                        {spotlightVideo.title}
                                    </h1>

                                    <p className="text-sm lg:text-[15px] text-gray-300/90 leading-relaxed max-w-xl line-clamp-3 mb-5">
                                        {spotlightVideo.description || "Simak kajian ilmiah mendalam dari asatidzah Ahlus Sunnah wal Jama'ah untuk mempertebal akidah, menata adab, dan mempraktikkan sunnah dalam kehidupan harian."}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                            <CircleUserRound size={15} className="text-purple-400" />
                                            <span className="font-semibold text-white">{spotlightVideo.author?.name || 'Ustadz Pemateri'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-300">
                                            <Clock size={14} className="text-purple-400" />
                                            <span>{formatDuration(spotlightVideo.duration)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-300">
                                            <Eye size={14} className="text-purple-400" />
                                            <span>{formatViews(spotlightVideo.total_views)} tayangan</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap items-center gap-3 pt-1">
                                    <Link
                                        href={`/videos/${spotlightVideo.id}`}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-95"
                                    >
                                        <Play size={16} fill="white" />
                                        <span>Tonton Sekarang</span>
                                    </Link>
                                    
                                    <button
                                        onClick={() => {
                                            const target = document.getElementById('video-catalog-section');
                                            target?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl border border-white/15 transition-all flex items-center gap-2"
                                    >
                                        <span>Jelajahi Semua ({allVideos.length})</span>
                                        <ArrowRight size={15} />
                                    </button>
                                </div>

                                {/* Live Search Bar inside Hero */}
                                <div className="pt-2">
                                    <div className="relative max-w-xl">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-300">
                                            <Search size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari video kajian, topik fiqih, atau nama ustadz..."
                                            className="w-full pl-10 pr-24 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/15 transition-all"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute inset-y-0 right-14 pr-2 flex items-center text-gray-400 hover:text-white"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                const target = document.getElementById('video-catalog-section');
                                                target?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            Cari
                                        </button>
                                    </div>

                                    {/* Popular Quick Tags */}
                                    <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-gray-400">
                                        <span className="text-[11px] font-medium text-gray-400">Topik Populer:</span>
                                        {categories.slice(0, 6).map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => {
                                                    setSelectedCategory(cat.slug);
                                                    const target = document.getElementById('video-catalog-section');
                                                    target?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                                                    selectedCategory === cat.slug
                                                        ? 'bg-purple-600 text-white font-bold'
                                                        : 'bg-white/10 hover:bg-white/20 text-gray-300'
                                                }`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Spotlight Video Card */}
                            <div className="lg:col-span-5 flex justify-center">
                                <Link
                                    href={`/videos/${spotlightVideo.id}`}
                                    className="group relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black block transform transition-all duration-500 hover:scale-[1.02] hover:shadow-purple-500/20"
                                >
                                    <img
                                        src={getImageUrl(spotlightVideo.thumbnail)}
                                        onError={(e) => { e.currentTarget.src = '/images/katalog/video1.png'; }}
                                        alt={spotlightVideo.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                                    {/* Center Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-purple-600/90 group-hover:bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-purple-950/50 backdrop-blur-sm group-hover:scale-110 transition-all duration-300">
                                            <Play size={24} fill="white" className="ml-1" />
                                        </div>
                                    </div>

                                    {/* Top Badges */}
                                    <div className="absolute top-3 left-3 flex items-center gap-2">
                                        <span className="bg-purple-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                                            FEATURED
                                        </span>
                                    </div>

                                    {/* Bottom Info Bar */}
                                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-white">
                                        <span className="font-semibold truncate max-w-[70%]">
                                            {spotlightVideo.author?.name || 'Ustadz Pemateri'}
                                        </span>
                                        <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold">
                                            {formatDuration(spotlightVideo.duration)}
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── CATALOG & MAIN CONTENT SECTION ─── */}
                <div id="video-catalog-section" className="max-w-7xl mx-auto px-6 lg:px-8 py-10 scroll-mt-24">
                    
                    {/* Header Controls Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200/80">
                        <div>
                            <div className="flex items-center gap-2.5 mb-1">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                    Katalog Video Kajian
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                                    {filteredDesktopVideos.length} Video
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Pilihan kajian ilmiah terbaik dengan penjelasan dalil yang shahih dan mudah dipahami.
                            </p>
                        </div>

                        {/* Tabs & Sort Controls */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Tabs Switcher */}
                            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-200/80 shadow-sm">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        activeTab === 'all'
                                            ? 'bg-purple-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => setActiveTab('popular')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        activeTab === 'popular'
                                            ? 'bg-purple-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Terpopuler
                                </button>
                                <button
                                    onClick={() => setActiveTab('recent')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        activeTab === 'recent'
                                            ? 'bg-purple-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Terbaru
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    value={desktopSort}
                                    onChange={(e) => setDesktopSort(e.target.value as any)}
                                    className="appearance-none bg-white border border-gray-200 rounded-2xl pl-3.5 pr-8 py-2 text-xs font-bold text-gray-700 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm cursor-pointer"
                                >
                                    <option value="newest">Urutkan: Terbaru</option>
                                    <option value="popular">Urutkan: Terpopuler</option>
                                    <option value="duration_desc">Durasi: Terpanjang</option>
                                    <option value="duration_asc">Durasi: Terpendek</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Active Filter Pills (if any) */}
                    {(selectedCategory !== 'semua' || durationFilter !== 'all' || searchQuery.trim() !== '') && (
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <span className="text-xs font-medium text-gray-500 mr-1">Filter Aktif:</span>
                            
                            {selectedCategory !== 'semua' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                                    <span>Kategori: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}</span>
                                    <button onClick={() => setSelectedCategory('semua')} className="hover:text-purple-900">
                                        <X size={13} />
                                    </button>
                                </span>
                            )}

                            {durationFilter !== 'all' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                                    <span>
                                        Durasi: {
                                            durationFilter === 'short' ? '< 15 menit' :
                                            durationFilter === 'medium' ? '15 - 60 menit' : '> 60 menit'
                                        }
                                    </span>
                                    <button onClick={() => setDurationFilter('all')} className="hover:text-purple-900">
                                        <X size={13} />
                                    </button>
                                </span>
                            )}

                            {searchQuery.trim() !== '' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                                    <span>Kata Kunci: "{searchQuery}"</span>
                                    <button onClick={() => setSearchQuery('')} className="hover:text-purple-900">
                                        <X size={13} />
                                    </button>
                                </span>
                            )}

                            <button
                                onClick={() => {
                                    setSelectedCategory('semua');
                                    setDurationFilter('all');
                                    setSearchQuery('');
                                    setActiveTab('all');
                                }}
                                className="text-xs font-bold text-red-500 hover:text-red-700 underline ml-2"
                            >
                                Reset Semua
                            </button>
                        </div>
                    )}

                    {/* Layout Grid: Left Sidebar + Video Grid */}
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        
                        {/* ─── LEFT SIDEBAR (FILTERS) ─── */}
                        <div className="w-full lg:w-64 shrink-0 space-y-6">
                            
                            {/* Kategori Card */}
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Layers size={16} className="text-purple-600" />
                                        <h3 className="font-extrabold text-gray-900 text-sm">Kategori Kajian</h3>
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-400">
                                        {categories.length}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory('semua')}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                                            selectedCategory === 'semua'
                                                ? 'bg-purple-50 text-purple-700 font-bold border-l-4 border-purple-600'
                                                : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent font-medium'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Activity size={15} className={selectedCategory === 'semua' ? 'text-purple-600' : 'text-gray-400'} />
                                            <span>Semua Kategori</span>
                                        </div>
                                        <span className={`text-[11px] font-bold ${selectedCategory === 'semua' ? 'text-purple-600' : 'text-gray-400'}`}>
                                            {allVideos.length}
                                        </span>
                                    </button>

                                    {categories.map((cat) => {
                                        const active = selectedCategory === cat.slug;
                                        const count = cat.videos_count !== undefined 
                                            ? cat.videos_count 
                                            : allVideos.filter(v => v.category?.slug === cat.slug).length;

                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.slug)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                                                    active
                                                        ? 'bg-purple-50 text-purple-700 font-bold border-l-4 border-purple-600'
                                                        : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent font-medium'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5 truncate pr-1">
                                                    <span className={active ? 'text-purple-600' : 'text-gray-400'}>
                                                        {getCategoryIcon(cat.name)}
                                                    </span>
                                                    <span className="truncate">{cat.name}</span>
                                                </div>
                                                <span className={`text-[11px] font-bold shrink-0 ${active ? 'text-purple-600' : 'text-gray-400'}`}>
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Durasi Card */}
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100">
                                    <Clock size={16} className="text-purple-600" />
                                    <h3 className="font-extrabold text-gray-900 text-sm">Durasi Video</h3>
                                </div>

                                <div className="space-y-2">
                                    {[
                                        { key: 'all', label: 'Semua Durasi', count: durationCounts.all },
                                        { key: 'short', label: 'Pendek (< 15 menit)', count: durationCounts.short },
                                        { key: 'medium', label: 'Sedang (15 - 60 menit)', count: durationCounts.medium },
                                        { key: 'long', label: 'Panjang (> 60 menit)', count: durationCounts.long },
                                    ].map((item) => {
                                        const isSelected = durationFilter === item.key;
                                        return (
                                            <button
                                                key={item.key}
                                                onClick={() => setDurationFilter(item.key as any)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                                                    isSelected
                                                        ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200'
                                                        : 'text-gray-600 hover:bg-gray-50 border border-transparent font-medium'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                                        isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                                                    }`}>
                                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                    </div>
                                                    <span>{item.label}</span>
                                                </div>
                                                <span className={`text-[11px] font-bold ${isSelected ? 'text-purple-600' : 'text-gray-400'}`}>
                                                    {item.count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Hadits Motivasi Banner */}
                            <div className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-2xl p-5 text-white relative overflow-hidden shadow-sm">
                                <div className="text-purple-300/60 mb-2">
                                    <Quote size={24} />
                                </div>
                                <p className="text-xs text-purple-100/90 leading-relaxed italic mb-3">
                                    "Barang siapa menempuh jalan untuk mencari ilmu, Allah akan mudahkan baginya jalan menuju surga."
                                </p>
                                <span className="text-[11px] font-bold text-amber-300 block">
                                    (HR. Muslim No. 2699)
                                </span>
                            </div>

                        </div>

                        {/* ─── RIGHT CONTENT (VIDEO GRID) ─── */}
                        <div className="flex-1 min-w-0">
                            {filteredDesktopVideos.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredDesktopVideos.map((video) => (
                                        <Link
                                            href={`/videos/${video.id}`}
                                            key={video.id}
                                            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                                        >
                                            {/* Thumbnail Aspect 16:9 */}
                                            <div className="aspect-video w-full bg-slate-900 relative overflow-hidden">
                                                <img
                                                    src={getImageUrl(video.thumbnail)}
                                                    onError={(e) => { e.currentTarget.src = '/images/katalog/video1.png'; }}
                                                    alt={video.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                                                {/* Hover Play Icon Overlay */}
                                                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                        <Play size={20} fill="white" className="ml-0.5" />
                                                    </div>
                                                </div>

                                                {/* Category Tag (Top Left) */}
                                                {video.category && (
                                                    <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10">
                                                        {video.category.name}
                                                    </span>
                                                )}

                                                {/* Duration Pill (Bottom Right) */}
                                                <span className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                                    <Clock size={11} className="text-gray-300" />
                                                    {formatDuration(video.duration)}
                                                </span>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-4 flex flex-col flex-1 justify-between">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-[14px] leading-snug line-clamp-2 group-hover:text-purple-600 transition-colors mb-2">
                                                        {video.title}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                                                        <CircleUserRound size={13} className="text-purple-500 shrink-0" />
                                                        <span className="truncate font-medium">{video.author?.name || 'Ustadz Pemateri'}</span>
                                                    </div>
                                                </div>

                                                {/* Meta Footer */}
                                                <div className="pt-2.5 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <Eye size={12} className="text-gray-400" />
                                                        {formatViews(video.total_views)} tayangan
                                                    </span>
                                                    <span>
                                                        {timeAgo(video.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                /* Empty State */
                                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                                    <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                                        <PlaySquare size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        Tidak Ada Video Kajian Ditemukan
                                    </h3>
                                    <p className="text-xs text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
                                        Tidak ada kajian yang sesuai dengan kriteria filter atau pencarian Anda. Silakan coba kata kunci lain atau setel ulang filter.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('semua');
                                            setDurationFilter('all');
                                            setSearchQuery('');
                                            setActiveTab('all');
                                        }}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                    >
                                        <RotateCcw size={14} />
                                        <span>Reset Semua Filter</span>
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>

                </div>

                {/* ─── WEB FOOTER ─── */}
                <WebFooter />

            </div>
        </>
    );
}
