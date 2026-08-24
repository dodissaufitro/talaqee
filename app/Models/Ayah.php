<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ayah extends Model
{
    protected $fillable = [
        'surah_id', 'number', 'number_in_surah', 'text', 'translation', 'audio_url'
    ];

    public function surah()
    {
        return $this->belongsTo(Surah::class);
    }

    public function recordings()
    {
        return $this->hasMany(UserRecording::class);
    }
}
