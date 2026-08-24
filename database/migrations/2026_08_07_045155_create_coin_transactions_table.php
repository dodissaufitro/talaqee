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
        Schema::create('coin_transactions', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->enum('type', [
        'topup',
        'purchase',
        'bonus',
        'refund',
        'expired',
        'adjustment'
    ]);

    $table->unsignedBigInteger('amount');

    $table->unsignedBigInteger('balance_before');

    $table->unsignedBigInteger('balance_after');

    $table->string('reference_type')->nullable();

    $table->unsignedBigInteger('reference_id')->nullable();

    $table->string('description')->nullable();

    $table->string('transaction_number')->unique();

    $table->timestamps();

    $table->index([
        'user_id',
        'type'
    ]);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coin_transactions');
    }
};
