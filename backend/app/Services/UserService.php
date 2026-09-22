<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\User\CreateUserDTO;
use App\DTOs\User\UpdateUserDTO;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final readonly class UserService
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {
    }


    public function create(
        CreateUserDTO $dto
    ): User {

        $user = $this->userRepository->create(
            $dto->toArray()
        );


        $user->assignRole(
            $dto->role->value
        );


        return $user->load('roles');
    }


    public function update(
        User $user,
        UpdateUserDTO $dto
    ): User {

        if ($dto->role !== null && $user->hasRole(\App\Enums\RoleEnum::AGENT->value) && $dto->role !== \App\Enums\RoleEnum::AGENT) {
            $hasActiveMembership = \DB::table('appartenance_equipe')
                ->where('user_id', $user->id)
                ->whereNull('date_fin')
                ->exists();

            if ($hasActiveMembership) {
                throw new \App\Exceptions\Business\AgentHasActiveTeamException();
            }
        }

        $this->userRepository->update(
            $user,
            $dto->toArray()
        );


        if ($dto->role !== null) {

            $user->syncRoles(
                $dto->role->value
            );
        }


        return $user->load('roles');
    }


    public function findOrFail(
        int|string $id
    ): \Illuminate\Database\Eloquent\Model
    {
        return $this->userRepository
            ->findOrFail($id);
    }


    public function paginate(
        array $filters = [],
        int $perPage = 15
    ): LengthAwarePaginator {
        return $this->userRepository
            ->paginateWithFilters($filters, $perPage);
    }


    public function delete(
        User $user
    ): bool {
        return $this->userRepository
            ->delete($user);
    }


    public function findByEmail(
        string $email
    ): ?User {
        return $this->userRepository
            ->findByEmail($email);
    }


    public function existsByEmail(
        string $email
    ): bool {
        return $this->userRepository
            ->emailExists($email);
    }
}
