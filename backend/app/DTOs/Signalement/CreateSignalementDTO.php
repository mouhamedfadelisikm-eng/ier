<?php

declare(strict_types=1);

namespace App\DTOs\Signalement;

use App\Enums\SignalementPrioriteEnum;
use App\Enums\SignalementStatutEnum;
use Illuminate\Http\UploadedFile;

final readonly class CreateSignalementDTO
{
    /**
     * @param list<UploadedFile> $photos
     */
    public function __construct(
        public ?string $description,
        public float $latitude,
        public float $longitude,
        public int $user_id,
        public ?int $zone_id = null,
        public SignalementStatutEnum $statut = SignalementStatutEnum::EN_ATTENTE_VALIDATION,
        public SignalementPrioriteEnum $priorite = SignalementPrioriteEnum::NORMALE,
        public array $type_dechets = [],
        public array $photos = [],
    ) {
    }

    public function toArray(): array
    {
        return [
            'description' => $this->description,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'user_id' => $this->user_id,
            'zone_id' => $this->zone_id,
            // `created_at` is the physical source for the business dateHeureSignalement.
            'statut' => $this->statut->value,
            'priorite' => $this->priorite->value,
        ];
    }
}
