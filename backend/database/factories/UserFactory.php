<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * Le mot de passe utilisé par défaut.
     */
    protected static ?string $password;

    /**
     * Définition de l'état par défaut.
     */
    public function definition(): array
    {
        return [
            'nom' => fake()->lastName(),

            'prenom' => fake()->firstName(),

            'email' => fake()->unique()->safeEmail(),

            'email_verified_at' => now(),

            'telephone' => fake()->unique()->numerify('77########'),

            'adresse' => fake()->address(),

            'etat_compte' => 'actif',

            'password' => static::$password
                ??= Hash::make('password'),

            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Adresse email non vérifiée.
     */
    public function unverified(): static
    {
        return $this->state(fn () => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Compte suspendu.
     */
    public function suspended(): static
    {
        return $this->state(fn () => [
            'etat_compte' => 'suspendu',
        ]);
    }

    /**
     * Compte inactif.
     */
    public function inactive(): static
    {
        return $this->state(fn () => [
            'etat_compte' => 'inactif',
        ]);
    }
}
