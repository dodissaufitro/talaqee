<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Surah extends Model
{
    protected $fillable = [
        'number', 'name', 'english_name', 'english_name_translation', 'number_of_ayahs', 'revelation_type'
    ];

    public function ayahs()
    {
        return $this->hasMany(Ayah::class);
    }
}
