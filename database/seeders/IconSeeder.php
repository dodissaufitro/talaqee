<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Icon;

class IconSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $icons = [
            // Edukasi & Bacaan
            ['name' => 'Book', 'label' => 'Buku', 'category' => 'Edukasi'],
            ['name' => 'BookOpen', 'label' => 'Buku Terbuka', 'category' => 'Edukasi'],
            ['name' => 'Bookmark', 'label' => 'Penanda Buku', 'category' => 'Edukasi'],
            ['name' => 'Library', 'label' => 'Perpustakaan', 'category' => 'Edukasi'],
            ['name' => 'GraduationCap', 'label' => 'Topi Toga', 'category' => 'Edukasi'],
            ['name' => 'FileText', 'label' => 'Dokumen Teks', 'category' => 'Edukasi'],
            ['name' => 'Feather', 'label' => 'Bulu Pena', 'category' => 'Edukasi'],
            ['name' => 'Compass', 'label' => 'Kompas', 'category' => 'Edukasi'],

            // Agama & Spiritualitas
            ['name' => 'Moon', 'label' => 'Bulan Sabit', 'category' => 'Agama'],
            ['name' => 'Sun', 'label' => 'Matahari', 'category' => 'Agama'],
            ['name' => 'Heart', 'label' => 'Hati', 'category' => 'Agama'],
            ['name' => 'ShieldCheck', 'label' => 'Perisai Aman', 'category' => 'Agama'],

            // Media & Audio/Video
            ['name' => 'Mic', 'label' => 'Mikrofon', 'category' => 'Media'],
            ['name' => 'Headphones', 'label' => 'Headphone', 'category' => 'Media'],
            ['name' => 'Music', 'label' => 'Musik', 'category' => 'Media'],
            ['name' => 'Volume2', 'label' => 'Suara/Volume', 'category' => 'Media'],
            ['name' => 'Video', 'label' => 'Video', 'category' => 'Media'],
            ['name' => 'PlaySquare', 'label' => 'Pemutar Video', 'category' => 'Media'],
            ['name' => 'Play', 'label' => 'Putar', 'category' => 'Media'],

            // Kategori Umum & Antarmuka
            ['name' => 'Tag', 'label' => 'Label/Tag', 'category' => 'Umum'],
            ['name' => 'Grid', 'label' => 'Grid Kotak', 'category' => 'Umum'],
            ['name' => 'LayoutGrid', 'label' => 'Tata Letak Grid', 'category' => 'Umum'],
            ['name' => 'LayoutDashboard', 'label' => 'Dashboard', 'category' => 'Umum'],
            ['name' => 'Star', 'label' => 'Bintang', 'category' => 'Umum'],
            ['name' => 'Sparkles', 'label' => 'Kilauan', 'category' => 'Umum'],
            ['name' => 'Zap', 'label' => 'Petir/Cepat', 'category' => 'Umum'],
            ['name' => 'Globe', 'label' => 'Dunia/Global', 'category' => 'Umum'],
            ['name' => 'Search', 'label' => 'Pencarian', 'category' => 'Umum'],
            ['name' => 'Settings', 'label' => 'Pengaturan', 'category' => 'Umum'],
            ['name' => 'Bell', 'label' => 'Lonceng Notifikasi', 'category' => 'Umum'],
            ['name' => 'HelpCircle', 'label' => 'Bantuan / FAQ', 'category' => 'Umum'],

            // Bisnis & Transaksi
            ['name' => 'ShoppingCart', 'label' => 'Keranjang Belanja', 'category' => 'Bisnis'],
            ['name' => 'CreditCard', 'label' => 'Kartu Pembayaran', 'category' => 'Bisnis'],
            ['name' => 'Wallet', 'label' => 'Dompet', 'category' => 'Bisnis'],
            ['name' => 'Coins', 'label' => 'Koin Emas', 'category' => 'Bisnis'],
            ['name' => 'TrendingUp', 'label' => 'Grafik Naik', 'category' => 'Bisnis'],
            ['name' => 'Box', 'label' => 'Kotak Barang', 'category' => 'Bisnis'],
            ['name' => 'Megaphone', 'label' => 'Promosi/Megafon', 'category' => 'Bisnis'],

            // Pengguna & Interaksi
            ['name' => 'Users', 'label' => 'Grup Pengguna', 'category' => 'Pengguna'],
            ['name' => 'UserCheck', 'label' => 'Pengguna Terverifikasi', 'category' => 'Pengguna'],
            ['name' => 'MessageCircle', 'label' => 'Pesan/Obrolan', 'category' => 'Pengguna'],
        ];

        foreach ($icons as $item) {
            Icon::updateOrCreate(
                ['name' => $item['name']],
                [
                    'label' => $item['label'],
                    'category' => $item['category'],
                    'is_active' => true,
                ]
            );
        }
    }
}
