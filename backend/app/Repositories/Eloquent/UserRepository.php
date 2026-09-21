<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;

final class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(
        User $model
    ) {
        parent::__construct($model);
    }


    public function create(array $attributes): User
    {
        /** @var User $user */
        $user = parent::create($attributes);

        return $user;
    }


    public function update(
        Model $model,
        array $attributes
    ): User {
        /** @var User $user */
        $user = parent::update(
            $model,
            $attributes
        );

        return $user;
    }


    public function paginateWithFilters(
        array $filters = [],
        int $perPage = 15
    ): LengthAwarePaginator {
        $query = $this->model->newQuery();

        if (!empty($filters['nom'])) {
            $query->where('nom', 'like', '%' . $filters['nom'] . '%');
        }

        if (!empty($filters['email'])) {
            $query->where('email', 'like', '%' . $filters['email'] . '%');
        }

        if (!empty($filters['role'])) {
            $query->whereHas('roles', fn ($q) => $q->where('name', $filters['role']));
        }

        return $query->paginate($perPage);
    }


    public function findByEmail(
        string $email
    ): ?User {
        return $this->model
            ->newQuery()
            ->where('email', $email)
            ->first();
    }


    public function emailExists(
        string $email
    ): bool {
        return $this->model
            ->newQuery()
            ->where('email', $email)
            ->exists();
    }
}
