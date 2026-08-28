<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private function addIndexSafe($table, $columns) {
        try {
            Schema::table($table, function (Blueprint $table_bp) use ($columns) {
                $table_bp->index($columns);
            });
        } catch (\Exception $e) {}
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $this->addIndexSafe('videos', 'total_views');
        $this->addIndexSafe('audios', 'user_id');
        $this->addIndexSafe('user_recordings', 'user_id');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('video_audio_records', function (Blueprint $table) {
            //
        });
    }
};
