<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Affectation\ReassignAffectationRequest;
use App\Http\Requests\Affectation\StoreAffectationRequest;
use App\Http\Resources\AffectationResource;
use App\Models\Affectation;
use App\Services\AffectationService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

final class AffectationController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly AffectationService $service,
    ) {
    }

    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Affectation::class);
        return AffectationResource::collection(
            $this->service->paginate(15, auth()->user())
        );
    }

    public function show(Affectation $affectation): AffectationResource
    {
        $this->authorize('view', $affectation);
        return new AffectationResource($affectation->load(['equipe', 'signalement']));
    }

    public function store(StoreAffectationRequest $request): JsonResponse
    {
        $this->authorize('create', Affectation::class);
        $affectation = $this->service->create($request->toDTO());
        return (new AffectationResource($affectation->load(['equipe', 'signalement'])))->response()->setStatusCode(201);
    }

    public function reassign(
        ReassignAffectationRequest $request,
        Affectation $affectation
    ): JsonResponse
    {
        $this->authorize('update', $affectation);

        $new = $this->service->reassign(
            $affectation,
            $request->toDTO((int) $affectation->signalement_id)
        );

        return (new AffectationResource(
            $new->load(['equipe', 'signalement'])
        ))->response()->setStatusCode(201);
    }

    public function destroy(Affectation $affectation): Response
    {
        $this->authorize('delete', $affectation);
        $this->service->delete($affectation);
        return response()->noContent();
    }
}
