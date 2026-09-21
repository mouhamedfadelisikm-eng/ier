<?php

declare(strict_types=1);

namespace App\Http\Requests\Zone;

use App\DTOs\Zone\CreateZoneDTO;
use Illuminate\Foundation\Http\FormRequest;

final class StoreZoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom_zone' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
        ];
    }

    public function toDTO(): CreateZoneDTO
    {
        return new CreateZoneDTO(
            nom_zone: $this->validated('nom_zone'),
            description: $this->validated('description'),
        );
    }
}
