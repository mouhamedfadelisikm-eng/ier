<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Signalement\StoreSignalementRequest;
use App\Http\Requests\Signalement\UpdateSignalementRequest;
use App\Http\Requests\Signalement\PrioritizeSignalementRequest;
use App\Http\Resources\SignalementResource;
use App\Models\Signalement;
use App\Services\SignalementService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

final class SignalementController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly SignalementService $service,
    ) {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Signalement::class);

        $user = $request->user();

        if ($user !== null && $user->isCitizen()) {
            return SignalementResource::collection(
                Signalement::query()
                    ->where('user_id', $user->id)
                    ->latest()
                    ->paginate(15)
            );
        }

        return SignalementResource::collection(
            $this->service->paginate()
        );
    }

    public function show(Signalement $signalement): SignalementResource
    {
        $this->authorize('view', $signalement);

        return new SignalementResource(
            $signalement->load([
                'user',
                'zone',
                'typeDechets',
                'photos',
            ])
        );
    }

    public function store(StoreSignalementRequest $request): JsonResponse
    {
        $this->authorize('create', Signalement::class);

        $signalement = $this->service->create(
            $request->toDTO()
        );

        return (new SignalementResource(
            $signalement->load([
                'user',
                'zone',
                'typeDechets',
                'photos',
            ])
        ))
            ->response()
            ->setStatusCode(201);
    }

    public function validateSignalement(Signalement $signalement): SignalementResource
    {
        $this->authorize('validate', $signalement);

        return new SignalementResource(
            $this->service->validate($signalement)->load(['user', 'zone', 'typeDechets', 'photos'])
        );
    }

    public function reject(Signalement $signalement): SignalementResource
    {
        $this->authorize('reject', $signalement);

        return new SignalementResource(
            $this->service->reject($signalement)->load(['user', 'zone', 'typeDechets', 'photos'])
        );
    }

    public function prioritize(
        PrioritizeSignalementRequest $request,
        Signalement $signalement
    ): SignalementResource
    {
        $this->authorize('prioritize', $signalement);

        return new SignalementResource(
            $this->service->prioritize($signalement, $request->priorite())
                ->load(['user', 'zone', 'typeDechets', 'photos'])
        );
    }

    public function update(
        UpdateSignalementRequest $request,
        Signalement $signalement
    ): SignalementResource {
        $this->authorize('update', $signalement);

        $updated = $this->service->update(
            $signalement,
            $request->toDTO()
        );

        return new SignalementResource(
            $updated->load([
                'user',
                'zone',
                'typeDechets',
                'photos',
            ])
        );
    }

    public function destroy(Signalement $signalement): Response
    {
        $this->authorize('delete', $signalement);

        $this->service->delete($signalement);

        return response()->noContent();
    }
}
