<?php

declare(strict_types=1);

namespace App\Enums;

enum InterventionStatutEnum: string
{
    case EN_COURS  = 'en_cours';
    case TERMINEE  = 'terminee';
    case SUSPENDUE = 'suspendue';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Transitions autorisées pour une intervention.
     * Une intervention terminée est immuable ; une intervention suspendue
     * peut être reprise.
     *
     * @return list<self>
     */
    public function transitionsAutorisees(): array
    {
        return match ($this) {
            self::EN_COURS => [self::TERMINEE, self::SUSPENDUE],
            self::SUSPENDUE => [self::EN_COURS],
            self::TERMINEE => [],
        };
    }
}
