<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $guarded = [];
    protected $appends = ['average_rating'];

    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function purchases()
    {
        return $this->hasMany(BookPurchase::class);
    }

    public function chapters()
    {
        return $this->hasMany(BookChapter::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function getAverageRatingAttribute()
    {
        if (array_key_exists('reviews_avg_rating', $this->attributes)) {
            return round((float) $this->attributes['reviews_avg_rating'], 1);
        }
        if ($this->relationLoaded('reviews')) {
            return round((float) $this->reviews->avg('rating'), 1);
        }
        return round((float) ($this->reviews()->avg('rating') ?: 0), 1);
    }
}
