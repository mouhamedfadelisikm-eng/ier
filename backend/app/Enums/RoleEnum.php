<?php

namespace App\Enums;

enum RoleEnum: string
{
    case ADMIN = 'admin';

    case CITIZEN = 'citizen';

    case AGENT = 'agent';

    /**
     * Retourne tous les rôles.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Vérifie si un rôle est valide.
     */
    public static function exists(string $role): bool
    {
        return in_array($role, self::values(), true);
    }
}
