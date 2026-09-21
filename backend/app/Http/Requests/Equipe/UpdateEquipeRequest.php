<?php

declare(strict_types=1);

namespace App\Http\Requests\Equipe;

use App\DTOs\Equipe\UpdateEquipeDTO;
use Illuminate\Foundation\Http\FormRequest;

final class UpdateEquipeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom_equipe' => ['sometimes', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'agent_ids' => ['sometimes', 'array', 'max:50'],
            'agent_ids.*' => ['integer', 'distinct', 'exists:users,id'],
        ];
    }

    public function toDTO(): UpdateEquipeDTO
    {
        return new UpdateEquipeDTO(
            nom_equipe: $this->validated('nom_equipe'),
            description: $this->validated('description'),
            agent_ids: $this->validated('agent_ids'),
        );
    }
}
