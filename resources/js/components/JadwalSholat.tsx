import React, { useState, useEffect } from 'react';
import { MapPin, Clock } from 'lucide-react';

interface PrayerTimes {
    Subuh: string;
    Dzuhur: string;
    Ashar: string;
    Maghrib: string;
    Isya: string;
}

export default function JadwalSholat() {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [locationName, setLocationName] = useState<string>('Mencari lokasi...');
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [nextPrayer, setNextPrayer] = useState<{name: string, time: string, diffStr: string} | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch prayer times
    useEffect(() => {
        const fetchPrayerTimes = async (lat: number, lng: number, updateName = true) => {
            try {
                // Call Aladhan API
                const date = new Date();
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                
                const response = await fetch(`https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=20`);
                const data = await response.json();
                
                if (data.code === 200) {
                    const timings = data.data.timings;
                    const newPrayerTimes = {
                        Subuh: timings.Fajr,
                        Dzuhur: timings.Dhuhr,
                        Ashar: timings.Asr,
                        Maghrib: timings.Maghrib,
                        Isya: timings.Isha
                    };
                    setPrayerTimes(newPrayerTimes);
                    
                    // Schedule notifications
                    try {
                        const { LocalNotifications } = await import('@capacitor/local-notifications');
                        const permStatus = await LocalNotifications.requestPermissions();
                        if (permStatus.display === 'granted') {
                            // Cancel old notifications first
                            const pending = await LocalNotifications.getPending();
                            if (pending.notifications.length > 0) {
                                await LocalNotifications.cancel(pending);
                            }

                            const schedule = [
                                { id: 1, name: 'Subuh', time: timings.Fajr },
                                { id: 2, name: 'Dzuhur', time: timings.Dhuhr },
                                { id: 3, name: 'Ashar', time: timings.Asr },
                                { id: 4, name: 'Maghrib', time: timings.Maghrib },
                                { id: 5, name: 'Isya', time: timings.Isha }
                            ];

                            const notificationsToSchedule = [];
                            
                            for (const prayer of schedule) {
                                const [pHours, pMinutes] = prayer.time.split(':').map(Number);
                                const prayerDate = new Date();
                                prayerDate.setHours(pHours, pMinutes, 0, 0);
                                
                                // Only schedule if time is in the future today
                                if (prayerDate.getTime() > new Date().getTime()) {
                                    notificationsToSchedule.push({
                                        title: `Waktu Sholat ${prayer.name}`,
                                        body: `Telah masuk waktu sholat ${prayer.name} untuk wilayah Anda.`,
                                        id: prayer.id,
                                        schedule: { at: prayerDate },
                                        sound: undefined, // default sound
                                        smallIcon: "ic_launcher_round"
                                    });
                                }
                            }

                            if (notificationsToSchedule.length > 0) {
                                await LocalNotifications.schedule({ notifications: notificationsToSchedule });
                            }
                        }
                    } catch (e) {
                        console.log("LocalNotifications not available (likely running in web)");
                    }

                    if (updateName) {
                        try {
                            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
                            const geoData = await geoRes.json();
                            setLocationName(geoData.address.city || geoData.address.town || geoData.address.county || geoData.address.state || "Lokasi Anda");
                        } catch (e) {
                            setLocationName("Lokasi Ditemukan");
                        }
                    }
                } else {
                    setError("Gagal mengambil jadwal sholat.");
                }
            } catch (err) {
                setError("Koneksi gagal.");
            } finally {
                setLoading(false);
            }
        };

        // Segera ambil jadwal untuk Jakarta agar tidak stuck loading lama
        setLocationName('Jakarta (Default)');
        fetchPrayerTimes(-6.2088, 106.8456, false);

        // Coba minta lokasi asli dari perangkat
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocationName('Mencari lokasi akurat...');
                    fetchPrayerTimes(position.coords.latitude, position.coords.longitude, true);
                },
                (err) => {
                    console.log("Geolocation ditolak atau timeout, tetap gunakan Jakarta");
                },
                { timeout: 5000 }
            );
        }
    }, []);

    // Calculate next prayer
    useEffect(() => {
        if (!prayerTimes) return;

        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const currentSeconds = currentTime.getSeconds();
        const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

        const schedule = [
            { name: 'Subuh', time: prayerTimes.Subuh },
            { name: 'Dzuhur', time: prayerTimes.Dzuhur },
            { name: 'Ashar', time: prayerTimes.Ashar },
            { name: 'Maghrib', time: prayerTimes.Maghrib },
            { name: 'Isya', time: prayerTimes.Isya }
        ];

        let next = null;
        let minDiff = Infinity;

        for (const prayer of schedule) {
            const [pHours, pMinutes] = prayer.time.split(':').map(Number);
            const prayerTotalSeconds = pHours * 3600 + pMinutes * 60;
            
            if (prayerTotalSeconds > currentTotalSeconds) {
                const diff = prayerTotalSeconds - currentTotalSeconds;
                if (diff < minDiff) {
                    minDiff = diff;
                    next = { ...prayer, diffSeconds: diff };
                }
            }
        }

        // If no next prayer today, it must be Subuh tomorrow
        if (!next) {
            const [pHours, pMinutes] = prayerTimes.Subuh.split(':').map(Number);
            const prayerTotalSeconds = pHours * 3600 + pMinutes * 60;
            const diff = (24 * 3600 - currentTotalSeconds) + prayerTotalSeconds;
            next = { name: 'Subuh', time: prayerTimes.Subuh, diffSeconds: diff };
        }

        // Format diff string (HH:MM:SS)
        const h = Math.floor(next.diffSeconds / 3600);
        const m = Math.floor((next.diffSeconds % 3600) / 60);
        const s = next.diffSeconds % 60;
        
        const diffStr = `${h > 0 ? `- ${h}j ` : '- '}${m}m ${s}d`;

        setNextPrayer({
            name: next.name,
            time: next.time,
            diffStr: diffStr
        });

    }, [currentTime, prayerTimes]);

    if (loading && !prayerTimes) {
        return (
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[20px] p-4 flex flex-col justify-center items-center min-h-[140px] shadow-sm animate-pulse mx-5 mb-8">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3"></div>
                <p className="text-white/60 text-[11px] font-medium">Menyesuaikan lokasi...</p>
            </div>
        );
    }

    if (error && !prayerTimes) {
        return (
            <div className="bg-red-50 rounded-[20px] p-4 flex flex-col justify-center items-center min-h-[120px] border border-red-100 mx-5 mb-8">
                <p className="text-red-500 text-[12px] font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="px-5 mb-8">
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[20px] p-4 shadow-[0_8px_16px_rgba(15,23,42,0.15)] text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#6366F1]/20 rounded-full blur-xl"></div>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/5">
                        <MapPin className="w-3 h-3 text-[#38BDF8]" />
                        <span className="text-[10px] font-medium text-white/90 truncate max-w-[120px]">
                            {locationName}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/90">
                        <Clock className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span className="text-[12px] font-bold tracking-wide">
                            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>

                {/* Next Prayer Highlight */}
                {nextPrayer && (
                    <div className="mb-5 relative z-10">
                        <p className="text-[10px] text-white/70 mb-0.5">Menuju {nextPrayer.name}</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-[24px] font-extrabold leading-none tracking-tight text-white drop-shadow-sm">
                                {nextPrayer.time}
                            </h2>
                            <span className="text-[11px] font-bold text-[#FBBF24] bg-[#FBBF24]/10 px-2 py-0.5 rounded-md mb-0.5">
                                {nextPrayer.diffStr}
                            </span>
                        </div>
                    </div>
                )}

                {/* Prayer Times Grid */}
                <div className="grid grid-cols-5 gap-1.5 relative z-10">
                    {[
                        { name: 'Subuh', time: prayerTimes?.Subuh },
                        { name: 'Dzuhur', time: prayerTimes?.Dzuhur },
                        { name: 'Ashar', time: prayerTimes?.Ashar },
                        { name: 'Maghrib', time: prayerTimes?.Maghrib },
                        { name: 'Isya', time: prayerTimes?.Isya }
                    ].map((prayer) => {
                        const isNext = nextPrayer?.name === prayer.name;
                        return (
                            <div 
                                key={prayer.name} 
                                className={`flex flex-col items-center justify-center py-2 rounded-xl border transition-all ${
                                    isNext 
                                    ? 'bg-gradient-to-b from-[#38BDF8]/20 to-[#38BDF8]/5 border-[#38BDF8]/30 shadow-[0_0_12px_rgba(56,189,248,0.15)]' 
                                    : 'bg-white/5 border-white/5'
                                }`}
                            >
                                <span className={`text-[9px] font-medium mb-1 ${isNext ? 'text-[#38BDF8]' : 'text-white/60'}`}>
                                    {prayer.name}
                                </span>
                                <span className={`text-[11px] ${isNext ? 'font-bold text-white' : 'font-semibold text-white/90'}`}>
                                    {prayer.time}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
