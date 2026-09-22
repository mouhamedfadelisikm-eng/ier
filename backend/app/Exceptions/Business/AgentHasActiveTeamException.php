<?php

declare(strict_types=1);

namespace App\Exceptions\Business;

final class AgentHasActiveTeamException extends BusinessException
{
    public function __construct()
    {
        parent::__construct("Impossible de changer le rôle d'un agent ayant une appartenance active à une équipe.");
    }
}
