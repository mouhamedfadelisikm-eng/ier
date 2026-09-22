<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Signalement;
use App\Enums\RoleEnum;
use App\Enums\SignalementStatutEnum;
use App\Enums\SignalementPrioriteEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SignalementWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_cannot_bypass_status_via_put(): void
    {
        $this->authenticateAdmin();

        $signalement = Signalement::factory()->create(['statut' => SignalementStatutEnum::EN_ATTENTE_VALIDATION]);

        $response = $this->putJson("/api/signalements/{$signalement->id}", [
            'statut' => SignalementStatutEnum::CLOTURE->value
        ]);

        $response->assertStatus(403);
        $this->assertEquals(SignalementStatutEnum::EN_ATTENTE_VALIDATION, $signalement->fresh()->statut);
    }

    public function test_cannot_bypass_priority_via_put(): void
    {
        $this->authenticateAdmin();

        $signalement = Signalement::factory()->create(['priorite' => SignalementPrioriteEnum::NORMALE]);

        $response = $this->putJson("/api/signalements/{$signalement->id}", [
            'priorite' => SignalementPrioriteEnum::URGENTE->value
        ]);

        $response->assertStatus(403);
        $this->assertEquals(SignalementPrioriteEnum::NORMALE, $signalement->fresh()->priorite);
    }

    public function test_citizen_can_update_description_of_their_own_signalement(): void
    {
        $citizen = $this->authenticateCitizen();
        $signalement = Signalement::factory()->create(['user_id' => $citizen->id, 'description' => 'Old']);

        $response = $this->putJson("/api/signalements/{$signalement->id}", [
            'description' => 'New description'
        ]);

        $response->assertStatus(200);
        $this->assertEquals('New description', $signalement->fresh()->description);
    }

    public function test_citizen_cannot_update_others_signalement(): void
    {
        $this->authenticateCitizen();

        $other = User::factory()->create();
        $signalement = Signalement::factory()->create(['user_id' => $other->id, 'description' => 'Old']);

        $response = $this->putJson("/api/signalements/{$signalement->id}", [
            'description' => 'New'
        ]);

        $response->assertStatus(403);
    }
}
