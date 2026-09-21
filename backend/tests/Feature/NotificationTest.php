<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Signalement;
use App\Enums\SignalementStatutEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use App\Notifications\SignalementStatusChanged;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    /**
     * Vérifier que le créateur reçoit une notification lors d'un changement de statut.
     */
    public function test_user_receives_notification_on_status_change(): void
    {
        $this->authenticateAdmin();
        $citizen = User::factory()->create();
        $citizen->assignRole(\App\Enums\RoleEnum::CITIZEN->value);

        $signalement = Signalement::factory()->create([
            'user_id' => $citizen->id,
            'statut' => SignalementStatutEnum::EN_ATTENTE_VALIDATION->value
        ]);

        // Changement de statut (Validation)
        $this->postJson("/api/signalements/{$signalement->id}/valider")->assertStatus(200);

        // Vérifier en base (via le trait Notifiable)
        $this->assertCount(1, $citizen->notifications);
        $notification = $citizen->notifications->first();
        $this->assertEquals('signalement.status_changed', $notification->data['type']);
        $this->assertEquals(SignalementStatutEnum::VALIDE->value, $notification->data['new_status']);
    }
}
