<?php

namespace App\Models;

use App\Enums\RoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    use HasRoles;

    /**
     * Les attributs assignables.
     */
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'adresse',
        'password',
        'etat_compte',
    ];

    /**
     * Les attributs cachés.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Les conversions automatiques.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getNomCompletAttribute(): string
    {
        return $this->prenom . ' ' . $this->nom;
    }

    public function getNameAttribute(): string
    {
        return $this->prenom . ' ' . $this->nom;
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers métier
    |--------------------------------------------------------------------------
    */

    public function isAdmin(): bool
    {
        return $this->hasRole(RoleEnum::ADMIN->value);
    }

    public function isCitizen(): bool
    {
        return $this->hasRole(RoleEnum::CITIZEN->value);
    }

    public function isAgent(): bool
    {
        return $this->hasRole(RoleEnum::AGENT->value);
    }

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    public function equipes(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Equipe::class, 'appartenance_equipe', 'user_id', 'equipe_id')
            ->withPivot(['date_debut', 'date_fin', 'fonction']);
    }

    public function historiquePoints(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(HistoriquePoint::class, 'user_id');
    }

    public function signalements(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Signalement::class, 'user_id');
    }
}
