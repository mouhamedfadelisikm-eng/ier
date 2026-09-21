<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Signalement;
use App\Models\Zone;
use App\Models\TypeDechet;
use App\Models\Equipe;
use App\Models\Affectation;
use App\Models\Intervention;
use App\Models\HistoriquePoint;
use App\Enums\RoleEnum;
use App\Enums\SignalementStatutEnum;
use App\Enums\SignalementPrioriteEnum;
use App\Enums\InterventionStatutEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EndToEndScenarioTest extends TestCase
{
    public function test_complete_business_workflow(): void
    {
        Storage::fake('public');

        // 1. Inscription & Authentification Citoyen
        $citizenData = [
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'email' => 'jean.dupont@example.com',
            'password' => 'Citizen123!',
            'password_confirmation' => 'Citizen123!',
            'role' => RoleEnum::CITIZEN->value,
        ];
        $this->postJson('/api/auth/register', $citizenData)->assertStatus(201);

        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'jean.dupont@example.com',
            'password' => 'Citizen123!',
        ]);
        $loginResponse->assertStatus(200);
        $citizenToken = $loginResponse->json('data.token');
        $citizenId = $loginResponse->json('data.user.id');

        // 2. Création signalement (minimal)
        $signalementData = [
            'latitude' => 43.6047,
            'longitude' => 1.4442,
            'description' => 'Gros tas de gravats',
        ];
        $createResponse = $this->withHeader('Authorization', "Bearer $citizenToken")
                               ->postJson('/api/signalements', $signalementData);
        $createResponse->assertStatus(201);
        $signalementId = $createResponse->json('data.id');

        // 3. Qualification (Ajout zone et type de déchet) - par un Admin
        $admin = $this->authenticateAdmin();
        $zone = Zone::factory()->create(['nom_zone' => 'Zone Centre']);
        $type = TypeDechet::factory()->create(['libelle' => 'Gravats']);

        $this->putJson("/api/signalements/{$signalementId}", [
            'zone_id' => $zone->id,
            'type_dechets' => [
                ['type_dechet_id' => $type->id, 'quantite_estime' => 500]
            ]
        ])->assertStatus(200);

        // 4. Validation
        $this->postJson("/api/signalements/{$signalementId}/valider")->assertStatus(200);

        // 5. Priorisation
        $this->postJson("/api/signalements/{$signalementId}/prioriser", [
            'priorite' => SignalementPrioriteEnum::HAUTE->value
        ])->assertStatus(200);

        // 6. Affectation à une équipe
        $equipe = Equipe::factory()->create(['nom_equipe' => 'Equipe Propreté']);
        $agent = User::factory()->create();
        $agent->assignRole(RoleEnum::AGENT->value);
        // L'agent doit être dans l'équipe pour voir l'intervention plus tard (facultatif pour le test API mais bon pour le réalisme)
        $equipe->agents()->attach($agent->id, ['date_debut' => now()->toDateString(), 'fonction' => 'Chef']);

        $this->postJson('/api/affectations', [
            'signalement_id' => $signalementId,
            'equipe_id' => $equipe->id,
            'date_heure_affectation' => now()->toDateTimeString(),
        ])->assertStatus(201);
        $affectationId = Affectation::where('signalement_id', $signalementId)->first()->id;

        // 7. Création Intervention par un Agent (ou Admin)
        \Laravel\Sanctum\Sanctum::actingAs($agent);
        $interventionResponse = $this->postJson('/api/interventions', [
            'affectation_id' => $affectationId,
            'date_heure_debut' => now()->toDateTimeString(),
            'statut' => InterventionStatutEnum::EN_COURS->value,
        ]);
        $interventionResponse->assertStatus(201);
        $interventionId = $interventionResponse->json('data.id');

        // 8. Terminer l'intervention (Photos + CR)
        $photo = UploadedFile::fake()->image('chantier.jpg');
        $this->putJson("/api/interventions/{$interventionId}", [
            'statut' => InterventionStatutEnum::TERMINEE->value,
            'compte_rendu' => 'Gravats évacués vers la déchetterie.',
            'date_heure_fin' => now()->addHours(2)->toDateTimeString(),
            'photos' => [$photo]
        ])->assertStatus(200);

        // 9. Clôture par un Admin
        $this->authenticateAdmin();
        $this->postJson("/api/interventions/{$interventionId}/cloturer")->assertStatus(200);

        // 10. Vérifications finales
        // Statut signalement
        $this->assertEquals(SignalementStatutEnum::CLOTURE->value, Signalement::find($signalementId)->statut->value);

        // Gamification (Points pour le citoyen)
        $this->assertEquals(100, HistoriquePoint::where('user_id', $citizenId)->sum('nombre_points'));

        // Notification pour le citoyen
        $citizenUser = User::find($citizenId);
        $this->assertCount(6, $citizenUser->notifications); // Validation, Priorisation, Affectation, En Intervention, Terminé, Clôturé
        // Note: SignalementService::create ne notifie pas le créateur de sa propre création dans le code actuel.
    }
}
