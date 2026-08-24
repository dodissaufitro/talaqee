import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, ShoppingCart, Users, 
    CreditCard, FileText, Box, ChevronDown, 
    Download, Calendar, BarChart2, TrendingUp, Package, Wallet, 
    Filter
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PageProps {
    [key: string]: unknown;
    stats: {
        total_penjualan: number;
        total_transaksi: number;
        total_item_terjual: number;
        rata_rata: number;
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

const formatRupiahAxis = (value: number) => {
    if (value === 0) return 'Rp 0';
    return `Rp ${(value / 1000000).toFixed(0)}.${'000.000'}`;
};

const chartData = [
    { name: '1 Mei', value: 4000000 },
    { name: '3 Mei', value: 6000000 },
    { name: '6 Mei', value: 4000000 },
    { name: '8 Mei', value: 9000000 },
    { name: '11 Mei', value: 8000000 },
    { name: '13 Mei', value: 11000000 },
    { name: '16 Mei', value: 10000000 },
    { name: '18 Mei', value: 7000000 },
    { name: '19 Mei', value: 9000000 },
    { name: '21 Mei', value: 21000000 },
    { name: '23 Mei', value: 12000000 },
    { name: '25 Mei', value: 10000000 },
    { name: '26 Mei', value: 13000000 },
    { name: '28 Mei', value: 11000000 },
    { name: '29 Mei', value: 12000000 },
    { name: '31 Mei', value: 14000000 },
    { name: '', value: 11000000 },
];

export default function LaporanIndex() {
    const { stats, auth } = usePage<PageProps>().props;

    

    

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Laporan - BookStore" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Laporan" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-6">
                    {/* Header */}
                    <header className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Laporan</h2>
                            <p className="text-gray-500 text-sm mt-1">Dashboard <span className="mx-1">&gt;</span> Laporan</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 flex items-center gap-2 shadow-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                01 Mei 2024 - 31 Mei 2024
                                <ChevronDown size={16} className="text-gray-400 ml-2" />
                            </div>
                            <button className="bg-white border border-indigo-200 text-indigo-600 py-2.5 px-5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm hover:bg-indigo-50">
                                <Download size={16} /> Export
                            </button>
                        </div>
                    </header>

                    {/* Navigation Tabs */}
                    <div className="flex gap-4 border-b border-gray-200">
                        <div className="flex items-center gap-3 pb-4 border-b-2 border-indigo-600 px-2 cursor-pointer">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                <BarChart2 size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-gray-900 font-medium text-sm">Penjualan</p>
                                <p className="text-xs text-gray-500">Laporan penjualan</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pb-4 border-b-2 border-transparent hover:border-gray-300 px-2 cursor-pointer transition-colors opacity-60">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                <Package size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-gray-900 font-medium text-sm">Produk</p>
                                <p className="text-xs text-gray-500">Laporan produk</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pb-4 border-b-2 border-transparent hover:border-gray-300 px-2 cursor-pointer transition-colors opacity-60">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                <Users size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-gray-900 font-medium text-sm">Pelanggan</p>
                                <p className="text-xs text-gray-500">Laporan pelanggan</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pb-4 border-b-2 border-transparent hover:border-gray-300 px-2 cursor-pointer transition-colors opacity-60">
                            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                                <CreditCard size={20} className="text-teal-600" />
                            </div>
                            <div>
                                <p className="text-gray-900 font-medium text-sm">Transaksi</p>
                                <p className="text-xs text-gray-500">Laporan transaksi</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pb-4 border-b-2 border-transparent hover:border-gray-300 px-2 cursor-pointer transition-colors opacity-60">
                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                                <Box size={20} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-gray-900 font-medium text-sm">Stok</p>
                                <p className="text-xs text-gray-500">Laporan stok</p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="flex items-end gap-4 mt-2">
                        <div className="flex-1 max-w-xs">
                            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Periode</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                <input type="text" placeholder="01 Mei 2024 - 31 Mei 2024" className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white" />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div className="flex-1 max-w-[200px]">
                            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Kategori</label>
                            <div className="relative">
                                <select className="w-full px-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                    <option>Semua Kategori</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div className="flex-1 max-w-[200px]">
                            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Metode Pembayaran</label>
                            <div className="relative">
                                <select className="w-full px-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                    <option>Semua Metode</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div className="flex-1 max-w-[200px]">
                            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Status</label>
                            <div className="relative">
                                <select className="w-full px-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 appearance-none bg-white">
                                    <option>Semua Status</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2.5 px-6 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
                            <Filter size={16} /> Terapkan Filter
                        </button>
                        <button className="bg-white border border-gray-200 text-gray-700 py-2.5 px-6 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm hover:bg-gray-50">
                            <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center"></div> Reset
                        </button>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                                    <BarChart2 className="text-indigo-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs font-medium mb-1">Total Penjualan</p>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{formatRupiah(stats.total_penjualan)}</h3>
                                    <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={12} /> 12.3% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                                    <ShoppingCart className="text-emerald-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs font-medium mb-1">Total Transaksi</p>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{stats.total_transaksi}</h3>
                                    <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={12} /> 8.5% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Users className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs font-medium mb-1">Total Item Terjual</p>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{new Intl.NumberFormat('id-ID').format(stats.total_item_terjual)}</h3>
                                    <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={12} /> 9.7% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Users className="text-orange-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs font-medium mb-1">Rata-rata per Transaksi</p>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{formatRupiah(stats.rata_rata)}</h3>
                                    <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={12} /> 3.6% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Wallet className="text-teal-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs font-medium mb-1">Total Diskon</p>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{formatRupiah(stats.total_diskon)}</h3>
                                    <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                                        <TrendingUp size={12} /> 5.2% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Chart Area */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Grafik Penjualan</h3>
                                <div className="relative">
                                    <select className="pl-4 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 appearance-none bg-white outline-none">
                                        <option>Per Hari</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>
                            </div>
                            <div className="flex-1 w-full h-[250px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            tickFormatter={formatRupiahAxis}
                                            domain={[0, 20000000]}
                                            ticks={[0, 5000000, 10000000, 15000000, 20000000]}
                                            dx={-10}
                                        />
                                        <Tooltip 
                                            formatter={(value: number | string | undefined) => formatRupiah(Number(value))}
                                            labelStyle={{ color: '#64748b' }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke="#6366f1" 
                                            strokeWidth={3} 
                                            dot={{ r: 4, fill: '#fff', stroke: '#6366f1', strokeWidth: 2 }}
                                            activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-1 bg-indigo-500 rounded-full"></div>
                                    <span className="text-xs text-gray-500 font-medium">Total Penjualan (Rp)</span>
                                </div>
                            </div>
                        </div>

                        {/* Ringkasan Penjualan Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                            <h3 className="font-bold text-gray-900 mb-6">Ringkasan Penjualan</h3>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="text-gray-500 border-b border-gray-100">
                                            <th className="pb-3 font-medium w-1/3">Channel Penjualan</th>
                                            <th className="pb-3 font-medium w-1/3 text-right pr-4">Total Penjualan</th>
                                            <th className="pb-3 font-medium w-1/3">Persentase</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-4 font-medium text-gray-800">Toko Offline</td>
                                            <td className="py-4 text-gray-800 text-right pr-4">Rp 145.200.000</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-600 w-10">61.7%</span>
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '61.7%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-4 font-medium text-gray-800">Website</td>
                                            <td className="py-4 text-gray-800 text-right pr-4">Rp 65.850.000</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-600 w-10">28.0%</span>
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '28.0%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-4 font-medium text-gray-800">Marketplace</td>
                                            <td className="py-4 text-gray-800 text-right pr-4">Rp 18.750.000</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-600 w-10">8.0%</span>
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '8.0%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-4 font-medium text-gray-800">Aplikasi Mobile</td>
                                            <td className="py-4 text-gray-800 text-right pr-4">Rp 5.650.000</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-600 w-10">2.4%</span>
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '2.4%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td className="py-4 font-bold text-gray-900">Total</td>
                                            <td className="py-4 font-bold text-gray-900 text-right pr-4">Rp 235.450.000</td>
                                            <td className="py-4 font-bold text-gray-900">100%</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Penjualan per Kategori */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-6">Penjualan per Kategori</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="text-gray-500 border-b border-gray-100">
                                            <th className="pb-3 font-medium w-12">No.</th>
                                            <th className="pb-3 font-medium">Kategori</th>
                                            <th className="pb-3 font-medium text-right pr-4">Total Penjualan</th>
                                            <th className="pb-3 font-medium text-center">Item Terjual</th>
                                            <th className="pb-3 font-medium w-1/4">Persentase</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-4 text-gray-600">1</td>
                                            <td className="py-4 text-gray-800 font-medium">Fiksi</td>
                                            <td className="py-4 text-gray-800 text-right pr-4">Rp 98.750.000</td>
                                            <td className="py-4 text-gray-800 text-center">512</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-600 w-10 text-xs">41.9%</span>
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '41.9%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-4 text-gray-600">2</td>
                                            <td className="py-4 text-gray-800 font-medium">Non-Fiksi</td>
                                            <td className="py-4 text-gray-800 text-right pr-4">Rp 67.450.000</td>
                                            <td className="py-4 text-gray-800 text-center">356</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-600 w-10 text-xs">28.6%</span>
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '28.6%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-4 text-gray-600">3</td>
                                            <td className="py-4 text-gray-800 font-medium">Pendidikan</td>
                                            <td className="py-4 text-gray-800 text-right pr-4">Rp 45.300.000</td>
                                            <td className="py-4 text-gray-800 text-center">248</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-600 w-10 text-xs">19.2%</span>
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '19.2%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-4 text-gray-600">4</td>
                                            <td className="py-4 text-gray-800 font-medium">Anak-anak</td>
                                            <td className="py-4 text-gray-800 text-right pr-4">Rp 18.950.000</td>
                                            <td className="py-4 text-gray-800 text-center">104</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-600 w-10 text-xs">8.0%</span>
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '8.0%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-50">
                                            <td className="py-4 text-gray-600">5</td>
                                            <td className="py-4 text-gray-800 font-medium">Lainnya</td>
                                            <td className="py-4 text-gray-800 text-right pr-4">Rp 4.950.000</td>
                                            <td className="py-4 text-gray-800 text-center">28</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-600 w-10 text-xs">2.1%</span>
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '2.1%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan={2} className="py-4 font-bold text-gray-900">Total</td>
                                            <td className="py-4 font-bold text-gray-900 text-right pr-4">Rp 235.450.000</td>
                                            <td className="py-4 font-bold text-gray-900 text-center">1.248</td>
                                            <td className="py-4 font-bold text-gray-900">100%</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Laporan Terbaru */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-6">Laporan Terbaru</h3>
                            <div className="space-y-4">
                                {/* Report Item 1 */}
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                            <FileText className="text-blue-600" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Laporan Penjualan Mei 2024</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">01 Mei 2024 - 31 Mei 2024</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs text-gray-400">Dibuat: 01 Jun 2024 10:30</span>
                                        <button className="text-indigo-600 font-medium text-sm flex items-center gap-1.5 hover:text-indigo-700">
                                            <Download size={16} /> Download
                                        </button>
                                    </div>
                                </div>
                                {/* Report Item 2 */}
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                            <FileText className="text-blue-600" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Laporan Penjualan April 2024</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">01 Apr 2024 - 30 Apr 2024</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs text-gray-400">Dibuat: 01 Mei 2024 09:15</span>
                                        <button className="text-indigo-600 font-medium text-sm flex items-center gap-1.5 hover:text-indigo-700">
                                            <Download size={16} /> Download
                                        </button>
                                    </div>
                                </div>
                                {/* Report Item 3 */}
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                                            <FileText className="text-amber-600" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Laporan Penjualan Maret 2024</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">01 Mar 2024 - 31 Mar 2024</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs text-gray-400">Dibuat: 01 Apr 2024 09:20</span>
                                        <button className="text-indigo-600 font-medium text-sm flex items-center gap-1.5 hover:text-indigo-700">
                                            <Download size={16} /> Download
                                        </button>
                                    </div>
                                </div>
                                {/* Report Item 4 */}
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                            <FileText className="text-orange-600" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Laporan Penjualan Februari 2024</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">01 Feb 2024 - 29 Feb 2024</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs text-gray-400">Dibuat: 01 Mar 2024 09:10</span>
                                        <button className="text-indigo-600 font-medium text-sm flex items-center gap-1.5 hover:text-indigo-700">
                                            <Download size={16} /> Download
                                        </button>
                                    </div>
                                </div>
                                {/* Report Item 5 */}
                                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                            <FileText className="text-orange-600" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Laporan Penjualan Januari 2024</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">01 Jan 2024 - 31 Jan 2024</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs text-gray-400">Dibuat: 01 Feb 2024 09:05</span>
                                        <button className="text-indigo-600 font-medium text-sm flex items-center gap-1.5 hover:text-indigo-700">
                                            <Download size={16} /> Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center pt-8 pb-4">
                        <p className="text-xs text-gray-400">© 2024 BookStore. Semua hak dilindungi.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
