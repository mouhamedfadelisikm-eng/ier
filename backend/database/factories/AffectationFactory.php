<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Affectation;
use App\Models\Equipe;
use App\Models\Signalement;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Affectation>
 */
final class AffectationFactory extends Factory
{
    protected $model = Affectation::class;

    public function definition(): array
    {
        return [
            'date_heure_affectation' => $this->faker->dateTimeBetween('-2 months', 'now')->format('Y-m-d H:i:s'),
            'observation' => $this->faker->optional()->sentence(),
            'equipe_id' => Equipe::factory(),
            'signalement_id' => Signalement::factory()->valide(),
        ];
    }
}
