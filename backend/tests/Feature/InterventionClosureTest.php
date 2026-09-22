<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Intervention;
use App\Models\Affectation;
use App\Models\Signalement;
use App\Models\Equipe;
use App\Enums\RoleEnum;
use App\Enums\InterventionStatutEnum;
use App\Enums\SignalementStatutEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InterventionClosureTest extends TestCase
{
    use RefreshDatabase;

    public function test_agent_cannot_close_signalement(): void
    {
        $agent = $this->authenticateAgent();
        $equipe = Equipe::factory()->create();
        $equipe->agents()->attach($agent->id, ['date_debut' => now()->toDateString(), 'fonction' => 'Agent']);

        $signalement = Signalement::factory()->create(['statut' => SignalementStatutEnum::TERMINE]);
        $affectation = Affectation::factory()->create(['signalement_id' => $signalement->id, 'equipe_id' => $equipe->id]);
        $intervention = Intervention::factory()->create([
            'affectation_id' => $affectation->id,
            'statut' => InterventionStatutEnum::TERMINEE,
            'compte_rendu' => 'Fait'
        ]);

        $response = $this->postJson("/api/interventions/{$intervention->id}/cloturer");

        $response->assertStatus(403);
        $this->assertEquals(SignalementStatutEnum::TERMINE, $signalement->fresh()->statut);
    }

    public function test_admin_can_close_signalement(): void
    {
        $this->authenticateAdmin();

        $signalement = Signalement::factory()->create(['statut' => SignalementStatutEnum::TERMINE]);
        $affectation = Affectation::factory()->create(['signalement_id' => $signalement->id]);
        $intervention = Intervention::factory()->create([
            'affectation_id' => $affectation->id,
            'statut' => InterventionStatutEnum::TERMINEE,
            'compte_rendu' => 'Fait'
        ]);

        $response = $this->postJson("/api/interventions/{$intervention->id}/cloturer");

        $response->assertStatus(200);
        $this->assertEquals(SignalementStatutEnum::CLOTURE, $signalement->fresh()->statut);
    }

    public function test_cannot_close_if_not_finished(): void
    {
        $this->authenticateAdmin();

        $signalement = Signalement::factory()->create(['statut' => SignalementStatutEnum::TERMINE]);
        $affectation = Affectation::factory()->create(['signalement_id' => $signalement->id]);
        $intervention = Intervention::factory()->create([
            'affectation_id' => $affectation->id,
            'statut' => InterventionStatutEnum::EN_COURS,
            'compte_rendu' => '...'
        ]);

        $response = $this->postJson("/api/interventions/{$intervention->id}/cloturer");

        $response->assertStatus(422);
        $this->assertEquals(SignalementStatutEnum::TERMINE, $signalement->fresh()->statut);
    }
}
