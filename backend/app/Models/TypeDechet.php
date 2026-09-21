<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class TypeDechet extends Model
{
    use HasFactory;

    protected $table = 'types_dechets';

    protected $fillable = [
        'libelle',
        'description',
    ];

    public function signalements(): BelongsToMany
    {
        return $this->belongsToMany(Signalement::class, 'contenu_signalement')
            ->withPivot(['quantite_estime', 'volume_estime', 'dangerosite', 'remarque']);
    }
}
