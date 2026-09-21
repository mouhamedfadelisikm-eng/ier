<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface DashboardRepositoryInterface
{
    /**
     * Agrège les signalements actifs par zone (poids = nombre de signalements).
     *
     * @return Collection<int, \stdClass>
     */
    public function getHeatmapData(): Collection;
}
