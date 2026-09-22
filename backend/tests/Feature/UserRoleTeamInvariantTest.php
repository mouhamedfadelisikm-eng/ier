<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Equipe;
use App\Enums\RoleEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserRoleTeamInvariantTest extends TestCase
{
    use RefreshDatabase;

    /**
     * RG6: Seuls les Agents appartiennent aux équipes.
     * Empêcher le passage vers Citoyen si appartenance active.
     */
    public function test_cannot_change_agent_to_citizen_if_active_in_team(): void
    {
        $this->authenticateAdmin();

        $agent = User::factory()->create();
        $agent->assignRole(RoleEnum::AGENT->value);

        $equipe = Equipe::factory()->create();
        $equipe->agents()->attach($agent->id, [
            'date_debut' => now()->toDateString(),
            'fonction' => 'Agent'
        ]);

        $response = $this->putJson("/api/users/{$agent->id}", [
            'role' => RoleEnum::CITIZEN->value
        ]);

        $response->assertStatus(409)
                 ->assertJsonFragment(['message' => "Impossible de changer le rôle d'un agent ayant une appartenance active à une équipe."]);

        $this->assertTrue($agent->fresh()->hasRole(RoleEnum::AGENT->value));
    }

    public function test_can_change_agent_to_citizen_if_no_active_membership(): void
    {
        $this->authenticateAdmin();

        $agent = User::factory()->create();
        $agent->assignRole(RoleEnum::AGENT->value);

        $equipe = Equipe::factory()->create();
        $equipe->agents()->attach($agent->id, [
            'date_debut' => now()->subMonth()->toDateString(),
            'date_fin' => now()->subDay()->toDateString(),
            'fonction' => 'Agent'
        ]);

        $response = $this->putJson("/api/users/{$agent->id}", [
            'role' => RoleEnum::CITIZEN->value
        ]);

        $response->assertStatus(200);
        $this->assertTrue($agent->fresh()->hasRole(RoleEnum::CITIZEN->value));
    }
}
