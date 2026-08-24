import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, Bell, 
    TrendingUp, ChevronDown 
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';

interface MetricData {
    total_penjualan: number;
    total_terjual: number;
    total_pelanggan: number;
    rata_rata_transaksi: number;
}

interface PageProps {
    [key: string]: unknown;
    metrics: MetricData;
    charts: {
        grafik_penjualan: any[];
        kategori_penjualan: any[];
    };
    tables: {
        buku_terlaris: any[];
        transaksi_terbaru: any[];
        stok_menipis: any[];
    };
    navItems: any[];
    auth: {
        user: {
            name: string;
            email: string;
            roles?: any[];
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

export default function AdminDashboard() {
    const { metrics, charts, tables, auth } = usePage<PageProps>().props;

    

    // Helper to dynamically render icon component from string
    

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Dashboard Penjualan - BookStore" />

            {/* Sidebar */}
            <AdminSidebar activeItem="Dashboard" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-6">
                    {/* Header */}
                    <header className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                            <p className="text-gray-500 text-sm mt-1">Ringkasan penjualan toko buku Anda</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 flex items-center gap-2 shadow-sm">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                01 Mei 2024 - 31 Mei 2024
                            </div>
                            <button className="bg-white border border-gray-200 p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 relative shadow-sm">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            </button>
                        </div>
                    </header>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                <ShoppingCart className="text-purple-600" size={24} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Total Penjualan</p>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{formatRupiah(metrics.total_penjualan)}</h3>
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <TrendingUp size={14} /> 12.5% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                <Book className="text-emerald-600" size={24} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Total Terjual</p>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(metrics.total_terjual)} Buku</h3>
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <TrendingUp size={14} /> 8.3% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                <Users className="text-amber-600" size={24} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Total Pelanggan</p>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{new Intl.NumberFormat('id-ID').format(metrics.total_pelanggan)}</h3>
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <TrendingUp size={14} /> 15.7% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                <TrendingUp className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Rata-rata per Transaksi</p>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{formatRupiah(metrics.rata_rata_transaksi)}</h3>
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <TrendingUp size={14} /> 5.2% <span className="text-gray-400 font-normal">dari periode lalu</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Line Chart */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Grafik Penjualan</h3>
                                <select className="text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                    <option>Harian</option>
                                    <option>Mingguan</option>
                                    <option>Bulanan</option>
                                </select>
                            </div>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={charts.grafik_penjualan} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis 
                                            dataKey="name" 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tick={{ fill: '#9ca3af', fontSize: 12 }} 
                                            tickFormatter={(val) => val.split(' ')[0]} // Only show number
                                            interval="preserveStartEnd"
                                        />
                                        <YAxis 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                                            tickFormatter={(val) => `${Math.round(val / 1000000)}jt`}
                                        />
                                        <Tooltip 
                                            formatter={(value: any) => formatRupiah(Number(value))}
                                            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke="#3b82f6" 
                                            strokeWidth={3} 
                                            dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#3b82f6' }}
                                            activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-2 px-8">
                                <span>1 Mei</span>
                                <span>6 Mei</span>
                                <span>11 Mei</span>
                                <span>16 Mei</span>
                                <span>21 Mei</span>
                                <span>26 Mei</span>
                                <span>31 Mei</span>
                            </div>
                        </div>

                        {/* Doughnut Chart */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                            <h3 className="font-bold text-gray-900 mb-6">Penjualan Berdasarkan Kategori</h3>
                            <div className="flex-1 flex flex-col justify-center items-center relative">
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={charts.kategori_penjualan}
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={2}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {charts.kategori_penjualan.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => `${value}%`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Legend */}
                                <div className="w-full mt-4 space-y-2">
                                    {charts.kategori_penjualan.map((cat, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                                <span className="text-gray-600">{cat.name}</span>
                                            </div>
                                            <span className="font-medium text-gray-900">{cat.value}%</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Center Total */}
                                <div className="absolute left-0 bottom-0 text-left pt-6">
                                    <p className="text-xs text-gray-500 mb-1">Total</p>
                                    <p className="text-lg font-bold text-gray-900">{formatRupiah(metrics.total_penjualan)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Buku Terlaris */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Buku Terlaris</h3>
                                <button className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">Lihat Semua</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="text-gray-500 border-b border-gray-100">
                                            <th className="pb-3 font-normal">#</th>
                                            <th className="pb-3 font-normal">Buku</th>
                                            <th className="pb-3 font-normal text-right">Terjual</th>
                                            <th className="pb-3 font-normal text-right">Pendapatan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tables.buku_terlaris.map((buku, idx) => (
                                            <tr key={idx} className="border-b border-gray-50 last:border-0 group">
                                                <td className="py-3 text-gray-500">{idx + 1}</td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-14 bg-gray-100 rounded overflow-hidden shrink-0">
                                                            {buku.cover ? (
                                                                <img src={`/storage/${buku.cover}`} alt={buku.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                                    <Book size={16} className="text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors max-w-[120px]">{buku.title}</p>
                                                            <p className="text-xs text-gray-500 max-w-[120px] truncate">{buku.author}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right text-gray-900 font-medium">{buku.sold}</td>
                                                <td className="py-3 text-right text-gray-600">{formatRupiah(buku.revenue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Transaksi Terbaru */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Transaksi Terbaru</h3>
                                <button className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">Lihat Semua</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="text-gray-500 border-b border-gray-100">
                                            <th className="pb-3 font-normal">No. Transaksi</th>
                                            <th className="pb-3 font-normal">Pelanggan</th>
                                            <th className="pb-3 font-normal text-right">Total</th>
                                            <th className="pb-3 font-normal text-right">Waktu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tables.transaksi_terbaru.map((trx, idx) => (
                                            <tr key={idx} className="border-b border-gray-50 last:border-0 group">
                                                <td className="py-4 text-gray-900 font-medium">{trx.id}</td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <img src={trx.avatar} alt={trx.customer_name} className="w-6 h-6 rounded-full" />
                                                        <span className="text-gray-600 group-hover:text-blue-600 transition-colors">{trx.customer_name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-right text-gray-900 font-medium">{formatRupiah(trx.total)}</td>
                                                <td className="py-4 text-right text-gray-500 text-xs whitespace-nowrap">{trx.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Stok Menipis */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Stok Menipis</h3>
                                <button className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">Lihat Semua</button>
                            </div>
                            <div className="space-y-4">
                                {tables.stok_menipis.map((buku, idx) => (
                                    <div key={idx} className="flex items-center justify-between group cursor-pointer border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-14 bg-gray-100 rounded overflow-hidden shrink-0">
                                                {buku.cover ? (
                                                    <img src={`/storage/${buku.cover}`} alt={buku.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                        <Book size={16} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{buku.title}</p>
                                                <p className="text-xs text-gray-500">{buku.author}</p>
                                            </div>
                                        </div>
                                        <div className="bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1 rounded-md">
                                            Stok: {buku.stock}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
