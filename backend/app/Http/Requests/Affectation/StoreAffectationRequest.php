<?php

declare(strict_types=1);

namespace App\Http\Requests\Affectation;

use App\DTOs\Affectation\CreateAffectationDTO;
use Illuminate\Foundation\Http\FormRequest;

final class StoreAffectationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date_heure_affectation' => ['required', 'date_format:Y-m-d H:i:s'],
            'equipe_id' => ['required', 'integer', 'exists:equipes,id'],
            'signalement_id' => ['required', 'integer', 'exists:signalements,id'],
            'observation' => ['nullable', 'string'],
        ];
    }

    public function toDTO(): CreateAffectationDTO
    {
        return new CreateAffectationDTO(
            date_heure_affectation: $this->validated('date_heure_affectation'),
            equipe_id: (int) $this->validated('equipe_id'),
            signalement_id: (int) $this->validated('signalement_id'),
            observation: $this->validated('observation'),
        );
    }
}
