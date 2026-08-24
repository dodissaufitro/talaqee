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
       Schema::create('playlist_items', function (Blueprint $table) {
    $table->id();

    $table->foreignId('playlist_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->enum('content_type', [
        'video',
        'audio'
    ]);

    $table->unsignedBigInteger('content_id');

    $table->unsignedInteger('sort_order')->default(0);

    $table->timestamps();

    $table->unique([
        'playlist_id',
        'content_type',
        'content_id'
    ]);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('playlist_items');
    }
};
