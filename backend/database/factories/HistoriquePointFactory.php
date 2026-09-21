<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\HistoriquePoint;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HistoriquePoint>
 */
final class HistoriquePointFactory extends Factory
{
    protected $model = HistoriquePoint::class;

    public function definition(): array
    {
        $motifs = [
            'Signalement créé',
            'Signalement clôturé',
            'Signalement validé par admin',
            'Participation active',
        ];

        return [
            'nombre_points' => $this->faker->numberBetween(10, 200),
            'motif' => $this->faker->randomElement($motifs),
            'description' => $this->faker->optional()->sentence(),
            'date_attribution' => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'user_id' => User::factory(),
        ];
    }
}
