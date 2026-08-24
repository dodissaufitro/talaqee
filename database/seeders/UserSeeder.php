<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Avoid inserting duplicates
        if (!User::where('email', 'admin@talaqee.com')->exists()) {
            $admin = User::create([
                'name' => 'Super Admin',
                'email' => 'admin@talaqee.com',
                'password' => Hash::make('password'),
            ]);
            // Assign role if Spatie Permission is configured
            if (class_exists(\Spatie\Permission\Models\Role::class)) {
                $admin->assignRole('super_admin');
            }
        }

        if (!User::where('email', 'user@talaqee.com')->exists()) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'user@talaqee.com',
                'password' => Hash::make('password'),
            ]);
            if (class_exists(\Spatie\Permission\Models\Role::class)) {
                $user->assignRole('user');
            }
        }
    }
}
