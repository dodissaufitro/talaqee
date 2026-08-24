<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\NavigationItem;

class NavigationItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['name' => 'Dashboard', 'icon' => 'LayoutDashboard', 'route' => 'admin.dashboard'],
            ['name' => 'Penjualan', 'icon' => 'ShoppingCart', 'route' => null],
            ['name' => 'Buku', 'icon' => 'Book', 'route' => null],
            ['name' => 'Kategori', 'icon' => 'Grid', 'route' => null],
            ['name' => 'Pelanggan', 'icon' => 'Users', 'route' => null],
            ['name' => 'Transaksi', 'icon' => 'CreditCard', 'route' => null],
            ['name' => 'Laporan', 'icon' => 'FileText', 'route' => null],
            ['name' => 'Stok', 'icon' => 'Box', 'route' => null],
            ['name' => 'Promosi', 'icon' => 'Megaphone', 'route' => null],
            ['name' => 'Pengaturan', 'icon' => 'Settings', 'route' => null],
        ];

        foreach ($items as $index => $item) {
            NavigationItem::updateOrCreate(
                ['name' => $item['name']],
                [
                    'icon' => $item['icon'],
                    'route' => $item['route'],
                    'order' => $index + 1,
                    'is_active' => true,
                ]
            );
        }
    }
}
