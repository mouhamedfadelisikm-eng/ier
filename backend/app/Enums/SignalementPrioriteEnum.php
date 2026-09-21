<?php

declare(strict_types=1);

namespace App\Enums;

enum SignalementPrioriteEnum: string
{
    case FAIBLE  = 'faible';
    case NORMALE = 'normale';
    case HAUTE   = 'haute';
    case URGENTE = 'urgente';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
