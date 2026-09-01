import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import NotificationBell from '@/components/NotificationBell';
import { 
    Search, BookOpen, Heart, Activity, Globe, Users, Smile, Shield,
    Quote, ChevronDown, ArrowRight, Star, Play, PlaySquare, MoreVertical, Download,
    SkipBack, SkipForward, Repeat, Shuffle, Volume2, ChevronUp, ArrowLeft, Bookmark, Share2, ListPlus, RotateCcw, RotateCw, Moon, LayoutGrid, CircleUserRound, Calendar, Headphones, Pause, ChevronRight, Home
} from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';

interface Author {
    name: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    videos_count?: number; // reusing this for audio count for simplicity
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
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
        
        if (diffInDays === 0) return 'Hari ini';
        if (diffInDays === 1) return 'Kemarin';
        if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`;
        return `${Math.floor(diffInDays / 30)} bulan lalu`;
    };

    const getCategoryIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('aqidah')) return <Shield size={16} />;
        if (lowerName.includes('fiqih')) return <BookOpen size={16} />;
        if (lowerName.includes('tafsir')) return <BookOpen size={16} />;
        if (lowerName.includes('hadits')) return <BookOpen size={16} />;
        if (lowerName.includes('akhlak')) return <Heart size={16} />;
        if (lowerName.includes('sejarah')) return <Globe size={16} />;
        if (lowerName.includes('motivasi')) return <Star size={16} />;
        if (lowerName.includes('keluarga')) return <Users size={16} />;
        if (lowerName.includes('anak')) return <Smile size={16} />;
        return <BookOpen size={16} />;
    };

    // Dummy soundwave generator (SVG lines)
    const generateSoundwave = (seed: number, isPlaying: boolean = false) => {
        const lines = 40;
        return (
            <div className="flex items-center gap-[2px] h-8 overflow-hidden w-full opacity-60">
                {Array.from({length: lines}).map((_, i) => {
                    const height = isPlaying 
                        ? Math.random() * 80 + 20 
                        : (Math.sin(i * 0.5 + seed) * 40 + 50); // static wave look
                    
                    return (
                        <div 
                            key={i} 
                            className="w-1 bg-[#d4c6f5] rounded-full"
                            style={{ height: `${height}%`, transition: 'height 0.2s ease' }}
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
                            <Link prefetch={['mount', 'hover']} href={item.route} key={item.id} className="flex flex-col items-center justify-center w-[20%] gap-1 relative mt-1">
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

            {/* DESKTOP VIEW */}
            <div className="hidden md:block min-h-screen bg-gray-50 font-sans selection:bg-[#7e57c2] selection:text-white pb-28">
            <Head title="Rekaman Audio - Talaqee" />

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
                            Rekaman Audio
                        </h1>
                        <p className="text-slate-500 text-[15px] mb-8 font-medium">
                            Dengarkan kajian ilmiah kapan saja dan di mana saja
                        </p>

                        {/* Search Bar */}
                        <div className="relative bg-white border border-gray-200 rounded-[10px] flex items-center p-1.5 shadow-[0_2px_10px_rgb(0,0,0,0.03)] max-w-[460px]">
                            <div className="pl-3 pr-2 text-slate-400">
                                <Search size={18} strokeWidth={2.5} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari rekaman audio, ustadz, atau topik..."
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
                                Ilmu adalah warisan para nabi.<br/>
                                Ambillah ilmu sebelum hilang,<br/>
                                yaitu dengan wafatnya<br/>
                                para ulama.
                            </p>
                            <p className="text-[#8155ff] font-semibold mt-4 text-[12px]">
                                (HR. Ibnu Majah)
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
                                className="w-full flex items-center justify-between px-4 py-2.5 transition-colors bg-[#f4f0ff] border-l-2 border-[#6c40e6] text-[#6c40e6]"
                            >
                                <div className="flex items-center gap-3">
                                    <Activity size={16} className="text-[#6c40e6]" strokeWidth={2.5} />
                                    <span className="text-[13px] font-bold">Semua Kategori</span>
                                </div>
                                <span className="text-[12px] font-semibold text-[#6c40e6]">
                                    256
                                </span>
                            </button>

                            {categories.map((cat, idx) => {
                                const colors = [
                                    'text-emerald-500', 'text-blue-500', 'text-orange-500', 'text-teal-500',
                                    'text-rose-500', 'text-indigo-500', 'text-amber-500', 'text-sky-500', 'text-fuchsia-500'
                                ];
                                const color = colors[idx % colors.length];

                                return (
                                    <button 
                                        key={cat.id}
                                        className="w-full flex items-center justify-between px-4 py-2.5 transition-colors text-gray-600 hover:bg-gray-50 border-l-2 border-transparent"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={color}>
                                                {getCategoryIcon(cat.name)}
                                            </div>
                                            <span className="text-[13px] font-medium">{cat.name}</span>
                                        </div>
                                        <span className="text-[12px] font-semibold text-gray-400">
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
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#6c40e6] focus:ring-[#6c40e6]" />
                                            <span className="text-[13px] text-gray-600 font-medium group-hover:text-gray-900">Pendek (&lt; 15 menit)</span>
                                        </div>
                                        <span className="text-[12px] text-gray-400">68</span>
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#6c40e6] focus:ring-[#6c40e6]" />
                                            <span className="text-[13px] text-gray-600 font-medium group-hover:text-gray-900">Sedang (15 - 60 menit)</span>
                                        </div>
                                        <span className="text-[12px] text-gray-400">132</span>
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#6c40e6] focus:ring-[#6c40e6]" />
                                            <span className="text-[13px] text-gray-600 font-medium group-hover:text-gray-900">Panjang (&gt; 60 menit)</span>
                                        </div>
                                        <span className="text-[12px] text-gray-400">56</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[13px] font-bold text-gray-900 mb-3">Urutkan</h4>
                                <div className="relative">
                                    <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] font-medium text-gray-700 focus:ring-[#6c40e6] focus:border-[#6c40e6] outline-none cursor-pointer">
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

                {/* Right Content (Audio List) */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-[18px] font-bold text-gray-900">Terbaru</h2>
                        <Link href="#" className="flex items-center gap-1 text-[13px] font-semibold text-[#6c40e6] hover:text-[#5b32cc] transition-colors">
                            Lihat Semua <ArrowRight size={14} />
                        </Link>
                    </div>
                    
                    <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-2 flex flex-col mb-8">
                        {audios.length > 0 ? audios.map((audio, index) => (
                            <div key={audio.id} className={`flex items-center gap-5 p-4 rounded-[14px] hover:bg-slate-50 transition-colors group ${index !== audios.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                
                                {/* Image & Play Button */}
                                <div className="relative w-28 h-20 rounded-[10px] overflow-hidden bg-gray-200 shrink-0 shadow-sm">
                                    <img 
                                        src={audio.cover || '/images/placeholders/video-thumb.svg'} 
                                        alt={audio.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <button className="w-10 h-10 rounded-full bg-[#6c40e6] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#6c40e6]/30 hover:bg-[#5b32cc] hover:scale-105 transition-all -ml-10 z-10">
                                    <Play size={18} className="ml-1" fill="currentColor" />
                                </button>

                                {/* Info */}
                                <div className="flex-1 min-w-0 pr-4 lg:border-r border-gray-100">
                                    <h3 className="font-bold text-gray-900 text-[14px] leading-tight mb-1 group-hover:text-[#6c40e6] transition-colors truncate">
                                        {audio.title}
                                    </h3>
                                    <p className="text-[13px] text-gray-500 mb-1.5 truncate">
                                        {audio.author?.name || 'Ustadz Anonim'}
                                    </p>
                                    <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                                        <span className="flex items-center gap-1.5">
                                            <Activity size={12} /> {formatPlays(audio.total_plays || Math.floor(Math.random() * 20000) + 1000)} plays
                                        </span>
                                        <span>•</span>
                                        <span>{timeAgo(audio.created_at || new Date().toISOString())}</span>
                                        {audio.category && (
                                            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#f4f0ff] text-[#6c40e6]">
                                                {audio.category.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Soundwave */}
                                <div className="w-48 shrink-0 hidden lg:block pr-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                    {generateSoundwave(audio.id, false)}
                                </div>

                                {/* Actions & Duration */}
                                <div className="flex items-center gap-4 shrink-0 pl-2">
                                    <span className="text-[13px] font-bold text-gray-700 w-10 text-center">
                                        {formatDuration(audio.duration || Math.floor(Math.random() * 3000) + 600)}
                                    </span>
                                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6c40e6] hover:bg-[#f4f0ff] transition-colors border border-transparent">
                                        <Download size={16} strokeWidth={2.5} />
                                    </button>
                                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-slate-100 transition-colors">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>

                            </div>
                        )) : (
                            Array(5).fill(null).map((_, index) => (
                                <div key={index} className={`flex items-center gap-5 p-4 rounded-[14px] hover:bg-slate-50 transition-colors group ${index !== 4 ? 'border-b border-gray-50' : ''}`}>
                                    <div className="relative w-28 h-20 rounded-[10px] overflow-hidden bg-slate-800 shrink-0 shadow-sm"></div>
                                    <button className="w-10 h-10 rounded-full bg-[#6c40e6] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#6c40e6]/30 hover:bg-[#5b32cc] -ml-10 z-10"><Play size={18} className="ml-1" fill="currentColor" /></button>
                                    <div className="flex-1 min-w-0 pr-4 lg:border-r border-gray-100">
                                        <h3 className="font-bold text-gray-900 text-[14px] mb-1 truncate">Tafsir Surat Al-Fatihah Ayat 1-7</h3>
                                        <p className="text-[13px] text-gray-500 mb-1.5 truncate">Ustadz Dr. Firanda Andirja, MA</p>
                                        <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                                            <span>23.4K plays</span><span>•</span><span>2 hari yang lalu</span>
                                            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#f4f0ff] text-[#6c40e6]">Tafsir</span>
                                        </div>
                                    </div>
                                    <div className="w-48 shrink-0 hidden lg:block pr-4 opacity-50 group-hover:opacity-100 transition-opacity">{generateSoundwave(index)}</div>
                                    <div className="flex items-center gap-4 shrink-0 pl-2">
                                        <span className="text-[13px] font-bold text-gray-700 w-10 text-center">45:12</span>
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6c40e6] hover:bg-[#f4f0ff]"><Download size={16} strokeWidth={2.5} /></button>
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-slate-100"><MoreVertical size={16} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex justify-center">
                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                            Muat Lebih Banyak <ChevronDown size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

            </div>

            {/* Sticky Audio Player */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50">
                <div className="w-full px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between gap-6">
                    
                    {/* Now Playing Info */}
                    <div className="flex items-center gap-4 w-1/4 min-w-[250px]">
                        <img 
                            src="/images/placeholders/audio-cover.svg" 
                            alt="Cover" 
                            className="w-14 h-14 rounded-lg object-cover shadow-sm"
                        />
                        <div className="min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate">Tafsir Surat Al-Fatihah Ayat 1-7</h4>
                            <p className="text-xs text-gray-500 truncate">Ustadz Dr. Firanda Andirja, MA</p>
                        </div>
                    </div>

                    {/* Controls & Progress */}
                    <div className="flex-1 flex flex-col items-center justify-center max-w-2xl">
                        <div className="flex items-center gap-6 mb-2">
                            <button className="text-gray-400 hover:text-[#7e57c2] transition-colors"><Shuffle size={18} /></button>
                            <button className="text-gray-700 hover:text-[#7e57c2] transition-colors"><SkipBack size={20} fill="currentColor" /></button>
                            <button className="w-10 h-10 rounded-full bg-[#7e57c2] text-white flex items-center justify-center shadow hover:bg-[#6b48a8] hover:scale-105 transition-all">
                                {/* PAUSE ICON for demo */}
                                <div className="flex gap-1">
                                    <div className="w-1 h-3.5 bg-white rounded-sm"></div>
                                    <div className="w-1 h-3.5 bg-white rounded-sm"></div>
                                </div>
                            </button>
                            <button className="text-gray-700 hover:text-[#7e57c2] transition-colors"><SkipForward size={20} fill="currentColor" /></button>
                            <button className="text-gray-400 hover:text-[#7e57c2] transition-colors"><Repeat size={18} /></button>
                        </div>
                        <div className="w-full flex items-center gap-3 text-[11px] font-medium text-gray-500">
                            <span>15:32</span>
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full relative cursor-pointer">
                                <div className="absolute left-0 top-0 h-full w-1/3 bg-[#7e57c2] rounded-full"></div>
                                <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#7e57c2] rounded-full border-2 border-white shadow-sm"></div>
                            </div>
                            <span>45:12</span>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center justify-end gap-5 w-1/4 min-w-[250px]">
                        <button className="text-gray-400 hover:text-gray-700"><Volume2 size={20} /></button>
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full relative cursor-pointer hidden lg:block">
                            <div className="absolute left-0 top-0 h-full w-2/3 bg-[#7e57c2] rounded-full"></div>
                        </div>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <button className="text-xs font-bold text-[#7e57c2] bg-[#f3eefe] px-2 py-1 rounded">1.0x <span className="text-[10px] font-normal text-gray-500">Kecepatan</span></button>
                        <button className="flex items-center gap-1.5 text-xs font-bold text-[#7e57c2] bg-white border border-[#e9dfff] px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50">
                            <Download size={14} /> Unduh
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50">
                            <ChevronUp size={20} />
                        </button>
                    </div>

                </div>
            </div>

        </div>
        </>
    );
}
