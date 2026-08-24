import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, User as UserIcon, Camera, Save, X } from 'lucide-react';

export default function EditProfile() {
    const { auth, flash } = usePage<any>().props;
    const user = auth.user;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [previewUrl, setPreviewUrl] = useState<string | null>(user.avatar ? `/storage/${user.avatar}` : null);
    
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: user.name,
        email: user.email,
        avatar: null as File | null,
        _method: 'PUT' // Required for Laravel file uploads in PUT request
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    }, [flash]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/akun/edit-profil', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-[#7e57c2] selection:text-white">
            <Head title="Edit Profil" />
            
            {/* Top App Bar */}
            <div className="sticky top-0 z-50 bg-white px-4 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/akun" className="p-1 -ml-1 text-gray-800">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="font-extrabold text-gray-900 text-[18px]">Edit Profil</h1>
                </div>
            </div>

            {successMessage && (
                <div className="mx-5 mt-4 p-4 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm font-bold text-green-700">{successMessage}</p>
                    <button onClick={() => setSuccessMessage(null)}><X className="w-4 h-4 text-green-600" /></button>
                </div>
            )}

            <form onSubmit={submit} className="px-5 mt-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-[100px] h-[100px] bg-[#EEF2FF] rounded-full overflow-hidden border-[3px] border-white shadow-md relative flex items-center justify-center">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-10 h-10 text-[#5C5AE6]" />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#5C5AE6] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            <Camera className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <p className="text-[12px] font-medium text-[#64748B] mt-3">Ketuk untuk ubah foto</p>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={handlePhotoChange}
                    />
                    {errors.avatar && <p className="text-red-500 text-xs mt-1">{errors.avatar}</p>}
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div className="bg-white rounded-[16px] p-4 shadow-sm border border-[#F1F5F9]">
                        <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Nama Lengkap</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => { setData('name', e.target.value); clearErrors('name'); }}
                            className="w-full text-[15px] font-bold text-[#1E293B] bg-transparent border-none p-0 focus:ring-0 placeholder:font-normal placeholder:text-gray-400"
                            placeholder="Masukkan nama lengkap"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name}</p>}
                    </div>

                    <div className="bg-white rounded-[16px] p-4 shadow-sm border border-[#F1F5F9]">
                        <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Alamat Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => { setData('email', e.target.value); clearErrors('email'); }}
                            className="w-full text-[15px] font-bold text-[#1E293B] bg-transparent border-none p-0 focus:ring-0 placeholder:font-normal placeholder:text-gray-400"
                            placeholder="Masukkan email"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-10">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full h-[52px] bg-[#5C5AE6] hover:bg-[#4F46E5] text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                    >
                        {processing ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save className="w-5 h-5" /> Simpan Perubahan
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
