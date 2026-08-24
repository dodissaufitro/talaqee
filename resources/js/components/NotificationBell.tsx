import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';

interface Notification {
    id: number;
    title: string;
    message: string;
    action_url: string;
    is_read: boolean;
    created_at: string;
}

export default function NotificationBell() {
    const { auth } = usePage().props as any;
    const notifications: Notification[] = auth.unread_notifications || [];
    const [isOpen, setIsOpen] = useState(false);

    const markAsRead = (notification: Notification) => {
        router.post(`/notifications/${notification.id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                if (notification.action_url) {
                    router.visit(notification.action_url);
                }
            }
        });
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
            >
                <Bell size={20} />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900 text-sm">Notifikasi</h3>
                            <span className="text-xs bg-[#f3eefe] text-[#7e57c2] px-2 py-0.5 rounded-full font-medium">
                                {notifications.length} Baru
                            </span>
                        </div>
                        
                        <div className="overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    <div 
                                        key={notif.id} 
                                        onClick={() => markAsRead(notif)}
                                        className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <h4 className="text-sm font-bold text-gray-900 mb-1">{notif.title}</h4>
                                        <p className="text-xs text-gray-600 line-clamp-2">{notif.message}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                                    <p className="text-sm">Tidak ada notifikasi baru</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
