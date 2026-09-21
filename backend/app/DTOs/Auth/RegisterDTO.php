<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

use App\DTOs\BaseDTO;
use App\DTOs\User\CreateUserDTO;
use App\Enums\RoleEnum;

readonly class RegisterDTO extends BaseDTO
{
    public function __construct(
        public string $nom,
        public string $prenom,
        public string $email,
        public string $password,
    ) {
    }

    public function toArray(): array
    {
        return [
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'email' => $this->email,
            'password' => $this->password,
        ];
    }

    public function toCreateUserDTO(): CreateUserDTO
    {
        return new CreateUserDTO(
            nom: $this->nom,
            prenom: $this->prenom,
            email: $this->email,
            password: $this->password,
            role: RoleEnum::CITIZEN,
        );
    }
}
