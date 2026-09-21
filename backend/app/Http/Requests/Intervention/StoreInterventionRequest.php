<?php

declare(strict_types=1);

namespace App\Http\Requests\Intervention;

use App\DTOs\Intervention\CreateInterventionDTO;
use App\Enums\InterventionStatutEnum;
use App\Models\Affectation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

final class StoreInterventionRequest extends FormRequest
{
    public function authorize(): bool
    {
        if ($this->user()?->isAdmin()) return true;
        $affectation = Affectation::query()->find((int) $this->input('affectation_id'));
        if (! $affectation || ! $this->user()?->isAgent()) return false;
        return DB::table('appartenance_equipe')
            ->where('user_id', $this->user()->id)
            ->where('equipe_id', $affectation->equipe_id)
            ->whereNull('date_fin')
            ->exists();
    }

    public function rules(): array
    {
        return [
            'date_heure_debut' => ['required', 'date_format:Y-m-d H:i:s'],
            'affectation_id' => ['required', 'integer', 'exists:affectations,id'],
        ];
    }

    public function toDTO(): CreateInterventionDTO
    {
        return new CreateInterventionDTO(
            date_heure_debut: $this->validated('date_heure_debut'),
            affectation_id: (int) $this->validated('affectation_id'),
            statut: InterventionStatutEnum::EN_COURS,
            observation: null,
        );
    }
}
