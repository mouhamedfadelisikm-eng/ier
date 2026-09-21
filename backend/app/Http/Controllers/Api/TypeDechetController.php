<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TypeDechet\StoreTypeDechetRequest;
use App\Http\Requests\TypeDechet\UpdateTypeDechetRequest;
use App\Http\Resources\TypeDechetResource;
use App\Models\TypeDechet;
use App\Services\TypeDechetService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

final class TypeDechetController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly TypeDechetService $service,
    ) {
    }

    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', TypeDechet::class);
        return TypeDechetResource::collection($this->service->paginate());
    }

    public function show(TypeDechet $typesDechet): TypeDechetResource
    {
        $this->authorize('view', $typesDechet);
        return new TypeDechetResource($typesDechet);
    }

    public function store(StoreTypeDechetRequest $request): JsonResponse
    {
        $this->authorize('create', TypeDechet::class);
        $typeDechet = $this->service->create($request->toDTO());
        return (new TypeDechetResource($typeDechet))->response()->setStatusCode(201);
    }

    public function update(UpdateTypeDechetRequest $request, TypeDechet $typesDechet): TypeDechetResource
    {
        $this->authorize('update', $typesDechet);
        $updated = $this->service->update($typesDechet, $request->toDTO());
        return new TypeDechetResource($updated);
    }

    public function destroy(TypeDechet $typesDechet): Response
    {
        $this->authorize('delete', $typesDechet);
        $this->service->delete($typesDechet);
        return response()->noContent();
    }
}
