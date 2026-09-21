<?php

declare(strict_types=1);

namespace App\DTOs\Equipe;

final readonly class UpdateEquipeDTO
{
    public function __construct(
        public ?string $nom_equipe = null,
        public ?string $description = null,
        public ?array $agent_ids = null,
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'nom_equipe' => $this->nom_equipe,
            'description' => $this->description,
        ], fn ($value) => $value !== null);
    }
}
