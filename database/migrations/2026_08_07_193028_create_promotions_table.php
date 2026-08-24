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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type'); // Diskon Persen, Gratis Ongkir, Flash Sale, etc
            $table->date('start_date');
            $table->date('end_date');
            $table->string('value_text')->nullable(); // 20%, Rp 0, Gratis 1 Buku
            $table->string('status'); // Aktif, Akan Berakhir, Selesai
            $table->integer('reach')->default(0);
            $table->string('color_theme')->default('purple');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
