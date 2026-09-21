<?php

namespace Tests\Feature;

use App\Models\TypeDechet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TypeDechetApiTest extends TestCase
{
    /**
     * RG17: Chaque type de déchet est identifié de manière unique.
     */
    public function test_rg17_type_dechet_libelle_is_unique(): void
    {
        $this->authenticateAdmin();
        TypeDechet::factory()->create(['libelle' => 'Plastique']);

        $response = $this->postJson('/api/types-dechets', [
            'libelle' => 'Plastique',
            'description' => 'Un autre type plastique',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['libelle']);
    }
}
