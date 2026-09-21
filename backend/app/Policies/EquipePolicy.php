<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Equipe;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final class EquipePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isAgent();
    }

    public function view(User $user, Equipe $equipe): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isAgent() && DB::table('appartenance_equipe')
            ->where('user_id', $user->id)
            ->where('equipe_id', $equipe->id)
            ->whereNull('date_fin')
            ->exists();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Equipe $equipe): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Equipe $equipe): bool
    {
        return $user->isAdmin();
    }
}
