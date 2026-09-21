<?php

declare(strict_types=1);

namespace App\Http\Requests\TypeDechet;

use App\DTOs\TypeDechet\CreateTypeDechetDTO;
use Illuminate\Foundation\Http\FormRequest;

final class StoreTypeDechetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'libelle' => ['required', 'string', 'max:100', 'unique:types_dechets,libelle'],
            'description' => ['nullable', 'string'],
        ];
    }

    public function toDTO(): CreateTypeDechetDTO
    {
        return new CreateTypeDechetDTO(
            libelle: $this->validated('libelle'),
            description: $this->validated('description'),
        );
    }
}
