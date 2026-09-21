<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\Dashboard\HeatmapPointDTO;
use App\Repositories\Contracts\DashboardRepositoryInterface;
use Illuminate\Support\Collection;
use stdClass;

final readonly class DashboardService
{
    public function __construct(
        private DashboardRepositoryInterface $repository,
    ) {
    }

    /**
     * @return Collection<int, HeatmapPointDTO>
     */
    public function getHeatmapData(): Collection
    {
        return $this->repository->getHeatmapData()
            ->map(static fn (stdClass $row): HeatmapPointDTO => HeatmapPointDTO::fromRow($row));
    }
}
