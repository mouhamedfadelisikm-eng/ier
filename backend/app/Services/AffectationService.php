<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\Affectation\CreateAffectationDTO;
use App\Enums\SignalementStatutEnum;
use App\Exceptions\Business\SignalementNotValidatedException;
use App\Models\Affectation;
use App\Models\User;
use App\Repositories\Contracts\AffectationRepositoryInterface;
use App\Repositories\Contracts\SignalementRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final readonly class AffectationService
{
    public function __construct(
        private AffectationRepositoryInterface $repository,
        private SignalementRepositoryInterface $signalementRepository,
        private SignalementService $signalementService,
    ) {}

    public function create(CreateAffectationDTO $dto): Affectation
    {
        return DB::transaction(function () use ($dto): Affectation {
            $signalement = $this->signalementRepository->findOrFail($dto->signalement_id);
            if ($signalement->statut !== SignalementStatutEnum::PRIORISE) {
                throw new SignalementNotValidatedException();
            }
            $affectation = $this->repository->create($dto->toArray());
            $this->signalementService->transitionTo($signalement, SignalementStatutEnum::AFFECTE);
            return $affectation->load(['signalement', 'equipe']);
        });
    }

    public function reassign(Affectation $current, CreateAffectationDTO $dto): Affectation
    {
        return DB::transaction(function () use ($current, $dto): Affectation {
            $current->loadMissing('signalement');
            $signalement = $current->signalement;
            if ($signalement === null || $signalement->statut !== SignalementStatutEnum::AFFECTE) {
                throw new SignalementNotValidatedException();
            }
            $latest = $signalement->affectations()->latest('date_heure_affectation')->first();
            if ($latest && (int) $latest->id !== (int) $current->id) {
                throw ValidationException::withMessages(['affectation_id' => ['Cette affectation n’est plus l’affectation courante du signalement.']]);
            }
            if ((int) $current->equipe_id === (int) $dto->equipe_id) {
                throw ValidationException::withMessages(['equipe_id' => ['La réaffectation doit cibler une équipe différente de l’affectation courante.']]);
            }
            $new = $this->repository->create($dto->toArray());
            return $new->load(['signalement', 'equipe']);
        });
    }

    public function findOrFail(int|string $id): Affectation { return $this->repository->findOrFail($id); }

    public function paginate(int $perPage = 15, ?User $user = null): LengthAwarePaginator
    {
        $query = Affectation::query();
        if ($user?->isAgent()) {
            $teamIds = DB::table('appartenance_equipe')
                ->where('user_id', $user->id)
                ->whereNull('date_fin')
                ->pluck('equipe_id');
            $query->whereIn('equipe_id', $teamIds);
        }
        return $query->latest('date_heure_affectation')->paginate($perPage);
    }

    public function delete(Affectation $affectation): bool { return $this->repository->delete($affectation); }
}
