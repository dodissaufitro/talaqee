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
            <div className="relative bg-[#f8f5ff] overflow-hidden pt-16 pb-16 border-b border-[#e9dfff]">
                <div className="w-full px-6 md:px-12 lg:px-20 relative z-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-[#7e57c2]">
                            <FileText size={32} strokeWidth={2} />
                        </div>
                        <h1 className="text-4xl md:text-[48px] font-extrabold text-[#1f2937] leading-tight mb-4">
                            Syarat dan Ketentuan
                        </h1>
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
