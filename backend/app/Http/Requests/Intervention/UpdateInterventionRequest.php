<?php

declare(strict_types=1);

namespace App\Http\Requests\Intervention;

use App\DTOs\Intervention\UpdateInterventionDTO;
use App\Enums\InterventionStatutEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rules\Enum;

final class UpdateInterventionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'date_heure_fin' => ['sometimes', 'date_format:Y-m-d H:i:s'],
            'statut' => ['sometimes', new Enum(InterventionStatutEnum::class)],
            'compte_rendu' => ['sometimes', 'nullable', 'string'],
            'observation' => ['sometimes', 'nullable', 'string'],
            'photos' => ['sometimes', 'array', 'max:10'],
            'photos.*' => [
                'required',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
            ],
        ];
    }

    /**
     * @return list<UploadedFile>
     */
    public function uploadedPhotos(): array
    {
        /** @var list<UploadedFile> $photos */
        $photos = $this->file('photos', []);

        return array_values(array_filter(
            $photos,
            static fn ($photo) => $photo instanceof UploadedFile,
        ));
    }

    public function toDTO(): UpdateInterventionDTO
    {
        return new UpdateInterventionDTO(
            date_heure_fin: $this->validated('date_heure_fin'),
            statut: $this->filled('statut') ? InterventionStatutEnum::from($this->validated('statut')) : null,
            compte_rendu: $this->validated('compte_rendu'),
            observation: $this->validated('observation'),
            photos: $this->uploadedPhotos(),
        );
    }
}
