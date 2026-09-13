import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { ChevronLeft, Mail, MapPin, Phone, Clock, Building2, ShieldCheck, MessageSquare } from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';

export default function Contact() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#7e57c2] selection:text-white pb-20">
            <Head title="Kontak & Alamat Bisnis - Talaqee" />

            {/* Mobile Header */}
            <div className="md:hidden flex items-center px-5 py-4 bg-white sticky top-0 z-50 border-b border-gray-100">
                <Link href={route('home')} className="w-8 h-8 flex items-center justify-center -ml-2 mr-2">
                    <ChevronLeft className="w-6 h-6 text-[#5C5AE6]" />
                </Link>
                <span className="text-[18px] font-bold text-[#1E293B]">
                    Kontak & Alamat Kami
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
                    
                    {/* Left: Titles */}
                    <div className="w-full md:w-1/2">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-xl mb-6 text-[#6c40e6]">
                            <Building2 size={24} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-[36px] lg:text-[42px] font-extrabold text-[#111827] leading-tight mb-2 tracking-tight">
                            Kontak & Alamat Bisnis
                        </h1>
                        <p className="text-slate-500 text-[15px] font-medium">
                            Informasi resmi kontak, layanan bantuan pelanggan, dan domisili operasional Talaqee.
                        </p>
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
                                Sebaik-baik manusia<br/>
                                adalah yang paling<br/>
                                bermanfaat bagi orang<br/>
                                lain.
                            </p>
                            <p className="text-[#8155ff] font-semibold mt-4 text-[12px]">
                                (HR. Ahmad)
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Main Content Grid */}
            <div className="w-full px-6 md:px-12 lg:px-20 mt-10">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* 4 Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Card Alamat Bisnis */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-2">Alamat Bisnis</h3>
                            <p className="text-gray-600 text-xs leading-relaxed">
                                Gang Mawar 26-7 RT/RW 003/008, Kelurahan Halim Perdana Kusuma, Kecamatan Makasar, Jakarta Timur, Provinsi DKI Jakarta 13610
                            </p>
                        </div>

                        {/* Card Telepon / WA */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                                <Phone size={24} />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-2">WhatsApp / Telepon</h3>
                            <p className="text-gray-600 text-xs mb-3">+62 822 8557 8390</p>
                            <a 
                                href="https://wa.me/6282285578390" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50/80 px-3 py-1.5 rounded-full"
                            >
                                <MessageSquare size={13} /> Chat WhatsApp
                            </a>
                        </div>

                        {/* Card Email */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                <Mail size={24} />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-2">Email Dukungan</h3>
                            <p className="text-gray-600 text-xs mb-3">saufitrod@gmail.com</p>
                            <a 
                                href="mailto:saufitrod@gmail.com" 
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 px-3 py-1.5 rounded-full"
                            >
                                Kirim Email
                            </a>
                        </div>

                        {/* Card Jam Operasional */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                                <Clock size={24} />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-2">Jam Layanan</h3>
                            <div className="text-gray-600 text-xs space-y-1">
                                <p><span className="font-semibold text-gray-700">Senin – Jumat:</span><br/>08:00 – 17:00 WIB</p>
                                <p><span className="font-semibold text-gray-700">Sabtu – Ahad:</span><br/>09:00 – 15:00 WIB</p>
                            </div>
                        </div>
                    </div>

                    {/* Informasi Profil Bisnis & Transaksi */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <ShieldCheck size={22} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Informasi Bisnis & Operasional</h2>
                                <p className="text-xs text-gray-500">Transparansi layanan digital dan transaksi resmi Talaqee</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Usaha / Platform</h4>
                                    <p className="font-semibold text-gray-900">Talaqee</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Jenis Layanan</h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        Platform Pembelajaran Talaqqi Al-Qur'an, E-Book Islami, dan Pembelian Koin Digital untuk akses materi pembelajaran premium.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pengiriman Produk Digital</h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        Seluruh produk buku, audio, video, dan koin dikirimkan secara instan otomatis (digital delivery) ke akun pengguna setelah pembayaran diverifikasi.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Sistem Pembayaran Resmi</h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        Didukung oleh Payment Gateway resmi berizin <strong>iPaymu</strong> dengan pilihan metode pembayaran Virtual Account, QRIS, dan Transfer Bank yang aman.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Bantuan Transaksi</h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        Jika mengalami kendala transaksi top up koin atau pembelian materi, silakan hubungi tim kami melalui email atau WhatsApp dengan melampirkan nomor referensi transaksi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
