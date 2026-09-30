<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CoinPackage;

class CoinPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Paket 50 Koin',
                'coin_amount' => 50,
                'price' => 2500,
                'bonus_coin' => 0,
                'is_popular' => false,
                'badge_label' => null,
                'badge_color' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Paket 100 Koin',
                'coin_amount' => 100,
                'price' => 5000,
                'bonus_coin' => 0,
                'is_popular' => false,
                'badge_label' => null,
                'badge_color' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Paket 250 Koin',
                'coin_amount' => 250,
                'price' => 10000,
                'bonus_coin' => 0,
                'is_popular' => true,
                'badge_label' => 'Popular',
                'badge_color' => 'emerald',
                'is_active' => true,
            ],
            [
                'name' => 'Paket 500 Koin',
                'coin_amount' => 500,
                'price' => 20000,
                'bonus_coin' => 0,
                'is_popular' => false,
                'badge_label' => null,
                'badge_color' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Paket 1.000 Koin',
                'coin_amount' => 1000,
                'price' => 40000,
                'bonus_coin' => 0,
                'is_popular' => true,
                'badge_label' => 'Best Value',
                'badge_color' => 'amber',
                'is_active' => true,
            ],
            [
                'name' => 'Paket 5.000 Koin',
                'coin_amount' => 5000,
                'price' => 200000,
                'bonus_coin' => 0,
                'is_popular' => false,
                'badge_label' => null,
                'badge_color' => null,
                'is_active' => true,
            ],
        ];

        foreach ($packages as $package) {
            CoinPackage::firstOrCreate(
                ['coin_amount' => $package['coin_amount'], 'price' => $package['price']],
                $package
            );
        }
    }
}
