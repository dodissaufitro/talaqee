<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReadingProgress extends Model
{
    protected $table = 'reading_progress';

    protected $fillable = [
        'user_id',
        'book_id',
        'chapter_id',
        'current_page',
        'total_page',
        'progress_percent',
        'completed',
        'last_read_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'last_read_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function chapter()
    {
        return $this->belongsTo(BookChapter::class, 'chapter_id');
    }
}
