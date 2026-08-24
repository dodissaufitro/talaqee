<?php
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Carbon;

$transactionsData = [
    ['inv' => 'INV-20240531-001', 'date' => '2024-05-31 14:32:00', 'name' => 'Siti Nurhaliza', 'items' => 3, 'total' => 235000, 'method' => 'Transfer Bank BCA', 'status' => 'paid'],
    ['inv' => 'INV-20240531-002', 'date' => '2024-05-31 13:15:00', 'name' => 'Budi Santoso', 'items' => 2, 'total' => 150000, 'method' => 'QRIS', 'status' => 'paid'],
    ['inv' => 'INV-20240531-003', 'date' => '2024-05-31 11:08:00', 'name' => 'Dewi Lestari', 'items' => 4, 'total' => 325000, 'method' => 'E-Wallet OVO', 'status' => 'paid'],
    ['inv' => 'INV-20240530-001', 'date' => '2024-05-30 16:45:00', 'name' => 'Agus Setiawan', 'items' => 1, 'total' => 120000, 'method' => 'Tunai', 'status' => 'paid'],
    ['inv' => 'INV-20240530-002', 'date' => '2024-05-30 15:22:00', 'name' => 'Rina Marlina', 'items' => 2, 'total' => 175000, 'method' => 'Transfer Bank Mandiri', 'status' => 'pending'],
    ['inv' => 'INV-20240530-003', 'date' => '2024-05-30 10:30:00', 'name' => 'Hendra Wijaya', 'items' => 5, 'total' => 280000, 'method' => 'QRIS', 'status' => 'cancelled'],
    ['inv' => 'INV-20240529-001', 'date' => '2024-05-29 17:05:00', 'name' => 'Maya Sari', 'items' => 2, 'total' => 90000, 'method' => 'E-Wallet DANA', 'status' => 'paid'],
    ['inv' => 'INV-20240529-002', 'date' => '2024-05-29 14:20:00', 'name' => 'Andi Rahman', 'items' => 1, 'total' => 75000, 'method' => 'Tunai', 'status' => 'paid'],
];

foreach ($transactionsData as $t) {
    $user = User::where('name', $t['name'])->first();
    if($user) {
        Payment::updateOrCreate(
            ['invoice_number' => $t['inv']],
            [
                'user_id' => $user->id,
                'amount' => $t['total'],
                'items_count' => $t['items'],
                'payment_method' => $t['method'],
                'status' => $t['status'],
                'created_at' => Carbon::parse($t['date']),
                'updated_at' => Carbon::parse($t['date']),
            ]
        );
    }
}
echo "Transactions seeded successfully.\n";
