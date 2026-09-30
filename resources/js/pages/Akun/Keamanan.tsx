import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { 
    ArrowLeft, ShieldCheck, Lock, Eye, EyeOff, 
    CheckCircle2, KeyRound, Smartphone, AlertCircle, 
    Check, Sparkles, Mail
} from 'lucide-react';

interface KeamananProps {
    hasPassword: boolean;
    isGoogleAccount: boolean;
    email: string;
    status?: string;
}

export default function Keamanan({ hasPassword = true, isGoogleAccount = false, email = '' }: KeamananProps) {
    const { flash } = usePage<any>().props;

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, put, processing, errors, reset, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('akun.keamanan.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    // Simple password validation checks
    const hasMinLength = data.password.length >= 8;
    const hasNumberOrSpecial = /[0-9!@#$%^&*]/.test(data.password);
    const passwordsMatch = data.password && data.password === data.password_confirmation;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-[#7e57c2] selection:text-white">
            <Head title="Keamanan Akun - Talaqee" />

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
                        <h1 className="text-[17px] font-extrabold text-gray-900 leading-tight">Keamanan Akun</h1>
                        <p className="text-[11px] font-medium text-gray-500">Kelola kata sandi dan proteksi akunmu</p>
                    </div>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-5 pt-5 space-y-4">
                {/* Success Flash Banner */}
                {(recentlySuccessful || flash?.success) && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-3 shadow-sm animate-in fade-in duration-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div className="flex-1 text-xs font-semibold">
                            {flash?.success || 'Kata sandi berhasil diperbarui dengan aman.'}
                        </div>
                    </div>
                )}

                {/* Account Security Status Hero */}
                <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h2 className="text-[14px] font-extrabold text-gray-900">Perlindungan Akun Aktif</h2>
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Aman
                            </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">
                            {email || 'Akun Anda terlindungi dengan enkripsi standar industri.'}
                        </p>
                    </div>
                </div>

                {/* Change Password Card */}
                <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-50">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <KeyRound className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-[14px] font-extrabold text-gray-900">
                                {hasPassword ? 'Ubah Kata Sandi' : 'Buat Kata Sandi Akun'}
                            </h3>
                            <p className="text-[11px] text-gray-500">
                                Gunakan kata sandi yang kuat dan tidak digunakan di situs lain
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Current Password (if already has password) */}
                        {hasPassword && (
                            <div>
                                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                                    Kata Sandi Saat Ini
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={data.current_password}
                                        onChange={e => setData('current_password', e.target.value)}
                                        placeholder="Masukkan kata sandi saat ini"
                                        className={`w-full pl-10 pr-10 py-2.5 bg-gray-50/50 border rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C5AE6]/20 focus:border-[#5C5AE6] transition-all ${errors.current_password ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.current_password && (
                                    <p className="text-red-500 text-[11px] font-medium mt-1">
                                        {errors.current_password}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* New Password */}
                        <div>
                            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                                Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input 
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    className={`w-full pl-10 pr-10 py-2.5 bg-gray-50/50 border rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C5AE6]/20 focus:border-[#5C5AE6] transition-all ${errors.password ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-[11px] font-medium mt-1">
                                    {errors.password}
                                </p>
                            )}

                            {/* Password validation indicators */}
                            {data.password && (
                                <div className="mt-2.5 space-y-1.5 p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2 text-[10px]">
                                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasMinLength ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                        </div>
                                        <span className={hasMinLength ? 'text-emerald-700 font-bold' : 'text-gray-500'}>
                                            Minimal 8 karakter
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasNumberOrSpecial ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                        </div>
                                        <span className={hasNumberOrSpecial ? 'text-emerald-700 font-bold' : 'text-gray-500'}>
                                            Mengandung angka atau simbol
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                                Konfirmasi Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input 
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi kata sandi baru"
                                    className={`w-full pl-10 pr-10 py-2.5 bg-gray-50/50 border rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C5AE6]/20 focus:border-[#5C5AE6] transition-all ${errors.password_confirmation ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-[11px] font-medium mt-1">
                                    {errors.password_confirmation}
                                </p>
                            )}
                            {data.password_confirmation && passwordsMatch && (
                                <p className="text-emerald-600 text-[10px] font-bold mt-1 flex items-center gap-1">
                                    <Check className="w-3 h-3 stroke-[3]" /> Kata sandi cocok
                                </p>
                            )}
                        </div>

                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#5C5AE6] hover:bg-[#4E4CD4] text-white font-bold text-xs py-3 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                        >
                            <KeyRound className="w-4 h-4" />
                            <span>{processing ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}</span>
                        </button>
                    </form>
                </div>

                {/* Additional Info: Linked Accounts */}
                <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm space-y-3">
                    <h3 className="text-[13px] font-extrabold text-gray-900 mb-1">Metode Masuk Terhubung</h3>
                    
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-[12px] font-bold text-gray-900">Email & Kata Sandi</h4>
                                <p className="text-[10px] text-gray-500">{email}</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Terhubung
                        </span>
                    </div>

                    {isGoogleAccount && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-gray-100">
                                    <img src="/images/google_icon.svg" alt="Google" className="w-4 h-4" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="text-[12px] font-bold text-gray-900">Akun Google</h4>
                                    <p className="text-[10px] text-gray-500">Login instan dengan akun Google</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                Terhubung
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
