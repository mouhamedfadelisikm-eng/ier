<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\DTOs\BaseDTO;
use App\Models\User;

final readonly class AuthenticatedUserDTO extends BaseDTO
{
    public function __construct(
        public User $user,
        public string $accessToken,
    ) {
    }

    public function toArray(): array
    {
        return [
            'user' => $this->user,
            'accessToken' => $this->accessToken,
        ];
    }
}
