<?php

declare(strict_types=1);

namespace App\Http\Requests\Signalement;

use App\DTOs\Signalement\CreateSignalementDTO;
use App\Enums\DangerositeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rules\Enum;

final class StoreSignalementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'description' => ['nullable', 'string'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'zone_id' => ['nullable', 'integer', 'exists:zones,id'],
            'statut' => ['prohibited'],
            'priorite' => ['prohibited'],
            'type_dechets' => ['nullable', 'array'],
            'type_dechets.*.type_dechet_id' => ['required', 'integer', 'exists:types_dechets,id'],
            'type_dechets.*.quantite_estime' => ['nullable', 'numeric', 'min:0'],
            'type_dechets.*.volume_estime' => ['nullable', 'numeric', 'min:0'],
            'type_dechets.*.dangerosite' => ['nullable', new Enum(DangerositeEnum::class)],
            'type_dechets.*.remarque' => ['nullable', 'string'],
            'photos' => ['nullable', 'array', 'max:5'],
            'photos.*' => [
                'required',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
            ],
        ];
    }

    public function uploadedPhotos(): array
    {
        /** @var list<UploadedFile> $photos */
        $photos = $this->file('photos', []);
        return array_values(array_filter($photos, static fn ($photo) => $photo instanceof UploadedFile));
    }

    public function toDTO(): CreateSignalementDTO
    {
        return new CreateSignalementDTO(
            description: $this->validated('description'),
            latitude: (float) $this->validated('latitude'),
            longitude: (float) $this->validated('longitude'),
            user_id: (int) $this->user()->id,
            zone_id: $this->validated('zone_id'),
            type_dechets: $this->validated('type_dechets', []),
            photos: $this->uploadedPhotos(),
        );
    }
}
