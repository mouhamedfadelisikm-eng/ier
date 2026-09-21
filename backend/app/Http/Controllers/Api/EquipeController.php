<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Equipe\StoreEquipeRequest;
use App\Http\Requests\Equipe\UpdateEquipeRequest;
use App\Http\Resources\EquipeResource;
use App\Models\Equipe;
use App\Services\EquipeService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

final class EquipeController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly EquipeService $service,
    ) {
    }

    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Equipe::class);
        return EquipeResource::collection($this->service->paginate());
    }

    public function show(Equipe $equipe): EquipeResource
    {
        $this->authorize('view', $equipe);
        return new EquipeResource($equipe->load(['agents', 'zones']));
    }

    public function store(StoreEquipeRequest $request): JsonResponse
    {
        $this->authorize('create', Equipe::class);
        $equipe = $this->service->create($request->toDTO());
        return (new EquipeResource($equipe->load('agents')))->response()->setStatusCode(201);
    }

    public function update(UpdateEquipeRequest $request, Equipe $equipe): EquipeResource
    {
        $this->authorize('update', $equipe);
        $updated = $this->service->update($equipe, $request->toDTO());
        return new EquipeResource($updated->load(['agents', 'zones']));
    }

    public function destroy(Equipe $equipe): Response
    {
        $this->authorize('delete', $equipe);
        $this->service->delete($equipe);
        return response()->noContent();
    }
}
