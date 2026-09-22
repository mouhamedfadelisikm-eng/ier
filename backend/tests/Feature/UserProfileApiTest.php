<?php

namespace Tests\Feature;

use App\Models\User;
use App\Enums\RoleEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserProfileApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_get_their_profile(): void
    {
        $user = $this->authenticateCitizen([
            'nom' => 'Sow',
            'prenom' => 'Mamadou',
        ]);

        $response = $this->getJson('/api/user');

        $response->assertStatus(200)
                 ->assertJsonPath('data.nom', 'Sow')
                 ->assertJsonPath('data.prenom', 'Mamadou');
    }

    public function test_citizen_can_update_their_own_profile(): void
    {
        $user = $this->authenticateCitizen([
            'nom' => 'OldName',
            'prenom' => 'OldPrenom',
        ]);

        $response = $this->putJson('/api/user', [
            'nom' => 'NewName',
            'prenom' => 'NewPrenom',
            'telephone' => '771234567',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.nom', 'NewName')
                 ->assertJsonPath('data.prenom', 'NewPrenom')
                 ->assertJsonPath('data.telephone', '771234567');

        $this->assertEquals('NewName', $user->fresh()->nom);
    }

    public function test_agent_can_update_their_own_profile(): void
    {
        $user = $this->authenticateAgent([
            'nom' => 'AgentOld',
        ]);

        $response = $this->putJson('/api/user', [
            'nom' => 'AgentNew',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('AgentNew', $user->fresh()->nom);
    }

    public function test_admin_can_update_their_own_profile(): void
    {
        $user = $this->authenticateAdmin([
            'nom' => 'AdminOld',
        ]);

        $response = $this->putJson('/api/user', [
            'nom' => 'AdminNew',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('AdminNew', $user->fresh()->nom);
    }

    public function test_update_profile_respects_email_uniqueness(): void
    {
        $otherUser = User::factory()->create(['email' => 'taken@example.com']);
        $user = $this->authenticateCitizen(['email' => 'my@email.com']);

        $response = $this->putJson('/api/user', [
            'email' => 'taken@example.com',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_update_profile_can_change_password(): void
    {
        $user = $this->authenticateCitizen(['password' => Hash::make('old_password')]);

        $response = $this->putJson('/api/user', [
            'password' => 'new_password_123',
            'password_confirmation' => 'new_password_123',
        ]);

        $response->assertStatus(200);
        $this->assertTrue(Hash::check('new_password_123', $user->fresh()->password));
    }

    public function test_update_profile_fails_if_password_confirmation_mismatch(): void
    {
        $this->authenticateCitizen();

        $response = $this->putJson('/api/user', [
            'password' => 'new_password',
            'password_confirmation' => 'mismatch',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }

    public function test_update_profile_cannot_change_role(): void
    {
        $user = $this->authenticateCitizen();
        $this->assertTrue($user->hasRole(RoleEnum::CITIZEN->value));

        $response = $this->putJson('/api/user', [
            'role' => RoleEnum::ADMIN->value,
            'nom' => 'KeepName'
        ]);

        $response->assertStatus(200);
        $user->refresh();
        $this->assertTrue($user->hasRole(RoleEnum::CITIZEN->value));
        $this->assertFalse($user->hasRole(RoleEnum::ADMIN->value));
    }

    public function test_update_profile_without_changes_returns_current_profile(): void
    {
        $user = $this->authenticateCitizen(['nom' => 'NoChange']);

        $response = $this->putJson('/api/user', []);

        $response->assertStatus(200)
                 ->assertJsonPath('data.nom', 'NoChange');
    }
}
