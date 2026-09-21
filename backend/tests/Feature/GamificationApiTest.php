<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Signalement;
use App\Models\Intervention;
use App\Models\Affectation;
use App\Models\HistoriquePoint;
use App\Enums\RoleEnum;
use App\Enums\SignalementStatutEnum;
use App\Enums\InterventionStatutEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GamificationApiTest extends TestCase
{
    /**
     * RG5: Points attribués une seule fois après la clôture du signalement. Idempotence.
     */
    public function test_rg5_points_attribution_on_cloture_and_idempotence(): void
    {
        $this->authenticateAdmin();
        $citizen = User::factory()->create();
        $citizen->assignRole(RoleEnum::CITIZEN->value);

        $signalement = Signalement::factory()->termine()->create(['user_id' => $citizen->id]);
        $affectation = Affectation::factory()->create(['signalement_id' => $signalement->id]);
        $intervention = Intervention::factory()->terminee()->create(['affectation_id' => $affectation->id]);

        // Clôturer l'intervention (et le signalement)
        $this->postJson("/api/interventions/{$intervention->id}/cloturer")->assertStatus(200);

        // Vérifier l'attribution (100 points par défaut dans le service)
        $this->assertEquals(100, HistoriquePoint::where('user_id', $citizen->id)->sum('nombre_points'));
        $this->assertCount(1, HistoriquePoint::where('signalement_id', $signalement->id)->get());

        // Tentative de clôture répétée (Idempotence via Workflow)
        $this->postJson("/api/interventions/{$intervention->id}/cloturer")->assertStatus(422);

        $this->assertEquals(100, HistoriquePoint::where('user_id', $citizen->id)->sum('nombre_points'));
    }

    /**
     * RG34 & RG35: Historique appartient à un utilisateur, cumul possible.
     */
    public function test_rg34_rg35_points_cumul(): void
    {
        $this->authenticateAdmin();
        $citizen = User::factory()->create();
        $citizen->assignRole(RoleEnum::CITIZEN->value);

        // Signalement 1
        $s1 = Signalement::factory()->termine()->create(['user_id' => $citizen->id]);
        $a1 = Affectation::factory()->create(['signalement_id' => $s1->id]);
        $i1 = Intervention::factory()->terminee()->create(['affectation_id' => $a1->id]);
        $this->postJson("/api/interventions/{$i1->id}/cloturer")->assertStatus(200);

        // Signalement 2
        $s2 = Signalement::factory()->termine()->create(['user_id' => $citizen->id]);
        $a2 = Affectation::factory()->create(['signalement_id' => $s2->id]);
        $i2 = Intervention::factory()->terminee()->create(['affectation_id' => $a2->id]);
        $this->postJson("/api/interventions/{$i2->id}/cloturer")->assertStatus(200);

        $this->assertEquals(200, HistoriquePoint::where('user_id', $citizen->id)->sum('nombre_points'));
        $this->assertCount(2, HistoriquePoint::where('user_id', $citizen->id)->get());
    }

    public function test_leaderboard(): void
    {
        $u1 = User::factory()->create();
        $u1->assignRole(RoleEnum::CITIZEN->value);
        HistoriquePoint::factory()->create(['user_id' => $u1->id, 'nombre_points' => 50]);

        $u2 = User::factory()->create();
        $u2->assignRole(RoleEnum::CITIZEN->value);
        HistoriquePoint::factory()->create(['user_id' => $u2->id, 'nombre_points' => 150]);

        $this->authenticateCitizen();
        $response = $this->getJson('/api/gamification/leaderboard');

        $response->assertStatus(200)
                 ->assertJsonPath('data.0.user.id', $u2->id)
                 ->assertJsonPath('data.0.total_points', 150)
                 ->assertJsonPath('data.1.user.id', $u1->id);
    }
}
