import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Surah {
    id: number;
    number: number;
    name: string;
    english_name: string;
    english_name_translation: string;
    number_of_ayahs: number;
    revelation_type: string;
}

interface Props {
    surahs: Surah[];
}

export default function Index({ surahs }: Props) {
    return (
        <AppLayout>
            <Head title="Al-Quran" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold mb-6">Daftar Surah</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {surahs.map((surah) => (
                                    <Link 
                                        key={surah.id} 
                                        href={route('alquran.show', surah.id)}
                                        className="border p-4 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-full font-bold">
                                                {surah.number}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{surah.english_name}</h3>
                                                <p className="text-sm text-gray-500">{surah.english_name_translation}</p>
                                                <p className="text-xs text-gray-400 mt-1">{surah.number_of_ayahs} Ayat • {surah.revelation_type}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-arabic" style={{ fontFamily: "'Amiri Quran', 'Scheherazade New', serif" }}>{surah.name}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
