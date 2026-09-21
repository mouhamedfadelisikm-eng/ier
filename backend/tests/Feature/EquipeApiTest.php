<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Equipe;
use App\Models\Zone;
use App\Enums\RoleEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class EquipeApiTest extends TestCase
{
    /**
     * RG6 & RG24: Seuls les Agents appartiennent aux équipes. Une équipe peut regrouper plusieurs agents.
     */
    public function test_rg6_rg24_only_agents_in_team(): void
    {
        $this->authenticateAdmin();
        $agent1 = User::factory()->create();
        $agent1->assignRole(RoleEnum::AGENT->value);
        $agent2 = User::factory()->create();
        $agent2->assignRole(RoleEnum::AGENT->value);
        $citizen = User::factory()->create();
        $citizen->assignRole(RoleEnum::CITIZEN->value);

        // Succès avec deux agents
        $response = $this->postJson('/api/equipes', [
            'nom_equipe' => 'Equipe Alpha',
            'agent_ids' => [$agent1->id, $agent2->id]
        ]);
        $response->assertStatus(201);
        $this->assertCount(2, Equipe::find($response->json('data.id'))->agents);

        // Échec avec un citoyen
        $this->postJson('/api/equipes', [
            'nom_equipe' => 'Equipe Beta',
            'agent_ids' => [$agent1->id, $citizen->id]
        ])->assertStatus(422);
    }

    /**
     * RG7 & RG8: Mobilité et Historique.
     */
    public function test_rg7_rg8_membership_history(): void
    {
        $this->authenticateAdmin();
        $agent = User::factory()->create();
        $agent->assignRole(RoleEnum::AGENT->value);

        $equipe = Equipe::factory()->create(['nom_equipe' => 'Equipe Mobile']);

        // Entrée dans l'équipe
        $this->putJson("/api/equipes/{$equipe->id}", [
            'nom_equipe' => 'Equipe Mobile Updated',
            'agent_ids' => [$agent->id]
        ])->assertStatus(200);

        $this->assertDatabaseHas('appartenance_equipe', [
            'user_id' => $agent->id,
            'equipe_id' => $equipe->id,
            'date_fin' => null
        ]);

        // Sortie de l'équipe
        $this->putJson("/api/equipes/{$equipe->id}", [
            'nom_equipe' => 'Equipe Mobile Updated',
            'agent_ids' => []
        ])->assertStatus(200);

        $this->assertDatabaseHas('appartenance_equipe', [
            'user_id' => $agent->id,
            'equipe_id' => $equipe->id,
            'date_fin' => now()->toDateString()
        ]);
    }

    /**
     * RG22 & RG23: Couverture de zone.
     */
    public function test_rg22_rg23_zone_coverage(): void
    {
        $this->authenticateAdmin();
        $z1 = Zone::factory()->create();
        $z2 = Zone::factory()->create();
        $e1 = Equipe::factory()->create();
        $e2 = Equipe::factory()->create();

        // RG22: Une zone couverte par plusieurs équipes
        // RG23: Une équipe intervient dans plusieurs zones
        $z1->equipes()->attach([$e1->id, $e2->id]);
        $z2->equipes()->attach([$e1->id]);

        $this->assertCount(2, $z1->fresh()->equipes);
        $this->assertCount(2, $e1->fresh()->zones);
        $this->assertCount(1, $z2->fresh()->equipes);
    }
}
