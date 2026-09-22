<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\DTOs\User\UpdateUserDTO;
use Illuminate\Foundation\Http\FormRequest;

final class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = auth()->id();

        return [
            'nom' => ['sometimes', 'string', 'max:100'],
            'prenom' => ['sometimes', 'string', 'max:100'],
            'email' => ['sometimes', 'email', "unique:users,email,{$userId}"],
            'password' => ['sometimes', 'string', 'min:8', 'confirmed'],
            'telephone' => ['nullable', 'string', 'max:50'],
            'adresse' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function toDTO(): UpdateUserDTO
    {
        return new UpdateUserDTO(
            nom: $this->validated('nom'),
            prenom: $this->validated('prenom'),
            email: $this->validated('email'),
            password: $this->validated('password'),
            role: null, // Rôle non modifiable via ce request
            telephone: $this->validated('telephone'),
            adresse: $this->validated('adresse'),
        );
    }
}
