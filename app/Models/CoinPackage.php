<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoinPackage extends Model
{
    protected $fillable = [
        'name',
        'coin_amount',
        'price',
        'bonus_coin',
        'is_popular',
        'badge_label',
        'badge_color',
        'is_active',
    ];

    protected $casts = [
        'coin_amount' => 'integer',
        'price' => 'decimal:2',
        'bonus_coin' => 'integer',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
    ];
}
