<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\SignalementPrioriteEnum;
use App\Enums\SignalementStatutEnum;
use App\Models\Signalement;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Signalement>
 */
final class SignalementFactory extends Factory
{
    protected $model = Signalement::class;

    public function definition(): array
    {
        return [
            'description' => $this->faker->sentence(),

            'latitude' => (float) $this->faker->latitude(0, 20),
            'longitude' => (float) $this->faker->longitude(-20, 20),

            'statut' => SignalementStatutEnum::EN_ATTENTE_VALIDATION->value,

            'priorite' => $this->faker
                ->randomElement(SignalementPrioriteEnum::cases())
                ->value,

            'user_id' => User::factory(),

            // Par défaut un signalement appartient à une zone.
            'zone_id' => Zone::factory(),
        ];
    }

    public function sansDescription(): static
    {
        return $this->state(fn () => [
            'description' => null,
        ]);
    }

    public function sansZone(): static
    {
        return $this->state(fn () => [
            'zone_id' => null,
        ]);
    }

    public function valide(): static
    {
        return $this->state(fn () => [
            'statut' => SignalementStatutEnum::VALIDE->value,
        ]);
    }

    public function priorise(): static
    {
        return $this->state(fn () => [
            'statut' => SignalementStatutEnum::PRIORISE->value,
        ]);
    }

    public function affecte(): static
    {
        return $this->state(fn () => [
            'statut' => SignalementStatutEnum::AFFECTE->value,
        ]);
    }

    public function enIntervention(): static
    {
        return $this->state(fn () => [
            'statut' => SignalementStatutEnum::EN_INTERVENTION->value,
        ]);
    }

    public function termine(): static
    {
        return $this->state(fn () => [
            'statut' => SignalementStatutEnum::TERMINE->value,
        ]);
    }

    public function cloture(): static
    {
        return $this->state(fn () => [
            'statut' => SignalementStatutEnum::CLOTURE->value,
        ]);
    }

    public function rejete(): static
    {
        return $this->state(fn () => [
            'statut' => SignalementStatutEnum::REJETE->value,
        ]);
    }
}
