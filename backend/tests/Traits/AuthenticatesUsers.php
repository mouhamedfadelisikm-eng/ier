<?php

namespace Tests\Traits;

use App\Models\User;
use App\Enums\RoleEnum;
use Laravel\Sanctum\Sanctum;

trait AuthenticatesUsers
{
    protected function authenticateCitizen(array $attributes = []): User
    {
        return $this->authenticateAs(RoleEnum::CITIZEN, $attributes);
    }

    protected function authenticateAgent(array $attributes = []): User
    {
        return $this->authenticateAs(RoleEnum::AGENT, $attributes);
    }

    protected function authenticateAdmin(array $attributes = []): User
    {
        return $this->authenticateAs(RoleEnum::ADMIN, $attributes);
    }

    protected function authenticateAs(RoleEnum $role, array $attributes = []): User
    {
        $user = User::factory()->create($attributes);
        $user->assignRole($role->value);

        Sanctum::actingAs($user);

        return $user;
    }
}
