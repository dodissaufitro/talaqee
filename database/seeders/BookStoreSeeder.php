<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Author;
use App\Models\Book;
use Illuminate\Support\Str;

class BookStoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Fiksi', 'icon' => 'Feather'],
            ['name' => 'Non-Fiksi', 'icon' => 'Bookmark'],
            ['name' => 'Pendidikan', 'icon' => 'Library'],
            ['name' => 'Bisnis & Ekonomi', 'icon' => 'Globe'],
            ['name' => 'Anak-anak', 'icon' => 'Star'],
            ['name' => 'Komik & Manga', 'icon' => 'Zap'],
            ['name' => 'Agama & Spiritualitas', 'icon' => 'Moon'],
            ['name' => 'Sains & Teknologi', 'icon' => 'Compass'],
        ];

        $categoryModels = [];
        foreach ($categories as $cat) {
            $categoryModels[$cat['name']] = Category::firstOrCreate(
                ['name' => $cat['name']],
                [
                    'slug' => Str::slug($cat['name']),
                    'icon' => $cat['icon']
                ]
            );
        }

        $booksData = [
            ['title' => 'Laut Bercerita', 'author' => 'Leila S. Chudori', 'price' => 89000, 'rating' => 4.8, 'reviews' => 1245, 'cat' => 'Fiksi'],
            ['title' => 'Atomic Habits', 'author' => 'James Clear', 'price' => 98000, 'rating' => 4.9, 'reviews' => 2531, 'cat' => 'Non-Fiksi'],
            ['title' => 'Bumi Manusia', 'author' => 'Pramoedya A. Toer', 'price' => 85000, 'rating' => 4.9, 'reviews' => 1127, 'cat' => 'Fiksi'],
            ['title' => 'Rich Dad Poor Dad', 'author' => 'Robert T. Kiyosaki', 'price' => 95000, 'rating' => 4.7, 'reviews' => 2931, 'cat' => 'Bisnis & Ekonomi'],
            ['title' => 'Seni Bersikap Bodo Amat', 'author' => 'Mark Manson', 'price' => 75000, 'rating' => 4.6, 'reviews' => 2112, 'cat' => 'Non-Fiksi'],
            ['title' => 'The Psychology of Money', 'author' => 'Morgan Housel', 'price' => 90000, 'rating' => 4.8, 'reviews' => 1654, 'cat' => 'Bisnis & Ekonomi'],
            ['title' => 'Laskar Pelangi', 'author' => 'Andrea Hirata', 'price' => 79000, 'rating' => 4.9, 'reviews' => 1089, 'cat' => 'Fiksi'],
            ['title' => 'Ikigai', 'author' => 'Héctor García', 'price' => 72000, 'rating' => 4.7, 'reviews' => 1473, 'cat' => 'Non-Fiksi'],
        ];

        foreach ($booksData as $data) {
            $author = Author::firstOrCreate([
                'name' => $data['author'],
                'slug' => Str::slug($data['author'])
            ]);

            Book::firstOrCreate(
                ['title' => $data['title']],
                [
                    'slug' => Str::slug($data['title']),
                    'author_id' => $author->id,
                    'category_id' => $categoryModels[$data['cat']]->id,
                    'rating' => $data['rating'],
                    'total_reviews' => $data['reviews'],
                    'total_coin' => $data['price'], // We use total_coin to represent the price
                    'is_popular' => true,
                    'cover' => 'https://picsum.photos/seed/' . Str::slug($data['title']) . '/600/800'
                ]
            );
        }
    }
}
