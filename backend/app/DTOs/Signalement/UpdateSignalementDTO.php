<?php

declare(strict_types=1);

namespace App\DTOs\Signalement;

use App\Enums\SignalementPrioriteEnum;
use App\Enums\SignalementStatutEnum;

final readonly class UpdateSignalementDTO
{
    public function __construct(
        public ?string $description = null,
        public ?SignalementStatutEnum $statut = null,
        public ?SignalementPrioriteEnum $priorite = null,
        public ?int $zone_id = null,
        public bool $zone_id_present = false,
        public array $type_dechets = [],
        public bool $type_dechets_present = false,
    ) {
    }

    public function toArray(): array
    {
        $data = [];

        if ($this->description !== null) {
            $data['description'] = $this->description;
        }

        if ($this->statut !== null) {
            $data['statut'] = $this->statut->value;
        }

        if ($this->priorite !== null) {
            $data['priorite'] = $this->priorite->value;
        }

        if ($this->zone_id_present) {
            $data['zone_id'] = $this->zone_id;
        }

        return $data;
    }
}
