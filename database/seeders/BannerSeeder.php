<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Banner::create([
            'title' => 'Temukan Buku<br/><span class="text-blue-600">Terbaik Untuk</span><br/><span class="text-blue-600">Setiap Cerita</span>',
            'subtitle' => 'Jelajahi ribuan koleksi buku dari berbagai genre. Baca, belajar, dan temukan inspirasi setiap hari.',
            'button_text' => 'Cari Buku',
            'image_path' => 'banners/banner_promo_buku.jpg',
            'background_color' => 'bg-[#f0f6ff]',
            'link_url' => '/katalog',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        \App\Models\Banner::create([
            'title' => 'Tingkatkan<br/><span class="text-blue-600">Ilmu Agama</span><br/><span class="text-blue-600">Bersama Ustadz</span>',
            'subtitle' => 'Saksikan berbagai kajian rutin pilihan dan rekaman video eksklusif untuk menemani waktu luang Anda.',
            'button_text' => 'Lihat Video',
            'image_path' => 'banners/banner_kajian_rutin.jpg',
            'background_color' => 'bg-[#fff5f0]',
            'link_url' => '/videos',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        \App\Models\Banner::create([
            'title' => 'Dengarkan<br/><span class="text-blue-600">Audio Buku</span><br/><span class="text-blue-600">Islam Terbaik</span>',
            'subtitle' => 'Dengarkan bacaan buku Islami favorit Anda kapan saja dan di mana saja. Inspirasi dalam genggaman.',
            'button_text' => 'Dengarkan',
            'image_path' => 'banners/banner_koleksi_audio.jpg',
            'background_color' => 'bg-[#f0fff4]',
            'link_url' => '/audios',
            'sort_order' => 3,
            'is_active' => true,
        ]);
    }
}