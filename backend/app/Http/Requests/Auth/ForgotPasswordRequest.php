<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\DTOs\Auth\ForgotPasswordDTO;
use Illuminate\Foundation\Http\FormRequest;

final class ForgotPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'string',
                'email',
            ],
        ];
    }

    public function toDTO(): ForgotPasswordDTO
    {
        return new ForgotPasswordDTO(
            email: $this->validated('email'),
        );
    }
}
