<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Equipe extends Model
{
    use HasFactory;

    protected $table = 'equipes';

    protected $fillable = [
        'nom_equipe',
        'description',
    ];

    public function agents(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'appartenance_equipe', 'equipe_id', 'user_id')
            ->withPivot(['date_debut', 'date_fin', 'fonction']);
    }

    public function zones(): BelongsToMany
    {
        return $this->belongsToMany(Zone::class, 'couverture_zone', 'equipe_id', 'zone_id');
    }

    public function affectations(): HasMany
    {
        return $this->hasMany(Affectation::class, 'equipe_id');
    }
}
