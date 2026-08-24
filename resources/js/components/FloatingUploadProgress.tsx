import React from 'react';
import { useUploadStore } from '@/stores/useUploadStore';
import { Upload, X, CheckCircle2 } from 'lucide-react';

export default function FloatingUploadProgress() {
    const { isUploading, progress, title, resetUpload } = useUploadStore();

    if (!isUploading) return null;

    return (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${progress === 100 ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                            {progress === 100 ? <CheckCircle2 size={20} /> : <Upload size={20} className="animate-pulse" />}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                                {progress === 100 ? 'Upload Selesai' : 'Mengunggah Video'}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-1" title={title}>{title}</p>
                        </div>
                    </div>
                    {progress === 100 && (
                        <button onClick={resetUpload} className="text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                        <span className={progress === 100 ? 'text-green-600' : 'text-blue-600'}>
                            {progress}%
                        </span>
                        <span className="text-gray-500">
                            {progress === 100 ? 'Selesai' : 'Diproses...'}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-300 ${progress === 100 ? 'bg-green-500' : 'bg-blue-600 relative'}`}
                            style={{ width: `${progress}%` }}
                        >
                            {progress < 100 && (
                                <div className="absolute inset-0 bg-white/20 w-full animate-pulse -skew-x-12"></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
