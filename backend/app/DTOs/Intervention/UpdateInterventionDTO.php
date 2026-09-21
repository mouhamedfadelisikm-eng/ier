<?php

declare(strict_types=1);

namespace App\DTOs\Intervention;

use App\Enums\InterventionStatutEnum;
use Illuminate\Http\UploadedFile;

final readonly class UpdateInterventionDTO
{
    /**
     * @param list<UploadedFile> $photos
     */
    public function __construct(
        public ?string $date_heure_fin = null,
        public ?InterventionStatutEnum $statut = null,
        public ?string $compte_rendu = null,
        public ?string $observation = null,
        public array $photos = [],
    ) {
    }

    public function toArray(): array
    {
        $data = [];
        if ($this->date_heure_fin !== null) {
            $data['date_heure_fin'] = $this->date_heure_fin;
        }
        if ($this->statut !== null) {
            $data['statut'] = $this->statut->value;
        }
        if ($this->compte_rendu !== null) {
            $data['compte_rendu'] = $this->compte_rendu;
        }
        if ($this->observation !== null) {
            $data['observation'] = $this->observation;
        }
        return $data;
    }
}
