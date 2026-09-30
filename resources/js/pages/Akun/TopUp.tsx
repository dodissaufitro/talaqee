import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, Info, CheckCircle2, CreditCard, ChevronRight,
    Sparkles, Coins, Shield, Zap, Star, Gift, ArrowRight, Loader2
} from 'lucide-react';
import WebDesktopNav from '@/components/WebDesktopNav';
import WebFooter from '@/components/WebFooter';

interface CoinPackageItem {
    id: number;
    name: string;
    coin_amount: number;
    price: number | string;
    bonus_coin: number;
    is_popular: boolean;
    badge_label?: string | null;
    badge_color?: string | null;
    is_active?: boolean;
}

interface TopUpProps {
    packages?: CoinPackageItem[];
}

export default function TopUp({ packages = [] }: TopUpProps) {
    const { auth, flash } = usePage<any>().props;
    const coinBalance = auth?.user?.coin_balance || 0;

    const availablePackages = packages.length > 0 ? packages : [
        { id: 1, name: 'Paket 50 Koin', coin_amount: 50, price: 2500, bonus_coin: 0, is_popular: false, badge_label: null, badge_color: null },
        { id: 2, name: 'Paket 100 Koin', coin_amount: 100, price: 5000, bonus_coin: 0, is_popular: false, badge_label: null, badge_color: null },
        { id: 3, name: 'Paket 250 Koin', coin_amount: 250, price: 10000, bonus_coin: 0, is_popular: true, badge_label: 'Populer', badge_color: 'emerald' },
        { id: 4, name: 'Paket 500 Koin', coin_amount: 500, price: 20000, bonus_coin: 0, is_popular: false, badge_label: null, badge_color: null },
        { id: 5, name: 'Paket 1.000 Koin', coin_amount: 1000, price: 40000, bonus_coin: 0, is_popular: true, badge_label: 'Best Value', badge_color: 'amber' },
        { id: 6, name: 'Paket 5.000 Koin', coin_amount: 5000, price: 200000, bonus_coin: 0, is_popular: false, badge_label: null, badge_color: null },
    ];

    useEffect(() => {
        if (flash?.success) {
            alert(flash.success);
        }
    }, [flash]);

    const [selectedPackage, setSelectedPackage] = useState<number | null>(() => {
        const popular = availablePackages.find(p => p.is_popular || p.badge_label);
        return popular ? popular.id : (availablePackages[0]?.id || null);
    });

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = () => {
        if (!selectedPackage) return;
        setIsCheckingOut(true);
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get('return_url') || sessionStorage.getItem('last_book_url') || '';
        router.post('/akun/topup/checkout', {
            package_id: selectedPackage,
            return_url: returnUrl
        }, {
            onFinish: () => setIsCheckingOut(false),
        });
    };

    const selectedPkg = availablePackages.find(p => p.id === selectedPackage);

    const handleBack = () => {
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get('return_url') || sessionStorage.getItem('last_book_url');
        if (returnUrl) {
            router.visit(returnUrl);
        } else {
            window.history.back();
        }
    };

    const getBadgeStyle = (color?: string | null) => {
        switch (color) {
            case 'emerald': return 'bg-emerald-500 text-white';
            case 'blue': return 'bg-blue-500 text-white';
            case 'purple': case 'indigo': return 'bg-indigo-600 text-white';
            case 'rose': case 'red': return 'bg-rose-500 text-white';
            case 'amber': default: return 'bg-amber-500 text-white';
        }
    };

    const getBorderAccent = (color?: string | null) => {
        switch (color) {
            case 'emerald': return 'border-emerald-400';
            case 'blue': return 'border-blue-400';
            case 'purple': case 'indigo': return 'border-indigo-400';
            case 'rose': case 'red': return 'border-rose-400';
            case 'amber': return 'border-amber-400';
            default: return 'border-violet-400';
        }
    };

    // Price per coin calculation
    const getPricePerCoin = (pkg: CoinPackageItem) => {
        const total = Number(pkg.coin_amount) + Number(pkg.bonus_coin || 0);
        if (total === 0) return 0;
        return Math.round(Number(pkg.price) / total);
    };

    const features = [
        { icon: Zap, title: 'Instan Diterima', desc: 'Koin langsung masuk ke akun Anda setelah pembayaran berhasil.' },
        { icon: Shield, title: 'Pembayaran Aman', desc: 'Transaksi diproses via iPaymu yang terpercaya dan terenkripsi.' },
        { icon: Gift, title: 'Tidak Kadaluarsa', desc: 'Koin Anda tidak memiliki masa berlaku. Gunakan kapan saja.' },
    ];

    const PackageCard = ({ pkg }: { pkg: CoinPackageItem }) => {
        const isSelected = selectedPackage === pkg.id;
        const badge = pkg.badge_label || (pkg.is_popular ? 'Populer' : null);
        const totalCoins = Number(pkg.coin_amount) + Number(pkg.bonus_coin || 0);
        const pricePerCoin = getPricePerCoin(pkg);

        return (
            <div
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 group ${
                    isSelected
                        ? `border-violet-500 bg-white shadow-lg shadow-violet-100 scale-[1.02]`
                        : 'border-gray-100 bg-white shadow-sm hover:border-violet-300 hover:shadow-md'
                }`}
            >
                {/* Selected indicator */}
                {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                )}

                {/* Badge */}
                {badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-bold shadow-sm whitespace-nowrap ${getBadgeStyle(pkg.badge_color)}`}>
                        {badge}
                    </div>
                )}

                {/* Coin amount */}
                <div className="flex items-center gap-2 mb-3 mt-1">
                    <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-inner">
                        <span className="text-white text-[14px] font-extrabold">C</span>
                    </div>
                    <span className={`text-2xl font-black ${isSelected ? 'text-violet-700' : 'text-gray-800'}`}>
                        {Number(pkg.coin_amount).toLocaleString('id-ID')}
                    </span>
                    {pkg.bonus_coin > 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                            +{pkg.bonus_coin} bonus
                        </span>
                    )}
                </div>

                {/* Price */}
                <div className={`text-base font-bold mb-1 ${isSelected ? 'text-violet-600' : 'text-gray-700'}`}>
                    Rp {Number(pkg.price).toLocaleString('id-ID')}
                </div>

                {/* Price per coin */}
                <div className="text-[11px] text-gray-400 font-medium">
                    ~Rp {pricePerCoin.toLocaleString('id-ID')} / koin
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title="Top Up Koin - Talaqee" />

            {/* ===================== MOBILE VIEW ===================== */}
            <div className="block md:hidden min-h-screen bg-[#F8FAFC] pb-32 font-sans">
                {/* Mobile Header */}
                <div className="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={handleBack} className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-800" />
                        </button>
                        <h1 className="text-[17px] font-extrabold text-gray-900">Top Up Koin</h1>
                    </div>
                </div>

                <div className="px-5 pt-5">
                    {/* Flash Error */}
                    {flash?.error && (
                        <div className="mb-5 bg-amber-50 border border-amber-200 text-amber-900 text-sm p-4 rounded-2xl flex items-start gap-3">
                            <Info className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                            <span className="font-semibold text-[13px] leading-snug">{flash.error}</span>
                        </div>
                    )}

                    {/* Balance Card */}
                    <div className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-5 text-white mb-6 shadow-lg relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
                        <div className="relative z-10">
                            <p className="text-white/70 text-xs font-medium mb-2">Saldo Koin Kamu</p>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center shadow-inner">
                                    <span className="text-white text-[18px] font-extrabold">C</span>
                                </div>
                                <span className="text-3xl font-black tracking-tight">{coinBalance.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Packages */}
                    <div className="mb-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-[14px] font-extrabold text-gray-900">Pilih Paket Koin</h2>
                            <span className="text-xs text-gray-400">{availablePackages.length} paket tersedia</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {availablePackages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 rounded-2xl p-4 flex gap-3 items-start border border-blue-100 mb-4">
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-blue-800 leading-relaxed">
                            Koin dapat digunakan untuk membuka bab buku premium atau menonton kajian video eksklusif. Koin yang sudah dibeli tidak dapat diuangkan kembali.
                        </p>
                    </div>
                </div>

                {/* Mobile Checkout Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-[11px] text-gray-400 font-medium">Total Pembayaran</p>
                            <p className="text-[20px] font-black text-gray-900">
                                Rp {selectedPkg ? Number(selectedPkg.price).toLocaleString('id-ID') : 0}
                            </p>
                            {selectedPkg && (
                                <p className="text-[10px] text-violet-600 font-semibold">
                                    {Number(selectedPkg.coin_amount) + Number(selectedPkg.bonus_coin || 0)} Koin
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                            <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-600">iPaymu</span>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={!selectedPackage || isCheckingOut}
                        className={`w-full py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all ${
                            selectedPackage && !isCheckingOut
                                ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200 active:scale-[0.98]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {isCheckingOut ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
                        ) : (
                            `Beli Sekarang • Rp ${selectedPkg ? Number(selectedPkg.price).toLocaleString('id-ID') : 0}`
                        )}
                    </button>
                </div>
            </div>

            {/* ===================== DESKTOP / WEB VIEW ===================== */}
            <div className="hidden md:flex flex-col min-h-screen bg-[#f4f5fb] font-sans">
                <WebDesktopNav />

                {/* Page Hero */}
                <div className="relative bg-gradient-to-br from-[#3d1f8f] via-[#5b21b6] to-[#7c3aed] overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} />
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl" />

                    <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
                            <Link href="/akun" className="hover:text-white transition-colors">Akun</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-white font-medium">Top Up Koin</span>
                        </div>

                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">Top Up Koin</h1>
                                <p className="text-white/70 text-base">Tambah koin untuk membaca konten premium Talaqee</p>
                            </div>

                            {/* Current Balance Display */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-white text-right">
                                <p className="text-white/60 text-xs font-medium mb-1">Saldo Koin Anda</p>
                                <div className="flex items-center gap-2 justify-end">
                                    <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-extrabold">C</span>
                                    </div>
                                    <span className="text-2xl font-black">{coinBalance.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto w-full px-8 py-10 flex gap-8">
                    {/* Left: Packages */}
                    <div className="flex-1 min-w-0">
                        {/* Flash error */}
                        {flash?.error && (
                            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl flex items-start gap-3">
                                <Info className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                                <span className="font-semibold text-sm leading-snug">{flash.error}</span>
                            </div>
                        )}

                        {/* Section Title */}
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-extrabold text-gray-900">Pilih Paket Koin</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Klik paket untuk memilih, lalu lanjutkan pembayaran</p>
                            </div>
                            <span className="text-sm text-gray-400 bg-white border border-gray-100 shadow-sm px-3 py-1 rounded-full font-medium">
                                {availablePackages.length} paket tersedia
                            </span>
                        </div>

                        {/* Package Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {availablePackages.map((pkg) => {
                                const isSelected = selectedPackage === pkg.id;
                                const badge = pkg.badge_label || (pkg.is_popular ? 'Populer' : null);
                                const totalCoins = Number(pkg.coin_amount) + Number(pkg.bonus_coin || 0);
                                const pricePerCoin = getPricePerCoin(pkg);

                                return (
                                    <div
                                        key={pkg.id}
                                        onClick={() => setSelectedPackage(pkg.id)}
                                        className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 ${
                                            isSelected
                                                ? 'border-violet-500 bg-white shadow-xl shadow-violet-100 scale-[1.03]'
                                                : 'border-gray-100 bg-white shadow-sm hover:border-violet-300 hover:shadow-lg hover:scale-[1.01]'
                                        }`}
                                    >
                                        {/* Selected check */}
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center shadow-sm">
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            </div>
                                        )}

                                        {/* Badge */}
                                        {badge && (
                                            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-bold shadow-sm whitespace-nowrap ${getBadgeStyle(pkg.badge_color)}`}>
                                                {badge === 'Populer' || badge === 'Popular' ? '🔥 ' : badge === 'Best Value' ? '⭐ ' : ''}{badge}
                                            </div>
                                        )}

                                        {/* Coin icon + amount */}
                                        <div className="flex items-center gap-2.5 mb-3 mt-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${isSelected ? 'bg-amber-400' : 'bg-amber-300'}`}>
                                                <span className="text-white text-base font-extrabold">C</span>
                                            </div>
                                            <div>
                                                <div className={`text-2xl font-black leading-none ${isSelected ? 'text-violet-700' : 'text-gray-800'}`}>
                                                    {Number(pkg.coin_amount).toLocaleString('id-ID')}
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-medium">koin</div>
                                            </div>
                                        </div>

                                        {/* Bonus */}
                                        {pkg.bonus_coin > 0 && (
                                            <div className="flex items-center gap-1 mb-2">
                                                <Gift className="w-3 h-3 text-emerald-500" />
                                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                    +{pkg.bonus_coin} bonus
                                                </span>
                                            </div>
                                        )}

                                        {/* Price */}
                                        <div className={`text-lg font-extrabold mb-1 ${isSelected ? 'text-violet-600' : 'text-gray-700'}`}>
                                            Rp {Number(pkg.price).toLocaleString('id-ID')}
                                        </div>

                                        {/* Price per coin */}
                                        <div className="text-[11px] text-gray-400 font-medium">
                                            ~Rp {pricePerCoin.toLocaleString('id-ID')}/koin
                                        </div>

                                        {/* Selected bottom indicator */}
                                        {isSelected && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-500 rounded-b-2xl" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4">
                            {features.map((f, i) => {
                                const Icon = f.icon;
                                return (
                                    <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start gap-3">
                                        <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
                                            <Icon className="w-4 h-4 text-violet-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 mb-0.5">{f.title}</p>
                                            <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Order Summary Sidebar */}
                    <div className="w-80 shrink-0">
                        <div className="sticky top-6">
                            {/* Order Summary Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                                <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-5 py-4">
                                    <h3 className="text-white font-extrabold text-base">Ringkasan Pembelian</h3>
                                    <p className="text-white/70 text-xs mt-0.5">Periksa pesanan sebelum melanjutkan</p>
                                </div>

                                <div className="p-5">
                                    {selectedPkg ? (
                                        <>
                                            {/* Selected Package Info */}
                                            <div className="flex items-center gap-3 p-3.5 bg-violet-50 rounded-xl border border-violet-100 mb-5">
                                                <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                                                    <span className="text-white font-extrabold text-base">C</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-extrabold text-gray-900 text-sm">{selectedPkg.name}</p>
                                                    <p className="text-xs text-violet-600 font-semibold">
                                                        {(Number(selectedPkg.coin_amount) + Number(selectedPkg.bonus_coin || 0)).toLocaleString('id-ID')} koin
                                                        {selectedPkg.bonus_coin > 0 && <span className="text-emerald-600"> (+{selectedPkg.bonus_coin} bonus)</span>}
                                                    </p>
                                                </div>
                                                <CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0" />
                                            </div>

                                            {/* Price breakdown */}
                                            <div className="space-y-2.5 mb-5">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Harga paket</span>
                                                    <span className="font-semibold text-gray-800">Rp {Number(selectedPkg.price).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Koin didapat</span>
                                                    <span className="font-semibold text-amber-600">{Number(selectedPkg.coin_amount).toLocaleString('id-ID')} C</span>
                                                </div>
                                                {selectedPkg.bonus_coin > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500">Bonus koin</span>
                                                        <span className="font-semibold text-emerald-600">+{selectedPkg.bonus_coin} C</span>
                                                    </div>
                                                )}
                                                <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                                                    <span className="text-sm font-bold text-gray-900">Total Bayar</span>
                                                    <span className="text-lg font-black text-violet-700">Rp {Number(selectedPkg.price).toLocaleString('id-ID')}</span>
                                                </div>
                                            </div>

                                            {/* Payment method */}
                                            <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-5">
                                                <CreditCard className="w-4 h-4 text-gray-500 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-gray-700">Metode Pembayaran</p>
                                                    <p className="text-[11px] text-gray-500">iPaymu — Transfer, E-Wallet, QRIS</p>
                                                </div>
                                            </div>

                                            {/* CTA Button */}
                                            <button
                                                onClick={handleCheckout}
                                                disabled={isCheckingOut}
                                                className={`w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                                                    !isCheckingOut
                                                        ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 active:scale-[0.98]'
                                                        : 'bg-violet-400 text-white cursor-not-allowed'
                                                }`}
                                            >
                                                {isCheckingOut ? (
                                                    <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
                                                ) : (
                                                    <>Bayar Sekarang <ArrowRight className="w-4 h-4" /></>
                                                )}
                                            </button>

                                            {/* Security note */}
                                            <div className="flex items-center justify-center gap-1.5 mt-3 text-gray-400">
                                                <Shield className="w-3.5 h-3.5" />
                                                <span className="text-[11px] font-medium">Transaksi aman & terenkripsi</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-8 text-center">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Coins className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium">Pilih paket koin terlebih dahulu</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-bold text-blue-900">Info Penting</span>
                                </div>
                                <ul className="space-y-1.5">
                                    {[
                                        'Koin tidak memiliki masa berlaku',
                                        'Koin tidak dapat diuangkan kembali',
                                        'Masuk ke akun sebelum membeli',
                                        'Hubungi admin jika ada masalah',
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-blue-800">
                                            <span className="mt-0.5 text-blue-400">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <WebFooter />
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </>
    );
}
