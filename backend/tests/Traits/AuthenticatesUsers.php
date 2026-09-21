<?php

namespace Tests\Traits;

use App\Models\User;
use App\Enums\RoleEnum;
use Laravel\Sanctum\Sanctum;

trait AuthenticatesUsers
{
    protected function authenticateCitizen(): User
    {
        return $this->authenticateAs(RoleEnum::CITIZEN);
    }

    protected function authenticateAgent(): User
    {
        return $this->authenticateAs(RoleEnum::AGENT);
    }

    protected function authenticateAdmin(): User
    {
        return $this->authenticateAs(RoleEnum::ADMIN);
    }

    protected function authenticateAs(RoleEnum $role): User
    {
        $user = User::factory()->create();
        $user->assignRole($role->value);

        Sanctum::actingAs($user);

        return $user;
    }
}
