<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\SignalementPrioriteEnum;
use App\Enums\SignalementStatutEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Signalement extends Model
{
    use HasFactory;

    protected $table = 'signalements';

    protected $fillable = [
        'description',
        'latitude',
        'longitude',
        'statut',
        'priorite',
        'user_id',
        'zone_id',
    ];

    protected function casts(): array
    {
        return [
            // `created_at` is the physical representation of dateHeureSignalement.
            'latitude' => 'float',
            'longitude' => 'float',
            'statut' => SignalementStatutEnum::class,
            'priorite' => SignalementPrioriteEnum::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(Zone::class);
    }

    public function typeDechets(): BelongsToMany
    {
        return $this->belongsToMany(TypeDechet::class, 'contenu_signalement', 'signalement_id', 'type_dechet_id')
            ->withPivot(['quantite_estime', 'volume_estime', 'dangerosite', 'remarque']);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(PhotoSignalement::class, 'signalement_id');
    }

    public function affectations(): HasMany
    {
        return $this->hasMany(Affectation::class, 'signalement_id');
    }
}
