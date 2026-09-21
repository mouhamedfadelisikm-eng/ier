<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class Zone extends Model
{
    use HasFactory;

    protected $table = 'zones';

    protected $fillable = [
        'nom_zone',
        'description',
    ];

    public function signalements(): HasMany
    {
        return $this->hasMany(Signalement::class, 'zone_id');
    }

    public function equipes(): BelongsToMany
    {
        return $this->belongsToMany(Equipe::class, 'couverture_zone', 'zone_id', 'equipe_id');
    }
}
