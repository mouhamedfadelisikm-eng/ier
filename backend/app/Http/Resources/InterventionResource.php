<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class InterventionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date_heure_debut' => $this->date_heure_debut,
            'date_heure_fin' => $this->date_heure_fin,
            'statut' => $this->statut->value,
            'compte_rendu' => $this->compte_rendu,
            'observation' => $this->observation,
            'affectation' => new AffectationResource($this->whenLoaded('affectation')),
            'photos' => $this->when(
                $this->relationLoaded('photos'),
                fn () => $this->photos->map(fn ($photo) => [
                    'id' => $photo->id,
                    'url' => $photo->url,
                    'description' => $photo->description,
                ])
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
