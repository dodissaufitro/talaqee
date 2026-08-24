import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, Megaphone, ChevronDown, 
    Bell, Plus, Search, Filter, Eye, Edit2, Trash2, Tag, Calendar, 
    Clock, LineChart, User, TrendingUp
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface PromotionItem {
    id: number;
    title: string;
    description: string;
    type: string;
    start_date: string;
    end_date: string;
    value_text: string;
    status: string;
    reach: number;
    color_theme: string;
}

interface PageProps {
    [key: string]: unknown;
    promotions: {
        data: PromotionItem[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    stats: {
        total_promosi: number;
        promosi_aktif: number;
        akan_berakhir: number;
        total_diskon: number;
    };
    auth: {
        user: {
            name: string;
            email: string;
        }
    };
}

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
};

const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startDay = startDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const endDay = endDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    
    return (
        <>
            <div>{startDay}</div>
            <div className="text-gray-400 mt-0.5">- {endDay}</div>
        </>
    );
};

export default function PromosiIndex() {
    const { promotions, stats, auth } = usePage<PageProps>().props;

    

    

    const getThemeStyles = (theme: string) => {
        const styles = {
            purple: { bg: 'bg-[#6366f1]', text: 'text-indigo-600', badgeBg: 'bg-indigo-50', border: 'border-indigo-100' },
            orange: { bg: 'bg-[#f59e0b]', text: 'text-amber-600', badgeBg: 'bg-amber-50', border: 'border-amber-100' },
            green: { bg: 'bg-[#10b981]', text: 'text-emerald-600', badgeBg: 'bg-emerald-50', border: 'border-emerald-100' },
            blue: { bg: 'bg-[#3b82f6]', text: 'text-blue-600', badgeBg: 'bg-blue-50', border: 'border-blue-100' },
            pink: { bg: 'bg-[#ec4899]', text: 'text-pink-600', badgeBg: 'bg-pink-50', border: 'border-pink-100' },
            black: { bg: 'bg-[#1e293b]', text: 'text-slate-600', badgeBg: 'bg-slate-100', border: 'border-slate-200' },
        };
        return styles[theme as keyof typeof styles] || styles.purple;
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Promosi - BookStore" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Promosi" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Promosi</h2>
                            <p className="text-gray-500 text-sm mt-1">Dashboard <span className="mx-1">&gt;</span> Promosi</p>
                        </div>
                        <div className="flex flex-col items-end gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 flex items-center gap-2 shadow-sm">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    01 Mei 2024 - 31 Mei 2024
                                    <ChevronDown size={16} className="text-gray-400 ml-2" />
                                </div>
                                <button className="bg-white border border-gray-200 p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 relative shadow-sm">
                                    <Bell size={20} />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                </button>
                            </div>
                            <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2.5 px-5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
                                <Plus size={16} /> Tambah Promosi
                            </button>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Total Promosi */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0 border border-purple-100">
                                    <Tag className="text-purple-500" size={26} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Promosi</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.total_promosi}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 9.1% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Promosi Aktif */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100">
                                    <Calendar className="text-emerald-500" size={26} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Promosi Aktif</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.promosi_aktif}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 25% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Akan Berakhir */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 border border-orange-100">
                                    <Clock className="text-orange-400" size={26} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Akan Berakhir</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.akan_berakhir}</h3>
                                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} className="rotate-180" /> 20% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Total Diskon */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
                                    <LineChart className="text-blue-500" size={26} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-1">Total Diskon Diberikan</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{formatRupiah(stats.total_diskon)}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={14} /> 15.3% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 justify-between">
                            <div className="relative w-[320px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" placeholder="Cari promosi..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400" />
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-40 relative">
                                    <select className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                        <option>Semua Status</option>
                                        <option>Aktif</option>
                                        <option>Akan Berakhir</option>
                                        <option>Selesai</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                                <div className="w-44 relative">
                                    <select className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                        <option>Semua Jenis</option>
                                        <option>Diskon Persen</option>
                                        <option>Gratis Ongkir</option>
                                        <option>Flash Sale</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                                <div className="w-44 relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    <input type="text" placeholder="Pilih Tanggal" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white" />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Filter size={16} /> Filter
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center"></div> Reset
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-100">
                                        <th className="py-4 px-6 font-medium w-16">No.</th>
                                        <th className="py-4 px-6 font-medium w-1/3">Promosi</th>
                                        <th className="py-4 px-6 font-medium text-center">Jenis</th>
                                        <th className="py-4 px-6 font-medium text-center">Periode</th>
                                        <th className="py-4 px-6 font-medium text-center">Diskon</th>
                                        <th className="py-4 px-6 font-medium text-center">Status</th>
                                        <th className="py-4 px-6 font-medium text-center">Jangkauan</th>
                                        <th className="py-4 px-6 font-medium text-center w-40">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {promotions.data.length > 0 ? promotions.data.map((promo, idx) => {
                                        const theme = getThemeStyles(promo.color_theme);
                                        return (
                                            <tr key={promo.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-6 font-medium text-gray-900">{idx + 1}</td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-14 h-14 ${theme.bg} rounded-xl shadow-sm flex flex-col items-center justify-center shrink-0 text-white leading-tight font-bold text-center p-1 relative overflow-hidden`}>
                                                            <div className="text-[10px] uppercase opacity-90 tracking-wider">
                                                                {promo.title.split(' ')[0]}
                                                            </div>
                                                            <div className="text-lg">
                                                                {promo.title.match(/(\d+%|SALE|ONGKIR|GRATIS \d+)/)?.[0] || promo.title.split(' ')[1]}
                                                            </div>
                                                            {/* Decorator */}
                                                            <div className="absolute -bottom-2 -right-2 opacity-20">
                                                                <Tag size={32} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900">{promo.title}</h4>
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 pr-4">{promo.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${theme.badgeBg} ${theme.text} border ${theme.border}`}>
                                                        {promo.type}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center text-gray-900 text-sm">
                                                    {formatDateRange(promo.start_date, promo.end_date)}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className={`font-semibold ${theme.text}`}>
                                                        {promo.value_text}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    {promo.status === 'Aktif' && (
                                                        <span className="text-emerald-500 font-medium text-sm">Aktif</span>
                                                    )}
                                                    {promo.status === 'Akan Berakhir' && (
                                                        <span className="text-orange-500 font-medium text-sm">Akan Berakhir</span>
                                                    )}
                                                    {promo.status === 'Selesai' && (
                                                        <span className="text-gray-400 font-medium text-sm">Selesai</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-center text-gray-600">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <User size={14} className="text-gray-400" />
                                                        {new Intl.NumberFormat('id-ID').format(promo.reach)}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                                                            <Eye size={16} />
                                                        </button>
                                                        <button className="p-2 rounded-lg border border-indigo-100 text-indigo-500 hover:bg-indigo-50 shadow-sm transition-all">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 shadow-sm transition-all">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center text-gray-500">Belum ada promosi</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-50">
                            <span className="text-sm text-gray-500">
                                Menampilkan {promotions.from || 0} - {promotions.to || 0} dari {promotions.total} data
                            </span>
                            <div className="flex items-center gap-1">
                                {promotions.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                                            link.active
                                            ? 'bg-[#6366f1] text-white font-medium shadow-sm'
                                            : link.url
                                                ? 'text-gray-600 hover:bg-gray-100 border border-transparent'
                                                : 'text-gray-300 cursor-not-allowed'
                                        } ${link.label.includes('Previous') || link.label.includes('Next') ? 'w-auto px-2 border border-gray-200' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
