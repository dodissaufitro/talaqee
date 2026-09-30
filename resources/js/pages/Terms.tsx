import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { 
    ChevronLeft, FileText, ShieldCheck, Scale, AlertCircle, 
    CheckCircle2, Clock, BookOpen, UserCheck, Lock, CreditCard, 
    HelpCircle, Mail, MessageCircle, ArrowRight, Printer
} from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';
import WebFooter from '@/components/WebFooter';

interface TermSection {
    id: string;
    title: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const SECTIONS: TermSection[] = [
    { id: 'umum', title: '1. Ketentuan Umum & Definisi', icon: BookOpen },
    { id: 'akun', title: '2. Akun & Keamanan Pengguna', icon: UserCheck },
    { id: 'hak-cipta', title: '3. Hak Cipta & Lisensi Konten', icon: Scale },
    { id: 'pembayaran', title: '4. Transaksi & Sistem Koin', icon: CreditCard },
    { id: 'refund', title: '5. Pengembalian Dana (Refund)', icon: ShieldCheck },
    { id: 'privasi', title: '6. Privasi & Kerahasiaan Data', icon: Lock },
    { id: 'sanksi', title: '7. Penangguhan & Pembatalan', icon: AlertCircle },
    { id: 'hukum', title: '8. Hukum yang Berlaku & Kontak', icon: Clock },
];

export default function Terms() {
    const [activeSection, setActiveSection] = useState<string>('umum');

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const offset = 90;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#7e57c2] selection:text-white flex flex-col justify-between">
            <Head title="Syarat dan Ketentuan Layanan - Talaqee" />

            <div>
                {/* ─── MOBILE HEADER ─── */}
                <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href={route('home')} className="w-8 h-8 flex items-center justify-center -ml-1 text-gray-700 hover:text-[#7e57c2]">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <span className="text-[17px] font-bold text-gray-900">
                            Syarat & Ketentuan
                        </span>
                    </div>
                    <Link href={route('kontak')} className="text-xs font-semibold text-[#7e57c2] bg-purple-50 px-2.5 py-1 rounded-full">
                        Bantuan
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
                                    <Scale size={14} className="text-purple-400" />
                                    Ketentuan Hukum & Panduan Pengguna
                                </div>
                                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                                    Syarat dan Ketentuan <br className="hidden md:inline" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-100 to-indigo-200">Layanan Talaqee</span>
                                </h1>
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
                                    Perjanjian resmi penggunaan platform pembelajaran talaqqi Al-Qur'an, video kajian ilmiah, dan perpustakaan digital islami Talaqee.
                                </p>

                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-purple-200">
                                    <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                                        <Clock size={13} className="text-purple-400" />
                                        Berlaku Efektif: 1 Januari 2026
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                                        <CheckCircle2 size={13} className="text-emerald-400" />
                                        Prinsip Muamalah Syar'i
                                    </span>
                                </div>
                            </div>

                            {/* Right Hadith Glass Card */}
                            <div className="w-full lg:w-auto shrink-0 flex justify-center">
                                <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-6 md:p-8 max-w-[380px] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
                                    
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                                            <FileText size={22} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">Komitmen Perjanjian</h4>
                                            <p className="text-xs text-purple-200/70">Dalil Syariat</p>
                                        </div>
                                    </div>

                                    <div className="my-4 border-l-2 border-purple-400/50 pl-4 py-1">
                                        <p className="text-sm text-gray-200 italic leading-relaxed">
                                            "Kaum muslimin itu terikat pada syarat-syarat (perjanjian yang mereka sepakati)."
                                        </p>
                                        <span className="text-xs font-semibold text-purple-300 block mt-2">
                                            (HR. Abu Dawud No. 3594 & Tirmidzi)
                                        </span>
                                    </div>

                                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
                                        <span>Status Dokumen:</span>
                                        <span className="font-semibold text-white bg-emerald-900/60 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-400/30">
                                            Resmi & Mengikat
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
                        
                        {/* ─── LEFT SIDEBAR: TABLE OF CONTENTS (Sticky) ─── */}
                        <div className="w-full lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-24">
                            
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <div className="px-3 py-2 border-b border-gray-100 mb-2">
                                    <h3 className="font-bold text-gray-900 text-sm">Daftar Isi Ketentuan</h3>
                                </div>
                                <div className="space-y-1">
                                    {SECTIONS.map((sec) => {
                                        const IconComp = sec.icon;
                                        const isSelected = activeSection === sec.id;
                                        return (
                                            <button
                                                key={sec.id}
                                                onClick={() => scrollToSection(sec.id)}
                                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs transition-all ${
                                                    isSelected 
                                                        ? 'bg-purple-50 text-[#7C3AED] font-bold shadow-sm' 
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            >
                                                <IconComp size={15} className={isSelected ? 'text-[#7C3AED]' : 'text-gray-400 shrink-0'} />
                                                <span className="truncate">{sec.title}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Need Clarification Card */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm text-center">
                                <HelpCircle size={24} className="text-[#7C3AED] mx-auto mb-2" />
                                <h4 className="font-bold text-gray-900 text-xs mb-1">Ada Pertanyaan Hukum?</h4>
                                <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                                    Tim legal dan customer support kami siap menjelaskan klausul yang berlaku.
                                </p>
                                <a 
                                    href="mailto:saufitrod@gmail.com?subject=Tanya%20Syarat%20Ketentuan%20Talaqee"
                                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] text-xs font-semibold transition-colors"
                                >
                                    <Mail size={13} />
                                    Email Legal Talaqee
                                </a>
                            </div>

                        </div>

                        {/* ─── RIGHT ARTICLES / SECTIONS ─── */}
                        <div className="flex-1 w-full space-y-6">
                            
                            {/* SECTION 1: Ketentuan Umum */}
                            <section id="umum" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold">
                                        <BookOpen size={18} />
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900">1. Ketentuan Umum & Definisi</h2>
                                </div>
                                <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                                    <p>
                                        Selamat datang di platform <strong>Talaqee</strong> ("Kami", "Platform", atau "Layanan"). Dengan mengunduh aplikasi, mengakses situs web, mendaftarkan akun, atau menggunakan materi digital yang disediakan, Anda ("Pengguna") menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan ini.
                                    </p>
                                    <p>
                                        Jika Anda tidak menyetujui salah satu butir dari Syarat dan Ketentuan ini, Anda disarankan untuk tidak melanjutkan penggunaan layanan kami.
                                    </p>
                                    <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-purple-900 leading-relaxed">
                                        <strong>Definisi:</strong> "Talaqqi" merujuk pada metode belajar Al-Qur'an secara langsung berhadapan dan bertahap. "Koin" adalah mata uang virtual non-tunai di platform Talaqee yang digunakan khusus untuk membuka akses materi e-book atau rekaman audio premium.
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 2: Akun & Keamanan */}
                            <section id="akun" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                        <UserCheck size={18} />
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900">2. Pendaftaran Akun & Tanggung Jawab Keamanan</h2>
                                </div>
                                <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Pengguna wajib memberikan data yang benar, akurat, dan valid saat melakukan pendaftaran akun (nama lengkap dan alamat email aktif).</li>
                                        <li>Pengguna bertanggung jawab penuh atas kerahasiaan kata sandi (password) serta segala aktivitas yang terjadi di bawah akun pribadi tersebut.</li>
                                        <li>Satu akun hanya diperuntukkan bagi penggunaan personal individu dan dilarang dipinjamkan atau diperjualbelikan kepada pihak ketiga.</li>
                                        <li>Talaqee berhak menolak pendaftaran atau menonaktifkan akun yang terindikasi menggunakan identitas palsu atau bot pendaftar otomatis.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* SECTION 3: Hak Cipta & Lisensi */}
                            <section id="hak-cipta" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                        <Scale size={18} />
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900">3. Hak Cipta, Kepemilikan & Lisensi Konten</h2>
                                </div>
                                <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                                    <p>
                                        Seluruh materi yang disajikan dalam platform Talaqee—termasuk naskah e-book, rekaman audio murottal, rekaman talaqqi, video kajian, desain visual antarmuka, logo, dan kode sumber—adalah hak milik eksklusif Talaqee dan/atau asatidzah serta penerbit mitra yang dilindungi oleh Undang-Undang Hak Cipta Republik Indonesia.
                                    </p>
                                    <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 text-rose-900 text-xs space-y-1.5">
                                        <span className="font-bold flex items-center gap-1.5 text-rose-700">
                                            <AlertCircle size={15} /> Larangan Keras Pembajakan:
                                        </span>
                                        <p>
                                            Dilarang keras menyalin, merekam layar untuk tujuan komersil, memperbanyak, mendistribusikan secara ilegal, mengunggah ulang ke situs torrent/file sharing, atau menjual kembali materi tanpa izin tertulis dari manajemen Talaqee. Pelanggaran akan diproses melalui jalur hukum yang berlaku.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 4: Transaksi & Sistem Koin */}
                            <section id="pembayaran" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                                        <CreditCard size={18} />
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900">4. Pembelian, Sistem Koin & Pembayaran (iPaymu)</h2>
                                </div>
                                <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                                    <p>
                                        Sistem transaksi di Talaqee menggunakan saldo Koin digital untuk pembelian satuan e-book atau materi premium:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Top-up koin diproses melalui mitra Payment Gateway resmi berizin <strong>iPaymu</strong> dengan dukungan Virtual Account Bank, QRIS, dan e-Wallet.</li>
                                        <li>Koin digital yang telah dibeli tidak dapat ditukarkan kembali menjadi uang tunai (non-redeemable cash), kecuali dalam kondisi klaim refund resmi yang disetujui.</li>
                                        <li>Materi yang telah berhasil dibeli menggunakan koin akan menjadi hak akses baca/dengar permanen di akun pengguna selama akun berstatus aktif.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* SECTION 5: Refund Policy Link */}
                            <section id="refund" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900">5. Pengembalian Dana & Jaminan Kepuasan</h2>
                                </div>
                                <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                                    <p>
                                        Ketentuan pengembalian dana diatur secara terperinci dalam dokumen terpisah pada halaman Kebijakan Pengembalian Dana. Secara umum, refund hanya diberikan pada kasus kendala teknis konten yang gagal diakses, transaksi ganda (double billing), atau kegagalan top up koin.
                                    </p>
                                    <Link 
                                        href={route('refund.policy')}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] hover:underline bg-purple-50 px-3.5 py-2 rounded-xl border border-purple-100"
                                    >
                                        Lihat Dokumen Kebijakan Refund Lengkap →
                                    </Link>
                                </div>
                            </section>

                            {/* SECTION 6: Privasi Data */}
                            <section id="privasi" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-violet-50 text-[#7C3AED] flex items-center justify-center font-bold">
                                        <Lock size={18} />
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900">6. Privasi & Kerahasiaan Data Pribadi</h2>
                                </div>
                                <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                                    <p>
                                        Talaqee berkomitmen melindungi informasi data pribadi pengguna sesuai standar perlindungan data pribadi yang berlaku. Kami tidak akan memperjualbelikan nomor telepon, alamat email, atau histori pembelajaran Anda kepada pihak ketiga pengiklan manapun.
                                    </p>
                                    <p>
                                        Data hanya digunakan untuk kepentingan autentikasi masuk, pengiriman notifikasi materi baru, dan pemrosesan validasi transaksi pembayaran melalui iPaymu.
                                    </p>
                                </div>
                            </section>

                            {/* SECTION 7: Penangguhan Akun */}
                            <section id="sanksi" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                                        <AlertCircle size={18} />
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900">7. Penangguhan & Pemblokiran Akun</h2>
                                </div>
                                <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                                    <p>
                                        Talaqee berhak membatasi, menangguhkan sementara, atau menghentikan akun pengguna secara permanen tanpa pengembalian dana apabila pengguna:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1.5">
                                        <li>Melakukan tindakan peretasan, serangan denial of service (DoS), atau scraping sistem.</li>
                                        <li>Mengunggah komentar bermuatan SARA, provokasi, atau pelecehan adab penuntut ilmu di kolom interaksi materi.</li>
                                        <li>Menggunakan cara curang dalam pengisian koin atau transaksi palsu.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* SECTION 8: Kontak & Domisili Hukum */}
                            <section id="hukum" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center font-bold">
                                        <Clock size={18} />
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900">8. Hukum yang Berlaku & Kontak Resmi</h2>
                                </div>
                                <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                                    <p>
                                        Syarat dan Ketentuan ini tunduk pada hukum Negara Kesatuan Republik Indonesia. Setiap perselisihan yang timbul akan diupayakan untuk diselesaikan terlebih dahulu melalui musyawarah untuk mufakat secara kekeluargaan.
                                    </p>
                                    <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                                        <p><strong>Alamat Kantor Bisnis:</strong> Gang Mawar 26-7 RT/RW 003/008, Kel. Halim Perdana Kusuma, Kec. Makasar, Kota Jakarta Timur, DKI Jakarta 13610</p>
                                        <p><strong>WhatsApp Bantuan:</strong> +62 822 8557 8390</p>
                                        <p><strong>Email:</strong> saufitrod@gmail.com</p>
                                    </div>
                                </div>
                            </section>

                        </div>

                    </div>
                </div>
            </div>

            {/* ─── WEB FOOTER ─── */}
            <WebFooter />
        </div>
    );
}
