<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Intervention;
use App\Repositories\Contracts\InterventionRepositoryInterface;

final class InterventionRepository extends BaseRepository implements InterventionRepositoryInterface
{
    public function __construct(Intervention $model)
    {
        parent::__construct($model);
    }
}
