<?php

declare(strict_types=1);

namespace App\DTOs\Intervention;

use App\Enums\InterventionStatutEnum;

final readonly class CreateInterventionDTO
{
    public function __construct(
        public string $date_heure_debut,
        public int $affectation_id,
        public InterventionStatutEnum $statut = InterventionStatutEnum::EN_COURS,
        public ?string $observation = null,
    ) {
    }

    public function toArray(): array
    {
        return [
            'date_heure_debut' => $this->date_heure_debut,
            'affectation_id' => $this->affectation_id,
            'statut' => $this->statut->value,
            'observation' => $this->observation,
        ];
    }
}
