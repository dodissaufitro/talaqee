<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private function addIndexSafe($table, $columns, $name = null) {
        try {
            Schema::table($table, function (Blueprint $table_bp) use ($columns, $name) {
                if ($name) {
                    $table_bp->index($columns, $name);
                } else {
                    $table_bp->index($columns);
                }
            });
        } catch (\Exception $e) {
            // Index likely already exists
        }
    }

    private function dropIndexSafe($table, $columns) {
        try {
            Schema::table($table, function (Blueprint $table_bp) use ($columns) {
                $table_bp->dropIndex($columns);
            });
        } catch (\Exception $e) {
            // Index doesn't exist
        }
    }

    public function up(): void
    {
        $this->addIndexSafe('books', ['created_at'], 'books_created_at_idx');
        
        $this->addIndexSafe('videos', ['created_at'], 'videos_created_at_idx');
        
        $this->addIndexSafe('audios', ['created_at'], 'audios_created_at_idx');
        
        $this->addIndexSafe('reading_progress', ['user_id', 'book_id'], 'rp_user_book_idx');
        $this->addIndexSafe('reading_progress', ['last_read_at'], 'rp_last_read_idx');
        
        $this->addIndexSafe('banners', ['is_active', 'sort_order'], 'banners_active_sort_idx');
    }

    public function down(): void
    {
        $this->dropIndexSafe('books', 'books_created_at_idx');
        $this->dropIndexSafe('videos', 'videos_created_at_idx');
        $this->dropIndexSafe('audios', 'audios_created_at_idx');
        $this->dropIndexSafe('reading_progress', 'rp_user_book_idx');
        $this->dropIndexSafe('reading_progress', 'rp_last_read_idx');
        $this->dropIndexSafe('banners', 'banners_active_sort_idx');
    }
};
