<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\SignalementStatutEnum;
use App\Models\Signalement;
use App\Models\User;

final class SignalementPolicy
{
    public function viewAny(User $user): bool { return true; }

    public function view(User $user, Signalement $signalement): bool
    {
        return $user->isAdmin() || $user->isAgent() || $signalement->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->exists && $user->getRoleNames()->count() === 1;
    }

    public function update(User $user, Signalement $signalement): bool
    {
        if ($user->isAdmin()) return true;
        return $signalement->user_id === $user->id
            && in_array($signalement->statut, [SignalementStatutEnum::BROUILLON, SignalementStatutEnum::EN_ATTENTE_VALIDATION], true);
    }

    public function validate(User $user, Signalement $signalement): bool
    {
        return $user->isAdmin() && $signalement->statut === SignalementStatutEnum::EN_ATTENTE_VALIDATION;
    }

    public function reject(User $user, Signalement $signalement): bool
    {
        return $user->isAdmin() && $signalement->statut === SignalementStatutEnum::EN_ATTENTE_VALIDATION;
    }

    public function prioritize(User $user, Signalement $signalement): bool
    {
        return $user->isAdmin() && $signalement->statut === SignalementStatutEnum::VALIDE;
    }

    public function delete(User $user, Signalement $signalement): bool
    {
        return $user->isAdmin() || ($signalement->user_id === $user->id && $signalement->statut === SignalementStatutEnum::BROUILLON);
    }
}
