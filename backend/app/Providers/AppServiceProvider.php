<?php

namespace App\Providers;

use App\Policies\UserPolicy;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            UserRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\TypeDechetRepositoryInterface::class,
            \App\Repositories\Eloquent\TypeDechetRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\ZoneRepositoryInterface::class,
            \App\Repositories\Eloquent\ZoneRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\EquipeRepositoryInterface::class,
            \App\Repositories\Eloquent\EquipeRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\SignalementRepositoryInterface::class,
            \App\Repositories\Eloquent\SignalementRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\AffectationRepositoryInterface::class,
            \App\Repositories\Eloquent\AffectationRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\InterventionRepositoryInterface::class,
            \App\Repositories\Eloquent\InterventionRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\HistoriquePointRepositoryInterface::class,
            \App\Repositories\Eloquent\HistoriquePointRepository::class,
        );

        $this->app->bind(
            \App\Repositories\Contracts\DashboardRepositoryInterface::class,
            \App\Repositories\Eloquent\DashboardRepository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function ($notifiable, string $token): string {
            return config('app.frontend_url')
                . '/reset-password?token='
                . $token
                . '&email='
                . urlencode($notifiable->email);
        });

        Gate::policy(
            User::class,
            UserPolicy::class
        );

        Gate::policy(
            \App\Models\TypeDechet::class,
            \App\Policies\TypeDechetPolicy::class
        );

        Gate::policy(
            \App\Models\Zone::class,
            \App\Policies\ZonePolicy::class
        );

        Gate::policy(
            \App\Models\Equipe::class,
            \App\Policies\EquipePolicy::class
        );

        Gate::policy(
            \App\Models\Signalement::class,
            \App\Policies\SignalementPolicy::class
        );

        Gate::policy(
            \App\Models\Affectation::class,
            \App\Policies\AffectationPolicy::class
        );

        Gate::policy(
            \App\Models\Intervention::class,
            \App\Policies\InterventionPolicy::class
        );

        Gate::policy(
            \App\Models\HistoriquePoint::class,
            \App\Policies\HistoriquePointPolicy::class
        );
    }
}
