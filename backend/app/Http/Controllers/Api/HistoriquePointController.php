<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HistoriquePointResource;
use App\Models\HistoriquePoint;
use App\Services\HistoriquePointService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class HistoriquePointController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly HistoriquePointService $service,
    ) {
    }

    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', HistoriquePoint::class);
        return HistoriquePointResource::collection($this->service->paginate());
    }

    public function show(HistoriquePoint $historiquePoint): HistoriquePointResource
    {
        $this->authorize('view', $historiquePoint);
        return new HistoriquePointResource($historiquePoint->load('user'));
    }
}
