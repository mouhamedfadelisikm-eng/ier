<?php

declare(strict_types=1);

namespace App\Http\Requests\Zone;

use App\DTOs\Zone\UpdateZoneDTO;
use Illuminate\Foundation\Http\FormRequest;

final class UpdateZoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom_zone' => ['sometimes', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
        ];
    }

    public function toDTO(): UpdateZoneDTO
    {
        return new UpdateZoneDTO(
            nom_zone: $this->validated('nom_zone'),
            description: $this->validated('description'),
        );
    }
}
