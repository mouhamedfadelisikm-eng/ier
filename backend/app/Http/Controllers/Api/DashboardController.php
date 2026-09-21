<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HeatmapResource;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

final class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $service,
    ) {
    }

    public function heatmap(): JsonResponse
    {
        return response()->json(
            HeatmapResource::collection(
                $this->service->getHeatmapData()
            )->resolve()
        );
    }
}
