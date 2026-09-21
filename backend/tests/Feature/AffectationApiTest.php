<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Signalement;
use App\Models\Equipe;
use App\Models\Affectation;
use App\Enums\RoleEnum;
use App\Enums\SignalementStatutEnum;
use App\Enums\SignalementPrioriteEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AffectationApiTest extends TestCase
{
    /**
     * RG16: Validation puis priorisation avant affectation.
     */
    public function test_rg16_workflow_before_affectation(): void
    {
        $this->authenticateAdmin();
        $signalement = Signalement::factory()->create(['statut' => SignalementStatutEnum::EN_ATTENTE_VALIDATION->value]);
        $equipe = Equipe::factory()->create();

        // Tentative d'affectation avant validation/priorisation
        $this->postJson('/api/affectations', [
            'signalement_id' => $signalement->id,
            'equipe_id' => $equipe->id,
            'date_heure_affectation' => now()->toDateTimeString(),
        ])->assertStatus(422);

        // Valider
        $this->postJson("/api/signalements/{$signalement->id}/valider")->assertStatus(200);

        // Tentative d'affectation avant priorisation
        $this->postJson('/api/affectations', [
            'signalement_id' => $signalement->id,
            'equipe_id' => $equipe->id,
            'date_heure_affectation' => now()->toDateTimeString(),
        ])->assertStatus(422);

        // Prioriser
        $this->postJson("/api/signalements/{$signalement->id}/prioriser", [
            'priorite' => SignalementPrioriteEnum::HAUTE->value
        ])->assertStatus(200);

        // Affecter
        $this->postJson('/api/affectations', [
            'signalement_id' => $signalement->id,
            'equipe_id' => $equipe->id,
            'date_heure_affectation' => now()->toDateTimeString(),
        ])->assertStatus(201)
          ->assertJsonPath('data.signalement.statut', SignalementStatutEnum::AFFECTE->value);
    }

    /**
     * RG25 & RG26 & RG27: Relations.
     */
    public function test_rg25_rg26_rg27_affectation_relations(): void
    {
        $this->authenticateAdmin();
        $equipe = Equipe::factory()->create();
        $s1 = Signalement::factory()->create(['statut' => SignalementStatutEnum::PRIORISE->value]);
        $s2 = Signalement::factory()->create(['statut' => SignalementStatutEnum::PRIORISE->value]);

        // Une équipe reçoit plusieurs affectations (RG25)
        $a1 = Affectation::factory()->create(['equipe_id' => $equipe->id, 'signalement_id' => $s1->id]);
        $a2 = Affectation::factory()->create(['equipe_id' => $equipe->id, 'signalement_id' => $s2->id]);

        $this->assertCount(2, $equipe->affectations);
        // RG26: Une affectation concerne un seul signalement
        $this->assertEquals($s1->id, $a1->signalement_id);
        // RG27: Une affectation concerne une seule équipe
        $this->assertEquals($equipe->id, $a1->equipe_id);
    }

    /**
     * RG28: Réaffectation (Historique).
     */
    public function test_rg28_reassignation(): void
    {
        $this->authenticateAdmin();
        $signalement = Signalement::factory()->create(['statut' => SignalementStatutEnum::PRIORISE->value]);
        $equipe1 = Equipe::factory()->create();
        $equipe2 = Equipe::factory()->create();

        // Première affectation
        $response1 = $this->postJson('/api/affectations', [
            'signalement_id' => $signalement->id,
            'equipe_id' => $equipe1->id,
            'date_heure_affectation' => now()->toDateTimeString(),
        ]);
        $affectation1Id = $response1->json('data.id');

        // Réaffectation
        $this->postJson("/api/affectations/{$affectation1Id}/reaffecter", [
            'equipe_id' => $equipe2->id,
            'date_heure_affectation' => now()->addHour()->toDateTimeString(),
        ])->assertStatus(201);

        $signalement->refresh();
        $this->assertCount(2, $signalement->affectations);
        $this->assertEquals($equipe2->id, $signalement->affectations()->latest('date_heure_affectation')->first()->equipe_id);
    }
}
