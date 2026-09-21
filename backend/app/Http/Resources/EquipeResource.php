<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class EquipeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom_equipe' => $this->nom_equipe,
            'description' => $this->description,
            'agents' => UserResource::collection($this->whenLoaded('agents')),
            'zones' => ZoneResource::collection($this->whenLoaded('zones')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
