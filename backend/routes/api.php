<?php

use App\Http\Controllers\Api\AffectationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EquipeController;
use App\Http\Controllers\Api\HistoriquePointController;
use App\Http\Controllers\Api\InterventionController;
use App\Http\Controllers\Api\SignalementController;
use App\Http\Controllers\Api\TypeDechetController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ZoneController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\GamificationController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public authentication routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')
    ->name('auth.')
    ->group(function () {

        Route::post('/register', [AuthController::class, 'register'])
            ->middleware('throttle:register')
            ->name('register');

        Route::post('/login', [AuthController::class, 'login'])
            ->middleware('throttle:login')
            ->name('login');

        Route::post('/session/login', [AuthController::class, 'loginSession'])
            ->middleware('throttle:login')
            ->name('session.login');

        Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
            ->middleware('throttle:password-reset-request')
            ->name('forgot-password');

        Route::post('/reset-password', [AuthController::class, 'resetPassword'])
            ->middleware('throttle:password-reset')
            ->name('reset-password');
    });


/*
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')
    ->group(function () {

        /*
        | Current authenticated user
        */
        Route::get('/user', [UserController::class, 'getCurrentUser']);
        Route::put('/user', [UserController::class, 'updateCurrentUser']);


        /*
        | Authentication management
        */
        Route::prefix('auth')
            ->group(function () {

                Route::post('/logout', [AuthController::class, 'logout']);
                Route::post('/session/logout', [AuthController::class, 'logoutSession']);
            });


        /*
        | User administration
        |
        | Only administrators can manage users
        */
        Route::middleware('role:admin')
            ->apiResource('users', UserController::class)
            ->only([
                'store',
                'update',
                'destroy',
                'index',
                'show',
            ]);


        /*
        |--------------------------------------------------------------------------
        | Reference data — Types de déchets / Zones (Admin manages, all can read)
        |--------------------------------------------------------------------------
        */
        Route::apiResource('types-dechets', TypeDechetController::class);
        Route::apiResource('zones', ZoneController::class);


        /*
        |--------------------------------------------------------------------------
        | Équipes (Admin manages, Agents can read)
        |--------------------------------------------------------------------------
        */
        Route::apiResource('equipes', EquipeController::class);


        /*
        |--------------------------------------------------------------------------
        | Signalements (All authenticated users can create, Admin/Agents manage)
        |--------------------------------------------------------------------------
        */
        Route::post('/signalements/{signalement}/valider', [SignalementController::class, 'validateSignalement'])->name('signalements.validate');
        Route::post('/signalements/{signalement}/rejeter', [SignalementController::class, 'reject'])->name('signalements.reject');
        Route::post('/signalements/{signalement}/prioriser', [SignalementController::class, 'prioritize'])->name('signalements.prioritize');
        Route::apiResource('signalements', SignalementController::class);


        /*
        |--------------------------------------------------------------------------
        | Affectations (Admin only)
        |--------------------------------------------------------------------------
        */
        Route::post('/affectations/{affectation}/reaffecter', [AffectationController::class, 'reassign'])->name('affectations.reassign');
        Route::apiResource('affectations', AffectationController::class)->except(['update']);


        /*
        |--------------------------------------------------------------------------
        | Interventions (Agents and Admin)
        |--------------------------------------------------------------------------
        */
        Route::post('/interventions/{intervention}/cloturer', [InterventionController::class, 'cloturer'])
            ->name('interventions.cloturer');

        Route::apiResource('interventions', InterventionController::class);


        /*
        |--------------------------------------------------------------------------
        | Dashboard (Admin only)
        |--------------------------------------------------------------------------
        */
        Route::get('/dashboard/heatmap', [DashboardController::class, 'heatmap'])
            ->middleware('role:admin')
            ->name('dashboard.heatmap');


        /*
        |--------------------------------------------------------------------------
        | Historique des points — lecture seule (propre utilisateur ou Admin)
        |--------------------------------------------------------------------------
        */
        Route::get('/historique-points', [HistoriquePointController::class, 'index'])
            ->name('historique-points.index');

        Route::get('/historique-points/{historiquePoint}', [HistoriquePointController::class, 'show'])
            ->name('historique-points.show');

        Route::get('/gamification/leaderboard', [GamificationController::class, 'leaderboard'])
            ->name('gamification.leaderboard');

        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications/{notification}/read', [NotificationController::class, 'read'])->name('notifications.read');
    });
