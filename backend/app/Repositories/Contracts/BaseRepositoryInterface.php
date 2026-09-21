<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BaseRepositoryInterface
{
    /**
     * Find a model by its primary key.
     */
    public function find(int|string $id): ?Model;

    /**
     * Find a model or fail.
     */
    public function findOrFail(int|string $id): Model;

    /**
     * Return all models.
     */
    public function all(array $columns = ['*']): Collection;

    /**
     * Paginate models.
     */
    public function paginate(
        int $perPage = 15,
        array $columns = ['*']
    ): LengthAwarePaginator;

    /**
     * Create a model.
     */
    public function create(array $attributes): Model;

    /**
     * Update a model.
     */
    public function update(Model $model, array $attributes): Model;

    /**
     * Delete a model.
     */
    public function delete(Model $model): bool;

    /**
     * Check if a model exists.
     */
    public function exists(int|string $id): bool;
}
