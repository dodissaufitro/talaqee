import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import NotificationBell from '@/components/NotificationBell';
import { 
    Bell, Settings, ChevronRight, User as UserIcon, 
    ShieldCheck, Crown, Clock, Heart, Download, 
    HelpCircle, Info, LogOut, Home, LayoutGrid, PlaySquare, Headphones, CircleUserRound, Plus
} from 'lucide-react';

export default function AkunIndex() {
    const { auth } = usePage<any>().props;
    const user = auth.user;
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-[#7e57c2] selection:text-white">
            <Head title="Akun Saya" />
            
            {/* Header */}
            <div className="px-5 pt-6 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[24px] font-extrabold text-[#1E293B]">Akun Saya</h1>
                        <p className="text-[12px] font-medium text-[#64748B] mt-0.5">Kelola profil dan pengaturan akunmu</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100">
                            <Settings className="w-5 h-5 text-[#1E293B]" strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-5 space-y-4">
                {/* Profile Card */}
                <div className="bg-white rounded-[24px] p-4 flex items-center shadow-sm border border-[#F1F5F9]">
                    <div className="w-[72px] h-[72px] bg-[#EEF2FF] rounded-full shrink-0 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm mr-4 relative">
                        {user?.avatar ? (
                            <img src={`/storage/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                            <UserIcon className="w-8 h-8 text-[#5C5AE6] absolute z-[-1]" />
                        )}
                        {!user?.avatar && <img src="/images/avatar_placeholder.png" alt="Avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-[17px] font-extrabold text-[#1E293B] truncate">{user?.name || 'Ahmad Fauzi'}</h2>
                            <span className="flex items-center gap-1 bg-[#F5F3FF] text-[#7C3AED] text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
                                <Crown className="w-3 h-3" /> Premium
                            </span>
                        </div>
                        <p className="text-[13px] text-[#64748B] mb-1">{user?.email || 'ahmadfauzi@gmail.com'}</p>
                        <p className="text-[11px] font-medium text-[#94A3B8]">Bergabung sejak {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '12 Jan 2024'}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#94A3B8] shrink-0 ml-2" />
                </div>

                {/* Coin Balance Card */}
                <div className="rounded-[24px] p-5 relative overflow-hidden shadow-sm" style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%)' }}>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-extrabold text-[#1E293B]">Saldo Koin</span>
                            <Link href="/akun/topup" className="flex items-center gap-1 bg-[#7C3AED] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm hover:bg-[#6D28D9] transition-colors">
                                Top Up Koin <Plus className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-[#FBBF24] rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-white text-[18px] font-extrabold">C</span>
                            </div>
                            <span className="text-[32px] font-black text-[#1E293B] leading-none tracking-tight">{user?.coin_balance || 250}</span>
                        </div>
                        <button className="flex items-center gap-1 text-[11px] font-medium text-[#64748B] hover:text-[#1E293B] transition-colors">
                            Riwayat transaksi koin <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    {/* Wallet Illustration placeholder */}
                    <div className="absolute right-0 bottom-0 w-[140px] h-[100px] z-0 opacity-80 pointer-events-none">
                        <div className="absolute bottom-2 right-4 w-20 h-16 bg-[#7C3AED] rounded-xl shadow-lg transform rotate-[-5deg]"></div>
                        <div className="absolute bottom-6 right-8 w-16 h-12 bg-[#8B5CF6] rounded-xl shadow-inner"></div>
                        <div className="absolute bottom-1 right-2 w-6 h-6 bg-[#FBBF24] rounded-full shadow-md border-2 border-white flex items-center justify-center"><span className="text-white text-[10px] font-bold">C</span></div>
                        <div className="absolute bottom-4 right-20 w-5 h-5 bg-[#FBBF24] rounded-full shadow-md border-2 border-white flex items-center justify-center"><span className="text-white text-[8px] font-bold">C</span></div>
                        <div className="absolute top-4 right-12 w-4 h-4 bg-[#FBBF24] rounded-full shadow-md border-2 border-white flex items-center justify-center"><span className="text-white text-[7px] font-bold">C</span></div>
                    </div>
                </div>

                {/* Akun & Profil Section */}
                <div>
                    <h3 className="text-[13px] font-bold text-[#64748B] px-1 mb-2">Akun & Profil</h3>
                    <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-[#F1F5F9]">
                        <Link href="/akun/edit-profil" className="w-full flex items-center p-4 border-b border-[#F8FAFC] hover:bg-gray-50 transition-colors text-left">
                            <div className="w-10 h-10 bg-[#F5F3FF] text-[#7C3AED] rounded-full flex items-center justify-center mr-3 shrink-0">
                                <UserIcon className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[14px] font-extrabold text-[#1E293B]">Edit Profil</h4>
                                <p className="text-[11px] text-[#64748B]">Ubah informasi profil kamu</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#94A3B8] shrink-0" />
                        </Link>
                        <button className="w-full flex items-center p-4 border-b border-[#F8FAFC] hover:bg-gray-50 transition-colors text-left">
                            <div className="w-10 h-10 bg-[#ECFDF5] text-[#10B981] rounded-full flex items-center justify-center mr-3 shrink-0">
                                <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[14px] font-extrabold text-[#1E293B]">Keamanan Akun</h4>
                                <p className="text-[11px] text-[#64748B]">Ganti password dan keamanan</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#94A3B8] shrink-0" />
                        </button>
                        <button className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left">
                            <div className="w-10 h-10 bg-[#FFFBEB] text-[#F59E0B] rounded-full flex items-center justify-center mr-3 shrink-0">
                                <Crown className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[14px] font-extrabold text-[#1E293B]">Langganan Premium</h4>
                                <p className="text-[11px] text-[#64748B]">Lihat status dan keuntungan</p>
                            </div>
                            <span className="bg-[#EEF2FF] text-[#5C5AE6] text-[10px] font-bold px-2 py-0.5 rounded mr-2">Aktif</span>
                            <ChevronRight className="w-5 h-5 text-[#94A3B8] shrink-0" />
                        </button>
                    </div>
                </div>

                {/* Aktivitas Section */}
                <div>
                    <h3 className="text-[13px] font-bold text-[#64748B] px-1 mb-2">Aktivitas</h3>
                    <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-[#F1F5F9]">
                        <button className="w-full flex items-center p-4 border-b border-[#F8FAFC] hover:bg-gray-50 transition-colors text-left">
                            <div className="w-10 h-10 bg-[#EFF6FF] text-[#3B82F6] rounded-full flex items-center justify-center mr-3 shrink-0">
                                <Clock className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[14px] font-extrabold text-[#1E293B]">Riwayat Baca</h4>
                                <p className="text-[11px] text-[#64748B]">Lihat buku dan kajian yang pernah dibaca</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#94A3B8] shrink-0" />
                        </button>
                        <button className="w-full flex items-center p-4 border-b border-[#F8FAFC] hover:bg-gray-50 transition-colors text-left">
                            <div className="w-10 h-10 bg-[#FFF1F2] text-[#F43F5E] rounded-full flex items-center justify-center mr-3 shrink-0">
                                <Heart className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[14px] font-extrabold text-[#1E293B]">Favorit Saya</h4>
                                <p className="text-[11px] text-[#64748B]">Koleksi favorit buku dan kajian</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#94A3B8] shrink-0" />
                        </button>
                        <button className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left">
                            <div className="w-10 h-10 bg-[#ECFDF5] text-[#10B981] rounded-full flex items-center justify-center mr-3 shrink-0">
                                <Download className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[14px] font-extrabold text-[#1E293B]">Unduhan Saya</h4>
                                <p className="text-[11px] text-[#64748B]">Konten yang diunduh</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#94A3B8] shrink-0" />
                        </button>
                    </div>
                </div>

                {/* Bantuan & Lainnya Section */}
                <div>
                    <h3 className="text-[13px] font-bold text-[#64748B] px-1 mb-2">Bantuan & Lainnya</h3>
                    <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-[#F1F5F9]">
                        <Link href="/faq" className="w-full flex items-center p-4 border-b border-[#F8FAFC] hover:bg-gray-50 transition-colors text-left block">
                            <div className="w-10 h-10 bg-[#FAF5FF] text-[#A855F7] rounded-full flex items-center justify-center mr-3 shrink-0">
                                <HelpCircle className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[14px] font-extrabold text-[#1E293B]">Pusat Bantuan</h4>
                                <p className="text-[11px] text-[#64748B]">FAQ dan panduan penggunaan</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#94A3B8] shrink-0" />
                        </Link>
                        <button className="w-full flex items-center p-4 border-b border-[#F8FAFC] hover:bg-gray-50 transition-colors text-left">
                            <div className="w-10 h-10 bg-[#F0F9FF] text-[#0EA5E9] rounded-full flex items-center justify-center mr-3 shrink-0">
                                <Info className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[14px] font-extrabold text-[#1E293B]">Tentang Aplikasi</h4>
                                <p className="text-[11px] text-[#64748B]">Versi 1.2.0</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#94A3B8] shrink-0" />
                        </button>
                        <Link href="/refund-policy" className="w-full flex items-center p-4 border-b border-[#F8FAFC] hover:bg-gray-50 transition-colors text-left block">
                            <div className="w-10 h-10 bg-[#FEF2F2] text-[#EF4444] rounded-full flex items-center justify-center mr-3 shrink-0" style={{backgroundColor: '#FFFBEB', color: '#F59E0B'}}>
                                <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[14px] font-extrabold text-[#1E293B]">Refund Policy</h4>
                                <p className="text-[11px] text-[#64748B]">Kebijakan pengembalian dana</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#94A3B8] shrink-0" />
                        </Link>
                        <button 
                            onClick={() => setShowLogoutConfirm(true)}
                            className="w-full flex items-center p-4 hover:bg-red-50 transition-colors text-left"
                        >
                            <div className="w-10 h-10 bg-[#FEF2F2] text-[#EF4444] rounded-full flex items-center justify-center mr-3 shrink-0">
                                <LogOut className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[14px] font-extrabold text-[#EF4444]">Keluar</h4>
                                <p className="text-[11px] text-[#EF4444] opacity-80">Keluar dari akun</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#EF4444] opacity-50 shrink-0" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F1F5F9] z-50">
                <div className="flex justify-around items-center h-[70px] pb-2">
                    {[
                        { id: 'home', label: 'Beranda', icon: Home, route: '/' },
                        { id: 'katalog', label: 'Katalog', icon: LayoutGrid, route: '/katalog' },
                        { id: 'video', label: 'Video Saya', icon: PlaySquare, route: '/videos' },
                        { id: 'rekaman', label: 'Rekaman', icon: Headphones, route: '/audios' },
                        { id: 'akun', label: 'Akun', icon: CircleUserRound, active: true, route: (typeof auth !== 'undefined' && auth?.user) ? '/akun' : '/login' }
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
            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[24px] w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto border-4 border-white shadow-sm shadow-red-100">
                            <LogOut className="w-6 h-6 ml-1" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-[18px] font-extrabold text-[#1E293B] text-center mb-2">Keluar dari Akun?</h3>
                        <p className="text-[13px] text-[#64748B] text-center mb-6 leading-relaxed">
                            Apakah Anda yakin ingin keluar? Sesi Anda akan berakhir dan harus login kembali untuk mengakses fitur premium.
                        </p>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 py-3.5 px-4 rounded-xl font-bold text-[#64748B] bg-[#F8FAFC] border border-[#F1F5F9] hover:bg-gray-100 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => {
                                    setShowLogoutConfirm(false);
                                    router.post('/logout');
                                }}
                                className="flex-1 py-3.5 px-4 rounded-xl font-bold text-white bg-[#EF4444] hover:bg-red-600 shadow-md shadow-red-500/20 transition-colors"
                            >
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
