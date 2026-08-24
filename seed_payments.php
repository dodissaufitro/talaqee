<?php
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Str;

if (Payment::count() === 0) {
    $users = User::take(5)->get();
    if ($users->isEmpty()) {
        User::factory(5)->create();
        $users = User::take(5)->get();
    }
    
    $amounts = [90000, 120000, 150000, 175000, 235000, 280000, 325000];
    $methods = ['Transfer Bank', 'QRIS', 'E-Wallet', 'Tunai'];
    $statuses = ['paid', 'paid', 'paid', 'pending', 'cancelled'];
    
    foreach (range(1, 10) as $i) {
        Payment::create([
            'user_id' => $users->random()->id,
            'invoice_number' => 'TRX-' . date('Ymd') . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
            'amount' => $amounts[array_rand($amounts)],
            'payment_method' => $methods[array_rand($methods)],
            'status' => $statuses[array_rand($statuses)],
            'created_at' => now()->subDays(rand(0, 5))->subHours(rand(0, 23)),
        ]);
    }
    echo "Generated 10 dummy payments.\n";
} else {
    echo "Payments already exist.\n";
}
