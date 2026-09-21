<?php

declare(strict_types=1);

namespace App\Exceptions\Auth;

use App\Exceptions\Business\BusinessException;

final class PasswordResetTokenExpiredException extends BusinessException
{
    public function __construct()
    {
        parent::__construct('The password reset token has expired.');
    }
}
