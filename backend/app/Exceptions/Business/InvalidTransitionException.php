<?php

declare(strict_types=1);

namespace App\Exceptions\Business;

final class InvalidTransitionException extends BusinessException
{
    public function __construct(string $from, string $to)
    {
        parent::__construct("La transition du statut '{$from}' vers '{$to}' n'est pas autorisée.");
    }
}
