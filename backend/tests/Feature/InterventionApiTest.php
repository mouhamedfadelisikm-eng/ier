<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Signalement;
use App\Models\Equipe;
use App\Models\Affectation;
use App\Models\Intervention;
use App\Enums\RoleEnum;
use App\Enums\SignalementStatutEnum;
use App\Enums\InterventionStatutEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class InterventionApiTest extends TestCase
{
    /**
     * RG29 & RG30 & RG31: Workflow d'intervention.
     */
    public function test_rg29_rg30_rg31_intervention_workflow(): void
    {
        $this->authenticateAdmin();
        $equipe = Equipe::factory()->create();
        $signalement = Signalement::factory()->create(['statut' => SignalementStatutEnum::AFFECTE->value]);
        $affectation = Affectation::factory()->create([
            'signalement_id' => $signalement->id,
            'equipe_id' => $equipe->id
        ]);

        // Créer une intervention (RG29)
        $response = $this->postJson('/api/interventions', [
            'affectation_id' => $affectation->id,
            'statut' => InterventionStatutEnum::EN_COURS->value,
            'date_heure_debut' => now()->toDateTimeString(),
        ]);

        $response->assertStatus(201);
        $interventionId = $response->json('data.id');

        // RG30: Une intervention appartient à une seule affectation
        $this->assertEquals($affectation->id, Intervention::find($interventionId)->affectation_id);
        // RG31: Une intervention réalisée par une seule équipe
        $this->assertEquals($equipe->id, Intervention::find($interventionId)->affectation->equipe_id);

        // Signalement passe à EN_INTERVENTION
        $this->assertEquals(SignalementStatutEnum::EN_INTERVENTION->value, $signalement->fresh()->statut->value);

        // Terminer l'intervention (RG33 nécessite compte rendu)
        $this->putJson("/api/interventions/{$interventionId}", [
            'statut' => InterventionStatutEnum::TERMINEE->value,
            'compte_rendu' => 'Travail terminé avec succès',
            'date_heure_fin' => now()->addHour()->toDateTimeString(),
        ])->assertStatus(200);

        $this->assertEquals(SignalementStatutEnum::TERMINE->value, $signalement->fresh()->statut->value);
    }

    /**
     * RG32: Photos d'intervention.
     */
    public function test_rg32_intervention_photos(): void
    {
        Storage::fake('public');
        $this->authenticateAdmin();
        $intervention = Intervention::factory()->create();

        $file = UploadedFile::fake()->image('intervention.jpg');

        $this->putJson("/api/interventions/{$intervention->id}", [
            'photos' => [$file]
        ])->assertStatus(200)->assertJsonCount(1, 'data.photos');
    }

    /**
     * RG33: Compte rendu obligatoire avant TERMINEE.
     */
    public function test_rg33_compte_rendu_mandatory(): void
    {
        $this->authenticateAdmin();

        // Préparer un signalement dans le bon état pour permettre la fin d'intervention
        $signalement = Signalement::factory()->enIntervention()->create();
        $affectation = Affectation::factory()->create(['signalement_id' => $signalement->id]);
        $intervention = Intervention::factory()->create([
            'affectation_id' => $affectation->id,
            'statut' => InterventionStatutEnum::EN_COURS->value
        ]);

        // Tentative de passer à TERMINEE sans compte rendu
        $this->putJson("/api/interventions/{$intervention->id}", [
            'statut' => InterventionStatutEnum::TERMINEE->value,
            'date_heure_fin' => now()->toDateTimeString(),
        ])->assertStatus(422);

        // Avec compte rendu
        $this->putJson("/api/interventions/{$intervention->id}", [
            'statut' => InterventionStatutEnum::TERMINEE->value,
            'compte_rendu' => 'Fait.',
            'date_heure_fin' => now()->toDateTimeString(),
        ])->assertStatus(200);
    }
}
