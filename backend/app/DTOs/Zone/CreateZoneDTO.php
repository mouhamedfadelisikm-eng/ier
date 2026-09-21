<?php

declare(strict_types=1);

namespace App\DTOs\Zone;

final readonly class CreateZoneDTO
{
    public function __construct(
        public string $nom_zone,
        public ?string $description = null,
    ) {
    }

    public function toArray(): array
    {
        return [
            'nom_zone' => $this->nom_zone,
            'description' => $this->description,
        ];
    }
}
