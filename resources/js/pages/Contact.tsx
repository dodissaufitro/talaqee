import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { ChevronLeft, Mail, MapPin, Phone } from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';

export default function Contact() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#7e57c2] selection:text-white pb-20">
            <Head title="Kontak Kami - Talaqee" />

            {/* Mobile Header */}
            <div className="md:hidden flex items-center px-5 py-4 bg-white sticky top-0 z-50 border-b border-gray-100">
                <Link href={route('home')} className="w-8 h-8 flex items-center justify-center -ml-2 mr-2">
                    <ChevronLeft className="w-6 h-6 text-[#5C5AE6]" />
                </Link>
                <span className="text-[18px] font-bold text-[#1E293B]">
                    Kontak Kami
                </span>
            </div>

            {/* Desktop Navigation */}
            <WebDesktopNav />

            {/* Hero Section */}
            <div className="relative bg-[#f8f5ff] overflow-hidden pt-16 pb-16 border-b border-[#e9dfff]">
                <div className="w-full px-6 md:px-12 lg:px-20 relative z-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-[#7e57c2]">
                            <Phone size={32} strokeWidth={2} />
                        </div>
                        <h1 className="text-4xl md:text-[48px] font-extrabold text-[#1f2937] leading-tight mb-4">
                            Kontak Kami
                        </h1>
                        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                            Kami siap membantu Anda. Jangan ragu untuk menghubungi kami jika ada pertanyaan.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-6 md:px-12 lg:px-20 mt-10">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                            <Mail size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
                        <p className="text-gray-600">saufitrod@gmail.com</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                            <Phone size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">WhatsApp / Telepon</h3>
                        <p className="text-gray-600">+62 822 8557 8390</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                            <MapPin size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Alamat</h3>
                        <p className="text-gray-600">Jakarta, Indonesia</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
