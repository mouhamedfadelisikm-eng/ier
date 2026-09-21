<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Enums\SignalementStatutEnum;
use App\Models\Signalement;
use App\Repositories\Contracts\DashboardRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class DashboardRepository implements DashboardRepositoryInterface
{
    public function __construct(
        private readonly Signalement $model,
    ) {
    }

    public function getHeatmapData(): Collection
    {
        return $this->model
            ->newQuery()
            ->toBase()
            ->select([
                'signalements.zone_id',
                DB::raw('MIN(zones.nom_zone) AS zone_nom'),
                DB::raw('AVG(signalements.latitude) AS latitude'),
                DB::raw('AVG(signalements.longitude) AS longitude'),
                DB::raw('COUNT(*) AS weight'),
            ])
            ->leftJoin('zones', 'zones.id', '=', 'signalements.zone_id')
            ->whereIn('signalements.statut', SignalementStatutEnum::statutsActifs())
            ->groupBy('signalements.zone_id')
            ->orderByDesc('weight')
            ->get();
    }
}
