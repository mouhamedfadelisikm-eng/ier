<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Zone\StoreZoneRequest;
use App\Http\Requests\Zone\UpdateZoneRequest;
use App\Http\Resources\ZoneResource;
use App\Models\Zone;
use App\Services\ZoneService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

final class ZoneController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly ZoneService $service,
    ) {
    }

    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Zone::class);
        return ZoneResource::collection($this->service->paginate());
    }

    public function show(Zone $zone): ZoneResource
    {
        $this->authorize('view', $zone);
        return new ZoneResource($zone);
    }

    public function store(StoreZoneRequest $request): JsonResponse
    {
        $this->authorize('create', Zone::class);
        $zone = $this->service->create($request->toDTO());
        return (new ZoneResource($zone))->response()->setStatusCode(201);
    }

    public function update(UpdateZoneRequest $request, Zone $zone): ZoneResource
    {
        $this->authorize('update', $zone);
        $updated = $this->service->update($zone, $request->toDTO());
        return new ZoneResource($updated);
    }

    public function destroy(Zone $zone): Response
    {
        $this->authorize('delete', $zone);
        $this->service->delete($zone);
        return response()->noContent();
    }
}
