<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Signalement;
use App\Services\HistoriquePointService;
use App\Repositories\Eloquent\HistoriquePointRepository;
use Tests\TestCase;

class HistoriquePointServiceTest extends TestCase
{
    public function test_award_points_is_idempotent_for_signalement(): void
    {
        $user = User::factory()->create();
        $signalement = Signalement::factory()->create();

        $service = app(HistoriquePointService::class);

        // Premier appel
        $p1 = $service->awardPoints($user->id, 100, 'Test', 'Desc', $signalement->id);

        // Deuxième appel
        $p2 = $service->awardPoints($user->id, 100, 'Test', 'Desc', $signalement->id);

        $this->assertEquals($p1->id, $p2->id);
        $this->assertDatabaseCount('historique_points', 1);
    }
}
