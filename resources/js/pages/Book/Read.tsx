import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    ArrowLeft, Bookmark, List, MoreVertical, 
    AlignLeft, PenSquare, Moon, MoreHorizontal,
    ChevronLeft, ChevronRight, Settings, Type, AlignJustify, Lock
} from 'lucide-react';

interface BookReadProps {
    book?: any;
    book_id: number;
    chapter_id: number;
    chapter: any;
    chapters?: any[];
    purchased_chapter_ids: number[];
}

export default function Read({ book, book_id, chapter_id, chapter, chapters = [], purchased_chapter_ids = [] }: BookReadProps) {
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
        { id: 'light', bg: 'bg-[#FCFBF8]', text: 'text-[#1F1F1F]', card: 'bg-white', border: 'border-gray-200/50' },
        { id: 'dark', bg: 'bg-gray-900', text: 'text-gray-200', card: 'bg-gray-800', border: 'border-gray-700' },
        { id: 'sepia', bg: 'bg-[#F4ECD8]', text: 'text-[#5C4033]', card: 'bg-[#FDF6E3]', border: 'border-[#E6D5B8]' }
    ];
    const [themeIdx, setThemeIdx] = useState(0);
    const currentTheme = themes[themeIdx];

    const [isBookmarked, setIsBookmarked] = useState(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const [confirmModal, setConfirmModal] = useState(false);
    const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

    // Daftar bab dan navigasi sebelumnya / selanjutnya
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

    // Logic for locked chapters: use passed chapter data
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

        router.post(`/buku/${book_id}/chapter/${chapter_id}/unlock`, {}, {
            preserveScroll: true
        });
        setConfirmModal(false);
    };

    return (
        <div className={`min-h-screen ${currentTheme.bg} font-sans transition-colors duration-300 pb-28 relative`}>
            <Head title={`Membaca: ${chapter?.title || 'Bab'} - ${book?.title || 'Buku'}`} />

            {/* Modal Overlay: Daftar Isi */}
            {activeModal === 'daftar-isi' && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
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
                                    <Link
                                        key={c.id}
                                        href={`/buku/${book_id}/read/${c.id}`}
                                        onClick={() => setActiveModal(null)}
                                        className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                                            isCurrent 
                                                ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                                                : `${currentTheme.border} hover:bg-gray-50/50`
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className={`text-xs px-2 py-0.5 rounded font-mono ${isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                Bab {c.chapter_number}
                                            </span>
                                            <span className="text-sm truncate">{c.title}</span>
                                        </div>
                                        <div>
                                            {c.is_free ? (
                                                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Gratis</span>
                                            ) : locked ? (
                                                <Lock className="w-4 h-4 text-amber-500" />
                                            ) : (
                                                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">Terbuka</span>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Overlay: Pengaturan / Catatan */}
            {activeModal && activeModal !== 'daftar-isi' && (
                <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
                    <div className={`${currentTheme.card} ${currentTheme.text} w-full max-w-sm rounded-2xl p-6 shadow-xl border ${currentTheme.border}`} onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-2">
                            {activeModal === 'catatan' ? 'Catatan Pembaca' : 'Pengaturan Tampilan'}
                        </h3>
                        <p className={`text-sm ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                            Gunakan panel di bagian bawah layar untuk mengatur ukuran font, jenis huruf, spasi baris, dan tema tampilan.
                        </p>
                        <button 
                            onClick={() => setActiveModal(null)}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {errorModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`${currentTheme.bg} rounded-2xl w-full max-w-[320px] p-6 shadow-2xl scale-in-95 duration-200 text-center border ${currentTheme.border}`}>
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className={`text-base font-bold mb-2 ${currentTheme.text}`}>Gagal Membuka Bab</h3>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">{errorModal.message}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setErrorModal({ isOpen: false, message: '' })} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition">
                                Batal
                            </button>
                            <Link href="/akun/topup" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center">
                                Top Up Koin
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Unlock Modal */}
            {confirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`${currentTheme.card} rounded-2xl w-full max-w-[320px] p-6 shadow-2xl scale-in-95 duration-200 text-center border ${currentTheme.border}`}>
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className={`text-base font-bold mb-2 ${currentTheme.text}`}>Buka Bab {chapter?.chapter_number || chapter_id}?</h3>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                            Akan menggunakan <strong>{chapter?.coin_price || 10} koin</strong> dari saldo koin Talaqee Anda.
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => setConfirmModal(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition">
                                Batal
                            </button>
                            <button onClick={proceedUnlock} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-sm">
                                Ya, Buka
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Top App Bar */}
            <div className={`sticky top-0 z-50 ${currentTheme.bg} transition-colors duration-300`}>
                <div className={`flex items-center justify-between px-4 h-14 border-b ${currentTheme.border}`}>
                    <div className="flex items-center gap-3">
                        <Link href={`/buku/${book_id}`} className={`p-1 -ml-1 ${currentTheme.id === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'} rounded-full`}>
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className={`text-[15px] font-extrabold leading-tight ${currentTheme.id === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                {book?.title || 'Membaca Buku'}
                            </h1>
                            <div className={`text-[11px] font-medium ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {book?.author?.name || ''} {book?.author?.name ? '•' : ''} Bab {chapter?.chapter_number || chapter_id}
                            </div>
                        </div>
                    </div>
                    <div className={`flex items-center gap-1.5 ${currentTheme.id === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                        <button onClick={() => setIsBookmarked(!isBookmarked)} className={`p-1.5 rounded-full ${currentTheme.id === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} ${isBookmarked ? 'text-blue-600' : ''}`} title="Bookmark">
                            <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={() => setActiveModal('daftar-isi')} className={`p-1.5 rounded-full ${currentTheme.id === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`} title="Daftar Isi">
                            <List className="w-5 h-5" />
                        </button>
                        <button onClick={() => setActiveModal('settings')} className={`p-1.5 rounded-full ${currentTheme.id === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`} title="Pengaturan">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Secondary Toolbar or Coin Banner */}
                {isLocked ? (
                    <div className={`flex items-center justify-between px-4 py-3 border-b ${currentTheme.border} ${currentTheme.id === 'dark' ? 'bg-gray-800/50' : 'bg-blue-50/30'}`}>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-[11px] font-bold text-white">C</span>
                            </div>
                            <span className={`text-[12px] font-bold ${currentTheme.id === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Koin Saya: 250</span>
                            <div className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 shadow-sm cursor-pointer ml-1">
                                <span className="text-[14px] leading-none mb-0.5">+</span>
                            </div>
                        </div>
                        <button className="text-[11px] font-medium text-blue-600 flex items-center gap-0.5 hover:underline">
                            Riwayat Transaksi <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <div className={`flex items-center justify-between px-4 py-2 border-b ${currentTheme.border} overflow-x-auto hide-scrollbar gap-2`}>
                        <button onClick={() => setActiveModal('daftar-isi')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 ${currentTheme.id === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <AlignLeft className="w-4 h-4" />
                            <span className="text-[12px] font-medium">Daftar Isi</span>
                        </button>
                        <button onClick={() => setIsBookmarked(!isBookmarked)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 ${currentTheme.id === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} ${isBookmarked ? 'text-blue-600 font-bold' : ''}`}>
                            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                            <span className="text-[12px] font-medium">Bookmark</span>
                        </button>
                        <button onClick={() => setActiveModal('catatan')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 ${currentTheme.id === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <PenSquare className="w-4 h-4" />
                            <span className="text-[12px] font-medium">Catatan</span>
                        </button>
                        
                        <div className={`w-[1px] h-4 mx-1 shrink-0 ${currentTheme.id === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                        
                        <button 
                            onClick={() => setThemeIdx((themeIdx + 1) % themes.length)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full shrink-0 shadow-sm transition-colors ${currentTheme.id === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Moon className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">{currentTheme.id === 'light' ? 'Mode Malam' : currentTheme.id === 'dark' ? 'Mode Sepia' : 'Mode Terang'}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className={`relative max-w-2xl mx-auto px-6 py-10 ${isLocked ? 'overflow-hidden max-h-[65vh]' : ''}`}>
                
                {/* Floating Navigation Arrows */}
                {prevChapter && (
                    <Link
                        href={`/buku/${book_id}/read/${prevChapter.id}`}
                        className="fixed left-2 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1.5 group"
                        title={`Bab Sebelumnya: ${prevChapter.title}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border transition-colors ${currentTheme.id === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400 group-hover:text-white' : 'bg-white border-gray-100 text-gray-600 group-hover:text-blue-600'}`}>
                            <ChevronLeft className="w-6 h-6" />
                        </div>
                        <span className={`text-[9px] font-bold text-center leading-tight hidden md:block ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Bab {prevChapter.chapter_number}
                        </span>
                    </Link>
                )}

                {nextChapter && (
                    <Link
                        href={`/buku/${book_id}/read/${nextChapter.id}`}
                        className="fixed right-2 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1.5 group"
                        title={`Bab Selanjutnya: ${nextChapter.title}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border transition-colors ${currentTheme.id === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400 group-hover:text-white' : 'bg-white border-gray-100 text-gray-600 group-hover:text-blue-600'}`}>
                            <ChevronRight className="w-6 h-6" />
                        </div>
                        <span className={`text-[9px] font-bold text-center leading-tight hidden md:block ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Bab {nextChapter.chapter_number}
                        </span>
                    </Link>
                )}

                <div className={`${fontFamilies[fontFamilyIdx]} ${currentTheme.text} transition-all duration-300`}>
                    <div className="text-center mb-10">
                        <p className={`text-[13px] font-bold mb-3 ${isLocked ? 'text-blue-600' : currentTheme.id === 'dark' ? 'text-gray-500' : 'text-gray-600'} ${!isLocked && 'tracking-[0.2em]'}`}>
                            BAB {chapter?.chapter_number || chapter_id}
                        </p>
                        <h2 className={`text-3xl ${isLocked ? 'font-bold' : 'font-normal'}`}>{chapter?.title || 'Judul Bab'}</h2>
                        {isLocked ? (
                            <div className="flex justify-center mt-4">
                                <div className="w-2.5 h-3.5 bg-blue-600 rounded-b-full rounded-tl-full -rotate-45"></div>
                            </div>
                        ) : (
                            <div className={`w-8 h-[1px] mx-auto mt-6 ${currentTheme.id === 'dark' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                        )}
                    </div>

                    {/* Pure Text Reading View */}
                    <div className={`${fontSizes[fontSizeIdx]} ${lineSpacings[lineSpacingIdx]} space-y-6 transition-all duration-300 relative`}>
                        {isLocked ? (
                            <p className="text-center italic opacity-80 py-6">
                                Bab ini masih terkunci. Anda dapat membukanya dengan koin untuk melanjutkan membaca.
                            </p>
                        ) : (
                            paragraphs.length > 0 && paragraphs[0] !== 'Belum ada konten untuk bab ini.' ? (
                                paragraphs.map((paragraph: string, idx: number) => (
                                    <p key={idx} className="text-justify leading-relaxed indent-6">
                                        {paragraph}
                                    </p>
                                ))
                            ) : (
                                <p className="italic text-gray-400 text-center py-16">
                                    Belum ada konten teks untuk bab ini.
                                </p>
                            )
                        )}
                        
                        {/* Gradient Fade for Locked Content */}
                        {isLocked && (
                            <div className={`absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t ${currentTheme.id === 'dark' ? 'from-gray-900' : currentTheme.id === 'sepia' ? 'from-[#F4ECD8]' : 'from-[#FCFBF8]'} to-transparent z-10 pointer-events-none`}></div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-12 mb-6">
                    <div className={`px-4 py-1.5 border rounded-full text-[11px] font-medium transition-colors ${currentTheme.id === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-700 shadow-sm'}`}>
                        {progress} / {totalPages}
                    </div>
                </div>
            </div>

            {/* Bottom Panel */}
            {isLocked ? (
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <div className={`rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] border-t p-5 ${currentTheme.id === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-white'}`}>
                        <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                    <div className="w-5 h-6 border-2 border-blue-600 rounded-md relative flex items-center justify-center mt-1">
                                        <div className="absolute -top-2 w-3 h-3 border-2 border-b-0 border-blue-600 rounded-t-full"></div>
                                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className={`text-[15px] font-bold ${currentTheme.id === 'dark' ? 'text-white' : 'text-gray-900'}`}>{chapter?.title || 'Bab ini Terkunci'}</h3>
                                    <p className={`text-[12px] ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Gunakan <span className="text-blue-600 font-bold">{chapter?.coin_price || 10} koin</span> untuk membuka bab ini</p>
                                </div>
                            </div>
                            <button className="px-3 py-1.5 border border-blue-200 text-blue-600 text-[11px] font-bold rounded-lg bg-blue-50/50 hover:bg-blue-50 transition shrink-0">
                                Cara Kerja
                            </button>
                        </div>

                        <div className={`rounded-2xl p-4 flex items-center justify-between mb-4 ${currentTheme.id === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-[#FFFAF0] border border-amber-100'}`}>
                            <div className="flex-1 flex flex-col items-center justify-center border-r border-amber-200/50">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <div className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-[9px] font-bold text-white">C</span>
                                    </div>
                                    <span className={`text-[16px] font-extrabold ${currentTheme.id === 'dark' ? 'text-white' : 'text-gray-900'}`}>{requiredCoin}</span>
                                </div>
                                <span className={`text-[10px] font-medium ${currentTheme.id === 'dark' ? 'text-gray-400' : 'text-amber-700/70'}`}>Koin dibutuhkan</span>
                            </div>
                            <div className="px-4 text-amber-300">
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="flex items-center gap-1.5 text-blue-600 mb-0.5">
                                    <div className="w-3 h-4 border-2 border-blue-600 rounded-sm relative flex items-center justify-center mt-0.5">
                                        <div className="absolute -top-1.5 w-2 h-2 border-2 border-b-0 border-blue-600 rounded-t-full"></div>
                                    </div>
                                    <span className="text-[13px] font-bold">Buka Bab {chapter?.chapter_number || chapter_id}</span>
                                </div>
                                <span className="text-[10px] text-blue-600/70 font-medium">Baca sekarang</span>
                            </div>
                        </div>

                        <button onClick={handleUnlockClick} className="w-full bg-[#2F5AF4] hover:bg-blue-700 text-white rounded-xl py-3.5 flex items-center justify-center gap-2 font-bold text-[14px] shadow-lg shadow-blue-500/20 transition mb-3">
                            Buka Bab {chapter?.chapter_number || chapter_id} 
                            <div className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center shrink-0 ml-1">
                                <span className="text-[9px] font-bold text-white">C</span>
                            </div>
                            {requiredCoin}
                        </button>
                        
                        <div className="flex items-center justify-center gap-1.5 text-gray-400">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                            <span className="text-[10px] font-medium">Transaksi aman & data terjaga</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`fixed bottom-4 left-4 right-4 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border z-50 overflow-hidden transition-colors duration-300 ${currentTheme.card} ${currentTheme.border}`}>
                    <div className={`p-4 border-b flex items-center gap-4 ${currentTheme.border}`}>
                        <span className={`text-[12px] font-medium w-6 ${currentTheme.id === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{progress}</span>
                        <div className="flex-1 relative flex items-center">
                            <input 
                                type="range" 
                                min="1" 
                                max={totalPages} 
                                value={progress}
                                onChange={(e) => setProgress(parseInt(e.target.value))}
                                className="w-full h-1 bg-gray-200 rounded-full appearance-none outline-none accent-blue-600"
                            />
                        </div>
                        <span className={`text-[12px] font-medium w-8 text-right ${currentTheme.id === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{totalPages}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4">
                        <button onClick={() => setFontSizeIdx((fontSizeIdx + 1) % fontSizes.length)} className={`flex flex-col items-center gap-1.5 w-16 transition-colors ${currentTheme.id === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                            <Type className="w-5 h-5" />
                            <span className="text-[10px] font-medium">Ukuran</span>
                        </button>
                        <button onClick={() => setLineSpacingIdx((lineSpacingIdx + 1) % lineSpacings.length)} className={`flex flex-col items-center gap-1.5 w-16 transition-colors ${currentTheme.id === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                            <AlignJustify className="w-5 h-5" />
                            <span className="text-[10px] font-medium">Jarak</span>
                        </button>
                        <button onClick={() => setFontFamilyIdx((fontFamilyIdx + 1) % fontFamilies.length)} className={`flex flex-col items-center gap-1.5 w-16 transition-colors ${currentTheme.id === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                            <div className="font-serif font-bold text-[18px] leading-none h-5 flex items-center">T</div>
                            <span className="text-[10px] font-medium">Font</span>
                        </button>
                        <button onClick={() => setThemeIdx((themeIdx + 1) % themes.length)} className={`flex flex-col items-center gap-1.5 w-16 transition-colors ${currentTheme.id === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                            <Moon className="w-5 h-5" fill={currentTheme.id === 'dark' ? 'currentColor' : 'none'} />
                            <span className="text-[10px] font-medium">Tema</span>
                        </button>
                        <button className={`flex flex-col items-center gap-1.5 w-16 transition-colors ${currentTheme.id === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                            <Settings className="w-5 h-5" />
                            <span className="text-[10px] font-medium">Pengaturan</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
