<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRecording extends Model
{
    protected $fillable = [
        'user_id', 'ayah_id', 'file_path', 'duration', 'admin_comment_text', 'admin_comment_audio_path'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ayah()
    {
        return $this->belongsTo(Ayah::class);
    }
}
