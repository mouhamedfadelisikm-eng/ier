<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Equipe;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Equipe>
 */
final class EquipeFactory extends Factory
{
    protected $model = Equipe::class;

    public function definition(): array
    {
        return [
            'nom_equipe' => 'Équipe ' . $this->faker->unique()->word(),
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}
