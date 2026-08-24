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
        Schema::create('missions', function (Blueprint $table) {
    $table->id();

    $table->string('title');

    $table->text('description')->nullable();

    $table->enum('type', [
        'login',
        'read',
        'watch',
        'listen',
        'purchase'
    ]);

    $table->unsignedInteger('target')->default(1);

    $table->unsignedInteger('coin_reward')->default(0);

    $table->boolean('is_daily')->default(false);

    $table->boolean('is_active')->default(true);

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('missions');
    }
};
