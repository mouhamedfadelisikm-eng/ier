<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Zone;
use App\Repositories\Contracts\ZoneRepositoryInterface;

final class ZoneRepository extends BaseRepository implements ZoneRepositoryInterface
{
    public function __construct(Zone $model)
    {
        parent::__construct($model);
    }
}
