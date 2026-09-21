<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class AffectationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date_heure_affectation' => $this->date_heure_affectation,
            'observation' => $this->observation,
            'equipe' => new EquipeResource($this->whenLoaded('equipe')),
            'signalement' => new SignalementResource($this->whenLoaded('signalement')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
