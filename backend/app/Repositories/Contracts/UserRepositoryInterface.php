<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function create(array $attributes): User;

    public function update(
        Model $model,
        array $attributes
    ): User;

    public function paginateWithFilters(
        array $filters = [],
        int $perPage = 15
    ): LengthAwarePaginator;

    public function findByEmail(string $email): ?User;

    public function emailExists(string $email): bool;
}
