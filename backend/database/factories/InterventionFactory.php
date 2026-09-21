<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\InterventionStatutEnum;
use App\Models\Affectation;
use App\Models\Intervention;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Intervention>
 */
final class InterventionFactory extends Factory
{
    protected $model = Intervention::class;

    public function definition(): array
    {
        $debut = $this->faker->dateTimeBetween('-1 month', 'now');

        return [
            'date_heure_debut' => $debut->format('Y-m-d H:i:s'),
            'date_heure_fin' => null,
            'statut' => InterventionStatutEnum::EN_COURS->value,
            'compte_rendu' => null,
            'observation' => $this->faker->optional()->sentence(),
            'affectation_id' => Affectation::factory(),
        ];
    }

    public function terminee(): static
    {
        return $this->state(function (array $attributes) {
            $debut = new \DateTime($attributes['date_heure_debut']);
            return [
                'statut' => InterventionStatutEnum::TERMINEE->value,
                'date_heure_fin' => $this->faker->dateTimeBetween($debut, 'now')->format('Y-m-d H:i:s'),
                'compte_rendu' => $this->faker->paragraph(),
            ];
        });
    }
}
