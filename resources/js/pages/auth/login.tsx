import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, User, Lock, Eye, EyeOff, BookOpen, Bookmark, Coins, Globe, Mail, Star, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { router } from '@inertiajs/react';

import InputError from '@/components/input-error';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleGoogleLogin = async () => {
        try {
            if (Capacitor.isNativePlatform()) {
                GoogleAuth.initialize({
                    clientId: '799984616839-2ur3dn8u55rbdsibesfe9td9pf92du6u.apps.googleusercontent.com',
                    scopes: ['profile', 'email'],
                    grantOfflineAccess: true,
                });
                const user = await GoogleAuth.signIn();
                const idToken = user.authentication.idToken;
                router.post(route('google.native.login'), { idToken });
            } else {
                window.location.href = '/auth/google';
            }
        } catch (error) {
            console.error('Google Sign-In Error:', error);
        }
    };

    return (
        <>
            {/* MOBILE VIEW (Android) */}
            <div className="block md:hidden min-h-screen font-sans bg-gradient-to-b from-[#F0F5FF] to-white pb-10">
                {/* Header */}
                <div className="pt-16 pb-8 px-6 relative overflow-hidden">
                    <div className="absolute top-8 left-6 grid grid-cols-3 gap-1.5 opacity-20">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        ))}
                    </div>
                    <h1 className="text-3xl font-medium text-gray-800 leading-tight relative z-10">
                        Sela<span className="font-bold">mat Datang</span><br/>
                        di <span className="font-extrabold text-[#2563EB]">BookReader</span>
                    </h1>
                    <p className="text-[13px] text-gray-500 mt-4 max-w-[200px] leading-snug relative z-10">
                        Baca ribuan buku favoritmu kapan saja, di mana saja.
                    </p>
                    <div className="absolute right-[-60px] top-[-20px] w-[240px] h-[300px] opacity-40 z-0 rotate-12">
                        <img src="/images/katalog/book3.png" className="w-full h-full object-cover rounded-xl shadow-2xl [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_30%,rgba(0,0,0,0)_100%)]" alt="Books" />
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[24px] p-6 mx-5 shadow-sm border border-[#F1F5F9] relative z-10">
                    <h2 className="text-[17px] font-bold text-gray-900">Masuk ke Akun Anda</h2>
                    <p className="text-[12px] text-gray-500 mb-6 mt-1">Silakan masuk untuk melanjutkan</p>

                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label className="block text-[11px] font-bold text-gray-700 mb-1.5">Email / Username</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                                <input 
                                    type="email" 
                                    value={data.email} 
                                    onChange={(e) => setData('email', e.target.value)} 
                                    placeholder="Masukkan email atau username" 
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-[13px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1 text-[11px]" />
                        </div>

                        <div className="mb-2">
                            <label className="block text-[11px] font-bold text-gray-700 mb-1.5">Kata Sandi</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    value={data.password} 
                                    onChange={(e) => setData('password', e.target.value)} 
                                    placeholder="Masukkan kata sandi" 
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-[13px] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                                    {showPassword ? <Eye className="w-[18px] h-[18px] text-gray-400" /> : <EyeOff className="w-[18px] h-[18px] text-gray-400" />}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1 text-[11px]" />
                        </div>

                        <div className="flex justify-end mb-6">
                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-[11px] font-medium text-[#2563EB]">Lupa Kata Sandi?</Link>
                            )}
                        </div>

                        <button type="submit" disabled={processing} className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-[13px] transition-colors flex justify-center items-center gap-2">
                            {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                            Masuk
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-[11px] text-gray-400">atau masuk dengan</span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>

                    <div className="mb-6">
                        <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            <span className="text-[12px] font-bold text-gray-800">Masuk dengan Google</span>
                        </button>
                    </div>

                    <p className="text-center text-[11px] text-gray-500">
                        Belum punya akun? <Link href={route('register')} className="text-[#2563EB] font-bold">Daftar sekarang</Link>
                    </p>
                </div>

                {/* Bottom Features */}
                <div className="px-6 py-10 relative overflow-hidden">
                    {/* Background abstract shape / books */}
                    <div className="absolute left-[-40px] bottom-[-40px] w-48 opacity-30 z-0 -rotate-12">
                        <img src="/images/katalog/book1.png" className="w-full object-cover rounded-xl shadow-2xl [mask-image:linear-gradient(to_top,rgba(0,0,0,1)_10%,rgba(0,0,0,0)_90%)]" alt="Background Books" />
                    </div>

                    <div className="flex justify-between items-start relative z-10 pl-[70px]">
                        <div className="flex flex-col items-center flex-1">
                            <div className="w-10 h-10 rounded-[14px] bg-[#EEF2FF] flex items-center justify-center mb-2 shadow-sm">
                                <BookOpen className="w-[22px] h-[22px] text-[#3B82F6]" strokeWidth={2} />
                            </div>
                            <span className="text-[10px] font-extrabold text-gray-800 text-center mb-0.5">Banyak Pilihan</span>
                            <span className="text-[9px] font-medium text-gray-500 text-center leading-tight">Ribuan buku<br/>menarik</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                            <div className="w-10 h-10 rounded-[14px] bg-[#FFFBEB] flex items-center justify-center mb-2 shadow-sm">
                                <div className="w-5 h-5 bg-[#F59E0B] rounded-full flex items-center justify-center">
                                    <Star className="w-3 h-3 text-white fill-white" />
                                </div>
                            </div>
                            <span className="text-[10px] font-extrabold text-gray-800 text-center mb-0.5">Hemat & Praktis</span>
                            <span className="text-[9px] font-medium text-gray-500 text-center leading-tight">Beli per bab<br/>dengan koin</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                            <div className="w-10 h-10 rounded-[14px] bg-[#ECFDF5] flex items-center justify-center mb-2 shadow-sm">
                                <ShieldCheck className="w-[22px] h-[22px] text-[#10B981]" strokeWidth={2} />
                            </div>
                            <span className="text-[10px] font-extrabold text-gray-800 text-center mb-0.5">Aman & Nyaman</span>
                            <span className="text-[9px] font-medium text-gray-500 text-center leading-tight">Transaksi aman,<br/>data terjaga</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* DESKTOP VIEW */}

            <div className="hidden md:flex min-h-screen bg-white font-sans text-gray-900">
            <Head title="Log in - Talaqee" />

            {/* Left Panel - Branding & Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#4b55a8] to-[#2c326c] flex-col justify-between p-12 overflow-hidden">
                {/* Background Image / Pattern */}
                <div 
                    className="absolute inset-0 z-0 opacity-40 bg-cover bg-bottom bg-no-repeat mix-blend-overlay"
                    style={{ backgroundImage: "url('/images/login-bg.png')" }}
                />
                
                <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-16">
                        <Link href={route('home')} className="block">
                            <img src="/logo/logo_app.talaqee.png" alt="Talaqee Logo" className="h-16 w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                        Belajar Islam <br />
                        Kapan Saja, Di Mana Saja
                        <div className="h-1.5 w-16 bg-[#fbbd23] mt-6 rounded-full"></div>
                    </h1>

                    <p className="text-white/80 text-lg max-w-md mb-12 leading-relaxed">
                        Akses ribuan buku, video kajian, dan rekaman audio untuk menambah ilmu dan mendekatkan diri kepada Allah.
                    </p>

                    {/* Features */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-3 rounded-xl shadow-lg shrink-0">
                                <BookOpen className="w-6 h-6 text-[#6366f1]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Ribuan Konten Islami</h3>
                                <p className="text-white/70 text-sm">Buku, video, audio, dan kajian berkualitas dari para ustadz terpercaya.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-white p-3 rounded-xl shadow-lg shrink-0">
                                <Coins className="w-6 h-6 text-[#fbbd23]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Dapatkan Coin</h3>
                                <p className="text-white/70 text-sm">Dapatkan coin gratis setiap hari dan tukarkan dengan konten premium.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-white p-3 rounded-xl shadow-lg shrink-0">
                                <Bookmark className="w-6 h-6 text-[#8b5cf6]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Rak Buku Pribadi</h3>
                                <p className="text-white/70 text-sm">Simpan, lanjutkan, dan kelola konten favorit anda dengan mudah.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center relative p-8 lg:p-24 overflow-y-auto">
                
                {/* Language Switcher */}
                <div className="absolute top-8 right-8 hidden sm:block">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        <Globe className="w-4 h-4" />
                        Bahasa
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                </div>

                <div className="max-w-md w-full mx-auto bg-white lg:border lg:border-gray-100 lg:shadow-xl lg:rounded-3xl lg:p-10">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang Kembali</h2>
                        <p className="text-gray-500 text-sm">Masuk untuk melanjutkan perjalanan ilmu Anda</p>
                    </div>

                    {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                                Email atau No. HP
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="text"
                                    required
                                    autoFocus
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Masukkan email atau nomor HP"
                                    className="pl-10 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#6366f1] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan password"
                                    className="pl-10 pr-10 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#6366f1] focus:border-transparent outline-none transition-all"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* Remember & Forgot Password */}
                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-[#6366f1] focus:ring-[#6366f1] w-4 h-4 cursor-pointer"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="text-sm text-gray-600">Ingat saya</span>
                            </label>

                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-sm font-medium text-[#6366f1] hover:text-[#4f46e5]">
                                    Lupa password?
                                </Link>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium py-3.5 rounded-xl flex justify-center items-center gap-2 transition-colors shadow-sm shadow-[#6366f1]/30 mt-6"
                        >
                            {processing ? <LoaderCircle className="h-5 w-5 animate-spin" /> : null}
                            Masuk
                        </button>
                    </form>

                    {/* Social Login */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white text-gray-500">atau masuk dengan</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <button type="button" onClick={handleGoogleLogin} className="flex justify-center items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="h-5 w-5" />
                                <span className="hidden sm:inline-block text-sm font-medium text-gray-700">Google</span>
                            </button>
                            <button className="flex justify-center items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                <span className="hidden sm:inline-block text-sm font-medium text-gray-700">Facebook</span>
                            </button>
                            <button className="flex justify-center items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <svg className="h-5 w-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.126 3.822 3.08 1.512-.046 2.083-.928 3.9-.928 1.81 0 2.434.928 3.961.892 1.589-.04 2.6-1.523 3.593-2.984 1.167-1.704 1.646-3.356 1.674-3.441-.037-.014-3.215-1.232-3.24-4.908-.02-3.085 2.518-4.57 2.607-4.621-1.427-2.09-3.61-2.353-4.39-2.413-2.146-.153-4.226 1.338-5.325 1.338zm-3.083-4.956c.804-.972 1.345-2.325 1.198-3.678-1.157.047-2.583.77-3.414 1.742-.703.824-1.345 2.202-1.173 3.529 1.29.1 2.585-.618 3.389-1.593z"/></svg>
                                <span className="hidden sm:inline-block text-sm font-medium text-gray-700">Apple</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Belum punya akun? <Link href={route('register')} className="font-medium text-[#6366f1] hover:text-[#4f46e5]">Daftar sekarang</Link>
                    </p>
                </div>


            </div>
        </div>
        </>
    );
}
