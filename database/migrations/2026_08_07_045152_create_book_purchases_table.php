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
        Schema::create('book_purchases', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('book_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('chapter_id')
        ->constrained('book_chapters')
        ->cascadeOnDelete();

    $table->unsignedInteger('coin_price');

    $table->timestamp('purchased_at')->useCurrent();

    $table->timestamps();

    $table->unique([
        'user_id',
        'chapter_id'
    ]);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_purchases');
    }
};
