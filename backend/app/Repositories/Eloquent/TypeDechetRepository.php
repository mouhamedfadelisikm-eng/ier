<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\TypeDechet;
use App\Repositories\Contracts\TypeDechetRepositoryInterface;

final class TypeDechetRepository extends BaseRepository implements TypeDechetRepositoryInterface
{
    public function __construct(TypeDechet $model)
    {
        parent::__construct($model);
    }
}
