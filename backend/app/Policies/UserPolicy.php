<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Models\User;

final class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(RoleEnum::ADMIN->value);
    }


    public function view(User $user, User $model): bool
    {
        return $user->id === $model->id
            || $user->hasRole(RoleEnum::ADMIN->value);
    }


    public function create(User $user): bool
    {
        return $user->hasRole(RoleEnum::ADMIN->value);
    }


    public function update(User $user, User $model): bool
    {
        return $user->id === $model->id
            || $user->hasRole(RoleEnum::ADMIN->value);
    }


    public function delete(User $user, User $model): bool
    {
        return $user->hasRole(RoleEnum::ADMIN->value);
    }
}
