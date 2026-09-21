<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\DTOs\User\UpdateUserDTO;
use App\Enums\RoleEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'nom' => [
                'sometimes',
                'string',
                'max:100',
            ],

            'prenom' => [
                'sometimes',
                'string',
                'max:100',
            ],

            'email' => [
                'sometimes',
                'email',
                'unique:users,email,' . $this->user->id,
            ],

            'password' => [
                'sometimes',
                'string',
                'min:8',
                'confirmed',
            ],

            'role' => [
                'sometimes',
                new Enum(RoleEnum::class),
            ],

            'telephone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'adresse' => [
                'nullable',
                'string',
                'max:255',
            ],
        ];
    }


    public function toDTO(): UpdateUserDTO
    {
        return new UpdateUserDTO(
            nom: $this->validated('nom'),
            prenom: $this->validated('prenom'),
            email: $this->validated('email'),
            password: $this->validated('password'),

            role: $this->filled('role')
                ? RoleEnum::from(
                    $this->validated('role')
                )
                : null,
            telephone: $this->validated('telephone'),
            adresse: $this->validated('adresse'),
        );
    }
}
