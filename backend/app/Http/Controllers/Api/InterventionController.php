<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Intervention\StoreInterventionRequest;
use App\Http\Requests\Intervention\UpdateInterventionRequest;
use App\Http\Resources\InterventionResource;
use App\Models\Intervention;
use App\Services\InterventionService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

final class InterventionController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly InterventionService $service,
    ) {
    }

    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Intervention::class);
        return InterventionResource::collection($this->service->paginate(15, auth()->user()));
    }

    public function show(Intervention $intervention): InterventionResource
    {
        $this->authorize('view', $intervention);
        return new InterventionResource($intervention->load(['affectation', 'photos']));
    }

    public function store(StoreInterventionRequest $request): JsonResponse
    {
        $this->authorize('create', Intervention::class);
        $intervention = $this->service->create($request->toDTO());
        return (new InterventionResource($intervention->load(['affectation', 'photos'])))->response()->setStatusCode(201);
    }

    public function update(UpdateInterventionRequest $request, Intervention $intervention): InterventionResource
    {
        $this->authorize('update', $intervention);
        $updated = $this->service->update($intervention, $request->toDTO());
        return new InterventionResource($updated->load(['affectation', 'photos']));
    }

    /**
     * Clôturer une intervention (termine le cycle de vie du signalement).
     */
    public function cloturer(Intervention $intervention): InterventionResource
    {
        $this->authorize('cloturer', $intervention);
        $cloturee = $this->service->cloturer($intervention);
        return new InterventionResource($cloturee->load(['affectation', 'photos']));
    }

    public function destroy(Intervention $intervention): Response
    {
        $this->authorize('delete', $intervention);
        $this->service->delete($intervention);
        return response()->noContent();
    }
}
