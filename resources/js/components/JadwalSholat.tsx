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

    // Fetch prayer times with instant localStorage cache
    useEffect(() => {
        const todayKey = new Date().toISOString().slice(0, 10);
        const cacheKey = `talaqee_prayer_${todayKey}`;
        
        // Cek cache lokal terlebih dahulu untuk render seketika (0ms)
        let hasCache = false;
        try {
            const cachedTimes = localStorage.getItem(cacheKey);
            const cachedLoc = localStorage.getItem('talaqee_prayer_location');
            if (cachedTimes) {
                setPrayerTimes(JSON.parse(cachedTimes));
                if (cachedLoc) setLocationName(cachedLoc);
                setLoading(false);
                hasCache = true;
            }
        } catch (e) {}

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
                    try {
                        localStorage.setItem(cacheKey, JSON.stringify(newPrayerTimes));
                    } catch (e) {}
                    
                    // Schedule notifications
                    try {
                        const { LocalNotifications } = await import('@capacitor/local-notifications');
                        const permStatus = await LocalNotifications.requestPermissions();
                        if (permStatus.display === 'granted') {
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
                                
                                if (prayerDate.getTime() > new Date().getTime()) {
                                    notificationsToSchedule.push({
                                        title: `Waktu Sholat ${prayer.name}`,
                                        body: `Telah masuk waktu sholat ${prayer.name} untuk wilayah Anda.`,
                                        id: prayer.id,
                                        schedule: { at: prayerDate },
                                        sound: undefined,
                                        smallIcon: "ic_launcher_round"
                                    });
                                }
                            }

                            if (notificationsToSchedule.length > 0) {
                                await LocalNotifications.schedule({ notifications: notificationsToSchedule });
                            }
                        }
                    } catch (e) {
                        // LocalNotifications not available in web
                    }

                    if (updateName) {
                        try {
                            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
                            const geoData = await geoRes.json();
                            const resolvedName = geoData.address.city || geoData.address.town || geoData.address.county || geoData.address.state || "Lokasi Anda";
                            setLocationName(resolvedName);
                            try {
                                localStorage.setItem('talaqee_prayer_location', resolvedName);
                            } catch (e) {}
                        } catch (e) {
                            setLocationName("Lokasi Ditemukan");
                        }
                    }
                } else if (!hasCache) {
                    setError("Gagal mengambil jadwal sholat.");
                }
            } catch (err) {
                if (!hasCache) setError("Koneksi gagal.");
            } finally {
                setLoading(false);
            }
        };

        // Jika belum ada cache sama sekali, fetch Jakarta
        if (!hasCache) {
            setLocationName('Jakarta (Default)');
            fetchPrayerTimes(-6.2088, 106.8456, false);
        }

        // Coba minta lokasi asli dari perangkat jika belum pernah disimpan
        const savedLoc = localStorage.getItem('talaqee_prayer_location');
        if (!savedLoc && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchPrayerTimes(position.coords.latitude, position.coords.longitude, true);
                },
                (err) => {
                    // Timeout or denied
                },
                { timeout: 4000 }
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

    const cleanLocationName = (name: string) => {
        if (!name) return 'Jakarta';
        if (/jakarta/i.test(name)) return 'DKI Jakarta';
        return name
            .replace(/^Special Capital Region of\s*/i, '')
            .replace(/^Daerah Khusus Ibukota\s*/i, '')
            .replace(/^Kota Administrasi\s*/i, '')
            .replace(/^Kota\s*/i, '')
            .replace(/^Kabupaten\s*/i, 'Kab. ')
            .trim() || 'Lokasi Anda';
    };

    if (loading && !prayerTimes) {
        return (
            <div className="bg-gradient-to-br from-[#0F172A] via-[#132238] to-[#0A2621] rounded-2xl p-4 flex flex-col justify-center items-center min-h-[130px] shadow-sm animate-pulse mx-5 mb-6">
                <div className="w-7 h-7 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin mb-2.5"></div>
                <p className="text-white/70 text-[11px] font-medium">Menyesuaikan jadwal sholat...</p>
            </div>
        );
    }

    if (error && !prayerTimes) {
        return (
            <div className="bg-red-50 rounded-2xl p-4 flex flex-col justify-center items-center min-h-[100px] border border-red-100 mx-5 mb-6">
                <p className="text-red-500 text-[12px] font-medium">{error}</p>
            </div>
        );
    }

    const displayLocation = cleanLocationName(locationName);

    return (
        <div className="px-5 mb-6">
            <div className="bg-gradient-to-br from-[#0F172A] via-[#14233D] to-[#0C2B24] rounded-2xl p-4 shadow-[0_6px_20px_rgba(15,23,42,0.12)] text-white relative overflow-hidden border border-white/5">
                {/* Background ambient Islamic glowing decorations */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-sky-500/15 rounded-full blur-2xl pointer-events-none"></div>
                
                {/* Top Header: Location & Live Clock */}
                <div className="flex items-center justify-between mb-3.5 relative z-10">
                    <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 max-w-[65%]">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-[11px] font-semibold text-white/95 truncate">
                            {displayLocation}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/5 text-white/90">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span className="text-[11px] font-bold tracking-wider">
                            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>

                {/* Next Prayer Highlight Banner */}
                {nextPrayer && (
                    <div className="mb-3.5 relative z-10 flex items-center justify-between bg-white/[0.04] p-2.5 px-3 rounded-xl border border-white/5">
                        <div>
                            <p className="text-[10px] text-white/60 font-medium mb-0.5">Waktu Berikutnya</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-[14px] font-bold text-white">{nextPrayer.name}</span>
                                <span className="text-[20px] font-extrabold text-emerald-300 tracking-tight leading-none drop-shadow-sm">
                                    {nextPrayer.time}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] text-white/50 block mb-0.5">Menuju Sholat</span>
                            <span className="inline-flex items-center text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/25 px-2 py-0.5 rounded-full">
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
                                className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all ${
                                    isNext 
                                    ? 'bg-gradient-to-b from-emerald-500/25 to-teal-500/15 border border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]' 
                                    : 'bg-white/[0.05] border border-white/[0.05]'
                                }`}
                            >
                                <span className={`text-[9px] font-medium mb-0.5 ${isNext ? 'text-emerald-300 font-bold' : 'text-white/60'}`}>
                                    {prayer.name}
                                </span>
                                <span className={`text-[11px] ${isNext ? 'font-black text-white' : 'font-semibold text-white/90'}`}>
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
