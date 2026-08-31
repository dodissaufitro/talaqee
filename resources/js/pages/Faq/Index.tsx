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
            <div className="relative bg-[#f8f5ff] overflow-hidden pt-20 pb-16 border-b border-[#e9dfff]">
                {/* Background Graphics */}
                <div className="absolute inset-0 z-0">
                    <img src="/images/mosque_hero.png" alt="Mosque background" className="absolute bottom-0 right-0 w-[80%] md:w-[60%] h-auto opacity-20 object-cover object-bottom" />
                </div>
                
                {/* Simulated 3D Graphic Area */}
                <div className="absolute bottom-0 right-[10%] hidden md:block z-10">
                    <div className="w-[400px] h-[300px] relative">
                        {/* We use a placeholder image to simulate the 3D graphic provided in the design */}
                        <img src="/images/placeholders/book-cover.svg" alt="3D Illustration" className="w-full h-full object-contain mix-blend-multiply opacity-30" />
                        {/* Recreating some shapes purely with CSS for flavor */}
                        <div className="absolute top-10 left-10 w-24 h-24 bg-[#7e57c2] rounded-full shadow-2xl flex items-center justify-center transform -rotate-12">
                            <span className="text-white text-5xl font-bold">?</span>
                        </div>
                        <div className="absolute top-24 right-20 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center transform rotate-6">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-[#7e57c2] rounded-full"></div>
                                <div className="w-2 h-2 bg-[#7e57c2] rounded-full"></div>
                                <div className="w-2 h-2 bg-[#7e57c2] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full px-6 md:px-12 lg:px-20 relative z-20">
                    <div className="max-w-xl">
                        <h1 className="text-5xl md:text-[56px] font-extrabold text-[#1f2937] leading-none mb-4">
                            FAQ
                        </h1>
                        <h2 className="text-2xl font-bold text-[#7e57c2] mb-6">
                            Pertanyaan yang Sering Diajukan
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Temukan jawaban atas pertanyaan yang sering diajukan seputar layanan dan fitur di Talaqee.
                        </p>
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
