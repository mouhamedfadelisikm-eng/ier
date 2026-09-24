<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\Auth\ForgotPasswordDTO;
use App\DTOs\Auth\LoginDTO;
use App\DTOs\Auth\RegisterDTO;
use App\DTOs\Auth\ResetPasswordDTO;
use App\Exceptions\Auth\InvalidCredentialsException;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

final readonly class AuthService
{
    private const string TOKEN_NAME = 'auth_token';
    public function __construct(
        private UserService $userService,
    ) {
    }

    /**
     * Register a new user and create a Sanctum token.
     *
     * @return array{user: User, token: string}
     */
    public function register(RegisterDTO $dto): array
    {
        return DB::transaction(function () use ($dto): array {
            $user = $this->userService->create(
                $dto->toCreateUserDTO()
            );

            $token = $this->createToken($user);

            return [
                'user' => $user,
                'token' => $token,
            ];
        });
    }

    private function createToken(User $user): string
    {
        return $user
            ->createToken(self::TOKEN_NAME)
            ->plainTextToken;
    }

    /**
     * @throws InvalidCredentialsException
     */
    public function login(LoginDTO $dto): array
    {
        $user = $this->authenticateCredentials($dto);
        $token = $this->createToken($user);

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Authenticate first-party SPA credentials without issuing an API token.
     *
     * @throws InvalidCredentialsException
     */
    public function loginSession(LoginDTO $dto): User
    {
        return $this->authenticateCredentials($dto);
    }

    private function authenticateCredentials(LoginDTO $dto): User
    {
        $user = $this->userService->findByEmail(
            $dto->email
        );

        if (
            $user === null ||
            $user->etat_compte !== 'actif' ||
            ! Hash::check(
                $dto->password,
                $user->password
            )
        ) {
            throw new InvalidCredentialsException();
        }

        return $user;
    }

    public function logout(
        User $user,
        string $tokenId
    ): void {
        $user->tokens()
            ->where('id', $tokenId)
            ->delete();
    }

    public function sendResetLink(
        ForgotPasswordDTO $dto
    ): string {
        return Password::sendResetLink([
            'email' => $dto->email,
        ]);
    }

    public function resetPassword(
        ResetPasswordDTO $dto
    ): void {
        $status = Password::reset(
            [
                'email' => $dto->email,
                'password' => $dto->password,
                'password_confirmation' => $dto->password,
                'token' => $dto->token,
            ],
            function (User $user, string $password): void {
                $user->password = $password;
                $user->save();

                // A password reset invalidates every previously issued API token.
                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }
    }

}
