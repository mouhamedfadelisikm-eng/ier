<?php

declare(strict_types=1);

namespace App\DTOs\HistoriquePoint;

final readonly class CreateHistoriquePointDTO
{
    public function __construct(
        public int $nombre_points,
        public string $motif,
        public string $date_attribution,
        public int $user_id,
        public ?string $description = null,
        public ?int $signalement_id = null,
    ) {
    }

    public function toArray(): array
    {
        return [
            'nombre_points' => $this->nombre_points,
            'motif' => $this->motif,
            'date_attribution' => $this->date_attribution,
            'user_id' => $this->user_id,
            'signalement_id' => $this->signalement_id,
            'description' => $this->description,
        ];
    }
}
