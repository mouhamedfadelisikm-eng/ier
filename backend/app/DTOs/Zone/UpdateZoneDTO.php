<?php

declare(strict_types=1);

namespace App\DTOs\Zone;

final readonly class UpdateZoneDTO
{
    public function __construct(
        public ?string $nom_zone = null,
        public ?string $description = null,
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'nom_zone' => $this->nom_zone,
            'description' => $this->description,
        ], fn ($value) => $value !== null);
    }
}
