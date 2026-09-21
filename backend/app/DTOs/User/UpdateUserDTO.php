<?php

declare(strict_types=1);

namespace App\DTOs\User;

use App\Enums\RoleEnum;

final readonly class UpdateUserDTO
{
    public function __construct(
        public ?string $nom = null,
        public ?string $prenom = null,
        public ?string $email = null,
        public ?string $password = null,
        public ?RoleEnum $role = null,
        public ?string $telephone = null,
        public ?string $adresse = null,
    ) {
    }


    public function toArray(): array
    {
        return array_filter([
            'nom'      => $this->nom,
            'prenom'   => $this->prenom,
            'email'    => $this->email,
            'password' => $this->password,
            'telephone'=> $this->telephone,
            'adresse'  => $this->adresse,
        ], fn ($value) => $value !== null);
    }
}
