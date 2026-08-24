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
        Schema::create('coin_packages', function (Blueprint $table) {
    $table->id();

    $table->string('name');

    $table->unsignedInteger('coin_amount');

    $table->decimal('price', 15, 2);

    $table->unsignedInteger('bonus_coin')->default(0);

    $table->boolean('is_popular')->default(false);

    $table->boolean('is_active')->default(true);

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coin_packages');
    }
};
