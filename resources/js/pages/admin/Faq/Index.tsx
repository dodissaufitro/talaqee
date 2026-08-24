import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit, Trash2, Search, HelpCircle } from 'lucide-react';

interface Faq {
    id: number;
    question: string;
    answer: string;
    order: number;
    is_active: boolean;
}

export default function FaqIndex({ faqs, auth }: { faqs: Faq[], auth: any }) {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        question: '',
        answer: '',
        order: 0,
        is_active: true as boolean,
    });

    const openModal = (faq: Faq | null = null) => {
        if (faq) {
            setEditingFaq(faq);
            setData({
                question: faq.question,
                answer: faq.answer,
                order: faq.order,
                is_active: faq.is_active
            });
        } else {
            setEditingFaq(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFaq(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFaq) {
            put(route('admin.faqs.update', editingFaq.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.faqs.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
            destroy(route('admin.faqs.destroy', id));
        }
    };

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(search.toLowerCase()) || 
        faq.answer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">
            <Head title="Kelola FAQ" />
            <AdminSidebar activeItem="FAQ" auth={auth} />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
                <div className="p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <HelpCircle className="w-6 h-6 text-indigo-600" /> FAQ
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola pertanyaan yang sering diajukan</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari pertanyaan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shrink-0 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Tambah FAQ
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold w-16">No</th>
                                    <th className="px-6 py-4 font-semibold">Pertanyaan & Jawaban</th>
                                    <th className="px-6 py-4 font-semibold w-24 text-center">Urutan</th>
                                    <th className="px-6 py-4 font-semibold w-24 text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold w-24 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredFaqs.length > 0 ? filteredFaqs.map((faq, index) => (
                                    <tr key={faq.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 mb-1">{faq.question}</div>
                                            <div className="text-gray-500 line-clamp-2">{faq.answer}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">{faq.order}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${faq.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                                {faq.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openModal(faq)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(faq.id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Tidak ada FAQ yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingFaq ? 'Edit FAQ' : 'Tambah FAQ'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                                    <input
                                        type="text"
                                        value={data.question}
                                        onChange={e => setData('question', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        required
                                    />
                                    {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
                                    <textarea
                                        value={data.answer}
                                        onChange={e => setData('answer', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        required
                                    />
                                    {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                                        <input
                                            type="number"
                                            value={data.order}
                                            onChange={e => setData('order', parseInt(e.target.value))}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={data.is_active ? '1' : '0'}
                                            onChange={e => setData('is_active', e.target.value === '1')}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        >
                                            <option value="1">Aktif</option>
                                            <option value="0">Nonaktif</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
