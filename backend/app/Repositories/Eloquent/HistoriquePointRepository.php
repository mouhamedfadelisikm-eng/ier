<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\HistoriquePoint;
use App\Repositories\Contracts\HistoriquePointRepositoryInterface;

final class HistoriquePointRepository extends BaseRepository implements HistoriquePointRepositoryInterface
{
    public function __construct(HistoriquePoint $model)
    {
        parent::__construct($model);
    }
}
