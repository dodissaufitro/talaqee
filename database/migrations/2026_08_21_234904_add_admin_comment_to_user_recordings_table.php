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
        Schema::table('user_recordings', function (Blueprint $table) {
            $table->text('admin_comment_text')->nullable();
            $table->string('admin_comment_audio_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_recordings', function (Blueprint $table) {
            $table->dropColumn(['admin_comment_text', 'admin_comment_audio_path']);
        });
    }
};
