<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\Intervention\CreateInterventionDTO;
use App\DTOs\Intervention\UpdateInterventionDTO;
use App\Enums\InterventionStatutEnum;
use App\Enums\SignalementStatutEnum;
use App\Exceptions\Business\InvalidTransitionException;
use App\Models\Intervention;
use App\Repositories\Contracts\InterventionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

final readonly class InterventionService
{
    public function __construct(
        private InterventionRepositoryInterface $repository,
        private SignalementService $signalementService,
        private HistoriquePointService $pointsService,
    ) {
    }

    public function create(CreateInterventionDTO $dto): Intervention
    {
        return DB::transaction(function () use ($dto): Intervention {
            $affectation = DB::table('affectations')->where('id', $dto->affectation_id)->first();
            if ($affectation === null) {
                throw ValidationException::withMessages([
                    'affectation_id' => ['L’affectation demandée est introuvable.'],
                ]);
            }

            /** @var Intervention $intervention */
            $intervention = $this->repository->create($dto->toArray());

            $signalement = $intervention
                ->load('affectation.signalement')
                ->affectation
                ->signalement;

            if ($signalement === null) {
                throw ValidationException::withMessages([
                    'affectation_id' => ['Le signalement associé à l’affectation est introuvable.'],
                ]);
            }

            $canStart = $signalement->statut === SignalementStatutEnum::AFFECTE;
            if ($signalement->statut === SignalementStatutEnum::EN_INTERVENTION) {
                $hasActiveIntervention = Intervention::query()
                    ->where('affectation_id', $dto->affectation_id)
                    ->where('statut', InterventionStatutEnum::EN_COURS->value)
                    ->exists();
                $canStart = ! $hasActiveIntervention;
            }

            if (! $canStart) {
                throw new InvalidTransitionException(
                    $signalement->statut->value,
                    SignalementStatutEnum::EN_INTERVENTION->value,
                );
            }

            if ($signalement->statut === SignalementStatutEnum::AFFECTE) {
                $this->signalementService->transitionTo(
                    $signalement,
                    SignalementStatutEnum::EN_INTERVENTION,
                );
            }

            return $intervention->load([
                'affectation',
                'photos',
            ]);
        });
    }

    public function update(Intervention $intervention, UpdateInterventionDTO $dto): Intervention
    {
        return DB::transaction(function () use ($intervention, $dto): Intervention {
            $currentStatus = $intervention->statut;

            if ($dto->statut !== null && $dto->statut !== $currentStatus) {
                $this->validateTransition($currentStatus, $dto->statut);
            }

            $nextStatus = $dto->statut ?? $currentStatus;
            if ($nextStatus === InterventionStatutEnum::TERMINEE) {
                $hasExistingReport = trim((string) $intervention->compte_rendu) !== '';
                $hasNewReport = $dto->compte_rendu !== null && trim($dto->compte_rendu) !== '';
                if (! $hasExistingReport && ! $hasNewReport) {
                    throw ValidationException::withMessages([
                        'compte_rendu' => ['Un compte rendu est obligatoire pour terminer une intervention.'],
                    ]);
                }
                if ($dto->date_heure_fin === null && $intervention->date_heure_fin === null) {
                    throw ValidationException::withMessages([
                        'date_heure_fin' => ['La date de fin est obligatoire pour terminer une intervention.'],
                    ]);
                }
            }

            /** @var Intervention $updated */
            $updated = $this->repository->update($intervention, $dto->toArray());

            $this->storePhotos($updated, $dto->photos);

            $signalement = $updated
                ->load('affectation.signalement')
                ->affectation
                ->signalement;

            if ($nextStatus === InterventionStatutEnum::TERMINEE
                && $currentStatus !== InterventionStatutEnum::TERMINEE) {
                $this->signalementService->transitionTo(
                    $signalement,
                    SignalementStatutEnum::TERMINE,
                );
            }

            return $updated->load('photos');
        });
    }

    public function cloturer(Intervention $intervention): Intervention
    {
        return DB::transaction(function () use ($intervention): Intervention {
            $intervention->load('affectation.signalement');
            $signalement = $intervention->affectation?->signalement;

            if ($signalement === null) {
                throw ValidationException::withMessages([
                    'intervention' => ['Le signalement associé à l’intervention est introuvable.'],
                ]);
            }

            if ($intervention->statut !== InterventionStatutEnum::TERMINEE) {
                throw ValidationException::withMessages([
                    'statut' => ['Seule une intervention terminée peut être clôturée.'],
                ]);
            }

            if (trim((string) $intervention->compte_rendu) === '') {
                throw ValidationException::withMessages([
                    'compte_rendu' => ['Un compte rendu est obligatoire pour clôturer l’intervention.'],
                ]);
            }

            if ($signalement->statut !== SignalementStatutEnum::TERMINE) {
                throw new InvalidTransitionException(
                    $signalement->statut->value,
                    SignalementStatutEnum::CLOTURE->value,
                );
            }

            $this->signalementService->transitionTo(
                $signalement,
                SignalementStatutEnum::CLOTURE,
            );

            $this->pointsService->awardPoints(
                $signalement->user_id,
                100,
                'Signalement clôturé',
                "Points attribués pour la résolution du signalement #{$signalement->id}",
                $signalement->id,
            );

            return $intervention->refresh();
        });
    }

    private function validateTransition(InterventionStatutEnum $current, InterventionStatutEnum $next): void
    {
        if (! in_array($next, $current->transitionsAutorisees(), true)) {
            throw new InvalidTransitionException($current->value, $next->value);
        }
    }

    public function findOrFail(int|string $id): Intervention
    {
        /** @var Intervention $intervention */
        $intervention = $this->repository->findOrFail($id);
        return $intervention;
    }

    public function paginate(int $perPage = 15, $user = null): LengthAwarePaginator
    {
        $query = Intervention::query();

        if ($user?->isAgent()) {
            $teamIds = DB::table('appartenance_equipe')
                ->where('user_id', $user->id)
                ->whereNull('date_fin')
                ->pluck('equipe_id');

            $query->whereHas('affectation', static fn ($q) => $q->whereIn('equipe_id', $teamIds));
        }

        return $query->latest('date_heure_debut')->paginate($perPage);
    }

    /**
     * @param list<UploadedFile> $photos
     */
    private function storePhotos(Intervention $intervention, array $photos): void
    {
        foreach ($photos as $photo) {
            if (! $photo instanceof UploadedFile) {
                throw ValidationException::withMessages([
                    'photos' => ['Chaque photo doit être un fichier image uploadé.'],
                ]);
            }

            $path = Storage::disk('public')->putFile('interventions/' . $intervention->id, $photo);
            if ($path === false) {
                throw ValidationException::withMessages([
                    'photos' => ['Le stockage de la photo a échoué.'],
                ]);
            }

            $intervention->photos()->create([
                'url' => Storage::disk('public')->url($path),
            ]);
        }
    }

    public function delete(Intervention $intervention): bool
    {
        foreach ($intervention->photos()->get() as $photo) {
            $urlPath = (string) parse_url((string) $photo->url, PHP_URL_PATH);
            $relative = preg_replace('#^/storage/#', '', $urlPath) ?: (string) $photo->url;
            Storage::disk('public')->delete($relative);
        }

        return $this->repository->delete($intervention);
    }
}
