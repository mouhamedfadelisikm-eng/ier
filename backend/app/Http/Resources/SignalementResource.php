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

            'type_dechets' => TypeDechetResource::collection(
                $this->whenLoaded('typeDechets')
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
