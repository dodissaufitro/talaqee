import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function GoogleOtp({ email }: { email: string }) {
    const { flash, errors } = usePage<any>().props;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        router.post('/auth/google/otp', { otp }, {
            onFinish: () => setLoading(false)
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#7e57c2] selection:text-white">
            <Head title="Verifikasi OTP" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-[#EEF2FF] text-[#5C5AE6] rounded-2xl flex items-center justify-center mb-4">
                        <ShieldCheck size={32} strokeWidth={2.5} />
                    </div>
                </div>
                <h2 className="text-center text-2xl font-extrabold text-gray-900">
                    Verifikasi OTP
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Kami telah mengirimkan kode OTP ke email Anda.<br/>
                    Email terkait: <span className="font-bold">{email}</span>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
                    
                    {flash?.error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                            <p className="text-sm text-red-700 font-medium">{flash.error}</p>
                        </div>
                    )}
                    {flash?.success && (
                        <div className="mb-4 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl">
                            <p className="text-sm text-emerald-700 font-medium">{flash.success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-bold text-gray-700">
                                Kode OTP (6 Digit)
                            </label>
                            <div className="mt-1">
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#7e57c2] focus:border-[#7e57c2] sm:text-lg tracking-[0.25em] text-center font-bold"
                                    placeholder="••••••"
                                />
                                {errors.otp && (
                                    <p className="mt-2 text-sm text-red-600">{errors.otp}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#5C5AE6] hover:bg-[#4f4dd0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5C5AE6] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Memverifikasi...</>
                                ) : (
                                    <><ShieldCheck className="w-5 h-5 mr-2" /> Verifikasi Sekarang <ArrowRight className="w-5 h-5 ml-1" /></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
