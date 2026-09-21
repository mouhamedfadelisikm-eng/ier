<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\Zone\CreateZoneDTO;
use App\DTOs\Zone\UpdateZoneDTO;
use App\Models\Zone;
use App\Repositories\Contracts\ZoneRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final readonly class ZoneService
{
    public function __construct(
        private ZoneRepositoryInterface $repository,
    ) {
    }

    public function create(CreateZoneDTO $dto): Zone
    {
        /** @var Zone */
        return $this->repository->create($dto->toArray());
    }

    public function update(Zone $zone, UpdateZoneDTO $dto): Zone
    {
        /** @var Zone */
        return $this->repository->update($zone, $dto->toArray());
    }

    public function findOrFail(int|string $id): Zone
    {
        /** @var Zone */
        return $this->repository->findOrFail($id);
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage);
    }

    public function delete(Zone $zone): bool
    {
        return $this->repository->delete($zone);
    }
}
