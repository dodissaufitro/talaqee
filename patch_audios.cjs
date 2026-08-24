const fs = require('fs');

const file = 'C:/laragon/www/talaqee/resources/js/pages/Audios/Index.tsx';
let content = fs.readFileSync(file, 'utf8');

const mobileLayout = `
            {/* MOBILE VIEW (Android) */}
            <div className="block md:hidden bg-white min-h-screen pb-40 font-sans relative">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-white sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <Link href="/katalog" className="w-8 h-8 flex items-center justify-center -ml-2">
                            <ArrowLeft className="w-6 h-6 text-[#5C5AE6]" strokeWidth={2} />
                        </Link>
                        <span className="text-[17px] font-extrabold text-[#1E293B]">
                            Rekaman Audio
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button>
                            <Bookmark className="w-6 h-6 text-[#1E293B]" strokeWidth={2} />
                        </button>
                        <button>
                            <MoreVertical className="w-6 h-6 text-[#1E293B]" strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Hero / Info Card */}
                <div className="px-5 pt-2 pb-6 flex gap-4">
                    {/* Cover */}
                    <div className="w-[120px] h-[170px] shrink-0 rounded-2xl overflow-hidden relative shadow-md">
                        <img src="/images/katalog/book1.png" alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                            <Headphones className="w-3 h-3 text-white" />
                            <span className="text-white text-[9px] font-medium">Audio Kajian</span>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pt-1">
                        <span className="inline-block bg-[#EEF2FF] text-[#5C5AE6] text-[10px] font-bold px-2 py-0.5 rounded-md mb-2">
                            Kajian Islam
                        </span>
                        <h1 className="text-[16px] font-extrabold text-[#1E293B] leading-tight mb-2">
                            Menjadi Hamba yang Bersyukur
                        </h1>
                        <div className="flex items-center gap-1 mb-3">
                            <span className="text-[12px] font-medium text-[#475569]">Ust. Hanan Attaki, Lc</span>
                            <div className="w-3.5 h-3.5 bg-[#5C5AE6] rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full border border-[#94A3B8] flex items-center justify-center">
                                    <div className="w-1 h-1 bg-[#94A3B8] rounded-full"></div>
                                </div>
                                <span className="text-[10px] text-[#64748B]">48:23</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#94A3B8]" />
                                <span className="text-[10px] text-[#64748B]">15 Mei 2024</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Headphones className="w-3 h-3 text-[#94A3B8]" />
                                <span className="text-[10px] text-[#64748B]">12.5K didengar</span>
                            </div>
                        </div>

                        <p className="text-[11px] text-[#64748B] leading-[1.6]">
                            Kajian ini membahas tentang pentingnya bersyukur dalam kehidupan sehari-hari dan bagaimana cara menjadi hamba yang selalu bersyukur atas nikmat Allah.
                        </p>
                    </div>
                </div>

                {/* Player Section */}
                <div className="px-5 mb-8">
                    <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F1F5F9]">
                        {/* Soundwave */}
                        <div className="h-10 w-full flex items-center justify-between gap-0.5 mb-4">
                            {Array.from({length: 40}).map((_, i) => (
                                <div key={i} className={\`w-1 rounded-full \${i < 15 ? 'bg-[#5C5AE6]' : 'bg-[#E2E8F0]'}\`} style={{height: \`\${Math.random() * 80 + 20}%\`}}></div>
                            ))}
                        </div>

                        {/* Timeline */}
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[11px] font-bold text-[#475569]">12:45</span>
                            <span className="text-[11px] font-bold text-[#475569]">48:23</span>
                        </div>
                        <div className="h-1.5 bg-[#E2E8F0] rounded-full relative mb-8">
                            <div className="absolute top-0 left-0 h-full w-[35%] bg-[#5C5AE6] rounded-full"></div>
                            <div className="absolute top-1/2 -translate-y-1/2 left-[35%] w-4 h-4 bg-[#5C5AE6] rounded-full shadow border-2 border-white"></div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between px-2">
                            <button className="bg-[#EEF2FF] text-[#5C5AE6] text-[11px] font-bold px-3 py-1.5 rounded-full">
                                1.0x
                            </button>
                            <button className="text-[#1E293B]">
                                <RotateCcw className="w-6 h-6" />
                            </button>
                            <button className="w-14 h-14 bg-[#5C5AE6] rounded-full flex items-center justify-center shadow-lg shadow-indigo-200">
                                <Pause className="w-6 h-6 text-white" fill="white" />
                            </button>
                            <button className="text-[#1E293B]">
                                <RotateCw className="w-6 h-6" />
                            </button>
                            <button className="flex items-center gap-1.5 bg-gray-50 text-[#64748B] px-3 py-1.5 rounded-full text-[11px] font-bold">
                                <Moon className="w-3.5 h-3.5" /> Timer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions Grid */}
                <div className="px-5 grid grid-cols-4 gap-2 mb-8">
                    <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#F1F5F9] bg-white shadow-sm">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-[10px] font-semibold text-[#475569]">Favorit</span>
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#F1F5F9] bg-white shadow-sm">
                        <Download className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-semibold text-[#475569]">Unduh</span>
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#F1F5F9] bg-white shadow-sm">
                        <Share2 className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-semibold text-[#475569]">Bagikan</span>
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#F1F5F9] bg-white shadow-sm">
                        <ListPlus className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] font-semibold text-[#475569]">Playlist</span>
                    </button>
                </div>

                {/* Daftar Bagian */}
                <div className="px-5 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[16px] font-extrabold text-[#1E293B]">Daftar Bagian</h3>
                        <button className="text-[12px] text-[#5C5AE6] font-bold flex items-center gap-0.5">
                            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="bg-[#F8FAFC] rounded-2xl p-2 space-y-1">
                        {[
                            { id: 1, title: '1. Pendahuluan', desc: 'Pembukaan dan pengantar kajian', time: '05:12', active: true },
                            { id: 2, title: '2. Makna Bersyukur', desc: 'Apa itu syukur dan dalilnya', time: '12:30', active: false },
                            { id: 3, title: '3. Manfaat Bersyukur', desc: 'Keutamaan syukur dalam hidup', time: '14:08', active: false },
                            { id: 4, title: '4. Cara Bersyukur', desc: 'Langkah praktis menjadi pribadi yang bersyukur', time: '11:22', active: false },
                            { id: 5, title: '5. Penutup & Doa', desc: 'Rangkuman dan doa penutup', time: '05:11', active: false },
                        ].map(track => (
                            <div key={track.id} className={\`flex items-center gap-3 p-3 rounded-xl \${track.active ? 'bg-white shadow-sm' : ''}\`}>
                                <div className={\`w-10 h-10 rounded-full flex items-center justify-center shrink-0 \${track.active ? 'bg-[#EEF2FF] text-[#5C5AE6]' : 'bg-white text-[#64748B]'}\`}>
                                    {track.active ? <Play className="w-5 h-5 ml-1" fill="currentColor" /> : <span className="font-bold text-[14px]">{track.id}</span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[13px] font-extrabold text-[#1E293B] mb-0.5">{track.title}</h4>
                                    <p className="text-[11px] text-[#64748B] truncate">{track.desc}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className={\`text-[12px] font-bold \${track.active ? 'text-[#5C5AE6]' : 'text-[#64748B]'}\`}>{track.time}</span>
                                    <button><MoreVertical className="w-5 h-5 text-[#94A3B8]" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rekaman Lainnya */}
                <div className="pb-8">
                    <div className="px-5 flex items-center justify-between mb-4">
                        <h3 className="text-[16px] font-extrabold text-[#1E293B]">Rekaman Lainnya</h3>
                        <button className="text-[12px] text-[#5C5AE6] font-bold flex items-center gap-0.5">
                            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto px-5 pb-4 hide-scrollbar">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-[140px] shrink-0">
                                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-2 border border-[#F1F5F9]">
                                    <img src={\`/images/katalog/book\${i + 2}.png\`} alt="Cover" className="w-full h-full object-cover" />
                                </div>
                                <h4 className="font-bold text-[11px] text-[#1E293B] leading-[1.3] mb-1 line-clamp-2">Sabar dalam Menghadapi Ujian</h4>
                                <p className="text-[9px] font-medium text-[#64748B]">Ust. Abdul Somad, Lc</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mini Player Floating */}
                <div className="fixed bottom-[80px] left-4 right-4 bg-white rounded-2xl p-3 shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[#F1F5F9] flex items-center gap-3 z-50">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <img src="/images/katalog/book1.png" alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-extrabold text-[#1E293B] mb-0.5 truncate">Menjadi Hamba yang Bersyukur</h4>
                        <p className="text-[11px] text-[#64748B] truncate">Ust. Hanan Attaki, Lc</p>
                    </div>
                    <div className="flex items-center gap-4 pr-1 shrink-0">
                        <button><Pause className="w-5 h-5 text-[#1E293B]" fill="currentColor" /></button>
                        <button><SkipForward className="w-5 h-5 text-[#1E293B]" fill="currentColor" /></button>
                    </div>
                </div>

                {/* Bottom Navigation (Replacing Koin with Rekaman) */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F1F5F9] z-50">
                    <div className="flex justify-around items-center h-[70px] pb-2">
                        {[
                            { id: 'home', label: 'Beranda', icon: Home, route: '/' },
                            { id: 'katalog', label: 'Katalog', icon: LayoutGrid, route: '/katalog' },
                            { id: 'rakbuku', label: 'Rak Buku', icon: BookOpen, route: '/buku' },
                            { id: 'rekaman', label: 'Rekaman', icon: Headphones, active: true, route: '/audios' },
                            { id: 'akun', label: 'Akun', icon: CircleUserRound, route: '#' }
                        ].map((item) => (
                            <Link href={item.route} key={item.id} className="flex flex-col items-center justify-center w-[20%] gap-1 relative mt-1">
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
                
                <style dangerouslySetInnerHTML={{__html: \`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                \`}} />
            </div>
`;

// replace \`return (\` with \`return ( <> \${mobileLayout} <div className="hidden md:block ...">\`
let newContent = content.replace(/return \(\s*<div className="min-h-screen/g, 'return (\n        <>\n' + mobileLayout + '\n            {/* DESKTOP VIEW */}\n            <div className="hidden md:block min-h-screen');
newContent = newContent.replace(/<\/div>\s*\);\s*\}/, '</div>\n        </>\n    );\n}');

// Add new imports needed
newContent = newContent.replace(/SkipForward, Repeat, Shuffle, Volume2, ChevronUp/, 'SkipForward, Repeat, Shuffle, Volume2, ChevronUp, ArrowLeft, Bookmark, Heart, Share2, ListPlus, RotateCcw, RotateCw, Moon, LayoutGrid, CircleUserRound, Calendar');

fs.writeFileSync(file, newContent);
console.log('Done');
