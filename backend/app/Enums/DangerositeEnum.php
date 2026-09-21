<?php

declare(strict_types=1);

namespace App\Enums;

enum DangerositeEnum: string
{
    case FAIBLE  = 'faible';
    case MODERE  = 'modere';
    case ELEVE   = 'eleve';
    case EXTREME = 'extreme';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
