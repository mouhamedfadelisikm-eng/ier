<?php

declare(strict_types=1);

namespace App\DTOs\Dashboard;

use stdClass;

final readonly class HeatmapPointDTO
{
    public function __construct(
        public float $latitude,
        public float $longitude,
        public int $weight,
        public ?int $zone_id,
        public ?string $zone_nom,
    ) {
    }

    public static function fromRow(stdClass $row): self
    {
        return new self(
            latitude: round((float) $row->latitude, 6),
            longitude: round((float) $row->longitude, 6),
            weight: (int) $row->weight,
            zone_id: $row->zone_id !== null ? (int) $row->zone_id : null,
            zone_nom: $row->zone_nom,
        );
    }
}
