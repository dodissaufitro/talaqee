<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookChapter extends Model
{
    protected $fillable = [
        'book_id',
        'chapter_number',
        'title',
        'description',
        'content',
        'page_count',
        'coin_price',
        'is_free',
        'is_active',
    ];

    protected $casts = [
        'is_free' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
