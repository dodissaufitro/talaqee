import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    ArrowLeft, Crown, Check, Sparkles, BookOpen, 
    Download, ShieldCheck, Zap, Plus, AlertCircle, 
    CheckCircle2, Clock, Calendar, ChevronRight
} from 'lucide-react';

interface Plan {
    id: string;
    name: string;
    duration: string;
    duration_days: number;
    price_rp: string;
    price_coins: number;
    badge: string | null;
    popular: boolean;
}

interface Benefit {
    title: string;
    desc: string;
    icon: string;
}

interface ActiveSubscription {
    id: number;
    plan_name: string;
    started_at: string;
    expired_at: string;
    days_left: number;
    status: string;
}

interface SubscriptionHistoryItem {
    id: number;
    plan_name: string;
    price: string | number;
    status: string;
    started_at: string | null;
    expired_at: string | null;
}

interface LanggananProps {
    activeSubscription: ActiveSubscription | null;
    plans: Plan[];
    benefits: Benefit[];
    history: SubscriptionHistoryItem[];
    coinBalance: number;
}

export default function Langganan({
    activeSubscription,
    plans = [],
    benefits = [],
    history = [],
    coinBalance = 0,
}: LanggananProps) {
    const { flash } = usePage<any>().props;

    const [selectedPlanId, setSelectedPlanId] = useState<string>(plans.find(p => p.popular)?.id || plans[0]?.id || 'yearly');
    const [confirmModal, setConfirmModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const selectedPlan = plans.find(p => p.id === selectedPlanId);
    const canAfford = selectedPlan ? coinBalance >= selectedPlan.price_coins : false;

    const handleSubscribe = () => {
        setSubmitting(true);
        router.post('/akun/langganan/subscribe', {
            plan_id: selectedPlanId
        }, {
            preserveScroll: true,
            onFinish: () => {
                setSubmitting(false);
                setConfirmModal(false);
            }
        });
    };

    const handleCancelSubscription = () => {
        setSubmitting(true);
        router.post('/akun/langganan/cancel', {}, {
            preserveScroll: true,
            onFinish: () => {
                setSubmitting(false);
                setCancelModal(false);
            }
        });
    };

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case 'BookOpen': return <BookOpen className="w-5 h-5 text-indigo-500" />;
            case 'Download': return <Download className="w-5 h-5 text-emerald-500" />;
            case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-blue-500" />;
            case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-500" />;
            case 'Crown': return <Crown className="w-5 h-5 text-purple-500" />;
            default: return <Zap className="w-5 h-5 text-amber-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-[#7e57c2] selection:text-white">
            <Head title="Langganan Premium - Talaqee" />

            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-5 py-4 border-b border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => window.history.back()} 
                        className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-[17px] font-extrabold text-gray-900 leading-tight">Langganan Premium</h1>
                        <p className="text-[11px] font-medium text-gray-500">Nikmati akses buku tanpa batas</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-full">
                    <div className="w-3.5 h-3.5 bg-[#FBBF24] rounded-full flex items-center justify-center text-white text-[8px] font-black">C</div>
                    <span className="text-[11px] font-black text-amber-900">{coinBalance}</span>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-5 pt-4 space-y-4">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-3 shadow-sm animate-in fade-in duration-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div className="flex-1 text-xs font-semibold">{flash.success}</div>
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex items-center gap-3 shadow-sm animate-in fade-in duration-300">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                        <div className="flex-1 text-xs font-semibold">{flash.error}</div>
                    </div>
                )}

                {/* Hero Status Card */}
                {activeSubscription ? (
                    <div className="rounded-[24px] p-6 text-white relative overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #4338CA 50%, #6366F1 100%)' }}>
                        {/* Background glowing shapes */}
                        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/30 text-amber-300 text-[11px] font-extrabold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
                                    <Crown className="w-3.5 h-3.5 fill-amber-300" /> VIP MEMBER
                                </span>
                                <span className="bg-emerald-500/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    Aktif
                                </span>
                            </div>

                            <h2 className="text-xl font-black text-white mb-1">
                                {activeSubscription.plan_name}
                            </h2>
                            <p className="text-xs text-indigo-200 mb-5">
                                Semua bab buku terbuka & bebas dibaca kapan pun tanpa koin.
                            </p>

                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between mb-4">
                                <div>
                                    <span className="text-[10px] font-semibold text-indigo-200 block mb-0.5">Sisa Masa Aktif</span>
                                    <span className="text-lg font-black text-white">{activeSubscription.days_left} Hari Lagi</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-semibold text-indigo-200 block mb-0.5">Berakhir Pada</span>
                                    <span className="text-xs font-bold text-white">{activeSubscription.expired_at}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setCancelModal(true)}
                                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors"
                                >
                                    Batalkan Langganan
                                </button>
                                <a 
                                    href="#paket-langganan"
                                    className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 text-xs font-extrabold transition-colors text-center shadow-md"
                                >
                                    Perpanjang Paket
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-[24px] p-6 text-white relative overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #312E81 0%, #4F46E5 60%, #7C3AED 100%)' }}>
                        <div className="absolute top-2 right-2 w-32 h-32 bg-amber-400/15 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 text-amber-300 shadow-inner">
                                <Crown className="w-6 h-6 fill-amber-300" />
                            </div>
                            <h2 className="text-xl font-black text-white leading-tight mb-1">
                                Upgrade ke Talaqee VIP
                            </h2>
                            <p className="text-xs text-indigo-100 leading-relaxed max-w-sm mb-4">
                                Buka akses ribuan buku & bab secara bebas tanpa harus membuka koin berulang kali.
                            </p>

                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 text-[11px] font-bold text-amber-300">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Mulai dari Rp 29.000 / 30 Koin</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Plan Selection Section */}
                <div id="paket-langganan" className="space-y-3 pt-2">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[14px] font-extrabold text-gray-900">Pilih Paket Langganan</h3>
                        <span className="text-[11px] text-gray-500 font-medium">Bisa bayar dengan koin</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {plans.map((plan) => {
                            const isSelected = selectedPlanId === plan.id;
                            return (
                                <div 
                                    key={plan.id}
                                    onClick={() => setSelectedPlanId(plan.id)}
                                    className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                                        isSelected 
                                            ? 'bg-white border-[#5C5AE6] shadow-md ring-4 ring-[#5C5AE6]/10' 
                                            : 'bg-white border-gray-100 shadow-sm hover:border-gray-200'
                                    }`}
                                >
                                    {plan.badge && (
                                        <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                                            {plan.badge}
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                                                {plan.duration}
                                            </span>
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#5C5AE6] bg-[#5C5AE6]' : 'border-gray-300'}`}>
                                                {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                                            </div>
                                        </div>
                                        <h4 className="font-extrabold text-[14px] text-gray-900 leading-tight mb-2">
                                            {plan.name}
                                        </h4>
                                    </div>

                                    <div className="pt-2 border-t border-gray-50 mt-3">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div className="w-4 h-4 bg-[#FBBF24] rounded-full flex items-center justify-center text-white text-[9px] font-black shadow-sm">C</div>
                                            <span className="text-base font-black text-gray-900">{plan.price_coins} Koin</span>
                                        </div>
                                        <span className="text-[11px] font-medium text-gray-400 block">
                                            atau {plan.price_rp}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Activation Action Button Card */}
                <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">Paket Dipilih:</span>
                        <span className="font-extrabold text-gray-900">{selectedPlan?.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-50">
                        <span className="text-gray-500 font-medium">Saldo Koin Kamu:</span>
                        <div className="flex items-center gap-1 font-extrabold text-gray-900">
                            <span className={canAfford ? 'text-emerald-600' : 'text-rose-600'}>{coinBalance} Koin</span>
                            <span className="text-gray-400 font-normal">/ {selectedPlan?.price_coins} Koin</span>
                        </div>
                    </div>

                    {canAfford ? (
                        <button 
                            onClick={() => setConfirmModal(true)}
                            className="w-full bg-[#5C5AE6] hover:bg-[#4E4CD4] text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                        >
                            <Crown className="w-4 h-4 fill-white" />
                            <span>Aktifkan Sekarang ({selectedPlan?.price_coins} Koin)</span>
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <Link 
                                href={`/akun/topup?return_url=${encodeURIComponent(window.location.pathname)}`}
                                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 block text-center"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Top Up Koin Sekarang</span>
                            </Link>
                            <p className="text-[11px] text-center text-amber-600 font-medium">
                                Koinmu kurang {selectedPlan ? selectedPlan.price_coins - coinBalance : 0} koin untuk paket ini.
                            </p>
                        </div>
                    )}
                </div>

                {/* VIP Benefits Section */}
                <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <h3 className="text-[14px] font-extrabold text-gray-900">Keuntungan VIP Talaqee</h3>
                    </div>

                    <div className="space-y-3.5">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="flex gap-3.5 items-start">
                                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    {renderIcon(benefit.icon)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[13px] font-extrabold text-gray-900 mb-0.5 leading-snug">
                                        {benefit.title}
                                    </h4>
                                    <p className="text-[11px] text-gray-500 leading-relaxed">
                                        {benefit.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* History Section */}
                {history.length > 0 && (
                    <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm space-y-3">
                        <h3 className="text-[13px] font-extrabold text-gray-900 mb-1">Riwayat Langganan</h3>
                        <div className="divide-y divide-gray-50">
                            {history.map((item) => (
                                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{item.plan_name}</h4>
                                        <p className="text-[10px] text-gray-400">{item.started_at} - {item.expired_at}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        item.status === 'active' 
                                            ? 'bg-emerald-50 text-emerald-700' 
                                            : item.status === 'cancelled'
                                            ? 'bg-rose-50 text-rose-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {item.status === 'active' ? 'Aktif' : item.status === 'cancelled' ? 'Dibatalkan' : 'Kedaluwarsa'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Subscribe Modal */}
            {confirmModal && selectedPlan && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                            <Crown className="w-6 h-6 fill-amber-500 text-amber-500" />
                        </div>
                        <h3 className="text-base font-extrabold text-gray-900 mb-1">Aktifkan {selectedPlan.name}?</h3>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            Sebanyak <span className="font-bold text-amber-600">{selectedPlan.price_coins} Koin</span> akan digunakan untuk mengaktifkan paket ini selama {selectedPlan.duration}.
                        </p>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setConfirmModal(false)}
                                disabled={submitting}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleSubscribe}
                                disabled={submitting}
                                className="flex-1 py-2.5 rounded-xl bg-[#5C5AE6] hover:bg-[#4E4CD4] text-white text-xs font-bold shadow-sm transition"
                            >
                                {submitting ? 'Memproses...' : 'Ya, Aktifkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {cancelModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-extrabold text-gray-900 mb-1">Batalkan Langganan?</h3>
                        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                            Apakah kamu yakin ingin membatalkan status langganan premium?
                        </p>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCancelModal(false)}
                                disabled={submitting}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Tutup
                            </button>
                            <button 
                                onClick={handleCancelSubscription}
                                disabled={submitting}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition"
                            >
                                {submitting ? 'Memproses...' : 'Ya, Batalkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
