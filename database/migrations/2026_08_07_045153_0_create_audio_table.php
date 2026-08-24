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
       Schema::create('audios', function (Blueprint $table) {
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

    $table->string('audio_url');

    $table->integer('duration')->default(0);

    $table->text('description')->nullable();

    $table->unsignedBigInteger('total_plays')->default(0);

    $table->boolean('is_active')->default(true);

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audio');
    }
};
