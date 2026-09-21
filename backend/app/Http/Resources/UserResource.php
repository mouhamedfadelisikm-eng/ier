<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'name' => $this->name,
            'email' => $this->email,
            'roles' => $this->getRoleNames(),
            'role' => $this->getRoleNames()->first() ?? 'citizen',
            'created_at' => $this->created_at,
        ];
    }
}
