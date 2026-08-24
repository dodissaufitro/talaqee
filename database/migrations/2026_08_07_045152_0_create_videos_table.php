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
        Schema::create('videos', function (Blueprint $table) {
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

    $table->string('thumbnail')->nullable();

    $table->string('video_url');

    $table->integer('duration')->default(0);

    $table->text('description')->nullable();

    $table->unsignedInteger('coin_reward')->default(0);

    $table->unsignedBigInteger('total_views')->default(0);

    $table->decimal('rating', 3, 2)->default(0);

    $table->boolean('is_featured')->default(false);

    $table->boolean('is_active')->default(true);

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
