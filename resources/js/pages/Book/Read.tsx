import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    ArrowLeft, Bookmark, List, MoreVertical, 
    AlignLeft, PenSquare, Moon, Sun, MoreHorizontal,
    ChevronLeft, ChevronRight, Settings, Type, AlignJustify, Lock,
    BookOpen, Home
} from 'lucide-react';

interface BookReadProps {
    book?: any;
    book_id: number;
    chapter_id: number;
    chapter: any;
    chapters?: any[];
    purchased_chapter_ids: number[];
    is_favorited?: boolean;
}

export default function Read({ 
    book, 
    book_id, 
    chapter_id, 
    chapter, 
    chapters = [], 
    purchased_chapter_ids = [],
    is_favorited = false,
}: BookReadProps) {
    const { auth, flash } = usePage<any>().props;

    const [progress, setProgress] = useState(1);
    const totalPages = 1;

    const contentText = chapter?.content || "Belum ada konten untuk bab ini.";
    const paragraphs = contentText.split('\n').filter((p: string) => p.trim() !== '');

    // Settings State
    const fontSizes = ['text-[15px]', 'text-[17px]', 'text-[19px]', 'text-[21px]'];
    const [fontSizeIdx, setFontSizeIdx] = useState(1);

    const lineSpacings = ['leading-[1.6]', 'leading-[1.9]', 'leading-[2.3]'];
    const [lineSpacingIdx, setLineSpacingIdx] = useState(1);

    const fontFamilies = ['font-serif', 'font-sans'];
    const [fontFamilyIdx, setFontFamilyIdx] = useState(0);

    const themes = [
        { id: 'light', bg: 'bg-[#FCFBF8]', text: 'text-[#1F1F1F]', card: 'bg-white', border: 'border-gray-200/50', nav: 'bg-white border-gray-100', sidebar: 'bg-white border-gray-100' },
        { id: 'dark', bg: 'bg-gray-900', text: 'text-gray-200', card: 'bg-gray-800', border: 'border-gray-700', nav: 'bg-gray-950 border-gray-800', sidebar: 'bg-gray-800 border-gray-700' },
        { id: 'sepia', bg: 'bg-[#F4ECD8]', text: 'text-[#5C4033]', card: 'bg-[#FDF6E3]', border: 'border-[#E6D5B8]', nav: 'bg-[#FDF6E3] border-[#E6D5B8]', sidebar: 'bg-[#FDF6E3] border-[#E6D5B8]' }
    ];
    const [themeIdx, setThemeIdx] = useState(0);
    const currentTheme = themes[themeIdx];

    const [isBookmarked, setIsBookmarked] = useState(is_favorited);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const handleToggleBookmark = async () => {
        if (!auth?.user) {
            window.location.href = '/login';
            return;
        }
        const nextState = !isBookmarked;
        setIsBookmarked(nextState);
        const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content 
            || decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '');

        try {
            await fetch('/favorit/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-XSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ content_type: 'book', content_id: book_id })
            });
        } catch (e) {
            setIsBookmarked(!nextState);
        }
    };

    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState(false);
    const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

    const sortedChapters = chapters.length > 0 ? chapters : [chapter];
    const currentIdx = sortedChapters.findIndex((c: any) => c.id === chapter?.id);
    const prevChapter = currentIdx > 0 ? sortedChapters[currentIdx - 1] : null;
    const nextChapter = currentIdx >= 0 && currentIdx < sortedChapters.length - 1 ? sortedChapters[currentIdx + 1] : null;

    useEffect(() => {
        if (flash?.error) {
            setErrorModal({ isOpen: true, message: flash.error });
        }
    }, [flash]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('last_book_url', window.location.pathname);
        }
    }, [book_id, chapter_id]);

    const isLocked = chapter?.is_locked;
    const coinBalance = auth?.user?.coin_balance || 0;
    const requiredCoin = chapter?.coin_price ?? 10;

    const handleUnlockClick = () => {
        if (!auth?.user) {
            window.location.href = '/login';
            return;
        }
        if (coinBalance < requiredCoin) {
            const returnUrl = window.location.pathname;
            sessionStorage.setItem('last_book_url', returnUrl);
            router.visit(`/akun/topup?return_url=${encodeURIComponent(returnUrl)}`);
            return;
        }
        setConfirmModal(true);
    };

    const proceedUnlock = () => {
        if (coinBalance < requiredCoin) {
            setConfirmModal(false);
            const returnUrl = window.location.pathname;
            sessionStorage.setItem('last_book_url', returnUrl);
            router.visit(`/akun/topup?return_url=${encodeURIComponent(returnUrl)}`);
            return;
        }
        router.post(`/buku/${book_id}/chapter/${chapter_id}/unlock`, {}, { preserveScroll: true });
        setConfirmModal(false);
    };

    const ChapterSidebar = () => (
        <div className={`${currentTheme.sidebar} border rounded-2xl overflow-hidden`}>
            <div className={`px-4 py-3 border-b ${currentTheme.border} flex items-center justify-between`}>
                <h3 className={`font-bold text-sm ${currentTheme.text}`}>
                    <List className="w-4 h-4 inline mr-2 opacity-70" />
                    Daftar Isi ({sortedChapters.length} Bab)
                </h3>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-280px)] p-2">
                {sortedChapters.map((c: any) => {
                    const isCurrent = c.id === chapter?.id;
                    const locked = !c.is_free && !purchased_chapter_ids.includes(c.id);
                    return (
                        <Link
                            key={c.id}
                            href={`/buku/${book_id}/read/${c.id}`}
                            className={`flex items-center justify-between p-2.5 rounded-xl mb-1 transition-colors text-sm ${
                                isCurrent 
                                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                                    : `${currentTheme.id === 'dark' ? 'hover:bg-gray-700/50 text-gray-300' : 'hover:bg-gray-100/80 text-gray-700'}`
                            }`}
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${isCurrent ? 'bg-white/20 text-white' : currentTheme.id === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                    {c.chapter_number}
                                </span>
                                <span className="text-xs truncate">{c.title}</span>
                            </div>
                            {c.is_free ? (
                                <span className={`text-[9px] shrink-0 ml-1 ${isCurrent ? 'text-white/80' : 'text-emerald-500'}`}>Gratis</span>
                            ) : locked ? (
                                <Lock className={`w-3 h-3 shrink-0 ml-1 ${isCurrent ? 'text-white/80' : 'text-amber-500'}`} />
                            ) : (
                                <span className={`text-[9px] shrink-0 ml-1 ${isCurrent ? 'text-white/80' : 'text-blue-500'}`}>✓</span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );

    const SettingsPanel = () => (
        <div className={`${currentTheme.sidebar} border ${currentTheme.border} rounded-2xl p-4`}>
            <h3 className={`font-bold text-sm ${currentTheme.text} mb-4`}>Pengaturan Tampilan</h3>
            
            {/* Font Size */}
            <div className="mb-4">
                <label className={`text-xs font-medium ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>Ukuran Font</label>
                <div className="flex gap-1">
                    {['S', 'M', 'L', 'XL'].map((size, i) => (
                        <button
                            key={i}
                            onClick={() => setFontSizeIdx(i)}
                            className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-colors ${fontSizeIdx === i ? 'bg-blue-600 text-white' : currentTheme.id === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Line Spacing */}
            <div className="mb-4">
                <label className={`text-xs font-medium ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>Jarak Baris</label>
                <div className="flex gap-1">
                    {['Rapat', 'Normal', 'Lega'].map((spacing, i) => (
                        <button
                            key={i}
                            onClick={() => setLineSpacingIdx(i)}
                            className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-colors ${lineSpacingIdx === i ? 'bg-blue-600 text-white' : currentTheme.id === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {spacing}
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Family */}
            <div className="mb-4">
                <label className={`text-xs font-medium ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>Jenis Font</label>
                <div className="flex gap-1">
                    {['Serif', 'Sans'].map((font, i) => (
                        <button
                            key={i}
                            onClick={() => setFontFamilyIdx(i)}
                            className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-colors ${fontFamilyIdx === i ? 'bg-blue-600 text-white' : currentTheme.id === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${i === 0 ? 'font-serif' : 'font-sans'}`}
                        >
                            {font}
                        </button>
                    ))}
                </div>
            </div>

            {/* Theme */}
            <div>
                <label className={`text-xs font-medium ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>Tema</label>
                <div className="flex gap-2">
                    {themes.map((theme, i) => (
                        <button
                            key={theme.id}
                            onClick={() => setThemeIdx(i)}
                            title={theme.id}
                            className={`flex-1 h-8 rounded-lg border-2 transition-all ${themeIdx === i ? 'border-blue-600 scale-105' : 'border-transparent'} ${theme.bg}`}
                        >
                            <span className={`text-[9px] font-bold ${theme.text}`}>{theme.id === 'light' ? '☀' : theme.id === 'dark' ? '🌙' : '📜'}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen ${currentTheme.bg} font-sans transition-colors duration-300 relative`}>
            <Head title={`Membaca: ${chapter?.title || 'Bab'} - ${book?.title || 'Buku'}`} />

            {/* Modals */}
            {activeModal === 'daftar-isi' && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm md:hidden" onClick={() => setActiveModal(null)}>
                    <div className={`${currentTheme.card} ${currentTheme.text} w-full max-w-md rounded-2xl p-6 shadow-xl border ${currentTheme.border} max-h-[80vh] flex flex-col`} onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between pb-3 border-b mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <List className="w-5 h-5 text-blue-600" />
                                Daftar Isi ({sortedChapters.length} Bab)
                            </h3>
                            <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 text-lg font-bold px-2">&times;</button>
                        </div>
                        <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                            {sortedChapters.map((c: any) => {
                                const isCurrent = c.id === chapter?.id;
                                const locked = !c.is_free && !purchased_chapter_ids.includes(c.id);
                                return (
                                    <Link key={c.id} href={`/buku/${book_id}/read/${c.id}`} onClick={() => setActiveModal(null)}
                                        className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${isCurrent ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : `${currentTheme.border} hover:bg-gray-50/50`}`}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className={`text-xs px-2 py-0.5 rounded font-mono ${isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Bab {c.chapter_number}</span>
                                            <span className="text-sm truncate">{c.title}</span>
                                        </div>
                                        <div>
                                            {c.is_free ? <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Gratis</span>
                                            : locked ? <Lock className="w-4 h-4 text-amber-500" />
                                            : <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">Terbuka</span>}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {errorModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`${currentTheme.bg} rounded-2xl w-full max-w-[320px] p-6 shadow-2xl text-center border ${currentTheme.border}`}>
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className={`text-base font-bold mb-2 ${currentTheme.text}`}>Gagal Membuka Bab</h3>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">{errorModal.message}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setErrorModal({ isOpen: false, message: '' })} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition">Batal</button>
                            <Link href="/akun/topup" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center">Top Up Koin</Link>
                        </div>
                    </div>
                </div>
            )}

            {confirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`${currentTheme.card} rounded-2xl w-full max-w-[320px] p-6 shadow-2xl text-center border ${currentTheme.border}`}>
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className={`text-base font-bold mb-2 ${currentTheme.text}`}>Buka Bab {chapter?.chapter_number || chapter_id}?</h3>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                            Akan menggunakan <strong>{chapter?.coin_price || 10} koin</strong> dari saldo koin Talaqee Anda.
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => setConfirmModal(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition">Batal</button>
                            <button onClick={proceedUnlock} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-sm">Ya, Buka</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===================== MOBILE VIEW ===================== */}
            <div className="block md:hidden pb-28">
                {/* Mobile Top Bar */}
                <div className={`sticky top-0 z-50 ${currentTheme.bg} transition-colors duration-300`}>
                    <div className={`flex items-center justify-between px-4 h-14 border-b ${currentTheme.border}`}>
                        <div className="flex items-center gap-3">
                            <Link href={`/buku/${book_id}`} className={`p-1 -ml-1 ${currentTheme.id === 'dark' ? 'text-gray-300' : 'text-gray-800'} rounded-full`}>
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div className="flex flex-col">
                                <h1 className={`text-[15px] font-extrabold leading-tight ${currentTheme.id === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{book?.title || 'Membaca Buku'}</h1>
                                <div className={`text-[11px] font-medium ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {book?.author?.name || ''} {book?.author?.name ? '•' : ''} Bab {chapter?.chapter_number || chapter_id}
                                </div>
                            </div>
                        </div>
                        <div className={`flex items-center gap-1.5 ${currentTheme.id === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                            <button onClick={handleToggleBookmark} className={`p-1.5 rounded-full ${isBookmarked ? 'text-blue-600' : ''}`}>
                                <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
                            </button>
                            <button onClick={() => setActiveModal('daftar-isi')} className="p-1.5 rounded-full">
                                <List className="w-5 h-5" />
                            </button>
                            <button onClick={() => setThemeIdx((themeIdx + 1) % themes.length)} className="p-1.5 rounded-full">
                                {currentTheme.id === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Reading toolbar */}
                    {!isLocked && (
                        <div className={`flex items-center px-4 py-2 border-b ${currentTheme.border} overflow-x-auto hide-scrollbar gap-2`}>
                            <button onClick={() => setActiveModal('daftar-isi')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <AlignLeft className="w-4 h-4" />
                                <span className="text-[12px] font-medium">Daftar Isi</span>
                            </button>
                            <button onClick={handleToggleBookmark} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 ${isBookmarked ? 'text-blue-600 font-bold' : currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                                <span className="text-[12px] font-medium">Bookmark</span>
                            </button>
                            <div className={`w-[1px] h-4 mx-1 shrink-0 ${currentTheme.id === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                            <button onClick={() => setThemeIdx((themeIdx + 1) % themes.length)} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full shrink-0 shadow-sm transition-colors ${currentTheme.id === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                                <Moon className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-bold">{currentTheme.id === 'light' ? 'Mode Malam' : currentTheme.id === 'dark' ? 'Mode Sepia' : 'Mode Terang'}</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className={`relative max-w-2xl mx-auto px-6 py-10 ${isLocked ? 'overflow-hidden max-h-[65vh]' : ''}`}>
                    {/* Navigation Arrows */}
                    {prevChapter && (
                        <Link href={`/buku/${book_id}/read/${prevChapter.id}`} className="fixed left-2 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1.5 group">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border transition-colors ${currentTheme.id === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-100 text-gray-600 group-hover:text-blue-600'}`}>
                                <ChevronLeft className="w-6 h-6" />
                            </div>
                        </Link>
                    )}
                    {nextChapter && (
                        <Link href={`/buku/${book_id}/read/${nextChapter.id}`} className="fixed right-2 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1.5 group">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border transition-colors ${currentTheme.id === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-100 text-gray-600 group-hover:text-blue-600'}`}>
                                <ChevronRight className="w-6 h-6" />
                            </div>
                        </Link>
                    )}

                    <div className={`${fontFamilies[fontFamilyIdx]} ${currentTheme.text} transition-all duration-300`}>
                        <div className="text-center mb-10">
                            <p className={`text-[13px] font-bold mb-3 tracking-[0.2em] ${currentTheme.id === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>BAB {chapter?.chapter_number || chapter_id}</p>
                            <h2 className="text-3xl font-normal">{chapter?.title || 'Judul Bab'}</h2>
                            <div className={`w-8 h-[1px] mx-auto mt-6 ${currentTheme.id === 'dark' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                        </div>

                        <div className={`${fontSizes[fontSizeIdx]} ${lineSpacings[lineSpacingIdx]} space-y-6 transition-all duration-300 relative`}>
                            {isLocked ? (
                                <p className="text-center italic opacity-80 py-6">Bab ini masih terkunci. Anda dapat membukanya dengan koin untuk melanjutkan membaca.</p>
                            ) : (
                                paragraphs.length > 0 && paragraphs[0] !== 'Belum ada konten untuk bab ini.' ? (
                                    paragraphs.map((paragraph: string, idx: number) => (
                                        <p key={idx} className="text-justify leading-relaxed indent-6">{paragraph}</p>
                                    ))
                                ) : (
                                    <p className="italic text-gray-400 text-center py-16">Belum ada konten teks untuk bab ini.</p>
                                )
                            )}
                            
                            {isLocked && (
                                <div className={`absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t ${currentTheme.id === 'dark' ? 'from-gray-900' : currentTheme.id === 'sepia' ? 'from-[#F4ECD8]' : 'from-[#FCFBF8]'} to-transparent z-10 pointer-events-none`}></div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Panel */}
                {isLocked ? (
                    <div className="fixed bottom-0 left-0 right-0 z-50">
                        <div className={`rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] border-t p-5 ${currentTheme.id === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-white'}`}>
                            <h3 className={`text-[15px] font-bold text-center mb-1 ${currentTheme.id === 'dark' ? 'text-white' : 'text-gray-900'}`}>{chapter?.title || 'Bab ini Terkunci'}</h3>
                            <p className={`text-[12px] text-center mb-4 ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Gunakan <span className="text-blue-600 font-bold">{chapter?.coin_price || 10} koin</span> untuk membuka bab ini</p>
                            <button onClick={handleUnlockClick} className="w-full bg-[#2F5AF4] hover:bg-blue-700 text-white rounded-xl py-3.5 flex items-center justify-center gap-2 font-bold text-[14px] shadow-lg transition mb-3">
                                Buka Bab {chapter?.chapter_number || chapter_id}
                                <div className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center shrink-0 ml-1"><span className="text-[9px] font-bold text-white">C</span></div>
                                {requiredCoin}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`fixed bottom-4 left-4 right-4 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border z-50 overflow-hidden transition-colors duration-300 ${currentTheme.card} ${currentTheme.border}`}>
                        <div className={`p-4 border-b flex items-center gap-4 ${currentTheme.border}`}>
                            <span className={`text-[12px] font-medium w-6 ${currentTheme.id === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{progress}</span>
                            <div className="flex-1 relative flex items-center">
                                <input type="range" min="1" max={totalPages} value={progress} onChange={(e) => setProgress(parseInt(e.target.value))} className="w-full h-1 bg-gray-200 rounded-full appearance-none outline-none accent-blue-600" />
                            </div>
                            <span className={`text-[12px] font-medium w-8 text-right ${currentTheme.id === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{totalPages}</span>
                        </div>
                        <div className="flex justify-between items-center p-4">
                            <button onClick={() => setFontSizeIdx((fontSizeIdx + 1) % fontSizes.length)} className={`flex flex-col items-center gap-1.5 w-16 ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Type className="w-5 h-5" />
                                <span className="text-[10px] font-medium">Ukuran</span>
                            </button>
                            <button onClick={() => setLineSpacingIdx((lineSpacingIdx + 1) % lineSpacings.length)} className={`flex flex-col items-center gap-1.5 w-16 ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <AlignJustify className="w-5 h-5" />
                                <span className="text-[10px] font-medium">Jarak</span>
                            </button>
                            <button onClick={() => setFontFamilyIdx((fontFamilyIdx + 1) % fontFamilies.length)} className={`flex flex-col items-center gap-1.5 w-16 ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <div className="font-serif font-bold text-[18px] leading-none h-5 flex items-center">T</div>
                                <span className="text-[10px] font-medium">Font</span>
                            </button>
                            <button onClick={() => setThemeIdx((themeIdx + 1) % themes.length)} className={`flex flex-col items-center gap-1.5 w-16 ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Moon className="w-5 h-5" fill={currentTheme.id === 'dark' ? 'currentColor' : 'none'} />
                                <span className="text-[10px] font-medium">Tema</span>
                            </button>
                            <button className={`flex flex-col items-center gap-1.5 w-16 ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Settings className="w-5 h-5" />
                                <span className="text-[10px] font-medium">Pengaturan</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ===================== DESKTOP / WEB VIEW ===================== */}
            <div className={`hidden md:flex flex-col min-h-screen transition-colors duration-300 ${currentTheme.bg}`}>
                {/* Desktop Top Navigation Bar */}
                <div className={`sticky top-0 z-50 ${currentTheme.nav} border-b transition-colors duration-300 shadow-sm`}>
                    <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                        {/* Left: Back + Title */}
                        <div className="flex items-center gap-4">
                            <Link href={`/buku/${book_id}`} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${currentTheme.id === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-900'}`}>
                                <ChevronLeft className="w-4 h-4" />
                                Kembali
                            </Link>
                            <div className={`w-px h-5 ${currentTheme.id === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                            <div>
                                <span className={`text-sm font-bold ${currentTheme.id === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{book?.title || 'Membaca Buku'}</span>
                                <span className={`text-xs ml-2 ${currentTheme.id === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>• Bab {chapter?.chapter_number}</span>
                            </div>
                        </div>

                        {/* Right: Controls */}
                        <div className="flex items-center gap-2">
                            <button onClick={handleToggleBookmark} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isBookmarked ? 'text-blue-600 bg-blue-50' : currentTheme.id === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                                {isBookmarked ? 'Dibookmark' : 'Bookmark'}
                            </button>
                            <div className={`w-px h-5 ${currentTheme.id === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                            <button onClick={() => setShowSidebar(!showSidebar)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showSidebar ? (currentTheme.id === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-900') : currentTheme.id === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <List className="w-4 h-4" />
                                Daftar Isi
                            </button>
                            <button onClick={() => setShowSettings(!showSettings)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showSettings ? (currentTheme.id === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-900') : currentTheme.id === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <Settings className="w-4 h-4" />
                                Pengaturan
                            </button>
                            <button onClick={() => setThemeIdx((themeIdx + 1) % themes.length)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${currentTheme.id === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                                {currentTheme.id === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                {currentTheme.id === 'light' ? 'Mode Malam' : currentTheme.id === 'dark' ? 'Mode Sepia' : 'Mode Terang'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Content Layout */}
                <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 gap-6">
                    {/* Left Sidebar: Chapter List */}
                    {showSidebar && (
                        <div className="w-64 shrink-0">
                            <div className="sticky top-24">
                                <ChapterSidebar />
                            </div>
                        </div>
                    )}

                    {/* Main Reading Area */}
                    <div className="flex-1 min-w-0">
                        {/* Reading Card */}
                        <div className={`relative ${currentTheme.card} border ${currentTheme.border} rounded-2xl shadow-sm overflow-hidden transition-colors duration-300`}>
                            {/* Chapter Header */}
                            <div className={`px-8 py-8 border-b ${currentTheme.border} text-center`}>
                                <p className={`text-xs font-bold tracking-[0.25em] uppercase mb-3 ${currentTheme.id === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    BAB {chapter?.chapter_number || chapter_id}
                                </p>
                                <h1 className={`text-2xl lg:text-3xl font-bold ${currentTheme.text} leading-tight`}>
                                    {chapter?.title || 'Judul Bab'}
                                </h1>
                                {!isLocked && (
                                    <div className={`w-12 h-[2px] mx-auto mt-5 rounded-full ${currentTheme.id === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                                )}
                                {isLocked && (
                                    <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold">
                                        <Lock className="w-3 h-3" />
                                        Bab Terkunci
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className={`px-8 lg:px-16 py-10 ${isLocked ? 'max-h-72 overflow-hidden relative' : ''}`}>
                                <div className={`${fontFamilies[fontFamilyIdx]} ${fontSizes[fontSizeIdx]} ${lineSpacings[lineSpacingIdx]} ${currentTheme.text} transition-all duration-300 max-w-2xl mx-auto`}>
                                    {isLocked ? (
                                        <p className={`text-center italic py-8 ${currentTheme.id === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            Bab ini masih terkunci. Gunakan koin untuk membuka akses ke bab ini.
                                        </p>
                                    ) : (
                                        paragraphs.length > 0 && paragraphs[0] !== 'Belum ada konten untuk bab ini.' ? (
                                            paragraphs.map((paragraph: string, idx: number) => (
                                                <p key={idx} className="text-justify leading-relaxed indent-8 mb-0">{paragraph}</p>
                                            ))
                                        ) : (
                                            <p className={`italic text-center py-16 ${currentTheme.id === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                Belum ada konten teks untuk bab ini.
                                            </p>
                                        )
                                    )}
                                </div>

                                {/* Gradient Fade for Locked */}
                                {isLocked && (
                                    <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${currentTheme.id === 'dark' ? 'from-gray-800' : currentTheme.id === 'sepia' ? 'from-[#FDF6E3]' : 'from-white'} to-transparent z-10`}></div>
                                )}
                            </div>

                            {/* Locked Panel (Inside Card) */}
                            {isLocked && (
                                <div className={`px-8 py-6 border-t ${currentTheme.border} ${currentTheme.id === 'dark' ? 'bg-gray-800/80' : 'bg-gray-50/80'} backdrop-blur-sm`}>
                                    <div className="max-w-md mx-auto text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Lock className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className={`text-base font-bold mb-1.5 ${currentTheme.text}`}>Bab ini Terkunci</h3>
                                        <p className={`text-sm mb-4 ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Gunakan <span className="font-bold text-blue-600">{chapter?.coin_price || 10} koin</span> untuk membaca bab ini secara penuh.
                                        </p>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${currentTheme.id === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-700'}`}>
                                                <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center"><span className="text-[10px] font-bold text-white">C</span></div>
                                                <span className="text-sm font-bold">Saldo: {coinBalance}</span>
                                            </div>
                                            <button onClick={handleUnlockClick} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm shadow-blue-100">
                                                <Lock className="w-4 h-4" />
                                                Buka ({requiredCoin} Koin)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Chapter Navigation Footer */}
                            {!isLocked && (
                                <div className={`px-8 py-5 border-t ${currentTheme.border} flex items-center justify-between ${currentTheme.id === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                                    <div>
                                        {prevChapter ? (
                                            <Link href={`/buku/${book_id}/read/${prevChapter.id}`} className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentTheme.id === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-blue-600'}`}>
                                                <ChevronLeft className="w-4 h-4" />
                                                <div className="text-left">
                                                    <div className="text-[10px] uppercase tracking-wide opacity-60 mb-0.5">Sebelumnya</div>
                                                    <div className="font-semibold">{prevChapter.title}</div>
                                                </div>
                                            </Link>
                                        ) : (
                                            <Link href={`/buku/${book_id}`} className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentTheme.id === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-blue-600'}`}>
                                                <ChevronLeft className="w-4 h-4" />
                                                <div>
                                                    <div className="text-[10px] uppercase tracking-wide opacity-60 mb-0.5">Kembali ke</div>
                                                    <div className="font-semibold">Detail Buku</div>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                    <div className={`text-xs px-3 py-1.5 rounded-full border ${currentTheme.id === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
                                        Bab {chapter?.chapter_number} / {sortedChapters.length}
                                    </div>
                                    <div className="text-right">
                                        {nextChapter ? (
                                            <Link href={`/buku/${book_id}/read/${nextChapter.id}`} className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentTheme.id === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-blue-600'}`}>
                                                <div className="text-right">
                                                    <div className="text-[10px] uppercase tracking-wide opacity-60 mb-0.5">Selanjutnya</div>
                                                    <div className="font-semibold">{nextChapter.title}</div>
                                                </div>
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        ) : (
                                            <Link href={`/buku/${book_id}`} className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentTheme.id === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-blue-600'}`}>
                                                <div className="text-right">
                                                    <div className="text-[10px] uppercase tracking-wide opacity-60 mb-0.5">Selesai</div>
                                                    <div className="font-semibold">Kembali ke Buku</div>
                                                </div>
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar: Settings */}
                    {showSettings && (
                        <div className="w-60 shrink-0">
                            <div className="sticky top-24">
                                <SettingsPanel />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
}
