<?php

declare(strict_types=1);

namespace App\Http\Requests\TypeDechet;

use App\DTOs\TypeDechet\UpdateTypeDechetDTO;
use Illuminate\Foundation\Http\FormRequest;

final class UpdateTypeDechetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'libelle' => ['sometimes', 'string', 'max:100', 'unique:types_dechets,libelle,' . $this->route('types_dechet')],
            'description' => ['nullable', 'string'],
        ];
    }

    public function toDTO(): UpdateTypeDechetDTO
    {
        return new UpdateTypeDechetDTO(
            libelle: $this->validated('libelle'),
            description: $this->validated('description'),
        );
    }
}
