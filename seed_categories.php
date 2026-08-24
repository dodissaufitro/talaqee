<?php
use App\Models\Category;
use Illuminate\Support\Str;

$categoriesData = [
    [
        'name' => 'Fiksi',
        'slug' => 'fiksi',
        'description' => 'Buku fiksi dan novel dari berbagai penulis.',
        'icon' => 'BookOpen',
        'color' => 'bg-indigo-50 text-indigo-600',
        'is_active' => true,
    ],
    [
        'name' => 'Non-Fiksi',
        'slug' => 'non-fiksi',
        'description' => 'Buku non-fiksi, motivasi, biografi, dan lainnya.',
        'icon' => 'GraduationCap',
        'color' => 'bg-emerald-50 text-emerald-600',
        'is_active' => true,
    ],
    [
        'name' => 'Sejarah',
        'slug' => 'sejarah',
        'description' => 'Buku sejarah dunia, nasional, dan tokoh.',
        'icon' => 'Landmark',
        'color' => 'bg-amber-50 text-amber-600',
        'is_active' => true,
    ],
    [
        'name' => 'Pengembangan Diri',
        'slug' => 'pengembangan-diri',
        'description' => 'Buku self improvement dan pengembangan diri.',
        'icon' => 'Lightbulb',
        'color' => 'bg-pink-50 text-pink-600',
        'is_active' => true,
    ],
    [
        'name' => 'Bisnis & Keuangan',
        'slug' => 'bisnis-keuangan',
        'description' => 'Buku bisnis, investasi, manajemen, dan keuangan.',
        'icon' => 'TrendingUp',
        'color' => 'bg-blue-50 text-blue-600',
        'is_active' => true,
    ],
    [
        'name' => 'Sains & Teknologi',
        'slug' => 'sains-teknologi',
        'description' => 'Buku sains, teknologi, dan pengetahuan umum.',
        'icon' => 'Atom',
        'color' => 'bg-purple-50 text-purple-600',
        'is_active' => true,
    ],
    [
        'name' => 'Anak-anak',
        'slug' => 'anak-anak',
        'description' => 'Buku cerita anak, pendidikan, dan aktivitas.',
        'icon' => 'Baby',
        'color' => 'bg-orange-50 text-orange-600',
        'is_active' => true,
    ],
    [
        'name' => 'Lainnya',
        'slug' => 'lainnya',
        'description' => 'Kategori lainnya di luar klasifikasi utama.',
        'icon' => 'MoreHorizontal',
        'color' => 'bg-gray-100 text-gray-500',
        'is_active' => false, // Set to nonaktif to match screenshot
    ],
];

foreach ($categoriesData as $c) {
    Category::updateOrCreate(
        ['slug' => $c['slug']],
        $c
    );
}
echo "Categories seeded successfully.\n";
