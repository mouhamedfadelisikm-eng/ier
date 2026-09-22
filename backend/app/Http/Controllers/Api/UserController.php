<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

final class UserController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly UserService $userService,
    ) {
    }


    public function getCurrentUser(Request $request): UserResource
    {
        return new UserResource($request->user()->load('roles'));
    }


    public function updateCurrentUser(UpdateProfileRequest $request): UserResource
    {
        /** @var User $user */
        $user = auth()->user();

        return new UserResource(
            $this->userService->update(
                $user,
                $request->toDTO()
            )
        );
    }


    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', User::class);
        return UserResource::collection(
            $this->userService->paginate(
                $request->only(['nom', 'email', 'role']),
                (int) $request->query('per_page', 15)
            )
        );
    }


    public function show(
        User $user
    ): UserResource {

        $this->authorize(
            'view',
            $user
        );


        return new UserResource(
            $user->load('roles')
        );
    }


    public function store(
        StoreUserRequest $request
    ): JsonResponse {

        $this->authorize(
            'create',
            User::class
        );

        $user = $this->userService->create(
            $request->toDTO()
        );


        return response()->json(
            new UserResource($user),
            201
        );
    }


    public function update(
        UpdateUserRequest $request,
        User $user
    ): UserResource {

        $this->authorize(
            'update',
            $user
        );


        return new UserResource(
            $this->userService->update(
                $user,
                $request->toDTO()
            )
        );
    }


    public function destroy(
        User $user
    ): Response
    {
        $this->authorize(
            'delete',
            $user
        );

        $this->userService->delete($user);

        return response()->noContent();
    }
}
