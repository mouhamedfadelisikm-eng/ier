<?php

declare(strict_types=1);

namespace App\DTOs\Equipe;

final readonly class CreateEquipeDTO
{
    public function __construct(
        public string $nom_equipe,
        public ?string $description = null,
        public array $agent_ids = [], // Array of agent user IDs to attach
    ) {
    }

    public function toArray(): array
    {
        return [
            'nom_equipe' => $this->nom_equipe,
            'description' => $this->description,
        ];
    }
}
