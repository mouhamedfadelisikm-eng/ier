<?php

declare(strict_types=1);

namespace App\DTOs;

abstract readonly class BaseDTO
{
    abstract public function toArray(): array;
}
