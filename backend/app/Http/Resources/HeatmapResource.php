<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\DTOs\Dashboard\HeatmapPointDTO;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin HeatmapPointDTO
 */
final class HeatmapResource extends JsonResource
{
    /**
     * @return array{
     *     latitude: float,
     *     longitude: float,
     *     weight: int,
     *     zone_id: int|null,
     *     zone_nom: string|null,
     * }
     */
    public function toArray(Request $request): array
    {
        return [
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'weight' => $this->weight,
            'zone_id' => $this->zone_id,
            'zone_nom' => $this->zone_nom,
        ];
    }
}
