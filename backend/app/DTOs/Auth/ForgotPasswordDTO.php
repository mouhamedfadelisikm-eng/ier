<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\DTOs\BaseDTO;

readonly class ForgotPasswordDTO extends BaseDTO
{
    public function __construct(
        public string $email,
    ) {
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
        ];
    }
}
