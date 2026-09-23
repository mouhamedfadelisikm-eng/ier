<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class SignalementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'description' => $this->description,

            'latitude' => $this->latitude,

            'longitude' => $this->longitude,

            'statut' => $this->statut?->value,

            'priorite' => $this->priorite?->value,

            'user' => new UserResource(
                $this->whenLoaded('user')
            ),

            'zone' => new ZoneResource(
                $this->whenLoaded('zone')
            ),

            'type_dechets' => $this->when(
                $this->relationLoaded('typeDechets'),
                fn () => $this->typeDechets->map(
                    fn ($typeDechet) => [
                        'id' => $typeDechet->id,
                        'type_dechet_id' => $typeDechet->id,
                        'libelle' => $typeDechet->libelle,
                        'description' => $typeDechet->description,
                        'quantite_estime' => $typeDechet->pivot?->quantite_estime !== null ? (float) $typeDechet->pivot?->quantite_estime : null,
                        'volume_estime' => $typeDechet->pivot?->volume_estime !== null ? (float) $typeDechet->pivot?->volume_estime : null,
                        'dangerosite' => $typeDechet->pivot?->dangerosite,
                        'remarque' => $typeDechet->pivot?->remarque,
                    ]
                )
            ),

            'photos' => $this->when(
                $this->relationLoaded('photos'),
                fn () => $this->photos->map(
                    fn ($photo) => [
                        'id' => $photo->id,
                        'url' => $photo->url,
                        'description' => $photo->description,
                    ]
                )
            ),

            'created_at' => $this->created_at,

            // `created_at` is the physical source for the business dateHeureSignalement.
            'date_heure_signalement' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}
