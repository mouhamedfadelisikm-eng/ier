<?php

declare(strict_types=1);

namespace App\DTOs\TypeDechet;

final readonly class UpdateTypeDechetDTO
{
    public function __construct(
        public ?string $libelle = null,
        public ?string $description = null,
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'libelle' => $this->libelle,
            'description' => $this->description,
        ], fn ($value) => $value !== null);
    }
}
