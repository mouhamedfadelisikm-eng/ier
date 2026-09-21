<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Intervention;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final class InterventionPolicy
{
    private function canOperate(User $user, Intervention $intervention): bool
    {
        if ($user->isAdmin()) return true;
        if (! $user->isAgent()) return false;
        return DB::table('appartenance_equipe')
            ->where('user_id', $user->id)
            ->where('equipe_id', $intervention->affectation->equipe_id)
            ->whereNull('date_fin')
            ->exists();
    }

    public function viewAny(User $user): bool { return $user->isAdmin() || $user->isAgent(); }
    public function view(User $user, Intervention $intervention): bool { return $this->canOperate($user, $intervention); }
    public function create(User $user): bool { return $user->isAdmin() || $user->isAgent(); }
    public function update(User $user, Intervention $intervention): bool { return $this->canOperate($user, $intervention); }
    public function delete(User $user, Intervention $intervention): bool { return $user->isAdmin(); }
}
