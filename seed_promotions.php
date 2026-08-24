<?php
use App\Models\Promotion;

Promotion::truncate();

$promotions = [
    [
        'title' => 'Diskon 20% Semua Buku',
        'description' => 'Dapatkan diskon 20% untuk semua buku tanpa minimal pembelian.',
        'type' => 'Diskon Persen',
        'start_date' => '2024-05-01',
        'end_date' => '2024-05-31',
        'value_text' => '20%',
        'status' => 'Aktif',
        'reach' => 1248,
        'color_theme' => 'purple'
    ],
    [
        'title' => 'Gratis Ongkir',
        'description' => 'Gratis ongkir untuk pembelian minimal Rp 100.000.',
        'type' => 'Gratis Ongkir',
        'start_date' => '2024-05-01',
        'end_date' => '2024-05-15',
        'value_text' => 'Rp 0',
        'status' => 'Aktif',
        'reach' => 856,
        'color_theme' => 'orange'
    ],
    [
        'title' => 'Beli 2 Gratis 1',
        'description' => 'Beli 2 buku apa saja, gratis 1 buku dengan harga termurah.',
        'type' => 'Beli X Gratis Y',
        'start_date' => '2024-05-01',
        'end_date' => '2024-05-31',
        'value_text' => 'Gratis 1 Buku',
        'status' => 'Aktif',
        'reach' => 642,
        'color_theme' => 'green'
    ],
    [
        'title' => 'Flash Sale Up to 50%',
        'description' => 'Diskon besar-besaran untuk buku pilihan, harga mulai dari Rp 10.000!',
        'type' => 'Flash Sale',
        'start_date' => '2024-05-10',
        'end_date' => '2024-05-12',
        'value_text' => 'Up to 50%',
        'status' => 'Akan Berakhir',
        'reach' => 1532,
        'color_theme' => 'blue'
    ],
    [
        'title' => 'Diskon 10% Buku Baru',
        'description' => 'Dapatkan diskon 10% untuk semua buku terbitan terbaru.',
        'type' => 'Diskon Persen',
        'start_date' => '2024-05-20',
        'end_date' => '2024-05-31',
        'value_text' => '10%',
        'status' => 'Akan Berakhir',
        'reach' => 475,
        'color_theme' => 'pink'
    ],
    [
        'title' => 'Clearance Sale',
        'description' => 'Buku pilihan dengan harga spesial, selama persediaan masih ada.',
        'type' => 'Diskon Nominal',
        'start_date' => '2024-04-01',
        'end_date' => '2024-04-30',
        'value_text' => 'Rp 15.000',
        'status' => 'Selesai',
        'reach' => 1026,
        'color_theme' => 'black'
    ]
];

foreach ($promotions as $promo) {
    Promotion::create($promo);
}
echo "Promotions seeded successfully.\n";
