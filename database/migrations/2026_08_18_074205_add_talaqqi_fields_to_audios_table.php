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
        Schema::table('audios', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('admin_reply_audio_url')->nullable();
            $table->text('admin_reply_text')->nullable();
            $table->string('status')->default('menunggu_balasan'); // menunggu_balasan, sudah_dibalas
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('audios', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'admin_reply_audio_url', 'admin_reply_text', 'status']);
        });
    }
};
