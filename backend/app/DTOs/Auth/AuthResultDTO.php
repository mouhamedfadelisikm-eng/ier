<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\DTOs\BaseDTO;
use App\Models\User;

readonly class AuthResultDTO extends BaseDTO
{
    public function __construct(
        public User $user,
        public string $token,
    ) {
    }

    public function toArray(): array
    {
        return [
            'user' => $this->user,
            'token' => $this->token,
        ];
    }
}
