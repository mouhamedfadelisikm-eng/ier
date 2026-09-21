<?php

declare(strict_types=1);

namespace App\DTOs\TypeDechet;

final readonly class CreateTypeDechetDTO
{
    public function __construct(
        public string $libelle,
        public ?string $description = null,
    ) {
    }

    public function toArray(): array
    {
        return [
            'libelle' => $this->libelle,
            'description' => $this->description,
        ];
    }
}
