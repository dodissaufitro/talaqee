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
        Schema::create('subscriptions', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->string('plan_name');

    $table->decimal('price', 15, 2);

    $table->dateTime('started_at');

    $table->dateTime('expired_at');

    $table->enum('status', [
        'active',
        'expired',
        'cancelled'
    ])->default('active');

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
        Schema::dropIfExists('subscriptions');
    }
};
