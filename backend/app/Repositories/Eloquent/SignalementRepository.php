<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Signalement;
use App\Repositories\Contracts\SignalementRepositoryInterface;

final class SignalementRepository extends BaseRepository implements SignalementRepositoryInterface
{
    public function __construct(Signalement $model)
    {
        parent::__construct($model);
    }
}
