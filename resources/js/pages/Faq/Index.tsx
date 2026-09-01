import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { 
    BookOpen, Search, Grid, User, CreditCard, PlaySquare, Settings, Info, Headset, Phone, MessageCircle, Mail, ChevronDown, ChevronUp
} from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';

interface FaqCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
    count: number;
}

interface FaqItem {
    id: number;
    categoryId: string;
    question: string;
    answer: string;
}

const FAQ_CATEGORIES: FaqCategory[] = [
    { id: 'all', name: 'Semua Pertanyaan', icon: <Grid size={18} />, count: 32 },
    { id: 'account', name: 'Akun & Pendaftaran', icon: <User size={18} />, count: 6 },
    { id: 'payment', name: 'Pembayaran & Langganan', icon: <CreditCard size={18} />, count: 8 },
    { id: 'content', name: 'Konten & Akses', icon: <PlaySquare size={18} />, count: 9 },
    { id: 'features', name: 'Fitur & Penggunaan', icon: <Settings size={18} />, count: 6 },
    { id: 'technical', name: 'Teknis & Lainnya', icon: <Info size={18} />, count: 3 },
];

const FAQS: FaqItem[] = [
    {
        id: 1,
        categoryId: 'all',
        question: 'Apa itu Talaqee?',
        answer: 'Talaqee adalah platform digital yang menyediakan ribuan konten islami berkualitas, seperti video kajian, rekaman audio, e-book, dan artikel dari ustadz dan ulama terpercaya untuk membantu Anda dalam belajar dan memperdalam ilmu agama.'
    },
    {
        id: 2,
        categoryId: 'account',
        question: 'Bagaimana cara mendaftar di Talaqee?',
        answer: 'Anda dapat mendaftar dengan mengklik tombol "Daftar Gratis" di sudut kanan atas halaman utama. Isi nama, email, dan password Anda, lalu ikuti instruksi yang dikirimkan ke email Anda untuk verifikasi.'
    },
    {
        id: 3,
        categoryId: 'payment',
        question: 'Apakah semua konten di Talaqee gratis?',
        answer: 'Talaqee menyediakan konten gratis maupun berbayar. Konten berbayar dapat diakses dengan membeli menggunakan sistem Koin atau berlangganan paket bulanan.'
    },
    {
        id: 4,
        categoryId: 'payment',
        question: 'Bagaimana cara mengakses konten berbayar?',
        answer: 'Anda bisa melakukan top-up Saldo/Koin terlebih dahulu, kemudian gunakan koin tersebut untuk membuka video premium atau membeli e-book di dalam aplikasi.'
    },
    {
        id: 5,
        categoryId: 'payment',
        question: 'Metode pembayaran apa saja yang tersedia?',
        answer: 'Kami mendukung berbagai metode pembayaran termasuk Transfer Bank (Virtual Account), e-Wallet (OVO, GoPay, Dana), dan minimarket terdekat.'
    },
    {
        id: 6,
        categoryId: 'content',
        question: 'Dapatkah saya mengunduh konten untuk ditonton secara offline?',
        answer: 'Ya, sebagian besar konten video dan audio di Talaqee dapat diunduh untuk dinikmati tanpa koneksi internet melalui aplikasi seluler kami.'
    },
    {
        id: 7,
        categoryId: 'features',
        question: 'Di perangkat apa saja saya bisa menggunakan Talaqee?',
        answer: 'Talaqee dapat diakses melalui browser komputer (PC/Laptop), tablet, serta smartphone Android maupun iOS menggunakan aplikasi resmi kami.'
    },
    {
        id: 8,
        categoryId: 'technical',
        question: 'Bagaimana cara menghubungi customer service?',
        answer: 'Anda dapat menghubungi tim dukungan kami melalui WhatsApp, Email, atau formulir "Hubungi Kami" yang tersedia di halaman ini. Tim kami siap membantu Anda 24/7.'
    },
];

export default function FaqIndex({ faqs = [] }: { faqs: any[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(1); // Expand the first one by default

    const toggleFaq = (id: number) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#7e57c2] selection:text-white pb-20">
            <Head title="FAQ - Talaqee" />

            {/* Mobile Header */}
            <div className="md:hidden flex items-center px-5 py-4 bg-white sticky top-0 z-50 border-b border-gray-100">
                <Link href={route('akun.index')} className="w-8 h-8 flex items-center justify-center -ml-2 mr-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#5C5AE6]"><path d="m15 18-6-6 6-6"/></svg>
                </Link>
                <span className="text-[18px] font-bold text-[#1E293B]">
                    Pusat Bantuan (FAQ)
                </span>
            </div>

            {/* Desktop Navigation */}
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
                            Pusat Bantuan
                        </h1>
                        <p className="text-slate-500 text-[15px] mb-8 font-medium">
                            Temukan jawaban atas pertanyaan yang sering diajukan.
                        </p>

                        {/* Search Bar */}
                        <div className="relative bg-white border border-gray-200 rounded-[10px] flex items-center p-1.5 shadow-[0_2px_10px_rgb(0,0,0,0.03)] max-w-[460px]">
                            <div className="pl-3 pr-2 text-slate-400">
                                <Search size={18} strokeWidth={2.5} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari jawaban atau topik bantuan..."
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
                                Bertanyalah kepada<br/>
                                orang yang berilmu,<br/>
                                jika kamu tidak<br/>
                                mengetahui.
                            </p>
                            <p className="text-[#8155ff] font-semibold mt-4 text-[12px]">
                                (QS. An-Nahl: 43)
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Main Content (2 Columns) */}
            <div className="w-full px-6 md:px-12 lg:px-20 mt-10 flex flex-col lg:flex-row gap-8">
                
                {/* Left Sidebar (Kategori) */}
                <div className="w-full lg:w-72 shrink-0 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Kategori Pertanyaan</h3>
                        </div>
                        <div className="p-2">
                            {FAQ_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors mb-1 ${
                                        selectedCategory === cat.id 
                                        ? 'bg-[#f3eefe] text-[#7e57c2] font-semibold' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={selectedCategory === cat.id ? 'text-[#7e57c2]' : 'text-gray-400'}>
                                            {cat.icon}
                                        </div>
                                        <span className="text-[15px]">{cat.name}</span>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                                        selectedCategory === cat.id ? 'bg-white text-[#7e57c2]' : 'text-gray-400'
                                    }`}>
                                        {cat.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Support Card */}
                    <div className="bg-[#f8f9fa] rounded-2xl p-6 border border-gray-100 text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                            <Headset size={24} />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Masih butuh bantuan?</h4>
                        <p className="text-sm text-gray-500 mb-5">Tim kami siap membantu Anda</p>
                        <button className="w-full py-2.5 rounded-xl bg-white text-[#7e57c2] font-semibold border border-[#e9dfff] hover:bg-[#f3eefe] transition-colors shadow-sm">
                            Hubungi Kami
                        </button>
                    </div>
                </div>

                {/* Right Content (FAQ List) */}
                <div className="flex-1">
                    
                    {/* Search & Sort */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative bg-white rounded-xl shadow-sm border border-gray-200 flex items-center">
                            <div className="pl-4 pr-2 text-gray-400">
                                <Search size={20} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari pertanyaan..."
                                className="w-full border-none focus:ring-0 text-gray-700 bg-transparent py-3 placeholder:text-gray-400"
                            />
                        </div>
                        <div className="relative shrink-0">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                            </div>
                            <select className="appearance-none bg-white border border-gray-200 rounded-xl pl-11 pr-10 py-3 text-sm font-medium text-gray-700 focus:ring-[#7e57c2] focus:border-[#7e57c2] outline-none cursor-pointer shadow-sm w-full md:w-auto">
                                <option>Terbaru</option>
                                <option>Terpopuler</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Accordion List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                        {faqs.map((faq, index) => {
                            const isExpanded = expandedFaq === faq.id;
                            
                            return (
                                <div key={faq.id} className={`border-b border-gray-50 last:border-0 ${isExpanded ? 'bg-[#fcfaff]' : 'bg-white'}`}>
                                    <button 
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full px-6 py-5 flex items-start text-left gap-4 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <span className="text-[15px] font-bold text-[#7e57c2] shrink-0 w-5">{index + 1}.</span>
                                        <span className={`flex-1 text-[15px] font-bold pr-4 ${isExpanded ? 'text-[#7e57c2]' : 'text-gray-800'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`shrink-0 mt-0.5 transition-transform duration-200 ${isExpanded ? 'text-[#7e57c2] rotate-180' : 'text-gray-400'}`}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </button>
                                    
                                    {isExpanded && (
                                        <div className="px-6 pb-6 pl-[52px] pr-12 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <p className="text-[15px] text-gray-500 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {faqs.length === 0 && (
                            <div className="px-6 py-8 text-center text-gray-500">Belum ada FAQ yang tersedia.</div>
                        )}
                    </div>

                    {/* Load More Button */}
                    <div className="flex justify-center">
                        <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#7e57c2] transition-colors">
                            Tampilkan lebih banyak <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

            </div>

            {/* Footer Support Block */}
            <div className="w-full px-6 md:px-12 lg:px-20 mt-16 mb-8">
                <div className="bg-[#f8f9fa] rounded-3xl p-6 md:p-8 flex flex-col xl:flex-row items-center gap-8 justify-between border border-gray-100">
                    
                    {/* Left text */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#7e57c2] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#7e57c2]/30">
                            <MessageCircle size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Tidak menemukan jawaban yang Anda cari?</h3>
                            <p className="text-gray-500 text-[15px]">Tim support kami siap membantu menjawab pertanyaan Anda.</p>
                        </div>
                    </div>

                    {/* Contact Cards */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                        <div className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 flex-1 min-w-[220px]">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Hubungi Kami</h4>
                                <p className="text-xs text-gray-500">Kami siap membantu</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 flex-1 min-w-[220px]">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <MessageCircle size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">WhatsApp</h4>
                                <p className="text-[11px] text-gray-600">+62 812-3456-7890</p>
                                <p className="text-[10px] text-gray-400">Senin - Jumat, 08.00 - 17.00 WIB</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 flex-1 min-w-[220px]">
                            <div className="w-10 h-10 rounded-full bg-[#f3eefe] text-[#7e57c2] flex items-center justify-center shrink-0">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Email</h4>
                                <p className="text-[11px] text-gray-600">support@talaqee.com</p>
                                <p className="text-[10px] text-gray-400">Respon dalam 1x24 jam</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
