<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\HistoriquePoint;
use App\Enums\RoleEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HistoriquePointIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_citizen_can_only_see_their_own_points(): void
    {
        $citizenA = $this->authenticateCitizen();
        HistoriquePoint::factory()->create(['user_id' => $citizenA->id, 'nombre_points' => 10]);

        $citizenB = User::factory()->create();
        $citizenB->assignRole(RoleEnum::CITIZEN->value);
        HistoriquePoint::factory()->create(['user_id' => $citizenB->id, 'nombre_points' => 20]);

        $response = $this->getJson('/api/historique-points');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonPath('data.0.user.id', $citizenA->id);
    }

    public function test_agent_can_only_see_their_own_points(): void
    {
        $agentA = $this->authenticateAgent();
        HistoriquePoint::factory()->create(['user_id' => $agentA->id, 'nombre_points' => 10]);

        $agentB = User::factory()->create();
        $agentB->assignRole(RoleEnum::AGENT->value);
        HistoriquePoint::factory()->create(['user_id' => $agentB->id, 'nombre_points' => 20]);

        $response = $this->getJson('/api/historique-points');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonPath('data.0.user.id', $agentA->id);
    }

    public function test_admin_can_see_all_points(): void
    {
        $this->authenticateAdmin();

        $u1 = User::factory()->create();
        HistoriquePoint::factory()->create(['user_id' => $u1->id]);

        $u2 = User::factory()->create();
        HistoriquePoint::factory()->create(['user_id' => $u2->id]);

        $response = $this->getJson('/api/historique-points');

        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }

    public function test_citizen_cannot_view_others_point_detail(): void
    {
        $citizenA = $this->authenticateCitizen();

        $citizenB = User::factory()->create();
        $citizenB->assignRole(RoleEnum::CITIZEN->value);
        $hpB = HistoriquePoint::factory()->create(['user_id' => $citizenB->id]);

        $response = $this->getJson("/api/historique-points/{$hpB->id}");

        $response->assertStatus(403);
    }
}
