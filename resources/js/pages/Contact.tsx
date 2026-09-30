import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { ChevronLeft, Mail, MapPin, Phone, Clock, Building2, ShieldCheck, MessageSquare, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';
import WebFooter from '@/components/WebFooter';

export default function Contact() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#7e57c2] selection:text-white flex flex-col justify-between">
            <Head title="Kontak & Alamat Bisnis - Talaqee" />

            <div>
                {/* ─── MOBILE HEADER ─── */}
                <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href={route('home')} className="w-8 h-8 flex items-center justify-center -ml-1 text-gray-700 hover:text-[#7e57c2]">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <span className="text-[17px] font-bold text-gray-900">
                            Kontak & Alamat Kami
                        </span>
                    </div>
                    <Link href={route('faq.index')} className="text-xs font-semibold text-[#7e57c2] bg-purple-50 px-2.5 py-1 rounded-full">
                        FAQ
                    </Link>
                </div>

                {/* ─── DESKTOP NAVIGATION ─── */}
                <WebDesktopNav />

                {/* ─── HERO BANNER ─── */}
                <div className="relative bg-gradient-to-br from-[#0B091A] via-[#140E2E] to-[#1E123D] pt-12 pb-24 md:pt-16 md:pb-28 overflow-hidden text-white border-b border-purple-900/30">
                    <div className="absolute top-[-80px] left-1/4 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-[-100px] right-10 w-[500px] h-[500px] bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="w-full max-w-[1340px] mx-auto px-6 md:px-10 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                            
                            {/* Left Header Titles */}
                            <div className="w-full lg:max-w-2xl text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs font-semibold tracking-wide uppercase mb-4">
                                    <Building2 size={14} className="text-purple-400" />
                                    Layanan Informasi & Kontak Resmi
                                </div>
                                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                                    Kontak & Domisili <br className="hidden md:inline" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-100 to-indigo-200">Operasional Talaqee</span>
                                </h1>
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
                                    Informasi resmi kontak bantuan pelanggan, alamat kantor operasional, dan saluran komunikasi Talaqee.
                                </p>

                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-purple-200">
                                    <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                                        <Clock size={13} className="text-purple-400" />
                                        Senin – Jumat (08.00 – 17.00 WIB)
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                                        <CheckCircle2 size={13} className="text-emerald-400" />
                                        Respons Cepat 1x24 Jam
                                    </span>
                                </div>
                            </div>

                            {/* Right Hadith Card */}
                            <div className="w-full lg:w-auto shrink-0 flex justify-center">
                                <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-6 md:p-8 max-w-[380px] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
                                    
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                                            <Sparkles size={22} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">Nasihat Kebajikan</h4>
                                            <p className="text-xs text-purple-200/70">Kebaikan bagi sesama</p>
                                        </div>
                                    </div>

                                    <div className="my-4 border-l-2 border-purple-400/50 pl-4 py-1">
                                        <p className="text-sm text-gray-200 italic leading-relaxed">
                                            "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya."
                                        </p>
                                        <span className="text-xs font-semibold text-purple-300 block mt-2">
                                            (HR. Ahmad & Thabrani)
                                        </span>
                                    </div>

                                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
                                        <span>Status Layanan:</span>
                                        <span className="font-semibold text-white bg-emerald-900/60 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-400/30">
                                            Aktif & Buka
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* ─── MAIN CONTENT GRID ─── */}
                <div className="w-full max-w-[1340px] mx-auto px-6 md:px-10 -mt-8 relative z-20 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Kolom 1: Alamat Kantor */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-6">
                                    <MapPin size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Kantor Operasional</h3>
                                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                    Kunjungi atau kirimkan surat korespondensi ke alamat kantor resmi kami:
                                </p>
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm text-gray-700 leading-relaxed font-medium">
                                    Gang Mawar 26-7 RT/RW 003/008,<br/>
                                    Kelurahan Halim Perdana Kusuma,<br/>
                                    Kecamatan Makasar, Kota Jakarta Timur,<br/>
                                    Daerah Khusus Ibukota Jakarta 13610
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                                <Clock size={16} className="text-[#7C3AED]" />
                                <span>Jam Layanan: Senin – Jumat (08.00 – 17.00 WIB)</span>
                            </div>
                        </div>

                        {/* Kolom 2: Kontak Langsung */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                                    <MessageSquare size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Saluran Komunikasi</h3>
                                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                    Hubungi tim customer service kami melalui saluran resmi berikut:
                                </p>
                                
                                <div className="space-y-4">
                                    <a 
                                        href="https://wa.me/6282285578390" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                            <Phone size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">WhatsApp Customer Care</div>
                                            <div className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">+62 822 8557 8390</div>
                                        </div>
                                    </a>

                                    <a 
                                        href="mailto:saufitrod@gmail.com" 
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-100 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0">
                                            <Mail size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-purple-800 font-semibold uppercase tracking-wider">Email Dukungan</div>
                                            <div className="text-base font-bold text-gray-900 group-hover:text-[#7C3AED] transition-colors truncate">saufitrod@gmail.com</div>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                                <CheckCircle2 size={16} />
                                <span>Rata-rata waktu tanggap tim support: &lt; 2 jam kerja</span>
                            </div>
                        </div>

                        {/* Kolom 3: Informasi Bisnis & Keamanan */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Informasi Pembayaran</h3>
                                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                    Transaksi koin digital Anda diproses secara resmi dan aman:
                                </p>
                                
                                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="font-bold text-gray-900 mb-1">Payment Gateway Resmi</div>
                                        <p className="text-xs text-gray-500">
                                            Didukung resmi oleh <strong>iPaymu</strong> dengan dukungan Virtual Account seluruh bank nasional, QRIS, dan e-Wallet berizin Bank Indonesia.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="font-bold text-gray-900 mb-1">Pengiriman Instan Otomatis</div>
                                        <p className="text-xs text-gray-500">
                                            Koin digital dan akses konten materi pembelajaran langsung aktif secara instan detik itu juga setelah verifikasi pembayaran berhasil.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
                                <Link href={route('refund.policy')} className="hover:text-[#7C3AED] transition-colors">
                                    Kebijakan Refund
                                </Link>
                                <span>•</span>
                                <Link href={route('terms')} className="hover:text-[#7C3AED] transition-colors">
                                    Syarat & Ketentuan
                                </Link>
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
