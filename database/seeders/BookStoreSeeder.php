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
        // Prevent duplication if already seeded
        if (Category::count() > 0) return;

        $categories = [
            ['name' => 'Fiksi', 'icon' => 'BookOpen'],
            ['name' => 'Non-Fiksi', 'icon' => 'FileText'],
            ['name' => 'Pendidikan', 'icon' => 'GraduationCap'],
            ['name' => 'Bisnis & Ekonomi', 'icon' => 'BarChart'],
            ['name' => 'Anak-anak', 'icon' => 'Smile'],
            ['name' => 'Komik & Manga', 'icon' => 'MessageCircle'],
            ['name' => 'Agama & Spiritualitas', 'icon' => 'Book'],
            ['name' => 'Sains & Teknologi', 'icon' => 'Atom'],
        ];

        $categoryModels = [];
        foreach ($categories as $cat) {
            $categoryModels[$cat['name']] = Category::create([
                'name' => $cat['name'],
                'slug' => Str::slug($cat['name']),
                'icon' => $cat['icon']
            ]);
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

            Book::create([
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'author_id' => $author->id,
                'category_id' => $categoryModels[$data['cat']]->id,
                'rating' => $data['rating'],
                'total_reviews' => $data['reviews'],
                'total_coin' => $data['price'], // We use total_coin to represent the price
                'is_popular' => true,
                'cover' => '/images/books/' . Str::slug($data['title']) . '.jpg' // Placeholder for image paths
            ]);
        }
    }
}
