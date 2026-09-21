<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository implements BaseRepositoryInterface
{
    public function __construct(
        protected Model $model,
    ) {
    }


    public function find(int|string $id): ?Model
    {
        return $this->model->find($id);
    }


    public function findOrFail(int|string $id): Model
    {
        return $this->model->findOrFail($id);
    }


    public function all(array $columns = ['*']): Collection
    {
        return $this->model
            ->newQuery()
            ->get($columns);
    }


    public function paginate(
        int $perPage = 15,
        array $columns = ['*']
    ): LengthAwarePaginator {
        return $this->model
            ->newQuery()
            ->paginate(
                $perPage,
                $columns
            );
    }


    public function create(array $attributes): Model
    {
        return $this->model->create($attributes);
    }


    public function update(
        Model $model,
        array $attributes
    ): Model {
        $model->fill($attributes);
        $model->save();

        return $model->refresh();
    }


    public function delete(Model $model): bool
    {
        return (bool) $model->delete();
    }


    public function exists(int|string $id): bool
    {
        return $this->model
            ->newQuery()
            ->whereKey($id)
            ->exists();
    }
}
