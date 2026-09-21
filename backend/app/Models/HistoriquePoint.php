<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class HistoriquePoint extends Model
{
    use HasFactory;

    protected $table = 'historique_points';

    protected $fillable = [
        'nombre_points',
        'motif',
        'description',
        'date_attribution',
        'user_id',
        'signalement_id',
    ];

    protected function casts(): array
    {
        return [
            'date_attribution' => 'date',
            'nombre_points' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function signalement(): BelongsTo
    {
        return $this->belongsTo(Signalement::class, 'signalement_id');
    }

}
