<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\Equipe\CreateEquipeDTO;
use App\DTOs\Equipe\UpdateEquipeDTO;
use App\Models\Equipe;
use App\Models\User;
use App\Repositories\Contracts\EquipeRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class EquipeService
{
    public function __construct(
        private readonly EquipeRepositoryInterface $repository,
    ) {
    }

    public function create(CreateEquipeDTO $dto): Equipe
    {
        return DB::transaction(function () use ($dto): Equipe {
            $this->assertAgentIds($dto->agent_ids);

            /** @var Equipe $equipe */
            $equipe = $this->repository->create($dto->toArray());
            $today = now()->toDateString();

            foreach ($dto->agent_ids as $agentId) {
                $equipe->agents()->attach($agentId, [
                    'date_debut' => $today,
                    'fonction' => 'Agent de collecte',
                ]);
            }

            return $equipe->load(['agents', 'zones']);
        });
    }

    public function update(Equipe $equipe, UpdateEquipeDTO $dto): Equipe
    {
        return DB::transaction(function () use ($equipe, $dto): Equipe {
            /** @var Equipe $updated */
            $updated = $this->repository->update($equipe, $dto->toArray());

            if ($dto->agent_ids !== null) {
                $this->assertAgentIds($dto->agent_ids);
                $today = now()->toDateString();

                $activeAgentIds = DB::table('appartenance_equipe')
                    ->where('equipe_id', $updated->id)
                    ->whereNull('date_fin')
                    ->pluck('user_id')
                    ->map(static fn ($id): int => (int) $id)
                    ->all();

                $desiredAgentIds = array_values(array_unique(array_map('intval', $dto->agent_ids)));

                $removed = array_diff($activeAgentIds, $desiredAgentIds);
                if ($removed !== []) {
                    DB::table('appartenance_equipe')
                        ->where('equipe_id', $updated->id)
                        ->whereNull('date_fin')
                        ->whereIn('user_id', $removed)
                        ->update(['date_fin' => $today]);
                }

                $added = array_diff($desiredAgentIds, $activeAgentIds);
                foreach ($added as $agentId) {
                    $previous = DB::table('appartenance_equipe')
                        ->where('equipe_id', $updated->id)
                        ->where('user_id', $agentId)
                        ->latest('date_debut')
                        ->first();

                    if ($previous !== null && $previous->date_fin === $today) {
                        DB::table('appartenance_equipe')
                            ->where('equipe_id', $updated->id)
                            ->where('user_id', $agentId)
                            ->where('date_debut', $previous->date_debut)
                            ->update(['date_fin' => null]);
                        continue;
                    }

                    DB::table('appartenance_equipe')->insert([
                        'user_id' => $agentId,
                        'equipe_id' => $updated->id,
                        'date_debut' => $today,
                        'date_fin' => null,
                        'fonction' => 'Agent de collecte',
                    ]);
                }
            }

            return $updated->load(['agents', 'zones']);
        });
    }

    /**
     * @param list<int> $agentIds
     */
    private function assertAgentIds(array $agentIds): void
    {
        if ($agentIds === []) {
            return;
        }

        $users = User::query()
            ->whereIn('id', array_unique(array_map('intval', $agentIds)))
            ->get();

        $invalid = [];
        foreach ($users as $user) {
            if (! $user->isAgent()) {
                $invalid[] = $user->id;
            }
        }

        if ($invalid !== []) {
            throw ValidationException::withMessages([
                'agent_ids' => ['Seuls des utilisateurs ayant le rôle Agent peuvent appartenir à une équipe.'],
            ]);
        }
    }

    public function findOrFail(int|string $id): Equipe
    {
        /** @var Equipe */
        return $this->repository->findOrFail($id);
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        $paginator = $this->repository->paginate($perPage);
        $paginator->getCollection()->load(['agents', 'zones']);

        return $paginator;
    }

    public function delete(Equipe $equipe): bool
    {
        return $this->repository->delete($equipe);
    }
}
