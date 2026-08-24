import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, Construction } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface NavigationItem {
    id: number;
    name: string;
    icon: string;
    route: string | null;
    order: number;
    is_active: boolean;
}

interface PageProps {
    [key: string]: unknown;
    navItems: NavigationItem[];
    pageTitle: string;
    auth: {
        user: { name: string; email: string };
    };
}

export default function Placeholder() {
    const { navItems, pageTitle, auth } = usePage<PageProps>().props;

    

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title={`${pageTitle} - BookStore Admin`} />

            {/* Sidebar */}
            <AdminSidebar activeItem="" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Construction size={40} className="text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{pageTitle}</h2>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Halaman manajemen untuk fitur <strong>{pageTitle}</strong> saat ini sedang dalam tahap pengembangan. Silakan periksa kembali nanti.
                    </p>
                    <Link 
                        href={route('admin.dashboard')}
                        className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Kembali ke Dashboard
                    </Link>
                </div>
            </main>
        </div>
    );
}
