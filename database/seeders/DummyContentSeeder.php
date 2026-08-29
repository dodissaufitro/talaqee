<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Book;
use App\Models\Banner;
use App\Models\Video;
use App\Models\UserRecording;
use App\Models\Category;
use App\Models\Author;
use App\Models\User;
use App\Models\Ayah;

class DummyContentSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::first();
        $author = Author::first();
        $user = User::first();
        
        if (!$category) $category = Category::create(['name' => 'Umum', 'slug' => 'umum', 'is_active' => true]);
        if (!$author) $author = Author::create(['name' => 'Penulis Dummy', 'slug' => 'penulis-dummy']);
        
        // 1. Rekomendasi Buku (Popular/Featured) dengan gambar berbeda
        for ($i = 1; $i <= 20; $i++) {
            Book::create([
                'category_id' => $category->id,
                'author_id' => $author->id,
                'title' => "Buku Rekomendasi " . $i,
                'slug' => "buku-rekomendasi-" . $i . "-" . time(),
                'cover' => "https://picsum.photos/seed/buku{$i}/600/800",
                'description' => "Deskripsi buku rekomendasi " . $i,
                'stock' => 10,
                'price' => 50000,
                'is_popular' => true,
                'is_featured' => true,
                'is_active' => true,
            ]);
        }

        // 2. Banners dengan gambar berbeda
        for ($i = 1; $i <= 3; $i++) {
            Banner::create([
                'title' => "Banner Promosi " . $i,
                'image_path' => "https://picsum.photos/seed/banner{$i}/1200/400",
                'link_url' => "#",
                'is_active' => true,
                'sort_order' => $i
            ]);
        }

        // 3. Videos dengan thumbnail/banner berbeda
        for ($i = 1; $i <= 5; $i++) {
            Video::create([
                'category_id' => $category->id,
                'author_id' => $author->id,
                'title' => "Video Edukasi " . $i,
                'slug' => "video-edukasi-" . $i . "-" . time(),
                'description' => "Deskripsi video edukasi " . $i,
                'video_url' => "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                'thumbnail' => "https://picsum.photos/seed/video{$i}/800/450",
                'duration' => rand(120, 600),
                'total_views' => rand(100, 1000),
                'is_active' => true
            ]);
        }

        // 4. Rekaman Alquran (UserRecordings)
        $ayah = Ayah::first(); // Assuming Surah and Ayah are populated. If not, just ignore or fake.
        if ($user && $ayah) {
            for ($i = 1; $i <= 5; $i++) {
                UserRecording::create([
                    'user_id' => $user->id,
                    'ayah_id' => $ayah->id,
                    'file_path' => '/audio/dummy-recording.mp3', // Placeholder
                    'duration' => rand(30, 120),
                    'admin_comment_text' => 'Bagus sekali bacaannya!'
                ]);
            }
        }
    }
}
