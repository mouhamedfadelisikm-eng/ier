<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class HistoriquePointResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre_points' => $this->nombre_points,
            'motif' => $this->motif,
            'description' => $this->description,
            'date_attribution' => $this->date_attribution,
            'user' => new UserResource($this->whenLoaded('user')),
            'signalement_id' => $this->signalement_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
