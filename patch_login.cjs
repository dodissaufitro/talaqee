const fs = require('fs');
let content = fs.readFileSync('C:/laragon/www/talaqee/resources/js/pages/Auth/login.tsx', 'utf8');

// Ensure Mail, Star, ShieldCheck are imported
if (!content.includes('Mail,')) {
    content = content.replace(/import \{ ([^}]+) \} from 'lucide-react';/, (match, p1) => {
        return `import { ${p1}, Mail, Star, ShieldCheck } from 'lucide-react';`;
    });
}

// Wrap existing desktop view in a hidden md:flex div
content = content.replace(/<div className="min-h-screen flex bg-white font-sans text-gray-900">/, '<div className="hidden md:flex min-h-screen bg-white font-sans text-gray-900">');

// Insert the mobile view block before the desktop view
const mobileBlock = `
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
                    <div className="absolute right-[-40px] top-6 w-[220px] h-[220px] opacity-80 z-0">
                        <img src="/images/katalog/book3.png" className="w-full h-full object-contain" alt="Books" />
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
                        <div className="h-px bg-gray-100 flex-1\"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" className="w-[18px] h-[18px]" alt="Google" />
                            <span className="text-[12px] font-bold text-gray-800">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                            <svg className="w-[18px] h-[18px] text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            <span className="text-[12px] font-bold text-gray-800">Facebook</span>
                        </button>
                    </div>

                    <p className="text-center text-[11px] text-gray-500">
                        Belum punya akun? <Link href={route('register')} className="text-[#2563EB] font-bold">Daftar sekarang</Link>
                    </p>
                </div>

                {/* Bottom Features */}
                <div className="px-6 py-10 relative overflow-hidden">
                    {/* Background abstract shape / books */}
                    <div className="absolute left-[-30px] bottom-[-20px] opacity-40 z-0">
                        <img src="/images/katalog/book1.png" className="w-40 object-contain" alt="Background Books" />
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
`;

content = content.replace(/<div className="hidden md:flex min-h-screen bg-white font-sans text-gray-900">/, mobileBlock + '\n            <div className="hidden md:flex min-h-screen bg-white font-sans text-gray-900">');

// Enclose in fragment
content = content.replace(/return \(\s*\{?\/\* MOBILE VIEW/, 'return (\n        <>\n            {/* MOBILE VIEW');
content = content.replace(/<\/div>\s*\);\s*\}/, '</div>\n        </>\n    );\n}');

fs.writeFileSync('C:/laragon/www/talaqee/resources/js/pages/Auth/login.tsx', content);
console.log('Mobile layout injected.');
