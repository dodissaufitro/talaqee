<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('coin_package_id')
        ->nullable()
        ->constrained()
        ->nullOnDelete();

    $table->string('invoice_number')->unique();

    $table->decimal('amount', 15, 2);

    $table->string('payment_method')->nullable();

    $table->string('payment_reference')->nullable();

    $table->enum('status', [
        'pending',
        'paid',
        'failed',
        'expired',
        'cancelled'
    ])->default('pending');

    $table->timestamp('paid_at')->nullable();

    $table->timestamps();

    $table->index([
        'user_id',
        'status'
    ]);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
