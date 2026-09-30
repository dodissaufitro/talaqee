import { Head, Link } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
import { 
    Search, Grid, User, CreditCard, PlaySquare, Settings, Info, Headset, 
    MessageCircle, Mail, ChevronDown, Sparkles, CheckCircle2, ThumbsUp, ThumbsDown,
    HelpCircle, ArrowRight, X, Phone, ShieldCheck, BookOpen, Layers
} from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';
import WebFooter from '@/components/WebFooter';

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    category?: string;
    order?: number;
}

const DEFAULT_CATEGORIES = [
    { id: 'all', name: 'Semua Pertanyaan', icon: Layers },
    { id: 'umum', name: 'Umum & Layanan', icon: BookOpen },
    { id: 'akun', name: 'Akun & Pendaftaran', icon: User },
    { id: 'pembayaran', name: 'Koin & Pembayaran', icon: CreditCard },
    { id: 'konten', name: 'Konten & Talaqqi', icon: PlaySquare },
    { id: 'teknis', name: 'Fitur & Dukungan', icon: Settings },
];

export default function FaqIndex({ faqs = [] }: { faqs: FaqItem[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(1);
    const [feedbackMap, setFeedbackMap] = useState<Record<number, 'yes' | 'no'>>({});

    // Augment FAQs with inferred categories if not specified from database
    const mappedFaqs = useMemo(() => {
        return faqs.map((faq) => {
            let cat = faq.category || 'umum';
            const q = faq.question.toLowerCase();
            const a = faq.answer.toLowerCase();

            if (q.includes('daftar') || q.includes('login') || q.includes('akun') || q.includes('password')) {
                cat = 'akun';
            } else if (q.includes('koin') || q.includes('bayar') || q.includes('langganan') || q.includes('gratis') || q.includes('harga') || a.includes('koin')) {
                cat = 'pembayaran';
            } else if (q.includes('unduh') || q.includes('konten') || q.includes('offline') || q.includes('video') || q.includes('buku')) {
                cat = 'konten';
            } else if (q.includes('customer') || q.includes('perangkat') || q.includes('service') || q.includes('bantuan') || q.includes('aplikasi')) {
                cat = 'teknis';
            } else if (q.includes('apa itu') || q.includes('talaqee')) {
                cat = 'umum';
            }

            return {
                ...faq,
                category: cat,
            };
        });
    }, [faqs]);

    // Filter FAQs based on category and search query
    const filteredFaqs = useMemo(() => {
        return mappedFaqs.filter((item) => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = !searchQuery.trim() || 
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                item.answer.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [mappedFaqs, selectedCategory, searchQuery]);

    // Dynamic category counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { all: mappedFaqs.length };
        mappedFaqs.forEach((item) => {
            if (item.category) {
                counts[item.category] = (counts[item.category] || 0) + 1;
            }
        });
        return counts;
    }, [mappedFaqs]);

    const toggleFaq = (id: number) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    const handleFeedback = (id: number, type: 'yes' | 'no') => {
        setFeedbackMap((prev) => ({ ...prev, [id]: type }));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#7e57c2] selection:text-white flex flex-col justify-between">
            <Head title="Pusat Bantuan & FAQ - Talaqee" />

            <div>
                {/* ─── MOBILE HEADER (Preserved for Mobile View) ─── */}
                <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href={route('home')} className="w-8 h-8 flex items-center justify-center -ml-1 text-gray-700 hover:text-[#7e57c2]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </Link>
                        <span className="text-[17px] font-bold text-gray-900">
                            Pusat Bantuan & FAQ
                        </span>
                    </div>
                    <Link href={route('kontak')} className="text-xs font-semibold text-[#7e57c2] bg-purple-50 px-2.5 py-1 rounded-full">
                        Kontak
                    </Link>
                </div>

                {/* ─── DESKTOP NAVIGATION ─── */}
                <WebDesktopNav />

                {/* ─── HERO BANNER (Modern Dark Gradient with Glow) ─── */}
                <div className="relative bg-gradient-to-br from-[#0B091A] via-[#140E2E] to-[#1E123D] pt-12 pb-24 md:pt-16 md:pb-28 overflow-hidden text-white border-b border-purple-900/30">
                    {/* Background Light Orbs */}
                    <div className="absolute top-[-80px] left-1/4 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-[-100px] right-10 w-[500px] h-[500px] bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="w-full max-w-[1340px] mx-auto px-6 md:px-10 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                            
                            {/* Left Text & Search */}
                            <div className="w-full lg:max-w-2xl text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs font-semibold tracking-wide uppercase mb-4">
                                    <Sparkles size={14} className="text-purple-400" />
                                    Pusat Bantuan & Panduan
                                </div>
                                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                                    Ada yang bisa kami <br className="hidden md:inline" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-100 to-indigo-200">bantu untuk Anda?</span>
                                </h1>
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
                                    Temukan jawaban cepat seputar pembelajaran talaqqi, pembelian koin, akses video kajian, e-book islami, dan kendala akun.
                                </p>

                                {/* Search Bar */}
                                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 shadow-2xl focus-within:bg-white/15 focus-within:border-purple-400 transition-all max-w-xl">
                                    <div className="flex items-center">
                                        <div className="pl-4 pr-3 text-purple-300">
                                            <Search size={20} />
                                        </div>
                                        <input 
                                            type="text" 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari topik (misal: top up koin, download offline, talaqqi)..."
                                            className="w-full bg-transparent border-none text-white placeholder-gray-400 text-sm md:text-[15px] focus:ring-0 focus:outline-none py-2.5"
                                        />
                                        {searchQuery && (
                                            <button 
                                                onClick={() => setSearchQuery('')}
                                                className="p-1.5 mr-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                                title="Hapus pencarian"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => {}}
                                            className="bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shrink-0 flex items-center gap-1.5"
                                        >
                                            Cari
                                        </button>
                                    </div>
                                </div>

                                {/* Popular Search Tags */}
                                <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-gray-400">
                                    <span className="font-medium text-gray-400">Paling sering dicari:</span>
                                    {['Top Up Koin', 'Download Offline', 'Ganti Password', 'Beli Materi'].map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setSearchQuery(tag)}
                                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-purple-200 border border-white/10 transition-colors"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right Quote & Stats Glass Card */}
                            <div className="w-full lg:w-auto shrink-0 flex justify-center">
                                <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-6 md:p-8 max-w-[380px] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
                                    
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                                            <HelpCircle size={22} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">Bimbingan Ilmu Syar'i</h4>
                                            <p className="text-xs text-purple-200/70">Nasihat dalam bertanya</p>
                                        </div>
                                    </div>

                                    <div className="my-4 border-l-2 border-purple-400/50 pl-4 py-1">
                                        <p className="text-sm text-gray-200 italic leading-relaxed">
                                            "Bertanyalah kepada orang yang berilmu, jika kamu tidak mengetahui."
                                        </p>
                                        <span className="text-xs font-semibold text-purple-300 block mt-2">
                                            (QS. An-Nahl: 43)
                                        </span>
                                    </div>

                                    <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xl font-extrabold text-white">24/7</div>
                                            <div className="text-[11px] text-gray-400">Pusat Bantuan Digital</div>
                                        </div>
                                        <div>
                                            <div className="text-xl font-extrabold text-purple-300">100%</div>
                                            <div className="text-[11px] text-gray-400">Responsif & Terbuka</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* ─── MAIN CONTENT SECTION ─── */}
                <div className="w-full max-w-[1340px] mx-auto px-6 md:px-10 -mt-8 relative z-20 pb-20">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        
                        {/* ─── LEFT SIDEBAR: CATEGORIES & QUICK CONTACT ─── */}
                        <div className="w-full lg:w-80 shrink-0 space-y-6">
                            
                            {/* Category Selector Card */}
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <div className="px-3 py-2 border-b border-gray-100 mb-2">
                                    <h3 className="font-bold text-gray-900 text-sm flex items-center justify-between">
                                        <span>Kategori Bantuan</span>
                                        <span className="text-xs font-normal text-gray-500">{mappedFaqs.length} Topik</span>
                                    </h3>
                                </div>
                                <div className="space-y-1">
                                    {DEFAULT_CATEGORIES.map((cat) => {
                                        const IconComp = cat.icon;
                                        const isSelected = selectedCategory === cat.id;
                                        const count = categoryCounts[cat.id] || 0;

                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => {
                                                    setSelectedCategory(cat.id);
                                                    setSearchQuery('');
                                                }}
                                                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all ${
                                                    isSelected 
                                                        ? 'bg-purple-50 text-[#7C3AED] font-bold shadow-sm' 
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                        isSelected ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        <IconComp size={16} />
                                                    </div>
                                                    <span className="text-sm">{cat.name}</span>
                                                </div>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                                    isSelected ? 'bg-purple-200/60 text-purple-800' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Need Direct Help Card */}
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 rounded-2xl p-6 border border-purple-100 shadow-sm text-center">
                                <div className="w-12 h-12 bg-white text-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md border border-purple-100">
                                    <Headset size={24} />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1 text-base">Belum Menemukan Jawaban?</h4>
                                <p className="text-xs text-gray-600 leading-relaxed mb-5">
                                    Tim customer support Talaqee siap membantu keluhan Anda secara langsung.
                                </p>
                                <div className="space-y-2">
                                    <a 
                                        href="https://wa.me/6282285578390" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm"
                                    >
                                        <MessageCircle size={15} />
                                        Chat WhatsApp Resmi
                                    </a>
                                    <Link 
                                        href={route('kontak')}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-purple-50 text-gray-700 text-xs font-semibold border border-purple-200 transition-colors"
                                    >
                                        Lihat Halaman Kontak
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>

                        </div>

                        {/* ─── RIGHT SECTION: FAQ ACCORDION LIST ─── */}
                        <div className="flex-1 w-full space-y-4">
                            
                            {/* Header Status & Filters */}
                            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        {DEFAULT_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Daftar Pertanyaan'}
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        Menampilkan {filteredFaqs.length} solusi bantuan
                                        {searchQuery && <span> untuk kata kunci "<strong>{searchQuery}</strong>"</span>}
                                    </p>
                                </div>
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="text-xs text-purple-600 hover:text-purple-800 font-semibold bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100"
                                    >
                                        Hapus Filter
                                    </button>
                                )}
                            </div>

                            {/* Accordion Cards */}
                            <div className="space-y-3">
                                {filteredFaqs.map((faq, index) => {
                                    const isExpanded = expandedFaq === faq.id;
                                    const feedback = feedbackMap[faq.id];

                                    return (
                                        <div 
                                            key={faq.id} 
                                            className={`rounded-2xl transition-all duration-200 border ${
                                                isExpanded 
                                                    ? 'bg-white border-purple-300 shadow-md ring-1 ring-purple-100' 
                                                    : 'bg-white border-gray-200/80 hover:border-purple-200 shadow-sm'
                                            }`}
                                        >
                                            <button 
                                                onClick={() => toggleFaq(faq.id)}
                                                className="w-full p-5 sm:p-6 flex items-start text-left gap-4 transition-colors"
                                            >
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                                                    isExpanded ? 'bg-[#7C3AED] text-white shadow-sm' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {index + 1}
                                                </div>

                                                <div className="flex-1 pr-2">
                                                    <span className={`text-[15px] sm:text-base font-bold leading-snug block ${
                                                        isExpanded ? 'text-[#7C3AED]' : 'text-gray-900'
                                                    }`}>
                                                        {faq.question}
                                                    </span>
                                                </div>

                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                                                    isExpanded ? 'bg-purple-100 text-[#7C3AED] rotate-180' : 'bg-gray-50 text-gray-400'
                                                }`}>
                                                    <ChevronDown size={18} />
                                                </div>
                                            </button>

                                            {/* Expandable Answer */}
                                            {isExpanded && (
                                                <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-gray-100">
                                                    <div className="pl-12 text-sm sm:text-[15px] text-gray-600 leading-relaxed space-y-3">
                                                        <p>{faq.answer}</p>

                                                        {/* Interactive helpful feedback */}
                                                        <div className="pt-4 mt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                                                            <span>Apakah informasi ini membantu Anda?</span>
                                                            <div className="flex items-center gap-2">
                                                                {feedback ? (
                                                                    <span className="text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                                                        <CheckCircle2 size={13} /> Terima kasih atas tanggapan Anda!
                                                                    </span>
                                                                ) : (
                                                                    <>
                                                                        <button 
                                                                            onClick={() => handleFeedback(faq.id, 'yes')}
                                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                                        >
                                                                            <ThumbsUp size={13} />
                                                                            <span>Ya</span>
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => handleFeedback(faq.id, 'no')}
                                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                                                                        >
                                                                            <ThumbsDown size={13} />
                                                                            <span>Tidak</span>
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Empty State */}
                                {filteredFaqs.length === 0 && (
                                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
                                        <div className="w-16 h-16 bg-purple-50 text-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Search size={28} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Pertanyaan Tidak Ditemukan</h3>
                                        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                                            Kami tidak menemukan jawaban untuk "{searchQuery}". Coba kata kunci lain atau hubungi tim customer service kami.
                                        </p>
                                        <div className="flex items-center justify-center gap-3">
                                            <button 
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setSelectedCategory('all');
                                                }}
                                                className="px-5 py-2.5 rounded-xl bg-purple-50 text-[#7C3AED] font-semibold text-xs hover:bg-purple-100 transition-colors"
                                            >
                                                Reset Semua Filter
                                            </button>
                                            <a 
                                                href="https://wa.me/6282285578390"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white font-semibold text-xs hover:opacity-95 transition-opacity"
                                            >
                                                Tanya via WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Additional FAQ Information Card */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                                <div className="flex items-center gap-4 text-center sm:text-left">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mx-auto">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">Privasi & Keamanan Terjamin</h4>
                                        <p className="text-xs text-gray-500">Seluruh data pengguna dan transaksi tersimpan aman dengan enkripsi terkini.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Link 
                                        href={route('refund.policy')}
                                        className="text-xs font-semibold text-gray-600 hover:text-[#7C3AED] px-3 py-2 rounded-lg hover:bg-gray-50"
                                    >
                                        Kebijakan Refund
                                    </Link>
                                    <span className="text-gray-300">|</span>
                                    <Link 
                                        href={route('terms')}
                                        className="text-xs font-semibold text-gray-600 hover:text-[#7C3AED] px-3 py-2 rounded-lg hover:bg-gray-50"
                                    >
                                        Syarat & Ketentuan
                                    </Link>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            {/* ─── WEB FOOTER ─── */}
            <WebFooter />
        </div>
    );
}
