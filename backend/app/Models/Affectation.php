<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Affectation extends Model
{
    use HasFactory;

    protected $table = 'affectations';

    protected $fillable = [
        'date_heure_affectation',
        'observation',
        'equipe_id',
        'signalement_id',
    ];

    protected function casts(): array
    {
        return [
            'date_heure_affectation' => 'datetime',
        ];
    }

    public function equipe(): BelongsTo
    {
        return $this->belongsTo(Equipe::class, 'equipe_id');
    }

    public function signalement(): BelongsTo
    {
        return $this->belongsTo(Signalement::class, 'signalement_id');
    }

    public function interventions(): HasMany
    {
        return $this->hasMany(Intervention::class, 'affectation_id');
    }
}
