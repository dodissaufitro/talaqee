<?php
use App\Models\Category;
use App\Models\Author;
use App\Models\Book;
use Illuminate\Support\Str;

$categoriesData = [
    ['name' => 'Pengembangan Diri', 'slug' => 'pengembangan-diri'],
    ['name' => 'Fiksi', 'slug' => 'fiksi'],
    ['name' => 'Sejarah', 'slug' => 'sejarah'],
    ['name' => 'Keuangan', 'slug' => 'keuangan'],
];

foreach ($categoriesData as $c) {
    Category::firstOrCreate(['slug' => $c['slug']], $c);
}

$authorsData = [
    'James Clear', 'Leila S. Chudori', 'Yuval Noah Harari', 'Henry Manampiring', 'Ahmad Fuadi', 'Robert T. Kiyosaki', 'Tere Liye'
];

foreach ($authorsData as $a) {
    Author::firstOrCreate(['name' => $a], ['slug' => Str::slug($a)]);
}

$booksData = [
    ['title' => 'Atomic Habits', 'isbn' => '978-602-06-3318-8', 'price' => 108000, 'stock' => 45, 'author' => 'James Clear', 'category' => 'pengembangan-diri'],
    ['title' => 'Laut Bercerita', 'isbn' => '978-979-91-0956-7', 'price' => 89000, 'stock' => 32, 'author' => 'Leila S. Chudori', 'category' => 'fiksi'],
    ['title' => 'Sapiens', 'isbn' => '978-602-06-6390-6', 'price' => 120000, 'stock' => 28, 'author' => 'Yuval Noah Harari', 'category' => 'sejarah'],
    ['title' => 'Filosofi Teras', 'isbn' => '978-602-5721-68-0', 'price' => 89000, 'stock' => 15, 'author' => 'Henry Manampiring', 'category' => 'pengembangan-diri'],
    ['title' => 'Negeri 5 Menara', 'isbn' => '978-979-22-4860-1', 'price' => 95000, 'stock' => 0, 'author' => 'Ahmad Fuadi', 'category' => 'fiksi'],
    ['title' => 'Rich Dad Poor Dad', 'isbn' => '978-602-455-698-6', 'price' => 115000, 'stock' => 22, 'author' => 'Robert T. Kiyosaki', 'category' => 'keuangan'],
    ['title' => 'Bumi', 'isbn' => '978-623-346-058-9', 'price' => 89000, 'stock' => 18, 'author' => 'Tere Liye', 'category' => 'fiksi'],
];

foreach ($booksData as $b) {
    $cat = Category::where('slug', $b['category'])->first();
    $aut = Author::where('name', $b['author'])->first();
    
    Book::updateOrCreate(
        ['isbn' => $b['isbn']],
        [
            'title' => $b['title'],
            'slug' => Str::slug($b['title']),
            'price' => $b['price'],
            'stock' => $b['stock'],
            'category_id' => $cat->id,
            'author_id' => $aut->id,
            'is_active' => true,
        ]
    );
}
echo "Books seeded successfully.\n";
