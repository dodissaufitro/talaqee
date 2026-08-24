<?php
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

// Hapus cache permissions
app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

// Buat Roles
$superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);
$adminRole = Role::firstOrCreate(['name' => 'Admin']);
$customerRole = Role::firstOrCreate(['name' => 'Customer']);

// Buat Permissions
$permissions = [
    'kelola pengguna',
    'kelola penjualan',
    'kelola buku',
    'kelola transaksi',
];

foreach ($permissions as $perm) {
    Permission::firstOrCreate(['name' => $perm]);
}

$superAdminRole->syncPermissions(Permission::all());
$adminRole->syncPermissions(['kelola penjualan', 'kelola buku', 'kelola transaksi']);

// User Super Admin
$superAdmin = User::firstOrCreate(
    ['email' => 'admin@bookstore.com'],
    [
        'name' => 'Super Admin',
        'password' => bcrypt('password'),
        'status' => 'Aktif',
    ]
);
$superAdmin->assignRole('Super Admin');

// User Admin
$admin = User::firstOrCreate(
    ['email' => 'kasir@bookstore.com'],
    [
        'name' => 'Kasir Toko',
        'password' => bcrypt('password'),
        'status' => 'Aktif',
    ]
);
$admin->assignRole('Admin');

// User Customer
$customer = User::firstOrCreate(
    ['email' => 'budi@gmail.com'],
    [
        'name' => 'Budi Santoso',
        'password' => bcrypt('password'),
        'status' => 'Aktif',
    ]
);
$customer->assignRole('Customer');

echo "Users and roles seeded successfully.\n";
