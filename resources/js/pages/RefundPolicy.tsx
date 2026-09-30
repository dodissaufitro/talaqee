import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { 
    ChevronLeft, ShieldCheck, Clock, CheckCircle2, AlertCircle, 
    ArrowRight, MessageCircle, Mail, FileText, HelpCircle, 
    Check, AlertTriangle, RefreshCw, CreditCard, Sparkles, Building2
} from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';
import WebFooter from '@/components/WebFooter';

interface RefundPolicyProps {
    policyContent?: string;
}

export default function RefundPolicy({ policyContent = '' }: RefundPolicyProps) {
    const [activeSection, setActiveSection] = useState<'all' | 'eligible' | 'not-eligible' | 'process'>('all');

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#7e57c2] selection:text-white flex flex-col justify-between">
            <Head title="Kebijakan Pengembalian Dana (Refund Policy) - Talaqee" />

            <div>
                {/* ─── MOBILE HEADER (Preserved for Mobile View) ─── */}
                <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href={route('home')} className="w-8 h-8 flex items-center justify-center -ml-1 text-gray-700 hover:text-[#7e57c2]">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <span className="text-[17px] font-bold text-gray-900">
                            Kebijakan Refund
                        </span>
                    </div>
                    <Link href={route('kontak')} className="text-xs font-semibold text-[#7e57c2] bg-purple-50 px-2.5 py-1 rounded-full">
                        Bantuan
                    </Link>
                </div>

                {/* ─── DESKTOP NAVIGATION ─── */}
                <WebDesktopNav />

                {/* ─── HERO BANNER (Modern Dark Gradient with Glow) ─── */}
                <div className="relative bg-gradient-to-br from-[#0B091A] via-[#140E2E] to-[#1E123D] pt-12 pb-24 md:pt-16 md:pb-28 overflow-hidden text-white border-b border-purple-900/30">
                    <div className="absolute top-[-80px] left-1/4 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-[-100px] right-10 w-[500px] h-[500px] bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="w-full max-w-[1340px] mx-auto px-6 md:px-10 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                            
                            {/* Left Header Info */}
                            <div className="w-full lg:max-w-2xl text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs font-semibold tracking-wide uppercase mb-4">
                                    <ShieldCheck size={14} className="text-purple-400" />
                                    Transparansi & Perlindungan Konsumen
                                </div>
                                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                                    Kebijakan Pengembalian <br className="hidden md:inline" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-100 to-indigo-200">Dana (Refund Policy)</span>
                                </h1>
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
                                    Komitmen Talaqee dalam menjamin transaksi yang adil, jujur, amanah, dan terpercaya bagi seluruh penuntut ilmu syar'i.
                                </p>

                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-purple-200">
                                    <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                                        <Clock size={13} className="text-purple-400" />
                                        Terakhir diperbarui: 22 Agustus 2026
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                                        <CheckCircle2 size={13} className="text-emerald-400" />
                                        Proses 1x24 Jam Kerja
                                    </span>
                                </div>
                            </div>

                            {/* Right Quote Glass Card */}
                            <div className="w-full lg:w-auto shrink-0 flex justify-center">
                                <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-6 md:p-8 max-w-[380px] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
                                    
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                                            <FileText size={22} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">Amanah & Janji</h4>
                                            <p className="text-xs text-purple-200/70">Prinsip Muamalah Islam</p>
                                        </div>
                                    </div>

                                    <div className="my-4 border-l-2 border-purple-400/50 pl-4 py-1">
                                        <p className="text-sm text-gray-200 italic leading-relaxed">
                                            "Dan penuhilah janji; sesungguhnya janji itu pasti diminta pertanggungjawabannya."
                                        </p>
                                        <span className="text-xs font-semibold text-purple-300 block mt-2">
                                            (QS. Al-Isra: 34)
                                        </span>
                                    </div>

                                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
                                        <span>Metode Resmi:</span>
                                        <span className="font-semibold text-white bg-purple-900/60 px-2.5 py-1 rounded-md border border-purple-400/30">
                                            iPaymu Payment Gateway
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* ─── MAIN CONTENT ─── */}
                <div className="w-full max-w-[1340px] mx-auto px-6 md:px-10 -mt-8 relative z-20 pb-20">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        
                        {/* ─── LEFT SIDEBAR NAVIGATION ─── */}
                        <div className="w-full lg:w-80 shrink-0 space-y-6">
                            
                            {/* Fast Nav Card */}
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <div className="px-3 py-2 border-b border-gray-100 mb-2">
                                    <h3 className="font-bold text-gray-900 text-sm">Navigasi Kebijakan</h3>
                                </div>
                                <div className="space-y-1">
                                    {[
                                        { id: 'all', label: 'Seluruh Kebijakan', icon: FileText },
                                        { id: 'eligible', label: 'Syarat Pengembalian', icon: CheckCircle2 },
                                        { id: 'not-eligible', label: 'Kondisi Tidak Berlaku', icon: AlertCircle },
                                        { id: 'process', label: 'Alur 3 Langkah Refund', icon: RefreshCw },
                                    ].map((item) => {
                                        const IconComp = item.icon;
                                        const isSelected = activeSection === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveSection(item.id as any)}
                                                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-sm transition-all ${
                                                    isSelected 
                                                        ? 'bg-purple-50 text-[#7C3AED] font-bold shadow-sm' 
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            >
                                                <IconComp size={16} className={isSelected ? 'text-[#7C3AED]' : 'text-gray-400'} />
                                                <span>{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Help & WhatsApp Card */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm text-center">
                                <div className="w-12 h-12 bg-purple-50 text-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <MessageCircle size={24} />
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm mb-1">Ingin Mengajukan Refund?</h4>
                                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                    Siapkan ID Transaksi, bukti transfer, dan deskripsi kendala Anda.
                                </p>
                                <a 
                                    href="https://wa.me/6282285578390?text=Halo%20Admin%20Talaqee,%20saya%20ingin%20mengajukan%20klaim%20pengembalian%20dana%20(refund)"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm mb-2"
                                >
                                    <MessageCircle size={15} />
                                    Ajukan via WhatsApp
                                </a>
                                <a 
                                    href="mailto:saufitrod@gmail.com?subject=Pengajuan%20Refund%20Talaqee"
                                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium transition-colors"
                                >
                                    <Mail size={14} />
                                    Kirim Email Dukungan
                                </a>
                            </div>

                        </div>

                        {/* ─── RIGHT CONTENT DETAILS ─── */}
                        <div className="flex-1 w-full space-y-6">
                            
                            {/* Introduction Card */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-3">Ketentuan Umum Layanan Digital</h2>
                                <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed">
                                    Terima kasih telah mempercayai <strong>Talaqee</strong> sebagai wadah belajar Al-Qur'an, video kajian, dan literasi Islam. Kami berupaya memberikan pengalaman terbaik bagi setiap pengguna. Namun, jika terjadi kendala teknis atau ketidaksesuaian yang sah dalam proses pembayaran dan akses materi, kami menyediakan prosedur pengembalian dana yang berkeadilan sesuai ketentuan di bawah ini.
                                </p>
                            </div>

                            {/* SECTION 1: Syarat Pengembalian Dana */}
                            {(activeSection === 'all' || activeSection === 'eligible') && (
                                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                            <CheckCircle2 size={22} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Kondisi yang Memenuhi Syarat Refund</h3>
                                            <p className="text-xs text-gray-500">Klaim Anda akan disetujui jika memenuhi salah satu kondisi berikut:</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-start gap-3.5">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 mb-1">1. Kendala Teknis Akses Konten (Digital Access Failure)</h4>
                                                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                                    Jika terjadi kegagalan sistem internal server Talaqee yang menyebabkan materi (E-Book, Audio Talaqqi, atau Video Kajian) yang telah berhasil dibeli tidak dapat diakses sama sekali dalam waktu lebih dari <strong>2x24 jam</strong> setelah dilaporkan.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-start gap-3.5">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 mb-1">2. Transaksi Terpotong Ganda (Double Billing)</h4>
                                                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                                    Apabila rekening bank atau saldo e-wallet Anda terpotong lebih dari satu kali untuk nomor invoice atau pesanan paket koin yang sama, dana lebihan akan dikembalikan 100%.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-start gap-3.5">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 mb-1">3. Saldo Koin Gagal Masuk Otomatis</h4>
                                                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                                    Uang pembayaran telah sukses terverifikasi pada Payment Gateway iPaymu, namun Saldo Koin tidak bertambah di akun Anda dalam waktu maksimal <strong>1x24 jam</strong> sejak pembayaran selesai.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECTION 2: Kondisi Tidak Berlaku */}
                            {(activeSection === 'all' || activeSection === 'not-eligible') && (
                                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                                            <AlertTriangle size={22} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Kondisi yang Tidak Memenuhi Syarat Refund</h3>
                                            <p className="text-xs text-gray-500">Pengembalian dana tidak dapat diproses dalam skenario berikut:</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/20">
                                            <div className="text-rose-500 font-bold text-xs uppercase tracking-wider mb-1">Kelalaian Pengguna</div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-1">Salah Memilih Produk</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                Salah membeli judul e-book, bab kajian, atau paket koin karena ketidaktelitian pembeli sebelum mengonfirmasi pembayaran.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/20">
                                            <div className="text-rose-500 font-bold text-xs uppercase tracking-wider mb-1">Subjektivitas</div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-1">Perubahan Keputusan</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                Alasan subjektif seperti tidak lagi menyukai konten setelah materi selesai dibaca atau ditonton.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/20">
                                            <div className="text-rose-500 font-bold text-xs uppercase tracking-wider mb-1">Batas Waktu</div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-1">Lewat dari 7 Hari Kalender</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                Klaim yang diajukan setelah lebih dari 7 (tujuh) hari kerja sejak transaksi pembelian diselesaikan.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/20">
                                            <div className="text-rose-500 font-bold text-xs uppercase tracking-wider mb-1">Pelanggaran Syarat</div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-1">Pelanggaran Hak Cipta & ToS</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                Akun yang dibekukan karena terbukti melakukan pembajakan, penyebaran ulang, atau manipulasi sistem.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECTION 3: Alur 3 Langkah Pengajuan */}
                            {(activeSection === 'all' || activeSection === 'process') && (
                                <div className="bg-gradient-to-br from-purple-50/60 to-indigo-50/40 rounded-2xl p-6 md:p-8 border border-purple-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
                                            <RefreshCw size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Alur & Tahapan Pengajuan Refund</h3>
                                            <p className="text-xs text-gray-500">3 langkah mudah untuk menyelesaikan proses klaim pengembalian dana</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-purple-100 relative">
                                            <div className="text-3xl font-extrabold text-purple-200 mb-2">01</div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-1.5">Kirimkan Bukti</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                Hubungi WhatsApp resmi atau email kami dengan melampirkan screenshot bukti transfer, nomor referensi transaksi, dan email akun Anda.
                                            </p>
                                        </div>

                                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-purple-100 relative">
                                            <div className="text-3xl font-extrabold text-purple-200 mb-2">02</div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-1.5">Verifikasi Admin</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                Tim Finance Talaqee memvalidasi data transaksi Anda ke log Payment Gateway iPaymu dalam waktu maksimal 1x24 jam kerja.
                                            </p>
                                        </div>

                                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-purple-100 relative">
                                            <div className="text-3xl font-extrabold text-purple-200 mb-2">03</div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-1.5">Pencairan Dana</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                Dana ditransfer kembali ke rekening pengirim atau dikonversi menjadi Koin Talaqee (sesuai persetujuan pengguna).
                                            </p>
                                        </div>
                                    </div>

                                    {/* SLA Info Banner */}
                                    <div className="mt-6 p-4 rounded-xl bg-white border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 text-center sm:text-left">
                                            <Clock size={20} className="text-[#7C3AED] shrink-0" />
                                            <span className="text-xs text-gray-700 font-medium">
                                                Estimasi waktu pencairan ke rekening bank lokal: <strong>3 – 7 hari kerja</strong> (tergantung kliring bank).
                                            </span>
                                        </div>
                                        <Link 
                                            href={route('terms')}
                                            className="text-xs font-bold text-[#7C3AED] hover:underline shrink-0"
                                        >
                                            Baca Syarat & Ketentuan →
                                        </Link>
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </div>

            {/* ─── WEB FOOTER ─── */}
            <WebFooter />
        </div>
    );
}
