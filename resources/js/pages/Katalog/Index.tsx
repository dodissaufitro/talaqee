import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    Search, Bell, Plus, BookOpen, Video, Headphones, Medal, Grip,
    ChevronRight, PlaySquare, Home, LayoutGrid, CircleUserRound, CircleDollarSign,
    Heart, Star, Shield, Globe, Sun, Moon, Flame, Zap, Feather, Compass, Bookmark, Library
} from 'lucide-react';
import Welcome from '../welcome';
import NotificationBell from '@/components/NotificationBell';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
    color?: string | null;
}

interface Book {
    id: number;
    title: string;
    description: string;
    cover: string;
    price: number;
    coins_price: number;
    author?: {
        name: string;
    };
    category?: {
        name: string;
    };
}

interface KatalogProps {
    categories: Category[];
    popularBooks: Book[];
    bukuTerbaru: Book[];
}

export default function Katalog(props: KatalogProps) {
    const { auth } = usePage<any>().props;
    const user = auth?.user;
    const [visibleCount, setVisibleCount] = useState(12);
    const [showAllPilihan, setShowAllPilihan] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('semua');

    const filteredPilihan = props.popularBooks.filter(book => {
        if (selectedCategory === 'semua' || selectedCategory === 'terpopuler' || selectedCategory === 'lainnya') return true;
        return book.category?.name?.toLowerCase().includes(selectedCategory);
    });

    const filteredTerbaru = props.bukuTerbaru.filter(book => {
        if (selectedCategory === 'semua' || selectedCategory === 'lainnya') return true;
        if (selectedCategory === 'terpopuler') return props.popularBooks.some(p => p.id === book.id);
        return book.category?.name?.toLowerCase().includes(selectedCategory);
    });

    return (
        <>
            {/* Desktop View (Web) */}
            <div className="hidden md:block">
                <Welcome categories={props.categories} popularBooks={props.popularBooks} />
            </div>

            {/* Mobile View (Android) */}
            <div className="block md:hidden">
                <div className="min-h-screen bg-gray-50 overflow-x-hidden">
                    <div className="min-h-screen bg-white pb-24 shadow-sm relative overflow-x-hidden">
                        <Head title="Katalog" />

                        {/* Header section */}
                        <div className="px-6 pt-6 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0 pr-4">
                                    <h1 className="text-[22px] font-extrabold text-[#1E293B] leading-tight">Katalog</h1>
                                    <p className="text-[12px] text-[#64748B] mt-1 font-medium truncate">Temukan ribuan konten inspiratif</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Link href="/akun/topup" className="flex items-center gap-2 bg-white rounded-full px-2.5 py-1.5 border border-[#E2E8F0] shadow-sm hover:bg-gray-50 transition-colors">
                                        <div className="w-5 h-5 bg-[#FBBF24] rounded-full flex items-center justify-center text-white text-[10px] font-bold">C</div>
                                        <span className="font-extrabold text-[12px] text-[#1E293B]">{user?.coin_balance || 0}</span>
                                        <Plus className="w-4 h-4 text-[#3B82F6] font-bold" />
                                    </Link>
                                    <NotificationBell />
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="px-6 pb-5">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-[#94A3B8] stroke-[2]" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-11 pr-4 py-3 border border-[#E2E8F0] rounded-[14px] leading-5 bg-white placeholder-[#94A3B8] text-[#1E293B] font-medium focus:outline-none focus:ring-1 focus:ring-[#5C5AE6] focus:border-[#5C5AE6] text-[14px]"
                                    placeholder="Cari buku, penulis, atau kajian..."
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="pb-6 pt-2 flex overflow-x-auto gap-2 px-6 hide-scrollbar snap-x snap-mandatory">
                            {(() => {
                                const dynamicCategories = [
                                    { id: 'semua', label: 'Semua', icon: BookOpen, color: '#6366F1', bg: '#EEF2FF' },
                                    ...props.categories.map(cat => {
                                        let iconName = cat.icon;
                                        let hexColor = cat.color;

                                        // Fallback based on name if icon is null from production DB
                                        if (!iconName) {
                                            const lower = cat.name.toLowerCase();
                                            if (lower.includes('aqidah')) { iconName = 'Shield'; hexColor = '#10B981'; }
                                            else if (lower.includes('akhlak')) { iconName = 'Heart'; hexColor = '#3B82F6'; }
                                            else if (lower.includes('non-fiksi') || lower.includes('non fiksi')) { iconName = 'Bookmark'; hexColor = '#3B82F6'; }
                                            else if (lower.includes('fiksi')) { iconName = 'Feather'; hexColor = '#F43F5E'; }
                                            else if (lower.includes('bisnis')) { iconName = 'Globe'; hexColor = '#F59E0B'; }
                                            else if (lower.includes('anak')) { iconName = 'Star'; hexColor = '#8B5CF6'; }
                                            else if (lower.includes('komik')) { iconName = 'Zap'; hexColor = '#EC4899'; }
                                            else if (lower.includes('sains')) { iconName = 'Compass'; hexColor = '#06B6D4'; }
                                            else if (lower.includes('sejarah')) { iconName = 'Globe'; hexColor = '#8B5CF6'; }
                                            else { iconName = 'BookOpen'; hexColor = '#10B981'; }
                                        }

                                        let IconComponent = BookOpen;
                                        switch (iconName) {
                                            case 'Book': IconComponent = BookOpen; break;
                                            case 'BookOpen': IconComponent = BookOpen; break;
                                            case 'Bookmark': IconComponent = Bookmark; break;
                                            case 'Library': IconComponent = Library; break;
                                            case 'Heart': IconComponent = Heart; break;
                                            case 'Star': IconComponent = Star; break;
                                            case 'Medal': IconComponent = Medal; break;
                                            case 'Shield': IconComponent = Shield; break;
                                            case 'Globe': IconComponent = Globe; break;
                                            case 'Sun': IconComponent = Sun; break;
                                            case 'Moon': IconComponent = Moon; break;
                                            case 'Flame': IconComponent = Flame; break;
                                            case 'Zap': IconComponent = Zap; break;
                                            case 'Feather': IconComponent = Feather; break;
                                            case 'Compass': IconComponent = Compass; break;
                                            case 'LayoutGrid': IconComponent = LayoutGrid; break;
                                            case 'Video': IconComponent = Video; break;
                                            case 'Headphones': IconComponent = Headphones; break;
                                            default: IconComponent = BookOpen; break;
                                        }

                                        // Ensure a valid color is used
                                        const finalColor = hexColor || '#10B981';
                                        
                                        // Simple heuristic to create a light background color from the solid hex by applying low opacity
                                        // But here we can just use a generic light gray or matching very light background since we can't easily parse hex in basic JS without a lib. 
                                        // Actually, we can use the opacity tailwind hack or just set it to #f3f4f6 (gray-100) or similar.
                                        // For now, let's use a very light color or just the emerald one since we control the hex anyway.
                                        // To make it look good, let's use a standard light background.
                                        const bg = `${finalColor}1A`; // 10% opacity hex

                                        return {
                                            id: cat.slug,
                                            label: cat.name,
                                            icon: IconComponent,
                                            color: finalColor,
                                            bg: bg
                                        };
                                    })
                                ];

                                return dynamicCategories.map((cat) => {
                                    const isActive = selectedCategory === cat.id;
                                    return (
                                        <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="flex flex-col items-center gap-1.5 min-w-[60px] snap-center">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all ${isActive ? 'ring-2 ring-offset-1' : ''}`} style={{ backgroundColor: cat.bg, outlineColor: cat.color }}>
                                                <cat.icon className="w-5 h-5 stroke-[1.5]" style={{ color: cat.color }} />
                                            </div>
                                            <div className="flex flex-col items-center w-full">
                                                <span className="text-[10px] font-bold text-center leading-tight w-full truncate px-0.5" style={{ color: isActive ? '#6366F1' : '#475569' }}>
                                                    {cat.label}
                                                </span>
                                                {isActive && (
                                                    <div className="w-4 h-[2px] bg-[#6366F1] mt-0.5 rounded-full"></div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                });
                            })()}
                        </div>

                        {/* Banner */}
                        <div className="px-6 pb-6">
                            <div className="rounded-[16px] px-4 py-3 relative overflow-hidden flex items-center shadow-sm" style={{ minHeight: '90px', background: 'linear-gradient(135deg, #FEF9EC 0%, #FFF3CD 100%)' }}>
                                {/* Sparkle decorations */}
                                <svg className="absolute top-2 left-[54%]" width="12" height="12" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 0L8.2 5.8L14 7L8.2 8.2L7 14L5.8 8.2L0 7L5.8 5.8L7 0Z" fill="#F59E0B" opacity="0.8"/>
                                </svg>
                                <svg className="absolute top-3 right-5" width="8" height="8" viewBox="0 0 10 10" fill="none">
                                    <path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4L5 0Z" fill="#F59E0B" opacity="0.7"/>
                                </svg>
                                <svg className="absolute bottom-3 left-[51%]" width="7" height="7" viewBox="0 0 8 8" fill="none">
                                    <path d="M4 0L4.8 3.2L8 4L4.8 4.8L4 8L3.2 4.8L0 4L3.2 3.2L4 0Z" fill="#FBBF24" opacity="0.6"/>
                                </svg>

                                {/* Left content */}
                                <div className="relative z-10 flex-1 pr-2">
                                    <h2 className="text-[13px] font-extrabold text-[#1E293B] leading-snug mb-1">
                                        Baca lebih banyak,<br/>Dapatkan lebih banyak koin!
                                    </h2>
                                    <p className="text-[10px] font-medium text-[#64748B] leading-relaxed mb-2">
                                        Selesaikan misi harian dan dapatkan koin gratis setiap hari.
                                    </p>
                                    <button className="bg-[#5C5AE6] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#4F4DD6] transition shadow-sm">
                                        Lihat Misi
                                        <ChevronRight className="w-2.5 h-2.5" />
                                    </button>
                                </div>

                                {/* Gift illustration */}
                                <div className="relative z-10 shrink-0 w-[95px] h-[95px]">
                                    <img
                                        src="/images/katalog/book_world.png"
                                        alt="Buku Wawasan Dunia"
                                        className="w-full h-full object-contain drop-shadow-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terakhir Dibaca / Lanjutkan Membaca */}
                        <div className="px-6 pb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-[16px] font-extrabold text-[#1E293B]">Terakhir Dibaca</h3>
                            </div>
                            {(() => {
                                const lastRead = props.popularBooks && props.popularBooks.length > 0 ? props.popularBooks[0] : null;
                                
                                if (!lastRead) return null;
                                
                                return (
                                    <Link href={`/buku/${lastRead.id}`} className="flex bg-white border border-[#F1F5F9] rounded-2xl p-3 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition gap-4 items-center relative overflow-hidden">
                                        <div className="w-[64px] aspect-[3/4] shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-sm border border-gray-100 relative z-10">
                                            <img src={lastRead.cover ? (lastRead.cover.startsWith('http') || lastRead.cover.startsWith('/') ? lastRead.cover : `/storage/${lastRead.cover}`) : "/images/placeholders/book-cover.svg"} alt={lastRead.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 relative z-10">
                                            <h4 className="font-bold text-[13px] text-[#1E293B] leading-tight mb-1 line-clamp-1">{lastRead.title}</h4>
                                            <p className="text-[10px] font-medium text-[#64748B] mb-2">{lastRead.author?.name || 'Leila S. Chudori'}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#5C5AE6] w-[45%] rounded-full"></div>
                                                </div>
                                                <span className="text-[9px] font-bold text-[#5C5AE6]">45%</span>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#5C5AE6] flex items-center justify-center shrink-0 relative z-10 shadow-sm">
                                            <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                        
                                        {/* Subtle background shape */}
                                        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#EEF2FF]/60 to-transparent z-0"></div>
                                    </Link>
                                );
                            })()}
                        </div>

                        {/* Buku Pilihan */}
                        <div className="pb-8">
                            <div className="px-6 flex items-center justify-between mb-4">
                                <h3 className="text-[16px] font-extrabold text-[#1E293B]">Buku Pilihan</h3>
                                {filteredPilihan.length > 4 && (
                                    <button 
                                        onClick={() => setShowAllPilihan(!showAllPilihan)}
                                        className="text-[12px] text-[#3B82F6] font-bold flex items-center gap-0.5"
                                    >
                                        {showAllPilihan ? 'Tutup' : 'Lihat Semua'} <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllPilihan ? 'rotate-90' : ''}`} />
                                    </button>
                                )}
                            </div>
                            
                            {filteredPilihan.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2.5 px-6 pb-2">
                                {filteredPilihan.slice(0, showAllPilihan ? filteredPilihan.length : 4).map((book) => (
                                    <Link href={`/buku/${book.id}`} key={book.id} className="flex flex-col w-full block">
                                        <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-2 border border-[#F1F5F9]">
                                            <img src={book.cover ? (book.cover.startsWith('http') || book.cover.startsWith('/') ? book.cover : `/storage/${book.cover}`) : "/images/placeholders/book-cover.svg"} alt={book.title} className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="font-bold text-[9px] text-[#1E293B] leading-[1.3] mb-1 line-clamp-2 min-h-[24px]">{book.title}</h4>
                                        <p className="text-[8px] font-medium text-[#64748B] mb-1.5 truncate">{book.author?.name || 'Leila S. Chudori'}</p>
                                        <div className="flex items-center gap-1 mt-auto">
                                            <div className="w-3 h-3 bg-[#FBBF24] rounded-full flex items-center justify-center text-white text-[7px] font-bold shadow-sm">C</div>
                                            <span className="font-bold text-[9px] text-[#1E293B]">{book.coins_price || 0}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            ) : (
                                <div className="px-6 pb-2 text-[12px] text-gray-500 text-center">Belum ada buku di kategori ini.</div>
                            )}
                        </div>

                        {/* Buku Terbaru */}
                        <div className="pb-8">
                            <div className="px-6 flex items-center justify-between mb-4">
                                <h3 className="text-[16px] font-extrabold text-[#1E293B]">Buku Terbaru</h3>
                            </div>
                            
                            {filteredTerbaru.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2.5 px-6 pb-2">
                                {filteredTerbaru.slice(0, visibleCount).map((book) => (
                                    <Link href={`/buku/${book.id}`} key={book.id} className="flex flex-col w-full block">
                                        <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-2 border border-[#F1F5F9]">
                                            <img src={book.cover ? (book.cover.startsWith('http') || book.cover.startsWith('/') ? book.cover : `/storage/${book.cover}`) : "/images/placeholders/book-cover.svg"} alt={book.title} className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="font-bold text-[9px] text-[#1E293B] leading-[1.3] mb-1 line-clamp-2 min-h-[24px]">{book.title}</h4>
                                        <p className="text-[8px] font-medium text-[#64748B] mb-1.5 truncate">{book.author?.name || 'Leila S. Chudori'}</p>
                                        <div className="flex items-center gap-1 mt-auto">
                                            <div className="w-3 h-3 bg-[#FBBF24] rounded-full flex items-center justify-center text-white text-[7px] font-bold shadow-sm">C</div>
                                            <span className="font-bold text-[9px] text-[#1E293B]">{book.coins_price || 0}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            ) : (
                                <div className="px-6 pb-2 text-[12px] text-gray-500 text-center">Belum ada buku di kategori ini.</div>
                            )}
                            
                            {filteredTerbaru && visibleCount < filteredTerbaru.length && (
                                <div className="px-6 mt-4">
                                    <button 
                                        onClick={() => setVisibleCount(prev => prev + 8)}
                                        className="w-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5C5AE6] font-bold text-[12px] py-3 rounded-xl transition-colors flex items-center justify-center gap-1"
                                    >
                                        Tampilkan Lebih Banyak
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Bottom Navigation */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F1F5F9] md:max-w-md md:mx-auto z-50">
                            <div className="flex justify-around items-center h-[70px] pb-2">
                                {[
                                    { id: 'home', label: 'Beranda', icon: Home, route: '/' },
                                    { id: 'katalog', label: 'Katalog', icon: LayoutGrid, active: true, route: '/katalog' },
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
                </div>
            </div>
        </>
    );
}
