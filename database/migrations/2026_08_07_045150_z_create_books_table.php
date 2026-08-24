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
        Schema::create('books', function (Blueprint $table) {
    $table->id();

    $table->foreignId('category_id')
        ->nullable()
        ->constrained()
        ->nullOnDelete();

    $table->foreignId('author_id')
        ->nullable()
        ->constrained()
        ->nullOnDelete();

    $table->string('title');
    $table->string('slug')->unique();

    $table->string('cover')->nullable();

    $table->text('description')->nullable();

    $table->integer('total_chapters')->default(0);

    $table->unsignedInteger('coin_per_chapter')->default(10);

    $table->unsignedInteger('total_coin')->default(0);

    $table->decimal('rating', 3, 2)->default(0);

    $table->unsignedInteger('total_reviews')->default(0);

    $table->unsignedBigInteger('total_reads')->default(0);

    $table->boolean('is_free')->default(false);

    $table->boolean('is_featured')->default(false);

    $table->boolean('is_popular')->default(false);

    $table->boolean('is_active')->default(true);

    $table->timestamps();

    $table->index('category_id');
    $table->index('author_id');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
