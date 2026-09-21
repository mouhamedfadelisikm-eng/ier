<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Equipe;
use App\Repositories\Contracts\EquipeRepositoryInterface;

final class EquipeRepository extends BaseRepository implements EquipeRepositoryInterface
{
    public function __construct(Equipe $model)
    {
        parent::__construct($model);
    }
}
