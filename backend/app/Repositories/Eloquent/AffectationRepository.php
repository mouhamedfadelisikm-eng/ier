<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Affectation;
use App\Repositories\Contracts\AffectationRepositoryInterface;

final class AffectationRepository extends BaseRepository implements AffectationRepositoryInterface
{
    public function __construct(Affectation $model)
    {
        parent::__construct($model);
    }
}
