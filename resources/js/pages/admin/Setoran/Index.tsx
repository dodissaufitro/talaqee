import React, { useState, useRef } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AdminSidebar from '@/components/AdminSidebar';
import { PlayCircle, MessageSquare, Mic, Square, UploadCloud, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Surah {
    id: number;
    name: string;
    english_name: string;
}

interface Ayah {
    id: number;
    number_in_surah: number;
    text: string;
    surah: Surah;
}

interface Recording {
    id: number;
    user: User;
    ayah: Ayah;
    file_path: string;
    created_at: string;
    admin_comment_text?: string;
    admin_comment_audio_path?: string;
}

interface Props {
    recordings: {
        data: Recording[];
        links: any[];
    };
}

interface PageProps {
    [key: string]: unknown;
    auth: {
        user: {
            name: string;
            email: string;
        }
    };
}

const CommentForm = ({ recording }: { recording: Recording }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [text, setText] = useState(recording.admin_comment_text || '');
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Tidak dapat mengakses mikrofon.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const submitComment = async () => {
        setIsUploading(true);
        const formData = new FormData();
        if (text) formData.append('admin_comment_text', text);
        if (audioBlob) formData.append('admin_comment_audio', audioBlob, `admin_comment_${recording.id}.webm`);

        try {
            await axios.post(`/admin/setoran/${recording.id}/comment`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            window.location.reload(); 
        } catch (error) {
            console.error('Error saving comment:', error);
            alert('Gagal menyimpan komentar.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="mt-0">
            {!isExpanded ? (
                <button 
                    onClick={() => setIsExpanded(true)}
                    className="text-indigo-600 text-xs font-semibold flex items-center gap-1 hover:text-indigo-800"
                >
                    <MessageSquare className="w-4 h-4" /> 
                    {recording.admin_comment_text || recording.admin_comment_audio_path ? 'Lihat/Edit Komentar' : 'Beri Komentar'}
                </button>
            ) : (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 w-[300px] sm:w-[350px]">
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Tulis komentar teks..."
                        className="w-full text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                        rows={2}
                    ></textarea>
                    
                    <div className="flex flex-col gap-2 mb-3">
                        {recording.admin_comment_audio_path && !audioUrl && (
                            <div className="mb-1">
                                <span className="text-xs text-gray-500 font-medium mb-1 block">Audio Tersimpan:</span>
                                <audio src={recording.admin_comment_audio_path} controls className="w-full h-8" />
                            </div>
                        )}
                        
                        {isRecording ? (
                            <div className="flex items-center gap-2 bg-red-50 p-1.5 px-3 rounded-md border border-red-100">
                                <span className="animate-ping w-2 h-2 rounded-full bg-red-500"></span>
                                <span className="text-red-500 text-xs flex-1">Merekam...</span>
                                <button onClick={stopRecording} className="bg-red-500 text-white p-1 rounded-sm"><Square className="w-3 h-3" fill="currentColor" /></button>
                            </div>
                        ) : !audioUrl ? (
                            <button onClick={startRecording} className="flex items-center justify-center gap-1.5 bg-white border border-gray-300 text-gray-700 py-1.5 rounded-md hover:bg-gray-50 text-xs font-medium">
                                <Mic className="w-3.5 h-3.5" /> Rekam Audio Baru
                            </button>
                        ) : (
                            <div className="flex flex-col gap-1.5 bg-indigo-50 p-1.5 rounded-md border border-indigo-100">
                                <span className="text-xs text-indigo-600 font-medium px-1">Audio Baru:</span>
                                <audio src={audioUrl} controls className="w-full h-8" />
                                <button onClick={() => { setAudioUrl(null); setAudioBlob(null); }} className="text-xs text-gray-500 hover:text-red-600 text-left px-1">Batal pakai audio ini</button>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <button onClick={() => setIsExpanded(false)} className="text-xs text-gray-500 hover:text-gray-700">Tutup</button>
                        <button 
                            onClick={submitComment}
                            disabled={isUploading}
                            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />} 
                            Simpan Komentar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function Index({ recordings }: Props) {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
            <Head title="Data Setoran Hafalan" />
            
            <AdminSidebar activeItem="Rekaman Audio" auth={auth} />

            <main className="flex-1 overflow-y-auto">
                <div className="p-8 w-full space-y-8">
                    <header className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Data Setoran Hafalan</h2>
                            <p className="text-sm text-gray-500 mt-1">Daftar semua rekaman setoran ayat dari pengguna.</p>
                        </div>
                    </header>

                    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4">No</th>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Surah & Ayat</th>
                                        <th className="px-6 py-4">Waktu Setoran</th>
                                        <th className="px-6 py-4 text-center">Audio</th>
                                        <th className="px-6 py-4">Komentar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recordings.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                Belum ada data setoran.
                                            </td>
                                        </tr>
                                    ) : (
                                        recordings.data.map((recording, index) => (
                                            <tr key={recording.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">{index + 1}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{recording.user?.name || 'Unknown User'}</div>
                                                    <div className="text-xs text-gray-500">{recording.user?.email || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-indigo-600">{recording.ayah?.surah?.english_name || 'Unknown Surah'}</div>
                                                    <div className="text-sm text-gray-500">Ayat {recording.ayah?.number_in_surah || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {recording.created_at ? new Date(recording.created_at).toLocaleString('id-ID') : '-'}
                                                </td>
                                                <td className="px-6 py-4 w-[250px]">
                                                    <audio 
                                                        src={recording.file_path} 
                                                        controls 
                                                        className="w-full h-10" 
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <CommentForm recording={recording} />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        {recordings.links && recordings.links.length > 3 && (
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <Link
                                        href={recordings.links[0].url || '#'}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                    <Link
                                        href={recordings.links[recordings.links.length - 1].url || '#'}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Next
                                    </Link>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-end">
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            {recordings.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        link.active 
                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } ${index === 0 ? 'rounded-l-md' : ''} ${index === recordings.links.length - 1 ? 'rounded-r-md' : ''}`}
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
