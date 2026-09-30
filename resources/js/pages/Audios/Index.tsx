import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import NotificationBell from '@/components/NotificationBell';
import { 
    Search, BookOpen, Heart, Activity, Globe, Users, Smile, Shield,
    Quote, ChevronDown, ArrowRight, Star, Play, PlaySquare, MoreVertical, Download,
    SkipBack, SkipForward, Repeat, Shuffle, Volume2, ChevronUp, ArrowLeft, Bookmark, Share2, ListPlus, RotateCcw, RotateCw, Moon, LayoutGrid, CircleUserRound, Calendar, Headphones, Pause, ChevronRight, Home,
    Clock, Sparkles, Filter, CheckCircle, SlidersHorizontal, Layers, X, Flame, VolumeX, FastForward, PlayCircle, Music, Mic
} from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';
import WebFooter from '@/components/WebFooter';

interface Author {
    name: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    videos_count?: number; // reusing this for audio count for simplicity
    audios_count?: number;
}

interface Audio {
    id: number;
    title: string;
    description: string;
    cover: string;
    audio_url: string;
    duration: number;
    total_plays: number;
    created_at: string;
    author?: Author;
    category?: Category;
    admin_reply_audio_url?: string;
    admin_reply_text?: string;
    status?: string;
}

interface Surah {
    id: number;
    number: number;
    name: string;
    english_name: string;
    english_name_translation: string;
    number_of_ayahs: number;
    revelation_type: string;
}

interface Setoran {
    id: number;
    file_path: string;
    created_at: string;
    admin_comment_text?: string;
    admin_comment_audio_path?: string;
    ayah?: {
        number_in_surah: number;
        surah?: {
            name: string;
            english_name: string;
        }
    }
}

interface AudioProps {
    categories: Category[];
    audios: Audio[];
    setorans?: Setoran[];
    surahs?: Surah[];
}

export default function AudioIndex({ categories, audios, setorans = [], surahs = [] }: AudioProps) {
    const { auth } = usePage<any>().props;
    const [isFavorited, setIsFavorited] = useState(false);

    // Desktop Filter States
    const [selectedCategory, setSelectedCategory] = useState<string>('semua');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
    const [desktopSort, setDesktopSort] = useState<'newest' | 'popular' | 'duration_desc' | 'duration_asc'>('newest');
    const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'recent' | 'setoran'>('all');

    // Interactive Audio Player State
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
    const [currentTrack, setCurrentTrack] = useState<Audio | null>(audios[0] || null);
    const [isPlayingTrack, setIsPlayingTrack] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [trackDuration, setTrackDuration] = useState<number>(0);
    const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
    const [volume, setVolume] = useState<number>(0.8);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [showPlayerFull, setShowPlayerFull] = useState<boolean>(false);

    const getCoverUrl = (path?: string | null, fallback: string = '/images/katalog/book1.png') => {
        if (!path) return fallback;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    const handleFavorite = () => {
        setIsFavorited(!isFavorited);
    };

    const handleDownload = () => {
        alert('Memulai unduhan rekaman...');
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Rekaman Hafalan',
                    text: 'Dengarkan rekaman hafalan ini di Talaqee',
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Tautan disalin ke clipboard!');
        }
    };

    const handlePlaylist = () => {
        alert('Ditambahkan ke playlist Anda');
    };
    
    // Formatting Helpers
    const formatDuration = (seconds: number) => {
        if (!seconds) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const formatPlays = (plays: number) => {
        if (!plays) return '0';
        if (plays >= 1000000) return (plays / 1000000).toFixed(1) + 'M';
        if (plays >= 1000) return (plays / 1000).toFixed(1) + 'K';
        return plays.toString();
    };

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

    // Filtered audios for desktop
    const filteredDesktopAudios = useMemo(() => {
        return audios.filter(a => {
            const matchesCategory = selectedCategory === 'semua' || a.category?.slug === selectedCategory;
            const q = searchQuery.trim().toLowerCase();
            const matchesSearch = !q ||
                a.title.toLowerCase().includes(q) ||
                (a.author?.name || '').toLowerCase().includes(q) ||
                (a.category?.name || '').toLowerCase().includes(q) ||
                (a.description || '').toLowerCase().includes(q);

            let matchesDuration = true;
            const dur = a.duration || 0;
            if (durationFilter === 'short') matchesDuration = dur < 900;
            else if (durationFilter === 'medium') matchesDuration = dur >= 900 && dur <= 3600;
            else if (durationFilter === 'long') matchesDuration = dur > 3600;

            return matchesCategory && matchesSearch && matchesDuration;
        }).sort((a, b) => {
            const effectiveSort = activeTab === 'popular' ? 'popular' : (activeTab === 'recent' ? 'newest' : desktopSort);
            if (effectiveSort === 'popular') return (b.total_plays || 0) - (a.total_plays || 0);
            if (effectiveSort === 'newest') return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
            if (effectiveSort === 'duration_desc') return (b.duration || 0) - (a.duration || 0);
            if (effectiveSort === 'duration_asc') return (a.duration || 0) - (b.duration || 0);
            return 0;
        });
    }, [audios, selectedCategory, searchQuery, durationFilter, desktopSort, activeTab]);

    const durationCounts = useMemo(() => {
        return {
            all: audios.length,
            short: audios.filter(a => (a.duration || 0) < 900).length,
            medium: audios.filter(a => (a.duration || 0) >= 900 && (a.duration || 0) <= 3600).length,
            long: audios.filter(a => (a.duration || 0) > 3600).length,
        };
    }, [audios]);

    const spotlightAudio = audios[0] || {
        id: 1,
        title: 'Murottal Surah Ar-Rahman (Merdu & Khusyuk)',
        description: 'Lantunan ayat suci Al-Qur\'an Surah Ar-Rahman dengan irama bayyati yang syahdu dan tajwid yang tartil.',
        author: { name: 'Syaikh Mishary Rashid Alafasy' },
        category: { id: 1, name: 'Tafsir Al-Qur\'an', slug: 'tafsir', icon: 'BookOpen' },
        duration: 960,
        total_plays: 45200,
        created_at: new Date().toISOString(),
        cover: '/images/katalog/book1.png',
        audio_url: 'https://server8.mp3quran.net/afs/055.mp3',
    };

    // Play/Pause handler
    const playTrack = (track: Audio) => {
        if (currentTrack?.id === track.id) {
            if (isPlayingTrack) {
                audioPlayerRef.current?.pause();
                setIsPlayingTrack(false);
            } else {
                audioPlayerRef.current?.play().then(() => setIsPlayingTrack(true)).catch(() => {});
            }
        } else {
            setCurrentTrack(track);
            setIsPlayingTrack(true);
            setCurrentTime(0);
            if (audioPlayerRef.current) {
                audioPlayerRef.current.src = track.audio_url || 'https://server8.mp3quran.net/afs/001.mp3';
                audioPlayerRef.current.play().then(() => setIsPlayingTrack(true)).catch(() => {});
            }
        }
    };

    const togglePlayCurrent = () => {
        if (!currentTrack && audios.length > 0) {
            playTrack(audios[0]);
            return;
        }
        if (audioPlayerRef.current) {
            if (isPlayingTrack) {
                audioPlayerRef.current.pause();
                setIsPlayingTrack(false);
            } else {
                audioPlayerRef.current.play().then(() => setIsPlayingTrack(true)).catch(() => {});
            }
        }
    };

    const handleNextTrack = () => {
        if (!currentTrack || filteredDesktopAudios.length === 0) return;
        const idx = filteredDesktopAudios.findIndex(a => a.id === currentTrack.id);
        const next = (idx + 1) % filteredDesktopAudios.length;
        playTrack(filteredDesktopAudios[next]);
    };

    const handlePrevTrack = () => {
        if (!currentTrack || filteredDesktopAudios.length === 0) return;
        const idx = filteredDesktopAudios.findIndex(a => a.id === currentTrack.id);
        const prev = (idx - 1 + filteredDesktopAudios.length) % filteredDesktopAudios.length;
        playTrack(filteredDesktopAudios[prev]);
    };

    const toggleMute = () => {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const changeSpeed = () => {
        const speeds = [1, 1.25, 1.5, 2];
        const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
        const newSpeed = speeds[nextIdx];
        setPlaybackSpeed(newSpeed);
        if (audioPlayerRef.current) {
            audioPlayerRef.current.playbackRate = newSpeed;
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioPlayerRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const dur = audioPlayerRef.current.duration || currentTrack?.duration || 0;
        if (dur > 0) {
            const newTime = (clickX / width) * dur;
            audioPlayerRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    // Dummy soundwave generator (SVG lines)
    const generateSoundwave = (seed: number, isPlaying: boolean = false) => {
        const lines = 36;
        return (
            <div className="flex items-center gap-[2.5px] h-7 overflow-hidden w-full">
                {Array.from({length: lines}).map((_, i) => {
                    const height = isPlaying 
                        ? Math.random() * 80 + 20 
                        : (Math.sin(i * 0.5 + seed) * 35 + 45);
                    
                    return (
                        <div 
                            key={i} 
                            className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-purple-600 animate-pulse' : 'bg-purple-200'}`}
                            style={{ height: `${height}%` }}
                        ></div>
                    );
                })}
            </div>
        );
    };

    return (
        <>

            {/* MOBILE VIEW (Android) */}
            <div className="block md:hidden bg-white min-h-screen pb-40 font-sans relative">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-white sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <Link href="/katalog" className="w-8 h-8 flex items-center justify-center -ml-2">
                            <ArrowLeft className="w-6 h-6 text-[#5C5AE6]" strokeWidth={2} />
                        </Link>
                        <span className="text-[17px] font-extrabold text-[#1E293B]">
                            Rekaman Audio
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <button>
                            <Bookmark className="w-6 h-6 text-[#1E293B]" strokeWidth={2} />
                        </button>
                        <button>
                            <MoreVertical className="w-6 h-6 text-[#1E293B]" strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Hero / Info Card */}
                <div className="px-5 pt-2 pb-6 flex gap-4">
                    {/* Cover */}
                    <div className="w-[120px] h-[170px] shrink-0 rounded-2xl overflow-hidden relative shadow-md">
                        <img src="/images/katalog/book1.png" alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                            <Headphones className="w-3 h-3 text-white" />
                            <span className="text-white text-[9px] font-medium">Audio Kajian</span>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pt-1">
                        <span className="inline-block bg-[#EEF2FF] text-[#5C5AE6] text-[10px] font-bold px-2 py-0.5 rounded-md mb-2">
                            Setoran Pribadi
                        </span>
                        <h1 className="text-[16px] font-extrabold text-[#1E293B] leading-tight mb-2">
                            Rekaman Hafalan & Tajwid
                        </h1>
                        <div className="flex items-center gap-1 mb-3">
                            <span className="text-[12px] font-medium text-[#475569]">Ust. Hanan Attaki, Lc</span>
                            <div className="w-3.5 h-3.5 bg-[#5C5AE6] rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full border border-[#94A3B8] flex items-center justify-center">
                                    <div className="w-1 h-1 bg-[#94A3B8] rounded-full"></div>
                                </div>
                                <span className="text-[10px] text-[#64748B]">48:23</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#94A3B8]" />
                                <span className="text-[10px] text-[#64748B]">15 Mei 2024</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Headphones className="w-3 h-3 text-[#94A3B8]" />
                                <span className="text-[10px] text-[#64748B]">12.5K didengar</span>
                            </div>
                        </div>

                        <p className="text-[11px] text-[#64748B] leading-[1.6]">
                            Dengarkan kembali rekaman setoran Anda dan perhatikan evaluasi serta bimbingan dari asatidzah di kotak balasan admin.
                        </p>
                    </div>
                </div>



                {/* Actions Grid */}
                <div className="px-5 grid grid-cols-4 gap-2 mb-8">
                    <button onClick={handleFavorite} className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border ${isFavorited ? 'border-red-100 bg-red-50' : 'border-[#F1F5F9] bg-white'} shadow-sm transition-colors`}>
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-red-500'}`} />
                        <span className="text-[10px] font-semibold text-[#475569]">Favorit</span>
                    </button>
                    <button onClick={handleDownload} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#F1F5F9] bg-white shadow-sm active:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-semibold text-[#475569]">Unduh</span>
                    </button>
                    <button onClick={handleShare} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#F1F5F9] bg-white shadow-sm active:bg-gray-50 transition-colors">
                        <Share2 className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-semibold text-[#475569]">Bagikan</span>
                    </button>
                    <button onClick={handlePlaylist} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#F1F5F9] bg-white shadow-sm active:bg-gray-50 transition-colors">
                        <ListPlus className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] font-semibold text-[#475569]">Playlist</span>
                    </button>
                </div>

                {/* Daftar Surah Al-Quran */}
                <div className="px-5 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[16px] font-extrabold text-[#1E293B]">Mulai Rekaman Hafalan</h3>
                    </div>

                    <div className="bg-[#F8FAFC] rounded-2xl p-2 space-y-3 max-h-[400px] overflow-y-auto">
                        {surahs.map((surah) => (
                            <Link 
                                key={surah.id} 
                                href={route('alquran.show', surah.id)}
                                className="flex items-center justify-between p-3 rounded-xl bg-white shadow-sm border border-[#F1F5F9] active:scale-[0.98] transition-transform"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#EEF2FF] text-[#5C5AE6] font-bold text-sm">
                                        {surah.number}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[14px] font-extrabold text-[#1E293B] mb-0.5">{surah.english_name}</h4>
                                        <p className="text-[11px] text-[#64748B]">{surah.english_name_translation}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[16px] font-arabic font-bold text-[#5C5AE6]">{surah.name}</p>
                                    <p className="text-[10px] text-[#94A3B8]">{surah.number_of_ayahs} Ayat</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Daftar Rekaman Saya */}
                <div className="px-5 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[16px] font-extrabold text-[#1E293B]">Riwayat Setoran Saya</h3>
                    </div>

                    <div className="bg-[#F8FAFC] rounded-2xl p-2 space-y-3">
                        {setorans.length > 0 ? setorans.map((setoran) => (
                            <div key={setoran.id} className="flex flex-col gap-2 p-3 rounded-xl bg-white shadow-sm border border-[#F1F5F9]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#EEF2FF] text-[#5C5AE6]">
                                        <Headphones className="w-5 h-5 ml-0" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[13px] font-extrabold text-[#1E293B] mb-0.5 truncate">
                                            {setoran.ayah?.surah?.english_name ? `Surat ${setoran.ayah.surah.english_name} - Ayat ${setoran.ayah.number_in_surah}` : `Setoran - ${timeAgo(setoran.created_at)}`}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${setoran.admin_comment_text || setoran.admin_comment_audio_path ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                                                {setoran.admin_comment_text || setoran.admin_comment_audio_path ? 'Telah Dievaluasi' : 'Menunggu Balasan'}
                                            </span>
                                            <span className="text-[10px] text-[#64748B]">{timeAgo(setoran.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-1">
                                    <audio src={setoran.file_path} controls className="w-full h-8" />
                                </div>

                                {(setoran.admin_comment_text || setoran.admin_comment_audio_path) && (
                                    <div className="mt-2 bg-[#F8FAFC] rounded-lg p-3 border border-emerald-100">
                                        <h5 className="text-[11px] font-extrabold text-[#1E293B] mb-1 flex items-center gap-1.5">
                                            <Shield className="w-3.5 h-3.5 text-emerald-500" />
                                            Balasan Super Admin (Ustadz)
                                        </h5>
                                        {setoran.admin_comment_text && (
                                            <p className="text-[11px] text-[#475569] italic mb-2">"{setoran.admin_comment_text}"</p>
                                        )}
                                        {setoran.admin_comment_audio_path && (
                                            <audio src={setoran.admin_comment_audio_path} controls className="w-full h-8" />
                                        )}
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="p-4 text-center">
                                <p className="text-[12px] text-[#64748B]">Anda belum memiliki riwayat rekaman setoran.</p>
                            </div>
                        )}
                    </div>
                </div>





                {/* Bottom Navigation (Replacing Koin with Rekaman) */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F1F5F9] z-50">
                    <div className="flex justify-around items-center h-[70px] pb-2">
                        {[
                            { id: 'home', label: 'Beranda', icon: Home, route: '/' },
                            { id: 'katalog', label: 'Katalog', icon: LayoutGrid, route: '/katalog' },
                            { id: 'video', label: 'Video Saya', icon: PlaySquare, route: '/videos' },
                            { id: 'rekaman', label: 'Rekaman', icon: Headphones, active: true, route: '/audios' },
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
                
                <style dangerouslySetInnerHTML={{__html: `
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}} />
            </div>

            {/* ─── DESKTOP VIEW ─── */}
            <div className="hidden md:block min-h-screen bg-[#F8FAFC] font-sans selection:bg-purple-600 selection:text-white pb-32">
                <Head title="Rekaman Audio & Talaqqi - Talaqee" />

                {/* Hidden Audio Player for Web Playback */}
                <audio
                    ref={audioPlayerRef}
                    src={currentTrack?.audio_url || 'https://server8.mp3quran.net/afs/055.mp3'}
                    onTimeUpdate={() => {
                        if (audioPlayerRef.current) {
                            setCurrentTime(audioPlayerRef.current.currentTime);
                            setTrackDuration(audioPlayerRef.current.duration || currentTrack?.duration || 0);
                        }
                    }}
                    onLoadedMetadata={() => {
                        if (audioPlayerRef.current) {
                            setTrackDuration(audioPlayerRef.current.duration || currentTrack?.duration || 0);
                        }
                    }}
                    onEnded={() => {
                        setIsPlayingTrack(false);
                        handleNextTrack();
                    }}
                />

                {/* Top Navigation */}
                <WebDesktopNav />

                {/* ─── HERO SPOTLIGHT SECTION ─── */}
                <div className="relative bg-gradient-to-br from-[#0B091A] via-[#161033] to-[#0A0E1A] text-white pt-10 pb-16 overflow-hidden border-b border-purple-950/40">
                    {/* Ambient Glow Lights */}
                    <div className="absolute -top-28 -left-28 w-96 h-96 bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />
                    <div className="absolute top-1/2 -right-32 w-[32rem] h-[32rem] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-400/10 rounded-full blur-[110px] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                        {/* Top Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold tracking-wide">
                                    <Sparkles size={13} className="text-purple-300" />
                                    REKAMAN AUDIO & TALAQQI ISLAMI
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-300 font-medium">
                                    {audios.length}+ Rekaman Audio & Murottal Pilihan
                                </span>
                            </div>

                            <div className="hidden sm:flex items-center gap-5 text-xs text-gray-300">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle size={14} className="text-emerald-400" />
                                    <span>Audio Jernih & Khusyuk</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} className="text-amber-400" />
                                    <span>Bimbingan Asatidzah</span>
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
                                            Audio Pilihan
                                        </span>
                                        {spotlightAudio.category && (
                                            <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-gray-200 text-[11px] font-semibold">
                                                {spotlightAudio.category.name}
                                            </span>
                                        )}
                                    </div>

                                    <h1 className="text-3xl lg:text-4xl xl:text-[40px] font-black tracking-tight text-white leading-tight mb-3">
                                        {spotlightAudio.title}
                                    </h1>

                                    <p className="text-sm lg:text-[15px] text-gray-300/90 leading-relaxed max-w-xl line-clamp-3 mb-5">
                                        {spotlightAudio.description || "Dengarkan lantunan ayat Al-Qur'an dan kajian ilmu syar'i secara jernih untuk menemani aktivitas, menambah wawasan, dan menenteramkan hati."}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                            <CircleUserRound size={15} className="text-purple-400" />
                                            <span className="font-semibold text-white">{spotlightAudio.author?.name || 'Qari / Ustadz'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-300">
                                            <Clock size={14} className="text-purple-400" />
                                            <span>{formatDuration(spotlightAudio.duration)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-300">
                                            <Headphones size={14} className="text-purple-400" />
                                            <span>{formatPlays(spotlightAudio.total_plays)} didengar</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap items-center gap-3 pt-1">
                                    <button
                                        onClick={() => playTrack(spotlightAudio)}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                                    >
                                        {isPlayingTrack && currentTrack?.id === spotlightAudio.id ? (
                                            <>
                                                <Pause size={16} fill="white" />
                                                <span>Jeda Audio</span>
                                            </>
                                        ) : (
                                            <>
                                                <Play size={16} fill="white" />
                                                <span>Putar Sekarang</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            const target = document.getElementById('audio-catalog-section');
                                            target?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
                                    >
                                        <span>Jelajahi Semua ({audios.length})</span>
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
                                            placeholder="Cari judul audio, topik kajian, atau nama qari / ustadz..."
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
                                                const target = document.getElementById('audio-catalog-section');
                                                target?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center cursor-pointer"
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
                                                    const target = document.getElementById('audio-catalog-section');
                                                    target?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
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

                            {/* Right Column: Spotlight Audio Player Showcase */}
                            <div className="lg:col-span-5 flex justify-center">
                                <div className="group relative w-full max-w-md bg-gradient-to-b from-white/10 to-white/5 rounded-3xl p-6 border border-white/20 shadow-2xl backdrop-blur-xl">
                                    <div className="flex gap-5 items-center mb-6">
                                        <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-lg border border-white/20 shrink-0 bg-slate-900">
                                            <img
                                                src={getCoverUrl(spotlightAudio.cover)}
                                                alt={spotlightAudio.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                <button
                                                    onClick={() => playTrack(spotlightAudio)}
                                                    className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                                                >
                                                    {isPlayingTrack && currentTrack?.id === spotlightAudio.id ? (
                                                        <Pause size={20} fill="white" />
                                                    ) : (
                                                        <Play size={20} fill="white" className="ml-0.5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded inline-block mb-1.5">
                                                Sedang Ditampilkan
                                            </span>
                                            <h3 className="font-extrabold text-white text-base leading-snug line-clamp-2 mb-1">
                                                {spotlightAudio.title}
                                            </h3>
                                            <p className="text-xs text-gray-300 font-medium truncate mb-2">
                                                {spotlightAudio.author?.name || 'Qari / Ustadz'}
                                            </p>
                                            <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5">
                                                <Clock size={12} className="text-purple-400" />
                                                {formatDuration(spotlightAudio.duration)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Visualizer Soundwave */}
                                    <div className="bg-black/30 rounded-2xl p-4 border border-white/10 mb-4">
                                        <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold mb-2">
                                            <span>Equalizer Visualizer</span>
                                            <span className={isPlayingTrack && currentTrack?.id === spotlightAudio.id ? 'text-emerald-400 animate-pulse' : 'text-gray-400'}>
                                                {isPlayingTrack && currentTrack?.id === spotlightAudio.id ? '● Playing' : '○ Standby'}
                                            </span>
                                        </div>
                                        {generateSoundwave(spotlightAudio.id, isPlayingTrack && currentTrack?.id === spotlightAudio.id)}
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-300">
                                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                            <Headphones size={13} className="text-purple-400" />
                                            {formatPlays(spotlightAudio.total_plays)} pendengar
                                        </span>
                                        <button
                                            onClick={() => playTrack(spotlightAudio)}
                                            className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                                        >
                                            <span>{isPlayingTrack && currentTrack?.id === spotlightAudio.id ? 'Jeda Suara' : 'Dengarkan Sekarang'}</span>
                                            <ArrowRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── CATALOG & MAIN CONTENT SECTION ─── */}
                <div id="audio-catalog-section" className="max-w-7xl mx-auto px-6 lg:px-8 py-10 scroll-mt-24">
                    
                    {/* Header Controls Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200/80">
                        <div>
                            <div className="flex items-center gap-2.5 mb-1">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                    Katalog Rekaman Audio & Talaqqi
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                                    {filteredDesktopAudios.length} Audio
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Dengarkan lantunan tartil ayat suci Al-Qur'an dan bimbingan tajwid ilmiah berkualitas tinggi.
                            </p>
                        </div>

                        {/* Tabs & Sort Controls */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Tabs Switcher */}
                            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-200/80 shadow-sm">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        activeTab === 'all'
                                            ? 'bg-purple-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => setActiveTab('popular')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        activeTab === 'popular'
                                            ? 'bg-purple-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Terpopuler
                                </button>
                                <button
                                    onClick={() => setActiveTab('recent')}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        activeTab === 'recent'
                                            ? 'bg-purple-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Terbaru
                                </button>
                                {setorans.length > 0 && (
                                    <button
                                        onClick={() => setActiveTab('setoran')}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            activeTab === 'setoran'
                                                ? 'bg-purple-600 text-white shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Setoran Saya ({setorans.length})
                                    </button>
                                )}
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    value={desktopSort}
                                    onChange={(e) => setDesktopSort(e.target.value as any)}
                                    className="appearance-none bg-white border border-gray-200 rounded-2xl pl-3.5 pr-8 py-2 text-xs font-bold text-gray-700 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 shadow-sm cursor-pointer"
                                >
                                    <option value="newest">Urutkan: Terbaru</option>
                                    <option value="popular">Urutkan: Paling Sering Didengar</option>
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
                                    <button onClick={() => setSelectedCategory('semua')} className="hover:text-purple-900 cursor-pointer">
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
                                    <button onClick={() => setDurationFilter('all')} className="hover:text-purple-900 cursor-pointer">
                                        <X size={13} />
                                    </button>
                                </span>
                            )}

                            {searchQuery.trim() !== '' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                                    <span>Kata Kunci: "{searchQuery}"</span>
                                    <button onClick={() => setSearchQuery('')} className="hover:text-purple-900 cursor-pointer">
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
                                className="text-xs font-bold text-red-500 hover:text-red-700 underline ml-2 cursor-pointer"
                            >
                                Reset Semua
                            </button>
                        </div>
                    )}

                    {/* Layout Grid: Left Sidebar + Audio List */}
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        
                        {/* ─── LEFT SIDEBAR (FILTERS) ─── */}
                        <div className="w-full lg:w-64 shrink-0 space-y-6">
                            
                            {/* Kategori Card */}
                            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Layers size={16} className="text-purple-600" />
                                        <h3 className="font-extrabold text-gray-900 text-sm">Kategori Audio</h3>
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-400">
                                        {categories.length}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory('semua')}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
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
                                            {audios.length}
                                        </span>
                                    </button>

                                    {categories.map((cat) => {
                                        const active = selectedCategory === cat.slug;
                                        const count = cat.audios_count !== undefined 
                                            ? cat.audios_count 
                                            : audios.filter(a => a.category?.slug === cat.slug).length;

                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.slug)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
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
                                    <h3 className="font-extrabold text-gray-900 text-sm">Durasi Audio</h3>
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
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
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

                            {/* Hadits Al-Qur'an Card */}
                            <div className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-2xl p-5 text-white relative overflow-hidden shadow-sm">
                                <div className="text-purple-300/60 mb-2">
                                    <Quote size={24} />
                                </div>
                                <p className="text-xs text-purple-100/90 leading-relaxed italic mb-3">
                                    "Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya."
                                </p>
                                <span className="text-[11px] font-bold text-amber-300 block">
                                    (HR. Bukhari No. 5027)
                                </span>
                            </div>

                        </div>

                        {/* ─── RIGHT CONTENT (TRACKS LISTING) ─── */}
                        <div className="flex-1 min-w-0 space-y-4">
                            
                            {/* SETORAN VIEW */}
                            {activeTab === 'setoran' && setorans.length > 0 ? (
                                <div className="space-y-4">
                                    <h3 className="font-extrabold text-gray-900 text-base mb-2">Riwayat Setoran Talaqqi Anda</h3>
                                    {setorans.map((setoran, idx) => (
                                        <div key={setoran.id || idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                                    <Mic size={22} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-gray-900">
                                                        {setoran.ayah?.surah?.name ? `Surah ${setoran.ayah.surah.name} (Ayat ${setoran.ayah.number_in_surah})` : `Setoran Hafalan #${idx + 1}`}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Diupload: {timeAgo(setoran.created_at)}
                                                    </p>
                                                    {setoran.admin_comment_text && (
                                                        <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-800">
                                                            <strong className="block text-[11px] font-bold text-amber-900 mb-0.5">Catatan Evaluasi Asatidzah:</strong>
                                                            {setoran.admin_comment_text}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {setoran.file_path && (
                                                <audio controls src={setoran.file_path.startsWith('http') ? setoran.file_path : `/storage/${setoran.file_path}`} className="h-9 w-60" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : filteredDesktopAudios.length > 0 ? (
                                /* AUDIO TRACKS LISTING */
                                <div className="space-y-3">
                                    {filteredDesktopAudios.map((audio, index) => {
                                        const isThisPlaying = isPlayingTrack && currentTrack?.id === audio.id;
                                        const isThisCurrent = currentTrack?.id === audio.id;

                                        return (
                                            <div
                                                key={audio.id}
                                                className={`group bg-white rounded-2xl p-3.5 border transition-all duration-300 flex items-center gap-4 shadow-sm hover:shadow-md ${
                                                    isThisCurrent
                                                        ? 'border-purple-300 bg-purple-50/20 shadow-purple-500/5'
                                                        : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                            >
                                                {/* Cover & Play Overlay */}
                                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 shadow-sm">
                                                    <img
                                                        src={getCoverUrl(audio.cover)}
                                                        alt={audio.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <button
                                                        onClick={() => playTrack(audio)}
                                                        className={`absolute inset-0 flex items-center justify-center transition-all cursor-pointer ${
                                                            isThisPlaying
                                                                ? 'bg-purple-900/60 opacity-100'
                                                                : 'bg-black/30 opacity-0 group-hover:opacity-100'
                                                        }`}
                                                    >
                                                        <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                                                            {isThisPlaying ? (
                                                                <Pause size={16} fill="white" />
                                                            ) : (
                                                                <Play size={16} fill="white" className="ml-0.5" />
                                                            )}
                                                        </div>
                                                    </button>
                                                </div>

                                                {/* Track Info */}
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {audio.category && (
                                                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100/60">
                                                                {audio.category.name}
                                                            </span>
                                                        )}
                                                        {isThisPlaying && (
                                                            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                                                                Memutar
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3
                                                        onClick={() => playTrack(audio)}
                                                        className={`font-bold text-[14px] sm:text-[15px] leading-snug line-clamp-1 mb-1 cursor-pointer transition-colors ${
                                                            isThisCurrent ? 'text-purple-600 font-extrabold' : 'text-gray-900 group-hover:text-purple-600'
                                                        }`}
                                                    >
                                                        {audio.title}
                                                    </h3>

                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                                        <span className="font-medium text-gray-700 flex items-center gap-1">
                                                            <CircleUserRound size={13} className="text-purple-500" />
                                                            {audio.author?.name || 'Qari / Ustadz'}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                                            <Headphones size={12} className="text-gray-400" />
                                                            {formatPlays(audio.total_plays)} didengar
                                                        </span>
                                                        <span>•</span>
                                                        <span className="text-[11px] text-gray-400">
                                                            {timeAgo(audio.created_at)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Soundwave Equalizer (Desktop only) */}
                                                <div className="hidden xl:block w-36 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {generateSoundwave(audio.id, isThisPlaying)}
                                                </div>

                                                {/* Duration & Actions */}
                                                <div className="flex items-center gap-3 shrink-0 pl-2">
                                                    <span className="text-xs font-bold text-gray-700 w-12 text-right">
                                                        {formatDuration(audio.duration)}
                                                    </span>

                                                    <button
                                                        onClick={() => playTrack(audio)}
                                                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                                            isThisPlaying
                                                                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                                                                : 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white'
                                                        }`}
                                                    >
                                                        {isThisPlaying ? (
                                                            <Pause size={16} fill="currentColor" />
                                                        ) : (
                                                            <Play size={16} fill="currentColor" className="ml-0.5" />
                                                        )}
                                                    </button>

                                                    <button
                                                        onClick={handleDownload}
                                                        title="Unduh rekaman"
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                                                    >
                                                        <Download size={15} />
                                                    </button>

                                                    <button
                                                        onClick={handleFavorite}
                                                        title="Favorit"
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                    >
                                                        <Heart size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                /* Empty State */
                                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                                    <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                                        <Headphones size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        Tidak Ada Rekaman Audio Ditemukan
                                    </h3>
                                    <p className="text-xs text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
                                        Tidak ada rekaman audio yang sesuai dengan filter atau pencarian "{searchQuery}". Silakan coba kata kunci lain atau setel ulang filter.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('semua');
                                            setDurationFilter('all');
                                            setSearchQuery('');
                                            setActiveTab('all');
                                        }}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                                    >
                                        <RotateCcw size={14} />
                                        <span>Reset Semua Filter</span>
                                    </button>
                                </div>
                            )}

                        </div>

                    </div>

                </div>

                {/* ─── STICKY BOTTOM AUDIO PLAYER ─── */}
                {currentTrack && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-50">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between gap-6">
                            
                            {/* Track Info (Left) */}
                            <div className="flex items-center gap-3.5 w-1/4 min-w-[220px]">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 shadow-sm border border-gray-200/60">
                                    <img
                                        src={getCoverUrl(currentTrack.cover)}
                                        alt={currentTrack.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                        {currentTrack.title}
                                    </h4>
                                    <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                        <CircleUserRound size={11} className="text-purple-500 shrink-0" />
                                        <span>{currentTrack.author?.name || 'Qari / Ustadz'}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Center Controls & Seek Bar */}
                            <div className="flex-1 flex flex-col items-center justify-center max-w-xl">
                                {/* Buttons */}
                                <div className="flex items-center gap-5 mb-1.5">
                                    <button
                                        onClick={handlePrevTrack}
                                        title="Sebelumnya"
                                        className="text-gray-500 hover:text-purple-600 transition-colors cursor-pointer"
                                    >
                                        <SkipBack size={18} fill="currentColor" />
                                    </button>

                                    <button
                                        onClick={togglePlayCurrent}
                                        className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                    >
                                        {isPlayingTrack ? (
                                            <Pause size={18} fill="white" />
                                        ) : (
                                            <Play size={18} fill="white" className="ml-0.5" />
                                        )}
                                    </button>

                                    <button
                                        onClick={handleNextTrack}
                                        title="Selanjutnya"
                                        className="text-gray-500 hover:text-purple-600 transition-colors cursor-pointer"
                                    >
                                        <SkipForward size={18} fill="currentColor" />
                                    </button>

                                    <button
                                        onClick={changeSpeed}
                                        className="text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                                        title="Ubah Kecepatan Putar"
                                    >
                                        {playbackSpeed}x
                                    </button>
                                </div>

                                {/* Scrubber Progress Bar */}
                                <div className="w-full flex items-center gap-3 text-[11px] font-semibold text-gray-500">
                                    <span className="w-10 text-right">{formatDuration(Math.floor(currentTime))}</span>
                                    <div
                                        onClick={handleSeek}
                                        className="flex-1 h-2 bg-gray-200 rounded-full relative cursor-pointer group"
                                    >
                                        <div
                                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                                            style={{
                                                width: `${trackDuration > 0 ? (currentTime / trackDuration) * 100 : 0}%`,
                                            }}
                                        />
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-purple-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{
                                                left: `${trackDuration > 0 ? (currentTime / trackDuration) * 100 : 0}%`,
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        />
                                    </div>
                                    <span className="w-10">{formatDuration(Math.floor(trackDuration || currentTrack.duration))}</span>
                                </div>
                            </div>

                            {/* Right Actions: Volume & Controls */}
                            <div className="flex items-center justify-end gap-4 w-1/4 min-w-[200px]">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={toggleMute}
                                        className="text-gray-500 hover:text-purple-600 transition-colors cursor-pointer"
                                    >
                                        {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={isMuted ? 0 : volume}
                                        onChange={(e) => {
                                            const v = parseFloat(e.target.value);
                                            setVolume(v);
                                            setIsMuted(false);
                                            if (audioPlayerRef.current) {
                                                audioPlayerRef.current.volume = v;
                                                audioPlayerRef.current.muted = false;
                                            }
                                        }}
                                        className="w-16 h-1.5 accent-purple-600 bg-gray-200 rounded-lg cursor-pointer"
                                    />
                                </div>

                                <button
                                    onClick={handleDownload}
                                    title="Unduh rekaman"
                                    className="p-2 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                                >
                                    <Download size={16} />
                                </button>

                                <button
                                    onClick={handleFavorite}
                                    title="Sukai rekaman"
                                    className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                    <Heart size={16} />
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {/* ─── WEB FOOTER ─── */}
                <WebFooter />

            </div>
        </>
    );
}
