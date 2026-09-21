<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\DTOs\User\CreateUserDTO;
use App\Enums\RoleEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'nom' => [
                'required',
                'string',
                'max:100',
            ],

            'prenom' => [
                'required',
                'string',
                'max:100',
            ],

            'email' => [
                'required',
                'email',
                'unique:users,email',
            ],

            'password' => [
                'required',
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


    public function toDTO(): CreateUserDTO
    {
        return new CreateUserDTO(
            nom: $this->validated('nom'),
            prenom: $this->validated('prenom'),
            email: $this->validated('email'),
            password: $this->validated('password'),
            role: $this->filled('role')
                ? RoleEnum::from($this->validated('role'))
                : RoleEnum::CITIZEN,
            telephone: $this->validated('telephone'),
            adresse: $this->validated('adresse'),
        );
    }
}
