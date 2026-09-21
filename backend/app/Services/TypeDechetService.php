<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\TypeDechet\CreateTypeDechetDTO;
use App\DTOs\TypeDechet\UpdateTypeDechetDTO;
use App\Models\TypeDechet;
use App\Repositories\Contracts\TypeDechetRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final readonly class TypeDechetService
{
    public function __construct(
        private TypeDechetRepositoryInterface $repository,
    ) {
    }

    public function create(CreateTypeDechetDTO $dto): TypeDechet
    {
        /** @var TypeDechet */
        return $this->repository->create($dto->toArray());
    }

    public function update(TypeDechet $typeDechet, UpdateTypeDechetDTO $dto): TypeDechet
    {
        /** @var TypeDechet */
        return $this->repository->update($typeDechet, $dto->toArray());
    }

    public function findOrFail(int|string $id): TypeDechet
    {
        /** @var TypeDechet */
        return $this->repository->findOrFail($id);
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage);
    }

    public function delete(TypeDechet $typeDechet): bool
    {
        return $this->repository->delete($typeDechet);
    }
}
