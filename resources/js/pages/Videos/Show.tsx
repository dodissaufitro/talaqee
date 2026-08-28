import { Head, Link } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import {
    ArrowLeft, Bookmark, Share2, Play, Pause, Maximize2,
    ThumbsUp, Download, List, Share, Eye, Calendar, User,
    MoreVertical, ChevronDown, ChevronUp, Home, LayoutGrid,
    PlaySquare, CircleUserRound, Headphones, Search
} from 'lucide-react';

interface Author {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
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

interface ShowProps {
    video: Video;
    relatedVideos: Video[];
}

export default function VideoShow({ video, relatedVideos }: ShowProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(26);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const mobileVideoRef = useRef<HTMLVideoElement>(null);
    const desktopVideoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = (ref: React.RefObject<HTMLVideoElement | null>) => {
        if (ref.current) {
            if (ref.current.paused) {
                ref.current.play();
                setIsPlaying(true);
            } else {
                ref.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const formatDuration = (seconds: number) => {
        if (!seconds) return '00:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentVideo = video || {
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

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    React.useEffect(() => {
        const storedLike = localStorage.getItem(`talaqee_video_${currentVideo.id}_liked`);
        const storedSave = localStorage.getItem(`talaqee_video_${currentVideo.id}_saved`);
        const storedBookmark = localStorage.getItem(`talaqee_video_${currentVideo.id}_bookmarked`);
        
        if (storedLike) setLiked(storedLike === 'true');
        if (storedSave) setSaved(storedSave === 'true');
        if (storedBookmark) setBookmarked(storedBookmark === 'true');
    }, [currentVideo.id]);

    const handleLike = () => {
        const newState = !liked;
        setLiked(newState);
        localStorage.setItem(`talaqee_video_${currentVideo.id}_liked`, newState.toString());
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: currentVideo.title || 'Video Kajian',
                text: 'Simak kajian ini di Talaqee!',
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast('Tautan berhasil disalin!');
        }
    };

    const handleDownload = () => {
        const url = currentVideo.video_url ? (currentVideo.video_url.startsWith('http') ? currentVideo.video_url : `/storage/${currentVideo.video_url}`) : "https://www.w3schools.com/html/mov_bbb.mp4";
        const a = document.createElement('a');
        a.href = url;
        a.download = `Talaqee_Video_${currentVideo.id}.mp4`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Memulai unduhan video...');
    };

    const handleSave = () => {
        const newState = !saved;
        setSaved(newState);
        localStorage.setItem(`talaqee_video_${currentVideo.id}_saved`, newState.toString());
        showToast(newState ? 'Kajian berhasil disimpan ke playlist!' : 'Kajian dihapus dari playlist.');
    };

    const handleBookmark = () => {
        const newState = !bookmarked;
        setBookmarked(newState);
        localStorage.setItem(`talaqee_video_${currentVideo.id}_bookmarked`, newState.toString());
        showToast(newState ? 'Kajian berhasil ditambahkan ke markah!' : 'Kajian dihapus dari markah.');
    };

    const formatViews = (views: number) => {
        if (!views) return '0';
        if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
        if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
        return views.toString();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '12 Mei 2024';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const dummyList = [
        { num: 2, title: 'Sabar dalam Menghadapi Ujian', speaker: 'Ust. Hanan Attaki, Lc', views: '15.2K', duration: '28:40', img: '/images/katalog/video2.png' },
        { num: 3, title: 'Ikhlas dalam Beramal', speaker: 'Ust. Hanan Attaki, Lc', views: '9.8K', duration: '29:10', img: '/images/katalog/video3.png' },
    ];

    const filteredRelatedVideos = relatedVideos.filter(v => 
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (v.author?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title={currentVideo.title} />

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-gray-900 text-white text-sm rounded-full shadow-lg font-medium transition-all animate-in fade-in slide-in-from-top-5">
                    {toastMessage}
                </div>
            )}

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
                        <button onClick={handleBookmark}>
                            <Bookmark
                                className="w-[22px] h-[22px]"
                                strokeWidth={2}
                                style={{ color: bookmarked ? '#2563EB' : '#374151', fill: bookmarked ? '#2563EB' : 'none' }}
                            />
                        </button>
                        <button onClick={handleShare}>
                            <Share2 className="w-[22px] h-[22px] text-gray-700" strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Video Player */}
                <div className="relative bg-black w-full" style={{ aspectRatio: '16/9' }}>
                    <video 
                        ref={mobileVideoRef}
                        src={currentVideo.video_url ? (currentVideo.video_url.startsWith('http') ? currentVideo.video_url : `/storage/${currentVideo.video_url}`) : "https://www.w3schools.com/html/mov_bbb.mp4"}
                        poster={currentVideo.thumbnail || '/images/katalog/video1.png'}
                        controls={isPlaying}
                        className="w-full h-full object-contain"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                    
                    {/* Custom Play Button Overlay (hides when playing natively) */}
                    {!isPlaying && (
                        <button
                            className="absolute inset-0 flex items-center justify-center bg-black/20"
                            onClick={() => togglePlay(mobileVideoRef)}
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
                            onClick={() => togglePlay(mobileVideoRef)} 
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
                        { icon: <ThumbsUp className="w-5 h-5" strokeWidth={1.5} style={{ fill: liked ? '#374151' : 'none', color: '#374151' }} />, label: formatViews((currentVideo.likes_count || 0) + (liked ? 1 : 0)), action: handleLike },
                        { icon: <Download className="w-5 h-5 text-gray-700" strokeWidth={1.5} />, label: 'Unduh', action: handleDownload },
                        { icon: <List className="w-5 h-5" strokeWidth={1.5} style={{ color: saved ? '#2563EB' : '#374151' }} />, label: 'Simpan', action: handleSave },
                        { icon: <Share className="w-5 h-5 text-gray-700" strokeWidth={1.5} />, label: 'Bagikan', action: handleShare },
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
                                <img src={currentVideo.thumbnail || '/images/katalog/video1.png'} alt={currentVideo.title} className="w-full h-full object-cover opacity-90" />
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
                        {filteredRelatedVideos.map((v, i) => (
                            <Link href={`/videos/${v.id}`} key={v.id} className="flex items-center gap-3 px-0.5 group">
                                <div className="relative shrink-0 w-[110px] h-[66px] rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                                    <img src={v.thumbnail || '/images/katalog/video2.png'} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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
                            { id: 'akun', label: 'Akun', icon: CircleUserRound, route: '/akun' },
                        ].map((item) => (
                            <Link href={item.route} key={item.id} className="flex flex-col items-center justify-center w-16 gap-1.5 relative mt-1">
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
            <div className="hidden md:block min-h-screen bg-gray-50">
                <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
                    <div className="w-full px-6 md:px-12 lg:px-20 py-4 flex items-center gap-6">
                        <Link href="/videos" className="flex items-center gap-2 text-gray-600 hover:text-[#7e57c2] transition-colors">
                            <ArrowLeft size={18} />
                            <span className="text-sm font-medium">Kembali</span>
                        </Link>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-500">{currentVideo.category?.name || 'Kajian Islam'}</span>
                    </div>
                </nav>

                <div className="w-full px-6 md:px-12 lg:px-20 py-10 flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 min-w-0">
                        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-6 shadow-sm border border-gray-100">
                            <video 
                                ref={desktopVideoRef}
                                src={currentVideo.video_url ? (currentVideo.video_url.startsWith('http') ? currentVideo.video_url : `/storage/${currentVideo.video_url}`) : "https://www.w3schools.com/html/mov_bbb.mp4"}
                                poster={currentVideo.thumbnail || '/images/katalog/video1.png'}
                                controls={isPlaying}
                                className="w-full h-full object-contain"
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            />
                            
                            {/* Custom Play Button Overlay (hides when playing natively) */}
                            {!isPlaying && (
                                <button
                                    className="absolute inset-0 flex items-center justify-center bg-black/20"
                                    onClick={() => togglePlay(desktopVideoRef)}
                                >
                                    <div className="w-20 h-20 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform">
                                        <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                    </div>
                                </button>
                            )}

                            {/* Invisible overlay to allow clicking the video body to pause, leaving bottom 64px for native controls */}
                            {isPlaying && (
                                <div 
                                    className="absolute inset-0 bottom-16 cursor-pointer" 
                                    onClick={() => togglePlay(desktopVideoRef)} 
                                />
                            )}
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{currentVideo.title}</h1>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                            <span>{currentVideo.author?.name || 'Ust. Hanan Attaki, Lc'}</span>
                            <span>·</span>
                            <span>{formatDate(currentVideo.created_at)}</span>
                            <span>·</span>
                            <span>{formatViews(currentVideo.total_views || 0)} ditonton</span>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${liked ? 'bg-[#EEF2FF] text-[#6366F1]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                    <ThumbsUp size={16} /> {formatViews((currentVideo.likes_count || 0) + (liked ? 1 : 0))} Suka
                                </button>
                                <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                                    <Download size={16} /> Unduh
                                </button>
                                <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                                    <Share size={16} /> Bagikan
                                </button>
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
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-gray-100">
                            <h2 className="font-bold text-gray-900 mb-2">Deskripsi</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {currentVideo.description || 'Hati yang tenang adalah kunci hidup bahagia. Dalam kajian ini, kita akan membahas bagaimana cara menjaga hati dari kegelisahan.'}
                            </p>
                        </div>
                    </div>

                    <div className="w-full lg:w-[340px] shrink-0">
                        <div className="bg-white rounded-2xl p-4 border border-gray-100">
                            <h2 className="font-bold text-gray-900 mb-4 text-base">Daftar Kajian</h2>
                            <div className="space-y-3">
                                {/* Currently playing */}
                                <div className="flex gap-3 bg-[#F8FAFF] p-2 -mx-2 rounded-xl border border-blue-50/50">
                                    <div className="relative shrink-0 w-[120px] h-[72px] rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                                        <img src={currentVideo.thumbnail || '/images/katalog/video1.png'} alt={currentVideo.title} className="w-full h-full object-cover opacity-90" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-lg border border-blue-400/30">
                                                <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 py-0.5">
                                        <p className="text-[10px] font-extrabold text-[#3B82F6] mb-1 uppercase tracking-wider flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                            Sedang Diputar
                                        </p>
                                        <p className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 mb-1">{currentVideo.title}</p>
                                    </div>
                                </div>

                                {/* Related videos */}
                                {filteredRelatedVideos.slice(0, 9).map((v, i) => (
                                    <Link href={`/videos/${v.id}`} key={v.id} className="flex gap-3 group">
                                        <div className="relative shrink-0 w-[120px] h-[72px] rounded-xl overflow-hidden bg-gray-100">
                                            <img src={v.thumbnail ? (v.thumbnail.startsWith('http') || v.thumbnail.startsWith('/') ? v.thumbnail : `/storage/${v.thumbnail}`) : "/images/placeholders/video-thumb.jpg"} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 py-0.5 rounded">{formatDuration(v.duration)}</div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-semibold text-gray-900 line-clamp-2 group-hover:text-[#7e57c2] transition-colors">{i + 1}. {v.title}</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">{v.author?.name}</p>
                                            <p className="text-[10px] text-gray-400">{formatViews(v.total_views)} ditonton</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
