<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\HistoriquePoint;
use App\Models\User;

final class HistoriquePointPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, HistoriquePoint $historiquePoint): bool
    {
        return $user->isAdmin() || $historiquePoint->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user): bool
    {
        return $user->isAdmin();
    }
}
