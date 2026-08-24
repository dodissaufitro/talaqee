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
        Schema::create('book_chapters', function (Blueprint $table) {
    $table->id();

    $table->foreignId('book_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->unsignedInteger('chapter_number');

    $table->string('title');

    $table->text('description')->nullable();

    $table->longText('content')->nullable();

    $table->unsignedInteger('page_count')->default(0);

    $table->unsignedInteger('coin_price')->default(10);

    $table->boolean('is_free')->default(false);

    $table->boolean('is_active')->default(true);

    $table->timestamps();

    $table->unique([
        'book_id',
        'chapter_number'
    ]);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_chapters');
    }
};
