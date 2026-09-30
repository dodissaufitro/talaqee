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
        Schema::table('coin_packages', function (Blueprint $table) {
            $table->string('badge_label')->nullable()->after('is_popular');
            $table->string('badge_color')->nullable()->default('amber')->after('badge_label');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coin_packages', function (Blueprint $table) {
            $table->dropColumn(['badge_label', 'badge_color']);
        });
    }
};
