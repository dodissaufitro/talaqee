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
        Schema::create('user_missions', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('mission_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->unsignedInteger('progress')->default(0);

    $table->boolean('completed')->default(false);

    $table->boolean('reward_claimed')->default(false);

    $table->timestamp('completed_at')->nullable();

    $table->date('mission_date')->nullable();

    $table->timestamps();

    $table->index([
        'user_id',
        'mission_date'
    ]);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_missions');
    }
};
