<?php
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

$customersData = [
    ['name' => 'Siti Nurhaliza', 'email' => 'siti.nurhaliza@email.com', 'phone' => '0812-3456-7890', 'city' => 'Jakarta', 'status' => 'Aktif', 'joined' => '2024-01-12', 'tx_count' => 18, 'total' => 2350000],
    ['name' => 'Budi Santoso', 'email' => 'budi.santoso@email.com', 'phone' => '0813-2345-6789', 'city' => 'Bandung', 'status' => 'Aktif', 'joined' => '2024-02-18', 'tx_count' => 12, 'total' => 1850000],
    ['name' => 'Dewi Lestari', 'email' => 'dewi.lestari@email.com', 'phone' => '0821-1234-5678', 'city' => 'Surabaya', 'status' => 'Loyal', 'joined' => '2024-03-01', 'tx_count' => 25, 'total' => 3750000],
    ['name' => 'Agus Setiawan', 'email' => 'agus.setiawan@email.com', 'phone' => '0811-9876-5432', 'city' => 'Yogyakarta', 'status' => 'Aktif', 'joined' => '2024-03-10', 'tx_count' => 8, 'total' => 950000],
    ['name' => 'Rina Marlina', 'email' => 'rina.marlina@email.com', 'phone' => '0857-1111-2222', 'city' => 'Semarang', 'status' => 'Aktif', 'joined' => '2024-03-22', 'tx_count' => 16, 'total' => 2100000],
    ['name' => 'Hendra Wijaya', 'email' => 'hendra.wijaya@email.com', 'phone' => '0812-7777-8888', 'city' => 'Medan', 'status' => 'Tidak Aktif', 'joined' => '2024-04-05', 'tx_count' => 6, 'total' => 720000],
    ['name' => 'Maya Sari', 'email' => 'maya.sari@email.com', 'phone' => '0896-3333-4444', 'city' => 'Makassar', 'status' => 'Aktif', 'joined' => '2024-04-11', 'tx_count' => 11, 'total' => 1400000],
    ['name' => 'Andi Rahman', 'email' => 'andi.rahman@email.com', 'phone' => '0815-5555-6666', 'city' => 'Denpasar', 'status' => 'Tidak Aktif', 'joined' => '2024-04-20', 'tx_count' => 4, 'total' => 560000],
];

foreach ($customersData as $c) {
    $user = User::updateOrCreate(
        ['email' => $c['email']],
        [
            'name' => $c['name'],
            'phone' => $c['phone'],
            'city' => $c['city'],
            'status' => $c['status'],
            'password' => Hash::make('password'),
            'created_at' => $c['joined'],
        ]
    );

    // clear old payments for exact count
    Payment::where('user_id', $user->id)->delete();

    // Create tx_count payments whose sum equals total
    $avg = intval($c['total'] / $c['tx_count']);
    for ($i = 0; $i < $c['tx_count']; $i++) {
        $amt = ($i === $c['tx_count'] - 1) ? ($c['total'] - ($avg * ($c['tx_count'] - 1))) : $avg;
        Payment::create([
            'user_id' => $user->id,
            'amount' => $amt,
            'status' => 'paid',
            'invoice_number' => 'INV-' . strtoupper(Str::random(6)),
            'payment_method' => 'bank_transfer',
        ]);
    }
}
echo "Customers and Payments seeded successfully.\n";
