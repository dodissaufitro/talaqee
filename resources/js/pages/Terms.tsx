import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { ChevronLeft, FileText } from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';

export default function Terms() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#7e57c2] selection:text-white pb-20">
            <Head title="Syarat dan Ketentuan - Talaqee" />

            {/* Mobile Header */}
            <div className="md:hidden flex items-center px-5 py-4 bg-white sticky top-0 z-50 border-b border-gray-100">
                <Link href={route('home')} className="w-8 h-8 flex items-center justify-center -ml-2 mr-2">
                    <ChevronLeft className="w-6 h-6 text-[#5C5AE6]" />
                </Link>
                <span className="text-[18px] font-bold text-[#1E293B]">
                    Syarat & Ketentuan
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
                            <FileText size={24} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-[36px] lg:text-[42px] font-extrabold text-[#111827] leading-tight mb-2 tracking-tight">
                            Syarat dan Ketentuan
                        </h1>
                        <p className="text-slate-500 text-[15px] font-medium">
                            Peraturan dan ketentuan dalam menggunakan layanan Talaqee.
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
                                Kaum muslimin itu<br/>
                                terikat pada syarat-syarat<br/>
                                (perjanjian) mereka.
                            </p>
                            <p className="text-[#8155ff] font-semibold mt-4 text-[12px]">
                                (HR. Abu Dawud)
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-6 md:px-12 lg:px-20 mt-10">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <div className="prose prose-indigo max-w-none text-gray-700">
                        <p className="text-[16px] leading-relaxed mb-4">
                            Selamat datang di <strong>Talaqee</strong>. Dengan mengakses dan menggunakan platform ini, Anda menyetujui syarat dan ketentuan berikut:
                        </p>
                        <h3 className="text-xl font-bold mt-6 mb-3">1. Penggunaan Platform</h3>
                        <p>Platform Talaqee disediakan untuk tujuan pembelajaran Islami. Pengguna diharapkan menjaga adab islami saat menggunakan platform ini.</p>

                        <h3 className="text-xl font-bold mt-6 mb-3">2. Akun Pengguna</h3>
                        <p>Anda bertanggung jawab untuk menjaga kerahasiaan akun dan kata sandi Anda. Semua aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda.</p>

                        <h3 className="text-xl font-bold mt-6 mb-3">3. Pembelian dan Pengembalian Dana</h3>
                        <p>Semua pembelian konten bersifat final kecuali diatur lain dalam Kebijakan Pengembalian Dana (Refund Policy) kami.</p>

                        <h3 className="text-xl font-bold mt-6 mb-3">4. Hak Cipta Konten</h3>
                        <p>Semua konten (Buku, Video, Audio) dilindungi oleh hak cipta. Dilarang keras menyalin, mendistribusikan, atau menjual ulang tanpa izin tertulis dari pihak Talaqee.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
