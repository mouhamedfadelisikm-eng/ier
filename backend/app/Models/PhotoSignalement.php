<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class PhotoSignalement extends Model
{
    use HasFactory;

    protected $table = 'photo_signalements';

    protected $fillable = [
        'url',
        'description',
        'signalement_id',
    ];

    public function signalement(): BelongsTo
    {
        return $this->belongsTo(Signalement::class, 'signalement_id');
    }
}
