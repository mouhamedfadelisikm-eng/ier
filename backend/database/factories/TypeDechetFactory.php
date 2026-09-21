<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\TypeDechet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TypeDechet>
 */
final class TypeDechetFactory extends Factory
{
    protected $model = TypeDechet::class;

    public function definition(): array
    {
        $types = [
            'Déchets ménagers', 'Déchets plastiques', 'Déchets organiques',
            'Déchets électroniques', 'Déchets encombrants', 'Déchets dangereux',
            'Déchets de construction', 'Déchets recyclables', 'Déchets médicaux',
        ];

        return [
            'libelle' => $this->faker->unique()->randomElement($types),
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}
