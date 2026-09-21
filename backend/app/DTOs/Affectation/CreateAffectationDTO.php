<?php

declare(strict_types=1);

namespace App\DTOs\Affectation;

final readonly class CreateAffectationDTO
{
    public function __construct(
        public string $date_heure_affectation,
        public int $equipe_id,
        public int $signalement_id,
        public ?string $observation = null,
    ) {
    }

    public function toArray(): array
    {
        return [
            'date_heure_affectation' => $this->date_heure_affectation,
            'equipe_id' => $this->equipe_id,
            'signalement_id' => $this->signalement_id,
            'observation' => $this->observation,
        ];
    }
}
