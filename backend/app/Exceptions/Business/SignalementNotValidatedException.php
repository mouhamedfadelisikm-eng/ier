<?php

declare(strict_types=1);

namespace App\Exceptions\Business;

final class SignalementNotValidatedException extends BusinessException
{
    public function __construct()
    {
        parent::__construct("Le signalement doit être validé puis priorisé avant toute affectation à une équipe.");
    }
}
