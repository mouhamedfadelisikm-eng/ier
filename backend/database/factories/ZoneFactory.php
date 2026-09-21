<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Zone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Zone>
 */
final class ZoneFactory extends Factory
{
    protected $model = Zone::class;

    public function definition(): array
    {
        $zones = [
            'Zone Nord', 'Zone Sud', 'Zone Est', 'Zone Ouest', 'Zone Centre',
            'Zone Industrielle', 'Zone Résidentielle', 'Zone Commerciale',
            'Zone Périphérique', 'Zone Rurale',
        ];

        return [
            'nom_zone' => $this->faker->unique()->randomElement($zones),
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}
