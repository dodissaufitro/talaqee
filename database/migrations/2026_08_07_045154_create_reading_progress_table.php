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
        Schema::create('reading_progress', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('book_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('chapter_id')
        ->nullable()
        ->constrained('book_chapters')
        ->nullOnDelete();

    $table->unsignedInteger('current_page')->default(0);

    $table->unsignedInteger('total_page')->default(0);

    $table->unsignedTinyInteger('progress_percent')->default(0);

    $table->boolean('completed')->default(false);

    $table->timestamp('last_read_at')->nullable();

    $table->timestamps();

    $table->unique([
        'user_id',
        'book_id'
    ]);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reading_progress');
    }
};
