<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class PhotoIntervention extends Model
{
    use HasFactory;

    protected $table = 'photo_interventions';

    protected $fillable = [
        'url',
        'description',
        'intervention_id',
    ];

    public function intervention(): BelongsTo
    {
        return $this->belongsTo(Intervention::class, 'intervention_id');
    }
}
