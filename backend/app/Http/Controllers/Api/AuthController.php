<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\AuthResource;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

final class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService,
    ) {
    }

    public function register(
        RegisterRequest $request
    ): JsonResponse {
        $result = $this->authService->register(
            $request->toDTO()
        );

        return new AuthResource($result)
            ->response()
            ->setStatusCode(201);
    }

    public function login(
        LoginRequest $request
    ): JsonResponse {
        $result = $this->authService->login(
            $request->toDTO()
        );

        return new AuthResource($result)
            ->response();
    }

    public function logout(Request $request): \Illuminate\Http\Response
    {
        $user = $request->user();

        $this->authService->logout(
            $user,
            (string) $user->currentAccessToken()->id
        );

        return response()->noContent();
    }

    public function forgotPassword(
        ForgotPasswordRequest $request
    ): JsonResponse {
        $this->authService->sendResetLink(
            $request->toDTO()
        );

        return response()->json([
            'message' => 'If the email exists, a reset link has been sent.',
        ]);
    }

    public function resetPassword(
        ResetPasswordRequest $request
    ): JsonResponse {
        $this->authService->resetPassword(
            $request->toDTO()
        );

        return response()->json([
            'message' => 'Password reset successfully.',
        ]);
    }
}
