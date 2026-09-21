<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\DTOs\BaseDTO;

readonly class ResetPasswordDTO extends BaseDTO
{
    public function __construct(
        public string $email,
        public string $token,
        public string $password,
    ) {
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'token' => $this->token,
            'password' => $this->password,
        ];
    }
}
