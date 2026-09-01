import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import NotificationBell from '@/components/NotificationBell';
import { Mic, Lock, Square, Play, UploadCloud, CheckCircle, Loader2, Home, LayoutGrid, PlaySquare, Headphones, CircleUserRound, ArrowLeft, Bookmark, Share2, Star, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Recording {
    id: number;
    file_path: string;
    duration: number;
    admin_comment_text?: string;
    admin_comment_audio_path?: string;
}

interface Ayah {
    id: number;
    number_in_surah: number;
    text: string;
    transliteration?: string;
    translation: string;
    recordings: Recording[];
}

interface Surah {
    id: number;
    name: string;
    english_name: string;
    ayahs: Ayah[];
}

interface Props {
    surah: Surah;
}

const AyahRow = ({ ayah, surahName, surahId }: { ayah: Ayah, surahName: string, surahId: number }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Existing recording
    const existingRecording = ayah.recordings.length > 0 ? ayah.recordings[0] : null;

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const { auth } = usePage().props as any;

    const startRecording = async () => {
        if (!auth?.user) {
            setShowLoginModal(true);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setIsSuccess(false);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Tidak dapat mengakses mikrofon. Pastikan Anda telah memberikan izin.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const uploadRecording = async () => {
        if (!audioBlob) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('audio', audioBlob, `recording_${ayah.id}.webm`);
        formData.append('ayah_id', ayah.id.toString());

        try {
            const response = await axios.post(route('alquran.recording.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.message) {
                setIsSuccess(true);
                setAudioBlob(null); // Clear blob after success so they rely on saved or just show success
            }
        } catch (error: any) {
            console.error('Error uploading recording:', error);
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert('Gagal menyimpan rekaman.');
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-3 mb-2 shadow-sm border border-gray-100">
            {/* Header Ayat */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#5C5AE6] flex items-center justify-center font-bold text-[11px]">
                        {ayah.number_in_surah}
                    </div>
                    <span className="text-[11px] font-medium text-[#64748B]">Ayat ke-{ayah.number_in_surah}</span>
                </div>
                <div className="flex items-center gap-2 text-[#5C5AE6]">
                    <button><Bookmark className="w-4 h-4" strokeWidth={2} /></button>
                    <button><Share2 className="w-4 h-4" strokeWidth={2} /></button>
                </div>
            </div>

            {/* Teks Arab */}
            <div className="text-center mb-2">
                <p className="text-[28px] text-gray-900" style={{ fontFamily: "'Amiri Quran', 'Scheherazade New', serif", lineHeight: '2' }}>
                    {ayah.number_in_surah === 1 && surahId !== 1 && surahId !== 9 
                        ? ayah.text.replace(new RegExp(`^\\uFEFF?بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\\s*(?:۞\\s*)?`), '') 
                        : ayah.text}
                </p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 mb-2 opacity-50">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4A373]"></div>
                <Star className="w-2.5 h-2.5 text-[#D4A373]" fill="currentColor" stroke="none" />
                <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4A373]"></div>
            </div>

            {/* Transliteration (Bacaan) & Terjemahan */}
            {(ayah.transliteration || ayah.translation) && (
                <div className="text-center mb-3">
                    {ayah.transliteration && (
                        <p className="text-[#1E293B] font-semibold text-[13px] leading-snug mb-1.5 italic" dangerouslySetInnerHTML={{ __html: 
                            ayah.number_in_surah === 1 && surahId !== 1 && surahId !== 9 
                                ? ayah.transliteration.replace(/^Bismillāhir-raḥmānir-raḥīm\(i\)\.\s*/, '')
                                : ayah.transliteration 
                        }}></p>
                    )}
                    {ayah.translation && (
                        <p className="text-[#64748B] text-[11px] leading-snug">
                            {ayah.number_in_surah === 1 && surahId !== 1 && surahId !== 9 
                                ? ayah.translation.replace(/^Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang\.\s*/i, '')
                                : ayah.translation}
                        </p>
                    )}
                </div>
            )}

            {/* Recording Controls */}
            <div className="mt-1">
                {isRecording ? (
                    <div className="flex items-center gap-2 bg-red-50 p-1 pl-3 rounded-lg border border-red-100">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                        <span className="text-red-500 font-semibold text-[11px] flex-1">Merekam...</span>
                        <button
                            onClick={stopRecording}
                            className="bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 transition-colors shadow-sm"
                        >
                            <Square className="w-3.5 h-3.5" fill="currentColor" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {!audioUrl && !isSuccess && (
                            <button
                                onClick={startRecording}
                                className="w-full flex items-center justify-center gap-1.5 bg-[#5C5AE6] text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-semibold text-[12px]"
                            >
                                {ayah.number_in_surah > 1 && !existingRecording ? <Lock className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                {ayah.number_in_surah > 1 && !existingRecording ? 'Setor (10 Koin)' : (existingRecording ? 'Setor Ulang' : 'Setor (Gratis)')}
                            </button>
                        )}

                        {audioUrl && !isSuccess && (
                            <div className="flex flex-col gap-2 bg-[#EEF2FF] p-2 rounded-lg border border-indigo-100">
                                <audio src={audioUrl} controls className="w-full h-8" />
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={() => { setAudioUrl(null); setAudioBlob(null); }}
                                        className="flex-1 bg-white text-gray-600 border border-gray-200 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-[11px] font-semibold"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={uploadRecording}
                                        disabled={isUploading}
                                        className="flex-[2] flex items-center justify-center gap-1.5 bg-emerald-500 text-white py-1.5 rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50 text-[11px] font-semibold shadow-sm"
                                    >
                                        {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                                        {isUploading ? 'Menyimpan...' : 'Simpan Rekaman'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {isSuccess && (
                            <div className="flex items-center justify-center gap-1.5 text-emerald-600 bg-emerald-50 py-2 rounded-lg border border-emerald-100">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-[12px] font-semibold">Berhasil disimpan!</span>
                            </div>
                        )}

                        {existingRecording && !audioUrl && (
                            <div className="mt-0.5 bg-[#F8FAFC] p-2 rounded-lg border border-[#F1F5F9]">
                                <p className="text-[10px] text-[#64748B] mb-1 font-bold px-1 flex items-center gap-1">
                                    <PlaySquare className="w-3 h-3" /> REKAMAN TERSIMPAN
                                </p>
                                <audio src={existingRecording.file_path} controls className="w-full h-8" />

                                {(existingRecording.admin_comment_text || existingRecording.admin_comment_audio_path) && (
                                    <div className="mt-2 bg-indigo-50/50 p-2 rounded-md border border-indigo-100">
                                        <p className="text-[10px] text-indigo-700 font-bold mb-1 flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3" /> BALASAN USTADZ
                                        </p>
                                        {existingRecording.admin_comment_text && (
                                            <p className="text-[11px] text-gray-700 mb-1.5 px-1 leading-snug">
                                                {existingRecording.admin_comment_text}
                                            </p>
                                        )}
                                        {existingRecording.admin_comment_audio_path && (
                                            <audio src={existingRecording.admin_comment_audio_path} controls className="w-full h-8" />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Login Modal */}
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent className="sm:max-w-md bg-white rounded-3xl w-[90%] max-w-[340px] p-6 border-0 shadow-2xl">
                    <DialogHeader className="mb-2">
                        <div className="w-16 h-16 bg-[#EEF2FF] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-[#5C5AE6]" />
                        </div>
                        <DialogTitle className="text-center text-[#1E293B] text-[20px] font-extrabold leading-tight">Akses Terbatas</DialogTitle>
                        <DialogDescription className="text-center text-[#64748B] text-[13px] leading-relaxed mt-2 px-2">
                            Silakan masuk ke akun Anda terlebih dahulu untuk mulai menyetor hafalan dan mendapatkan evaluasi.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-col gap-3 mt-4 sm:space-x-0">
                        <Link 
                            href={route('login')} 
                            className="w-full bg-[#5C5AE6] hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl text-center transition-all shadow-md active:scale-[0.98] text-[14px]"
                        >
                            Masuk Sekarang
                        </Link>
                        <button 
                            onClick={() => setShowLoginModal(false)}
                            className="w-full bg-white hover:bg-gray-50 text-[#64748B] font-semibold py-3.5 px-4 rounded-xl text-center transition-all border border-[#E2E8F0] active:scale-[0.98] text-[14px]"
                        >
                            Nanti Saja
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default function Show({ surah }: Props) {
    return (
        <>
            <Head title={`Surah ${surah.english_name}`} />

            {/* MOBILE VIEW */}
            <div className="block md:hidden bg-[#FAFBFF] min-h-screen pb-24 font-sans relative">
                {/* Navbar */}
                <div className="flex items-center px-5 py-4 bg-[#FAFBFF] sticky top-0 z-50">
                    <Link href="/audios" className="w-8 h-8 flex items-center justify-center -ml-2 mr-2">
                        <ArrowLeft className="w-6 h-6 text-[#5C5AE6]" strokeWidth={2} />
                    </Link>
                    <span className="text-[18px] font-bold text-[#1E293B]">
                        {surah.english_name}
                    </span>
                </div>

                {/* Header Surah with Mosque Pattern */}
                <div className="relative w-full overflow-hidden mb-6 mt-2">
                    {/* Background Illustration (Mosque Silhouettes) */}
                    <div className="absolute inset-0 z-0 flex items-end justify-center opacity-30 pointer-events-none">
                        <img src="/images/mosque_hero.png" alt="pattern" className="w-full h-auto object-cover object-bottom" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        {/* Fallback pattern if image is missing */}
                        <div className="absolute inset-0 bg-[#EEF2FF] opacity-50 mix-blend-multiply"></div>
                    </div>

                    <div className="relative z-10 py-10 px-5 text-center flex flex-col items-center justify-center">
                        <h1 className="text-[46px] font-bold text-[#1E293B] mb-2 drop-shadow-sm" style={{ fontFamily: "'Amiri Quran', 'Scheherazade New', serif", lineHeight: '1.6' }}>
                            {surah.name}
                        </h1>
                        <h2 className="text-[15px] font-semibold text-[#5C5AE6] tracking-wide">
                            Surah {surah.english_name}
                        </h2>
                    </div>
                </div>

                {/* Daftar Ayat */}
                <div className="px-4 pb-20">
                    {/* Bismillah Banner for non-Fatihah/Tawbah */}
                    {surah.id !== 1 && surah.id !== 9 && (
                        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-indigo-50 flex items-center justify-center">
                            <p className="text-[28px] text-[#5C5AE6]" style={{ fontFamily: "'Amiri Quran', 'Scheherazade New', serif", lineHeight: '2' }}>
                                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                            </p>
                        </div>
                    )}

                    {surah.ayahs.map((ayah) => (
                        <AyahRow key={ayah.id} ayah={ayah} surahName={surah.name} surahId={surah.id} />
                    ))}
                </div>

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F1F5F9] z-50 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-around items-center h-[70px] pb-2">
                        {[
                            { id: 'home', label: 'Beranda', icon: Home, route: '/' },
                            { id: 'katalog', label: 'Katalog', icon: LayoutGrid, route: '/katalog' },
                            { id: 'video', label: 'Video Saya', icon: PlaySquare, route: '/videos' },
                            { id: 'rekaman', label: 'Rekaman', icon: Headphones, active: true, route: '/audios' },
                            { id: 'akun', label: 'Akun', icon: CircleUserRound, route: (typeof auth !== 'undefined' && auth?.user) ? '/akun' : '/login' }
                        ].map((item) => (
                            <Link prefetch={['mount', 'hover']} href={item.route} key={item.id} className="flex flex-col items-center justify-center w-[20%] gap-1 relative mt-1">
                                {item.active ? (
                                    <>
                                        <div className="w-10 h-10 flex items-center justify-center">
                                            <item.icon className="w-6 h-6 text-[#5C5AE6] stroke-[2]" />
                                        </div>
                                        <span className="text-[10px] font-bold text-[#5C5AE6]">{item.label}</span>
                                        <div className="absolute -bottom-2 w-[16px] h-[3px] bg-[#5C5AE6] rounded-full"></div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 flex items-center justify-center">
                                            <item.icon className="w-6 h-6 text-[#94A3B8] stroke-[1.5]" />
                                        </div>
                                        <span className="text-[10px] font-medium text-[#64748B]">{item.label}</span>
                                    </>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:block">
                <AppLayout>
                    <div className="py-12 bg-[#FAFBFF] min-h-screen">
                        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">

                            <div className="mb-6 flex items-center justify-between">
                                <Link href={route('alquran.index')} className="text-[#5C5AE6] hover:text-indigo-800 font-semibold flex items-center gap-2">
                                    <ArrowLeft className="w-5 h-5" /> Kembali ke Daftar Surah
                                </Link>
                            </div>

                            {/* Header Surah with Mosque Pattern */}
                            <div className="relative w-full overflow-hidden mb-8 rounded-3xl bg-white shadow-sm border border-gray-100">
                                <div className="absolute inset-0 z-0 flex items-end justify-center opacity-20 pointer-events-none">
                                    <img src="/images/mosque_hero.png" alt="pattern" className="w-full h-auto object-cover object-bottom" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                    <div className="absolute inset-0 bg-[#EEF2FF] opacity-50 mix-blend-multiply"></div>
                                </div>

                                <div className="relative z-10 py-16 px-10 text-center flex flex-col items-center justify-center">
                                    <h1 className="text-5xl md:text-6xl font-bold text-[#1E293B] mb-4 drop-shadow-sm" style={{ fontFamily: "'Amiri Quran', 'Scheherazade New', serif", lineHeight: '1.6' }}>
                                        {surah.name}
                                    </h1>
                                    <h2 className="text-xl font-semibold text-[#5C5AE6] tracking-wide">
                                        Surah {surah.english_name}
                                    </h2>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {surah.ayahs.map((ayah) => (
                                    <AyahRow key={ayah.id} ayah={ayah} surahName={surah.english_name} />
                                ))}
                            </div>

                        </div>
                    </div>
                </AppLayout>
            </div>
        </>
    );
}
