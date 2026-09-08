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
        Schema::create('icons', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Nama ikon (misal: 'Book', 'Bookmark', 'Tag')
            $table->string('label')->nullable(); // Label deskriptif (misal: 'Buku', 'Penanda Buku')
            $table->string('category')->nullable()->default('general'); // Pengelompokan kategori ikon
            $table->text('svg')->nullable(); // Custom SVG code jika diperlukan
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('icons');
    }
};
