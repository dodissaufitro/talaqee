import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { Search, ChevronLeft, ShieldCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';

export default function RefundPolicy({ policyContent = '' }: { policyContent?: string }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#7e57c2] selection:text-white pb-20">
            <Head title="Kebijakan Pengembalian Dana (Refund Policy) - Talaqee" />

            {/* Mobile Header */}
            <div className="md:hidden flex items-center px-5 py-4 bg-white sticky top-0 z-50 border-b border-gray-100">
                <Link href={route('home')} className="w-8 h-8 flex items-center justify-center -ml-2 mr-2">
                    <ChevronLeft className="w-6 h-6 text-[#5C5AE6]" />
                </Link>
                <span className="text-[18px] font-bold text-[#1E293B]">
                    Refund Policy
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
                            <ShieldCheck size={24} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-[36px] lg:text-[42px] font-extrabold text-[#111827] leading-tight mb-2 tracking-tight">
                            Kebijakan Pengembalian Dana
                        </h1>
                        <p className="text-slate-500 text-[15px] font-medium">
                            Terakhir diperbarui: 22 Agustus 2026
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
                                Dan penuhilah janji;<br/>
                                sesungguhnya janji itu<br/>
                                pasti diminta<br/>
                                pertanggungjawabannya.
                            </p>
                            <p className="text-[#8155ff] font-semibold mt-4 text-[12px]">
                                (QS. Al-Isra: 34)
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-6 md:px-12 lg:px-20 mt-10">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                    
                    {policyContent ? (
                        <div className="prose prose-indigo max-w-none text-gray-700 whitespace-pre-wrap font-sans">
                            {policyContent}
                        </div>
                    ) : (
                        <div className="prose prose-indigo max-w-none text-gray-700">
                            <p className="text-[16px] leading-relaxed mb-8">
                                Terima kasih telah berbelanja dan menggunakan layanan di <strong>Talaqee</strong>. Kami selalu berkomitmen untuk menyediakan konten islami dan layanan berkualitas tinggi. Jika Anda tidak sepenuhnya puas dengan pembelian Anda, kami siap membantu sesuai dengan syarat dan ketentuan pengembalian dana (refund) yang berlaku.
                            </p>

                            <div className="mb-10">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                    <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm"><CheckCircle2 size={18} /></span>
                                    Syarat Pengembalian Dana
                                </h2>
                                <p className="mb-4 text-[15px] leading-relaxed">
                                    Pengembalian dana dapat diproses jika memenuhi salah satu atau beberapa kriteria berikut:
                                </p>
                                <ul className="space-y-3 mb-6 list-none pl-0">
                                    <li className="flex items-start gap-3 text-[15px] leading-relaxed bg-gray-50 p-4 rounded-xl">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#7e57c2] mt-2 shrink-0"></div>
                                        <span><strong>Konten Tidak Dapat Diakses:</strong> Jika terjadi kesalahan teknis dari sisi server kami yang mengakibatkan produk digital (Video, Audio, atau E-Book) yang sudah dibeli tidak dapat diakses sama sekali dalam waktu 2x24 jam.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[15px] leading-relaxed bg-gray-50 p-4 rounded-xl">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#7e57c2] mt-2 shrink-0"></div>
                                        <span><strong>Transaksi Ganda (Double Billing):</strong> Jika sistem kami atau pihak metode pembayaran secara tidak sengaja memotong dana Anda dua kali untuk satu transaksi yang sama.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[15px] leading-relaxed bg-gray-50 p-4 rounded-xl">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#7e57c2] mt-2 shrink-0"></div>
                                        <span><strong>Pembelian Koin Gagal:</strong> Saldo/uang Anda sudah terpotong melalui Payment Gateway, namun Saldo Koin di aplikasi Anda tidak bertambah dalam waktu maksimal 1x24 jam setelah Anda melaporkan kendala.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mb-10">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                                    <span className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-sm"><AlertCircle size={18} /></span>
                                    Kondisi Tidak Berlakunya Refund
                                </h2>
                                <p className="mb-4 text-[15px] leading-relaxed">
                                    Pengembalian dana <strong>TIDAK BERLAKU</strong> untuk kondisi berikut:
                                </p>
                                <ul className="space-y-3 list-none pl-0">
                                    <li className="flex items-start gap-3 text-[15px] leading-relaxed border border-gray-100 p-4 rounded-xl">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                                        <span>Anda salah membeli produk (misal: salah membeli judul buku atau video).</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[15px] leading-relaxed border border-gray-100 p-4 rounded-xl">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                                        <span>Anda merasa konten yang disajikan tidak sesuai dengan ekspektasi pribadi Anda (semua deskripsi dan preview sudah disajikan sebelum pembelian).</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[15px] leading-relaxed border border-gray-100 p-4 rounded-xl">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                                        <span>Pembelian telah dilakukan lebih dari <strong>7 Hari kerja</strong> sebelum Anda mengajukan klaim.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[15px] leading-relaxed border border-gray-100 p-4 rounded-xl">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                                        <span>Anda melanggar Syarat dan Ketentuan Layanan (Terms of Service) Talaqee yang berakibat pada pembekuan akun.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mb-8 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                                <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-3 mb-4">
                                    <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm"><Clock size={18} /></span>
                                    Proses Pengajuan Pengembalian Dana
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="font-bold text-indigo-400 text-xl">01.</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">Hubungi Tim Bantuan</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">Kirimkan email ke <strong>support@talaqee.com</strong> atau hubungi nomor WhatsApp resmi kami dengan melampirkan Bukti Pembayaran, ID Transaksi, dan deskripsi detail mengenai kendala Anda.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="font-bold text-indigo-400 text-xl">02.</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">Verifikasi</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">Tim kami akan meninjau dan memverifikasi laporan Anda dalam waktu maksimal 2x24 jam pada hari kerja.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="font-bold text-indigo-400 text-xl">03.</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">Pencairan Dana</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">Jika disetujui, dana akan dikembalikan ke rekening/metode pembayaran asli Anda atau dikonversi menjadi Koin Talaqee (sesuai kesepakatan). Proses pengembalian dana ke rekening bank memakan waktu 3-7 hari kerja tergantung kebijakan bank terkait.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
        </div>
    );
}
