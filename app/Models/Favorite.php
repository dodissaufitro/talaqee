<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = [
        'user_id',
        'content_type',
        'content_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class, 'content_id');
    }

    public function video()
    {
        return $this->belongsTo(Video::class, 'content_id');
    }

    public function audio()
    {
        return $this->belongsTo(Audio::class, 'content_id');
    }
}
