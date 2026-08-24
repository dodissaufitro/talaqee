import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, LayoutDashboard, ShoppingCart, Book, Grid, Users, 
    CreditCard, FileText, Box, Megaphone, Settings, ArrowLeft, Globe, UserCircle, Tag
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Book {
    id: number;
    title: string;
    description: string;
    cover: string | null;
}

interface Category {
    id: number;
    name: string;
    description: string;
    icon: string;
    color: string;
    is_active: boolean;
}

interface PageProps {
    [key: string]: unknown;
    category: Category;
    books: Book[];
}

export default function KategoriShow() {
    const { category, books } = usePage<PageProps>().props;

    

    

    const renderCategoryIcon = (iconName: string | null) => {
        if (!iconName) return <Tag size={20} />;
        const IconComponent = (LucideIcons as any)[iconName];
        if (!IconComponent) return <Tag size={20} />;
        return <IconComponent size={20} />;
    };

    const getIconColorClass = (colorStr: string | null) => {
        if (!colorStr) return "bg-gray-100 text-gray-500";
        return `bg-${colorStr}-100 text-${colorStr}-600`;
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title={`Detail Kategori - ${category.name}`} />

            {/* Sidebar */}
            <AdminSidebar activeItem="Kategori" auth={auth} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8">
                    {/* Header */}
                    <header className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Link href={route('admin.categories.index')} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 transition">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Detail Kategori</h2>
                                <p className="text-gray-500 text-sm mt-1">Informasi lengkap tentang kategori dan daftar bukunya.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link href={route('admin.categories.edit', category.id)} className="px-5 py-2.5 bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100 font-medium rounded-xl transition-colors">
                                Edit Kategori
                            </Link>
                        </div>
                    </header>

                    {/* Category Overview */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-start gap-6">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${getIconColorClass(category.color)}`}>
                            {renderCategoryIcon(category.icon)}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h1>
                            <div className="flex items-center gap-4 text-sm mb-4">
                                <span className={`px-2.5 py-1 rounded-full font-medium ${category.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                    {category.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                                <span className="text-gray-500 font-medium">Total: {books.length} Buku</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">Deskripsi</h3>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                    {category.description || 'Belum ada deskripsi untuk kategori ini.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Books List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Daftar Buku di Kategori Ini</h3>
                        
                        {books.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {books.map(book => (
                                    <div key={book.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                        <div className="aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden mb-3 relative flex items-center justify-center">
                                            {book.cover ? (
                                                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <Book className="text-gray-300" size={48} />
                                            )}
                                        </div>
                                        <h4 className="font-bold text-gray-900 truncate">{book.title}</h4>
                                        <Link href={route('admin.books.show', book.id)} className="text-blue-600 text-xs font-medium mt-2 inline-block hover:underline">
                                            Lihat Detail Buku
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center border border-dashed border-gray-200 rounded-xl">
                                <Book size={48} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500 font-medium">Belum ada buku di kategori ini</p>
                                <Link href={route('admin.books.create')} className="mt-4 inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                                    Tambah Buku Baru
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
