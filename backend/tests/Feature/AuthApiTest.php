<?php

namespace Tests\Feature;

use App\Models\User;
use App\Enums\RoleEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthApiTest extends TestCase
{
    /**
     * RG1: Chaque utilisateur est identifié de manière unique dans le système (ID + Email unique).
     */
    public function test_rg1_user_identification_is_unique(): void
    {
        $email = 'test@example.com';

        User::factory()->create(['email' => $email]);

        $this->expectException(\Illuminate\Database\QueryException::class);
        User::factory()->create(['email' => $email]);
    }

    /**
     * RG2: Un utilisateur possède exactement un seul rôle.
     */
    public function test_rg2_user_has_exactly_one_role(): void
    {
        $user = User::factory()->create();

        $user->assignRole(RoleEnum::CITIZEN->value);
        $this->assertTrue($user->hasRole(RoleEnum::CITIZEN->value));
        $this->assertCount(1, $user->roles);

        // Tentative d'ajouter un deuxième rôle (doit échouer à cause de la contrainte unique en DB)
        try {
            DB::table('model_has_roles')->insert([
                'role_id' => Role::findByName(RoleEnum::AGENT->value)->id,
                'model_type' => User::class,
                'model_id' => $user->id,
            ]);
            $this->fail("La contrainte d'unicité sur le rôle n'a pas fonctionné.");
        } catch (\Illuminate\Database\QueryException $e) {
            $this->assertStringContainsString('model_has_roles_single_role_unique', $e->getMessage());
        }
    }

    public function test_user_registration_assigns_default_role(): void
    {
        $data = [
            'nom' => 'Doe',
            'prenom' => 'John',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => RoleEnum::CITIZEN->value,
        ];

        $response = $this->postJson('/api/auth/register', $data);

        $response->assertStatus(201)
                 ->assertJsonPath('data.user.email', 'john@example.com');

        $user = User::where('email', 'john@example.com')->first();
        $this->assertTrue($user->hasRole(RoleEnum::CITIZEN->value));
        $this->assertCount(1, $user->roles);
    }

    public function test_user_cannot_register_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'duplicate@example.com']);

        $data = [
            'nom' => 'Doe',
            'prenom' => 'John',
            'email' => 'duplicate@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => RoleEnum::CITIZEN->value,
        ];

        $response = $this->postJson('/api/auth/register', $data);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_user_login_returns_token(): void
    {
        $password = 'Password123!';
        $user = User::factory()->create([
            'password' => Hash::make($password)
        ]);
        $user->assignRole(RoleEnum::CITIZEN->value);

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'token',
                         'user'
                     ]
                 ]);
    }
}
