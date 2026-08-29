<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VideoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $category = \App\Models\Category::first();
        $author = \App\Models\Author::first();
        
        if (!$category) $category = \App\Models\Category::create(['name' => 'Edukasi Islami', 'slug' => 'edukasi-islami', 'is_active' => true]);
        if (!$author) $author = \App\Models\Author::create(['name' => 'Ustadz Fulan', 'slug' => 'ustadz-fulan']);

        for ($i = 1; $i <= 5; $i++) {
            \App\Models\Video::firstOrCreate(
                ['title' => "Video Kajian " . $i],
                [
                    'category_id' => $category->id,
                    'author_id' => $author->id,
                    'slug' => "video-kajian-" . $i . "-" . time(),
                    'description' => "Deskripsi video kajian " . $i,
                    'video_url' => "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    'thumbnail' => "https://picsum.photos/seed/video{$i}/800/450",
                    'duration' => rand(120, 600),
                    'total_views' => rand(100, 1000),
                    'is_active' => true
                ]
            );
        }
    }
}
