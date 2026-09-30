import React from 'react';
import { Link } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

export default function WebFooter() {
    return (
        <footer className="w-full bg-white border-t border-gray-100 pt-16 pb-10 mt-16 font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-100">
                    {/* Column 1: Brand & Desc */}
                    <div className="md:col-span-4">
                        <Link href={route('home')} className="inline-block mb-4">
                            <img src="/logo/logo_app.talaqee.png" alt="Talaqee Logo" className="h-9 w-auto object-contain" />
                        </Link>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-sm mb-5">
                            Platform pembelajaran Al-Qur'an, perpustakaan digital islami, dan video kajian ilmiah terpercaya untuk mendampingi langkah hijrah dan literasi ilmu syar'i Anda.
                        </p>
                        <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Pembayaran Resmi via iPaymu Gateway</span>
                        </div>
                    </div>

                    {/* Column 2: Navigasi */}
                    <div className="md:col-span-3">
                        <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-4">
                            Navigasi Cepat
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium text-gray-600">
                            <li>
                                <Link href={route('home')} className="hover:text-purple-600 transition-colors">Beranda</Link>
                            </li>
                            <li>
                                <Link href={route('katalog.index')} className="hover:text-purple-600 transition-colors">Katalog Buku</Link>
                            </li>
                            <li>
                                <Link href={route('videos.index')} className="hover:text-purple-600 transition-colors">Video Kajian</Link>
                            </li>
                            <li>
                                <Link href={route('audios.index')} className="hover:text-purple-600 transition-colors">Audio Talaqqi</Link>
                            </li>
                            <li>
                                <Link href="/akun/topup" className="hover:text-purple-600 transition-colors">Top Up Koin</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Bantuan & Legalitas */}
                    <div className="md:col-span-2">
                        <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-4">
                            Bantuan
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium text-gray-600">
                            <li>
                                <Link href={route('faq.index')} className="hover:text-purple-600 transition-colors">FAQ</Link>
                            </li>
                            <li>
                                <Link href={route('refund.policy')} className="hover:text-purple-600 transition-colors">Refund Policy</Link>
                            </li>
                            <li>
                                <Link href={route('terms')} className="hover:text-purple-600 transition-colors">Syarat & Ketentuan</Link>
                            </li>
                            <li>
                                <Link href={route('kontak')} className="hover:text-purple-600 transition-colors">Kontak Kami</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Kontak & Kantor */}
                    <div className="md:col-span-3">
                        <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-4">
                            Kantor Bisnis
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-3">
                            Gang Mawar 26-7 RT/RW 003/008, Kel. Halim Perdana Kusuma, Kec. Makasar, Kota Jakarta Timur, DKI Jakarta 13610
                        </p>
                        <div className="space-y-1 text-xs text-gray-600 mb-3">
                            <p><strong className="text-gray-800">WhatsApp:</strong> +62 822 8557 8390</p>
                            <p><strong className="text-gray-800">Email:</strong> saufitrod@gmail.com</p>
                        </div>
                        <p className="text-[11px] text-gray-400">
                            Jam Layanan: Senin – Jumat (08.00 – 17.00 WIB)
                        </p>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                    <span>© 2026 Talaqee. Seluruh hak cipta dilindungi undang-undang.</span>
                    <div className="flex items-center gap-6">
                        <Link href={route('faq.index')} className="hover:text-purple-600 transition-colors">Pusat Bantuan</Link>
                        <Link href={route('terms')} className="hover:text-purple-600 transition-colors">Privasi</Link>
                        <Link href={route('kontak')} className="hover:text-purple-600 transition-colors">Customer Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
