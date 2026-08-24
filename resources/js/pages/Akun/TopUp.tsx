import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Info, CheckCircle2, CreditCard, ChevronRight } from 'lucide-react';

const coinPackages = [
    { id: 1, coins: 50, price: 2500, label: null },
    { id: 2, coins: 100, price: 5000, label: null },
    { id: 3, coins: 250, price: 10000, label: 'Popular', color: 'emerald' },
    { id: 4, coins: 500, price: 20000, label: null },
    { id: 5, coins: 1000, price: 40000, label: 'Best Value', color: 'amber' },
    { id: 6, coins: 5000, price: 200000, label: null },
];

export default function TopUp() {
    const { auth, flash } = usePage<any>().props;
    const coinBalance = auth?.user?.coin_balance || 0;
    
    useEffect(() => {
        if (flash?.error) {
            alert(flash.error);
        }
        if (flash?.success) {
            alert(flash.success);
        }
    }, [flash]);
    
    const [selectedPackage, setSelectedPackage] = useState<number | null>(3);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = () => {
        if (!selectedPackage) return;
        setIsCheckingOut(true);
        
        router.post('/akun/topup/checkout', {
            package_id: selectedPackage
        }, {
            onFinish: () => setIsCheckingOut(false),
        });
    };

    const selectedPkg = coinPackages.find(p => p.id === selectedPackage);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-blue-100">
            <Head title="Top Up Koin" />

            {/* Header */}
            <div className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-[#F1F5F9] shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => window.history.back()} className="w-10 h-10 bg-[#F8FAFC] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-[#1E293B]" />
                    </button>
                    <h1 className="text-[18px] font-extrabold text-[#1E293B]">Top Up Koin</h1>
                </div>
            </div>

            <div className="md:max-w-md md:mx-auto pt-6 px-6">
                {/* Current Balance */}
                <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-[20px] p-6 text-white mb-8 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-8 -mb-8 blur-lg"></div>
                    
                    <div className="relative z-10">
                        <p className="text-white/80 text-[13px] font-medium mb-1">Saldo Koin Saat Ini</p>
                        <div className="flex items-end gap-3">
                            <div className="w-10 h-10 bg-[#FBBF24] rounded-full flex items-center justify-center shadow-inner border-[2px] border-white/20">
                                <span className="text-white text-[22px] font-extrabold shadow-sm">C</span>
                            </div>
                            <span className="text-[36px] font-extrabold leading-none tracking-tight">{coinBalance.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>

                {/* Packages Grid */}
                <div className="mb-6">
                    <h2 className="text-[15px] font-extrabold text-[#1E293B] mb-4">Pilih Paket Koin</h2>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {coinPackages.map((pkg) => (
                            <div 
                                key={pkg.id}
                                onClick={() => setSelectedPackage(pkg.id)}
                                className={`relative rounded-[16px] border-[2px] p-4 cursor-pointer transition-all duration-200 ${
                                    selectedPackage === pkg.id 
                                        ? 'border-[#7C3AED] bg-white shadow-md scale-[1.02]' 
                                        : 'border-transparent bg-white shadow-sm hover:border-[#7C3AED]/30'
                                }`}
                            >
                                {selectedPackage === pkg.id && (
                                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#7C3AED] rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}

                                {pkg.label && (
                                    <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm
                                        ${pkg.color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                                        {pkg.label}
                                    </div>
                                )}

                                <div className="flex flex-col items-center mt-1">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <span className={`text-[24px] font-black ${selectedPackage === pkg.id ? 'text-[#1E293B]' : 'text-[#334155]'}`}>
                                            {pkg.coins}
                                        </span>
                                        <div className="w-5 h-5 bg-[#FBBF24] rounded-full flex items-center justify-center shadow-sm">
                                            <span className="text-white text-[12px] font-extrabold">C</span>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                                        selectedPackage === pkg.id 
                                            ? 'bg-[#F5F3FF] text-[#7C3AED]' 
                                            : 'bg-[#F1F5F9] text-[#64748B]'
                                    }`}>
                                        Rp {pkg.price.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50/70 rounded-[16px] p-4 flex gap-3 items-start border border-blue-100 mb-8">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[12px] font-bold text-[#1E293B] mb-1">Info Koin</p>
                        <p className="text-[11px] text-[#64748B] leading-relaxed">
                            Koin dapat digunakan untuk membuka bab buku premium atau menonton kajian video eksklusif. Koin yang sudah dibeli tidak dapat diuangkan kembali.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F1F5F9] md:max-w-md md:mx-auto p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-[11px] text-[#64748B] font-medium mb-0.5">Total Pembayaran</p>
                        <p className="text-[18px] font-black text-[#1E293B]">
                            Rp {selectedPkg?.price.toLocaleString('id-ID') || 0}
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-3 py-1.5 rounded-full border border-[#E2E8F0]">
                        <CreditCard className="w-4 h-4 text-[#64748B]" />
                        <span className="text-[11px] font-bold text-[#475569]">Pilih Metode</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                    </div>
                </div>
                
                <button 
                    onClick={handleCheckout}
                    disabled={!selectedPackage || isCheckingOut}
                    className={`w-full py-4 rounded-[16px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all ${
                        selectedPackage && !isCheckingOut
                            ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-[#7C3AED]/25 active:scale-[0.98]' 
                            : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                    }`}
                >
                    {isCheckingOut ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Memproses...
                        </>
                    ) : (
                        'Lanjutkan Pembayaran'
                    )}
                </button>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
}
