import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { Search, ChevronLeft, ShieldCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

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
            <nav className="hidden md:block bg-white sticky top-0 z-50 shadow-sm shadow-gray-100">
                <div className="w-full px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
                    <Link href={route('home')} className="flex items-center gap-2">
                        <img src="/logo/logo_app.talaqee.png" alt="Talaqee Logo" className="h-10 w-auto object-contain" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
                        <Link href={route('home')} className="text-gray-600 hover:text-[#7e57c2] transition-colors">Beranda</Link>
                        <Link href={route('katalog.index')} className="text-gray-600 hover:text-[#7e57c2] transition-colors">Katalog</Link>
                        <Link href={route('videos.index')} className="text-gray-600 hover:text-[#7e57c2] transition-colors">Video Kajian</Link>
                        <Link href={route('audios.index')} className="text-gray-600 hover:text-[#7e57c2] transition-colors">Rekaman Audio</Link>
                        <Link href="#" className="text-[#7e57c2] border-b-2 border-[#7e57c2] py-4">Refund Policy</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href={route('login')} className="px-5 py-2.5 text-sm font-semibold text-[#7e57c2] bg-white border-2 border-[#f3eefe] hover:bg-[#f3eefe] rounded-xl transition-colors">
                            Masuk
                        </Link>
                        <Link href={route('register')} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#7e57c2] hover:bg-[#6b48a8] rounded-xl transition-colors shadow-sm shadow-indigo-200">
                            Daftar Gratis
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative bg-[#f8f5ff] overflow-hidden pt-16 pb-16 border-b border-[#e9dfff]">
                <div className="absolute inset-0 z-0">
                    <img src="/images/mosque_hero.png" alt="Mosque background" className="absolute bottom-0 right-0 w-[80%] md:w-[60%] h-auto opacity-20 object-cover object-bottom" />
                </div>
                
                <div className="w-full px-6 md:px-12 lg:px-20 relative z-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-[#7e57c2]">
                            <ShieldCheck size={32} strokeWidth={2} />
                        </div>
                        <h1 className="text-4xl md:text-[48px] font-extrabold text-[#1f2937] leading-tight mb-4">
                            Kebijakan Pengembalian Dana
                        </h1>
                        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                            Terakhir diperbarui: 22 Agustus 2026
                        </p>
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
