<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\InterventionStatutEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Intervention extends Model
{
    use HasFactory;

    protected $table = 'interventions';

    protected $fillable = [
        'date_heure_debut',
        'date_heure_fin',
        'statut',
        'compte_rendu',
        'observation',
        'affectation_id',
    ];

    protected function casts(): array
    {
        return [
            'date_heure_debut' => 'datetime',
            'date_heure_fin' => 'datetime',
            'statut' => InterventionStatutEnum::class,
        ];
    }

    public function affectation(): BelongsTo
    {
        return $this->belongsTo(Affectation::class, 'affectation_id');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(PhotoIntervention::class, 'intervention_id');
    }
}
