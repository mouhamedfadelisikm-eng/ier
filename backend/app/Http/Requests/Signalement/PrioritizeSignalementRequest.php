<?php

declare(strict_types=1);

namespace App\Http\Requests\Signalement;

use App\Enums\SignalementPrioriteEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class PrioritizeSignalementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'priorite' => ['required', new Enum(SignalementPrioriteEnum::class)],
        ];
    }

    public function priorite(): SignalementPrioriteEnum
    {
        return SignalementPrioriteEnum::from($this->validated('priorite'));
    }
}
