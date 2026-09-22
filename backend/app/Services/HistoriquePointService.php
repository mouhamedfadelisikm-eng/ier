<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\HistoriquePoint\CreateHistoriquePointDTO;
use App\Models\HistoriquePoint;
use App\Models\User;
use App\Repositories\Contracts\HistoriquePointRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class HistoriquePointService
{
    public function __construct(
        private readonly HistoriquePointRepositoryInterface $repository,
    ) {
    }

    public function awardPoints(int $userId, int $points, string $motif, ?string $description = null, ?int $signalementId = null): HistoriquePoint
    {
        if ($signalementId !== null) {
            try {
                /** @var HistoriquePoint $existing */
                $existing = HistoriquePoint::query()->firstOrCreate(
                    ['signalement_id' => $signalementId],
                    [
                        'nombre_points' => $points,
                        'motif' => $motif,
                        'date_attribution' => now()->toDateString(),
                        'user_id' => $userId,
                        'description' => $description,
                    ]
                );

                return $existing;
            } catch (\Illuminate\Database\QueryException $e) {
                // En cas de course critique sur la contrainte unique signalement_id
                // On tente de rÃ©cupÃ©rer l\u0027existant une derniÃ¨re fois.
                $existing = HistoriquePoint::where('signalement_id', $signalementId)->first();
                if ($existing) {
                    return $existing;
                }
                throw $e;
            }
        }

        $dto = new CreateHistoriquePointDTO(
            nombre_points: $points,
            motif: $motif,
            date_attribution: now()->toDateString(),
            user_id: $userId,
            description: $description,
            signalement_id: $signalementId,
        );

        /** @var HistoriquePoint */
        return $this->repository->create($dto->toArray());
    }

    public function findOrFail(int|string $id): HistoriquePoint
    {
        /** @var HistoriquePoint */
        return $this->repository->findOrFail($id);
    }

    public function paginate(int $perPage = 15, ?User $user = null): LengthAwarePaginator
    {
        $query = HistoriquePoint::query();

        if ($user !== null && !$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        return $query->latest()->paginate($perPage);
    }
}
