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
        Schema::create('audio_progress', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('audio_id')
        ->constrained('audios')
        ->cascadeOnDelete();

    $table->integer('current_position')->default(0);

    $table->unsignedTinyInteger('progress_percent')->default(0);

    $table->boolean('completed')->default(false);

    $table->timestamp('completed_at')->nullable();

    $table->timestamps();

    $table->unique([
        'user_id',
        'audio_id'
    ]);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audio_progress');
    }
};
