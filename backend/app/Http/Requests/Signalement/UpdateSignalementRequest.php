<?php

declare(strict_types=1);

namespace App\Http\Requests\Signalement;

use App\DTOs\Signalement\UpdateSignalementDTO;
use App\Enums\DangerositeEnum;
use App\Enums\SignalementPrioriteEnum;
use App\Enums\SignalementStatutEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class UpdateSignalementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'description' => ['sometimes', 'nullable', 'string'],
            'zone_id' => ['sometimes', 'nullable', 'integer', 'exists:zones,id'],
            'type_dechets' => ['sometimes', 'array'],
            'type_dechets.*.type_dechet_id' => ['required', 'integer', 'exists:types_dechets,id'],
            'type_dechets.*.quantite_estime' => ['nullable', 'numeric', 'min:0'],
            'type_dechets.*.volume_estime' => ['nullable', 'numeric', 'min:0'],
            'type_dechets.*.dangerosite' => ['nullable', new Enum(DangerositeEnum::class)],
            'type_dechets.*.remarque' => ['nullable', 'string'],
        ];
    }

    public function toDTO(): UpdateSignalementDTO
    {
        return new UpdateSignalementDTO(
            description: $this->validated('description'),
            statut: null,
            priorite: null,
            zone_id: $this->validated('zone_id'),
            zone_id_present: $this->exists('zone_id'),
            type_dechets: $this->validated('type_dechets', []),
            type_dechets_present: $this->exists('type_dechets'),
        );
    }
}
