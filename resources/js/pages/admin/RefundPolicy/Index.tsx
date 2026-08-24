import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminSidebar from '@/components/AdminSidebar';
import { ShieldCheck, Save } from 'lucide-react';

interface PageData {
    id: number;
    slug: string;
    title: string;
    content: string | null;
}

export default function RefundPolicyIndex({ page, auth }: { page: PageData, auth: any }) {
    const { data, setData, post, processing, errors } = useForm({
        content: page.content || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.refund-policy.update'));
    };

    return (
        <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">
            <Head title="Refund Policy" />
            <AdminSidebar activeItem="Refund Policy" auth={auth} />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
                <div className="p-8 max-w-7xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-indigo-600" /> Refund Policy
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola konten halaman kebijakan pengembalian dana.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 border-b border-gray-100">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Konten Halaman</label>
                            <p className="text-xs text-gray-500 mb-4">
                                Masukkan teks kebijakan pengembalian dana di sini. Gunakan enter/baris baru untuk merapikan paragraf.
                            </p>
                            <textarea
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                rows={15}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono text-sm"
                                placeholder="Masukkan kebijakan pengembalian dana di sini..."
                            />
                            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" /> {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    );
}
