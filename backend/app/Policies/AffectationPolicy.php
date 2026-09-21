<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Affectation;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final class AffectationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isAgent();
    }

    public function view(User $user, Affectation $affectation): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if (! $user->isAgent()) {
            return false;
        }

        return DB::table('appartenance_equipe')
            ->where('user_id', $user->id)
            ->where('equipe_id', $affectation->equipe_id)
            ->whereNull('date_fin')
            ->exists();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Affectation $affectation): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Affectation $affectation): bool
    {
        return $user->isAdmin();
    }
}
