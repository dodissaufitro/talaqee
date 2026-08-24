import { create } from 'zustand';
import axios from 'axios';
import { router } from '@inertiajs/react';

interface UploadState {
    isUploading: boolean;
    progress: number;
    title: string;
    startUpload: (file: File | null, payload: any, urls: { chunkUrl: string, submitUrl: string }) => Promise<void>;
    resetUpload: () => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
    isUploading: false,
    progress: 0,
    title: '',

    startUpload: async (file, payload, urls) => {
        if (get().isUploading) return; // Prevent multiple concurrent uploads for now
        
        set({ isUploading: true, progress: 0, title: payload.title || 'Video' });

        try {
            if (file) {
                const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
                const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
                const fileId = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '')}`;
                
                for (let i = 0; i < totalChunks; i++) {
                    const start = i * CHUNK_SIZE;
                    const end = Math.min(start + CHUNK_SIZE, file.size);
                    const chunk = file.slice(start, end);
                    
                    const formData = new FormData();
                    formData.append('file', chunk);
                    formData.append('file_id', fileId);
                    formData.append('chunk_index', i.toString());
                    formData.append('total_chunks', totalChunks.toString());
                    
                    const response = await axios.post(urls.chunkUrl, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    
                    set({ progress: Math.round(((i + 1) / totalChunks) * 95) }); // Reserve 5% for final submit
                    
                    if (i === totalChunks - 1 && response.data.temp_video_path) {
                        payload.temp_video_path = response.data.temp_video_path;
                        payload.original_extension = file.name.split('.').pop() || 'mp4';
                    }
                }
            }

            // Final Submit via axios to not disrupt current page state
            const formData = new FormData();
            for (const key in payload) {
                if (payload[key] !== null && payload[key] !== undefined) {
                    if (typeof payload[key] === 'boolean') {
                        formData.append(key, payload[key] ? '1' : '0');
                    } else if (payload[key] instanceof File) {
                        formData.append(key, payload[key]);
                    } else {
                        formData.append(key, payload[key].toString());
                    }
                }
            }
            
            await axios.post(urls.submitUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            set({ progress: 100 });
            
            setTimeout(() => {
                set({ isUploading: false, progress: 0, title: '' });
                router.reload();
            }, 3000);

        } catch (error) {
            console.error('Upload error:', error);
            alert('Gagal mengunggah video. Silakan coba lagi.');
            set({ isUploading: false, progress: 0, title: '' });
        }
    },

    resetUpload: () => set({ isUploading: false, progress: 0, title: '' }),
}));
