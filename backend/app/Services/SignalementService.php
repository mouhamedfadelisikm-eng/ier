<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\Signalement\CreateSignalementDTO;
use App\DTOs\Signalement\UpdateSignalementDTO;
use App\Enums\SignalementPrioriteEnum;
use App\Enums\SignalementStatutEnum;
use App\Exceptions\Business\InvalidTransitionException;
use App\Models\Signalement;
use App\Notifications\SignalementStatusChanged;
use App\Repositories\Contracts\SignalementRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

final readonly class SignalementService
{
    public function __construct(
        private SignalementRepositoryInterface $repository,
    ) {
    }

    public function create(CreateSignalementDTO $dto): Signalement
    {
        return DB::transaction(function () use ($dto): Signalement {
            /** @var Signalement $signalement */
            $signalement = $this->repository->create($dto->toArray());

            $this->syncWasteTypes($signalement, $dto->type_dechets);
            $this->storePhotos($signalement, $dto->photos);

            return $signalement->load(['typeDechets', 'photos']);
        });
    }

    public function update(Signalement $signalement, UpdateSignalementDTO $dto, bool $isInternal = false): Signalement
    {
        return DB::transaction(function () use ($signalement, $dto, $isInternal): Signalement {
            $oldStatus = $signalement->statut;

            if (!$isInternal && ($dto->statut !== null || $dto->priorite !== null)) {
                throw ValidationException::withMessages([
                    'statut' => ['Le statut et la priorité ne peuvent pas être modifiés via cet endpoint générique.'],
                ]);
            }

            if ($dto->statut !== null && $dto->statut !== $oldStatus) {
                $this->validateTransition($oldStatus, $dto->statut);
            }

            /** @var Signalement $updated */
            $updated = $this->repository->update($signalement, $dto->toArray());

            if ($dto->type_dechets_present) {
                $this->syncWasteTypes($updated, $dto->type_dechets);
            }

            if ($dto->statut !== null && $dto->statut !== $oldStatus) {
                $this->notifyStatusChange($updated->user, $updated, $oldStatus, $dto->statut);
            }

            return $updated->load(['typeDechets', 'photos']);
        });
    }

    public function validate(Signalement $signalement): Signalement
    {
        return $this->transitionByRoleEndpoint($signalement, SignalementStatutEnum::VALIDE);
    }

    public function reject(Signalement $signalement): Signalement
    {
        return $this->transitionByRoleEndpoint($signalement, SignalementStatutEnum::REJETE);
    }

    public function prioritize(Signalement $signalement, SignalementPrioriteEnum $priorite): Signalement
    {
        return DB::transaction(function () use ($signalement, $priorite): Signalement {
            $oldStatus = $signalement->statut;
            $this->validateTransition($oldStatus, SignalementStatutEnum::PRIORISE);

            /** @var Signalement $updated */
            $updated = $this->repository->update($signalement, [
                'priorite' => $priorite->value,
                'statut' => SignalementStatutEnum::PRIORISE->value,
            ]);

            $this->notifyStatusChange($updated->user, $updated, $oldStatus, SignalementStatutEnum::PRIORISE);

            return $updated->load(['typeDechets', 'photos']);
        });
    }

    public function transitionTo(Signalement $signalement, SignalementStatutEnum $newStatut): Signalement
    {
        return DB::transaction(function () use ($signalement, $newStatut): Signalement {
            if ($signalement->statut === $newStatut) {
                return $signalement;
            }

            $oldStatus = $signalement->statut;
            $this->validateTransition($oldStatus, $newStatut);

            /** @var Signalement $updated */
            $updated = $this->repository->update($signalement, [
                'statut' => $newStatut->value,
            ]);

            $this->notifyStatusChange($updated->user, $updated, $oldStatus, $newStatut);

            return $updated;
        });
    }

    private function transitionByRoleEndpoint(Signalement $signalement, SignalementStatutEnum $newStatus): Signalement
    {
        return $this->transitionTo($signalement, $newStatus);
    }

    private function validateTransition(SignalementStatutEnum $current, SignalementStatutEnum $next): void
    {
        if (! in_array($next, $current->transitionsAutorisees(), true)) {
            throw new InvalidTransitionException($current->value, $next->value);
        }
    }

    /**
     * @param array<int, array<string,mixed>> $types
     */
    private function syncWasteTypes(Signalement $signalement, array $types): void
    {
        if ($types === []) {
            $signalement->typeDechets()->detach();
            return;
        }

        $attachData = [];
        foreach ($types as $item) {
            $typeId = isset($item['type_dechet_id']) ? (int) $item['type_dechet_id'] : 0;
            if ($typeId <= 0) {
                throw ValidationException::withMessages([
                    'type_dechets' => ['Chaque entrée doit préciser un type de déchet.'],
                ]);
            }
            $attachData[$typeId] = [
                'quantite_estime' => $item['quantite_estime'] ?? null,
                'volume_estime' => $item['volume_estime'] ?? null,
                'dangerosite' => $item['dangerosite'] ?? null,
                'remarque' => $item['remarque'] ?? null,
            ];
        }

        $signalement->typeDechets()->sync($attachData);
    }

    /**
     * @param list<UploadedFile> $photos
     */
    private function storePhotos(Signalement $signalement, array $photos): void
    {
        foreach ($photos as $photo) {
            if (! $photo instanceof UploadedFile) {
                throw ValidationException::withMessages([
                    'photos' => ['Chaque photo doit être un fichier image uploadé.'],
                ]);
            }

            $path = Storage::disk('public')->putFile(
                'signalements/' . $signalement->id,
                $photo,
            );

            if ($path === false) {
                throw ValidationException::withMessages([
                    'photos' => ['Le stockage de la photo a échoué.'],
                ]);
            }

            $signalement->photos()->create([
                'url' => Storage::disk('public')->url($path),
            ]);
        }
    }

    private function notifyStatusChange(
        \App\Models\User $user,
        Signalement $signalement,
        SignalementStatutEnum $oldStatus,
        SignalementStatutEnum $newStatus,
    ): void {
        $user->notify(new SignalementStatusChanged($signalement, $oldStatus, $newStatus));
    }

    public function findOrFail(int|string $id): Signalement
    {
        /** @var Signalement */
        return $this->repository->findOrFail($id);
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage);
    }

    public function delete(Signalement $signalement): bool
    {
        foreach ($signalement->photos()->get() as $photo) {
            $urlPath = (string) parse_url((string) $photo->url, PHP_URL_PATH);
            $relative = preg_replace('#^/storage/#', '', $urlPath) ?: (string) $photo->url;
            Storage::disk('public')->delete($relative);
        }

        return $this->repository->delete($signalement);
    }
}
