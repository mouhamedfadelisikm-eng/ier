<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Signalement;
use App\Models\Zone;
use App\Models\TypeDechet;
use App\Enums\RoleEnum;
use App\Enums\SignalementStatutEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SignalementApiTest extends TestCase
{
    /**
     * RG3: Tout utilisateur authentifié peut créer plusieurs signalements.
     * RG4: Un signalement a un seul créateur authentifié.
     * RG10: Zone facultative à la création.
     * RG12: Type de déchet facultatif à la création.
     * RG14: Photographie facultative.
     */
    public function test_rg3_rg4_rg10_rg12_rg14_minimal_creation(): void
    {
        $user = $this->authenticateCitizen();

        $data = [
            'latitude' => 48.8566,
            'longitude' => 2.3522,
            'description' => 'Déchet sauvage dans la rue',
        ];

        $response = $this->postJson('/api/signalements', $data);

        $response->assertStatus(201)
                 ->assertJsonPath('data.user.id', $user->id)
                 ->assertJsonPath('data.statut', SignalementStatutEnum::EN_ATTENTE_VALIDATION->value)
                 ->assertJsonPath('data.zone', null)
                 ->assertJsonPath('data.type_dechets', []);

        $this->assertCount(1, $user->signalements);

        // Créer un deuxième signalement
        $this->postJson('/api/signalements', $data)->assertStatus(201);
        $this->assertCount(2, $user->fresh()->signalements);
    }

    /**
     * RG9: Identifiant signalement unique.
     */
    public function test_rg9_signalement_id_is_unique(): void
    {
        $this->authenticateCitizen();
        $data = ['latitude' => 0, 'longitude' => 0];

        $s1 = $this->postJson('/api/signalements', $data)->json('data.id');
        $s2 = $this->postJson('/api/signalements', $data)->json('data.id');

        $this->assertNotEquals($s1, $s2);
    }

    /**
     * RG10 & RG12: Qualification (Zone + Type).
     */
    public function test_rg10_rg12_qualification(): void
    {
        $this->authenticateAdmin();
        $zone = Zone::factory()->create();
        $type = TypeDechet::factory()->create();
        $signalement = Signalement::factory()->create(['statut' => SignalementStatutEnum::EN_ATTENTE_VALIDATION->value]);

        $data = [
            'zone_id' => $zone->id,
            'type_dechets' => [
                ['type_dechet_id' => $type->id, 'quantite_estime' => 2]
            ]
        ];

        $response = $this->putJson("/api/signalements/{$signalement->id}", $data);

        $response->assertStatus(200)
                 ->assertJsonPath('data.zone.id', $zone->id)
                 ->assertJsonCount(1, 'data.type_dechets');
    }

    /**
     * RG14, RG19, RG20: Photos.
     */
    public function test_rg14_rg19_rg20_photos_upload(): void
    {
        Storage::fake('public');
        $this->authenticateCitizen();

        $file1 = UploadedFile::fake()->image('photo1.jpg');
        $file2 = UploadedFile::fake()->image('photo2.png');

        $data = [
            'latitude' => 10,
            'longitude' => 20,
            'photos' => [$file1, $file2]
        ];

        $response = $this->postJson('/api/signalements', $data);

        $response->assertStatus(201)
                 ->assertJsonCount(2, 'data.photos');

        $signalementId = $response->json('data.id');
        $this->assertCount(2, Signalement::find($signalementId)->photos);

        // Vérifier le stockage
        $photoUrl = $response->json('data.photos.0.url');
        $path = str_replace('/storage/', '', parse_url($photoUrl, PHP_URL_PATH));
        Storage::disk('public')->assertExists($path);
    }

    /**
     * RG15: Tout signalement doit être validé ou rejeté.
     */
    public function test_rg15_admin_decision(): void
    {
        $this->authenticateAdmin();
        $signalement = Signalement::factory()->create(['statut' => SignalementStatutEnum::EN_ATTENTE_VALIDATION->value]);

        // Validation
        $this->postJson("/api/signalements/{$signalement->id}/valider")
             ->assertStatus(200)
             ->assertJsonPath('data.statut', SignalementStatutEnum::VALIDE->value);

        // Rejet (sur un nouveau signalement)
        $signalement2 = Signalement::factory()->create(['statut' => SignalementStatutEnum::EN_ATTENTE_VALIDATION->value]);
        $this->postJson("/api/signalements/{$signalement2->id}/rejeter")
             ->assertStatus(200)
             ->assertJsonPath('data.statut', SignalementStatutEnum::REJETE->value);
    }

    /**
     * RG11 & RG13 & RG18 & RG21: Relations multiple.
     */
    public function test_rg11_rg13_multiplicity(): void
    {
        $this->authenticateAdmin();
        $zone = Zone::factory()->create();
        $type = TypeDechet::factory()->create();

        $s1 = Signalement::factory()->create(['zone_id' => $zone->id]);
        $s2 = Signalement::factory()->create(['zone_id' => $zone->id]);

        $s1->typeDechets()->attach($type->id);
        $s2->typeDechets()->attach($type->id);

        $this->assertEquals($zone->id, $s1->zone_id);
        $this->assertEquals($zone->id, $s2->zone_id);
        $this->assertTrue($s1->typeDechets->contains($type));
        $this->assertTrue($s2->typeDechets->contains($type));
    }
}
