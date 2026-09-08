import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, ChevronDown, Check, X, Tag, Sparkles } from 'lucide-react';

export interface IconOption {
    id?: number;
    name: string;
    label?: string;
    category?: string;
}

interface IconSelectProps {
    value: string;
    onChange: (iconName: string) => void;
    icons?: IconOption[];
    error?: string;
    label?: string;
    placeholder?: string;
}

// Fallback list of common Lucide icons if database icons are not supplied
const DEFAULT_ICONS: IconOption[] = [
    { name: 'Book', label: 'Buku', category: 'Edukasi' },
    { name: 'BookOpen', label: 'Buku Terbuka', category: 'Edukasi' },
    { name: 'Bookmark', label: 'Penanda Buku', category: 'Edukasi' },
    { name: 'Library', label: 'Perpustakaan', category: 'Edukasi' },
    { name: 'GraduationCap', label: 'Edukasi', category: 'Edukasi' },
    { name: 'FileText', label: 'Dokumen', category: 'Edukasi' },
    { name: 'Feather', label: 'Pena', category: 'Edukasi' },
    { name: 'Compass', label: 'Kompas', category: 'Edukasi' },
    { name: 'Moon', label: 'Bulan / Agama', category: 'Agama' },
    { name: 'Sun', label: 'Matahari', category: 'Agama' },
    { name: 'Heart', label: 'Hati', category: 'Agama' },
    { name: 'ShieldCheck', label: 'Keamanan', category: 'Agama' },
    { name: 'Mic', label: 'Mikrofon', category: 'Media' },
    { name: 'Headphones', label: 'Headphone', category: 'Media' },
    { name: 'Music', label: 'Musik', category: 'Media' },
    { name: 'Volume2', label: 'Audio', category: 'Media' },
    { name: 'Video', label: 'Video', category: 'Media' },
    { name: 'PlaySquare', label: 'Player', category: 'Media' },
    { name: 'Tag', label: 'Tag/Kategori', category: 'Umum' },
    { name: 'Grid', label: 'Grid', category: 'Umum' },
    { name: 'LayoutGrid', label: 'Tata Letak', category: 'Umum' },
    { name: 'LayoutDashboard', label: 'Dashboard', category: 'Umum' },
    { name: 'Star', label: 'Bintang', category: 'Umum' },
    { name: 'Sparkles', label: 'Kilauan', category: 'Umum' },
    { name: 'Zap', label: 'Petir', category: 'Umum' },
    { name: 'Globe', label: 'Dunia', category: 'Umum' },
    { name: 'Search', label: 'Pencarian', category: 'Umum' },
    { name: 'Settings', label: 'Pengaturan', category: 'Umum' },
    { name: 'Bell', label: 'Notifikasi', category: 'Umum' },
    { name: 'ShoppingCart', label: 'Toko', category: 'Bisnis' },
    { name: 'CreditCard', label: 'Kartu', category: 'Bisnis' },
    { name: 'Wallet', label: 'Dompet', category: 'Bisnis' },
    { name: 'Coins', label: 'Koin', category: 'Bisnis' },
    { name: 'TrendingUp', label: 'Tren', category: 'Bisnis' },
    { name: 'Box', label: 'Kotak', category: 'Bisnis' },
    { name: 'Users', label: 'Pengguna', category: 'Pengguna' },
    { name: 'MessageCircle', label: 'Pesan', category: 'Pengguna' },
];

export const renderLucideIcon = (iconName: string, size = 18, className = '') => {
    if (!iconName) return <Tag size={size} className={className} />;
    const Component = (LucideIcons as any)[iconName];
    if (!Component) return <Tag size={size} className={className} />;
    return <Component size={size} className={className} />;
};

export default function IconSelect({
    value,
    onChange,
    icons = [],
    error,
    label = 'Pilih Ikon',
    placeholder = 'Pilih ikon kategori...',
}: IconSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const containerRef = useRef<HTMLDivElement>(null);

    const availableIcons = useMemo(() => {
        return icons && icons.length > 0 ? icons : DEFAULT_ICONS;
    }, [icons]);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(availableIcons.map(i => i.category || 'Umum')));
        return ['all', ...unique];
    }, [availableIcons]);

    const filteredIcons = useMemo(() => {
        return availableIcons.filter(icon => {
            const matchesCategory = selectedCategory === 'all' || (icon.category || 'Umum') === selectedCategory;
            const matchesSearch = 
                icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (icon.label && icon.label.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [availableIcons, selectedCategory, searchTerm]);

    const currentIcon = useMemo(() => {
        return availableIcons.find(i => i.name.toLowerCase() === (value || '').toLowerCase());
    }, [availableIcons, value]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (iconName: string) => {
        onChange(iconName);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            {/* Trigger Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl cursor-pointer transition-all select-none shadow-sm ${
                    isOpen 
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-blue-500/5' 
                        : error 
                            ? 'border-red-400 hover:border-red-500' 
                            : 'border-gray-200 hover:border-gray-300'
                }`}
            >
                <div className="flex items-center gap-3 min-w-0">
                    {value ? (
                        <>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                {renderLucideIcon(value, 18)}
                            </div>
                            <div className="flex flex-col text-left truncate">
                                <span className="text-sm font-medium text-gray-900 truncate">
                                    {value}
                                </span>
                                {currentIcon?.label && (
                                    <span className="text-xs text-gray-400 truncate">
                                        {currentIcon.label} {currentIcon.category ? `• ${currentIcon.category}` : ''}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2.5 text-gray-400">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                <Sparkles size={16} />
                            </div>
                            <span className="text-sm">{placeholder}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                    {value && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                            title="Hapus pilihan ikon"
                        >
                            <X size={15} />
                        </button>
                    )}
                    <ChevronDown 
                        size={16} 
                        className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} 
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            {/* Dropdown Content */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full sm:w-[420px] bg-white rounded-2xl border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari ikon (misal: Book, Star, Tag)..."
                            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                            autoFocus
                        />
                    </div>

                    {/* Category Filter Pills */}
                    {categories.length > 2 && (
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                                        selectedCategory === cat
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {cat === 'all' ? 'Semua' : cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Icons Grid */}
                    <div className="max-h-60 overflow-y-auto pr-1 grid grid-cols-5 sm:grid-cols-6 gap-2">
                        {filteredIcons.map((icon) => {
                            const isSelected = value?.toLowerCase() === icon.name.toLowerCase();
                            return (
                                <button
                                    key={icon.name}
                                    type="button"
                                    onClick={() => handleSelect(icon.name)}
                                    className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                                        isSelected
                                            ? 'bg-blue-50 border-blue-500 text-blue-600 ring-2 ring-blue-500/20'
                                            : 'bg-gray-50/50 hover:bg-blue-50/60 border-gray-100 hover:border-blue-200 text-gray-700 hover:text-blue-600'
                                    }`}
                                    title={`${icon.name}${icon.label ? ` (${icon.label})` : ''}`}
                                >
                                    {isSelected && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xs">
                                            <Check size={10} strokeWidth={3} />
                                        </div>
                                    )}
                                    <div className="p-1 transition-transform group-hover:scale-110">
                                        {renderLucideIcon(icon.name, 20)}
                                    </div>
                                    <span className="text-[10px] font-medium truncate w-full mt-1 text-gray-500 group-hover:text-blue-600">
                                        {icon.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredIcons.length === 0 && (
                        <div className="py-6 text-center text-gray-400 space-y-1">
                            <Tag size={24} className="mx-auto text-gray-300" />
                            <p className="text-xs">Tidak ada ikon yang cocok dengan "{searchTerm}"</p>
                            <button
                                type="button"
                                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                                className="text-xs text-blue-600 font-medium hover:underline pt-1"
                            >
                                Reset Pencarian
                            </button>
                        </div>
                    )}

                    {/* Footer Info */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                        <span>{filteredIcons.length} ikon tersedia</span>
                        {value && (
                            <span className="text-blue-600 font-medium">Terpilih: {value}</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
