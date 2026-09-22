<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "ISI-Eco-Report API",
    version: "2.2.0",
    description: "API certifiée de signalement et de gestion des déchets sauvages. Supporte PostgreSQL 17. Permet l'authentification (Sanctum), le signalement géolocalisé, l'affectation d'équipes, le suivi d'interventions et la gamification avec historique de points."
)]
#[OA\Server(
    url: "/api",
    description: "Serveur API local"
)]
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Insérez votre jeton d'accès brut obtenu lors de la connexion."
)]

// --- AUTHENTIFICATION ---

#[OA\Post(
    path: "/auth/register",
    summary: "Inscription citoyenne",
    tags: ["Authentification"],
    responses: [new OA\Response(response: 201, description: "Citoyen créé")]
)]

#[OA\Post(
    path: "/auth/login",
    summary: "Connexion",
    tags: ["Authentification"],
    responses: [new OA\Response(response: 200, description: "Token retourné")]
)]

#[OA\Post(
    path: "/auth/logout",
    summary: "Déconnexion",
    tags: ["Authentification"],
    security: [["bearerAuth" => []]],
    responses: [new OA\Response(response: 204, description: "Succès")]
)]

// --- SIGNALEMENTS ---

#[OA\Get(
    path: "/signalements",
    summary: "Lister les signalements",
    description: "Citoyen : voit les siens. Admin/Agent : voit tout.",
    tags: ["Signalements"],
    security: [["bearerAuth" => []]],
    responses: [new OA\Response(response: 200, description: "Liste")]
)]

#[OA\Post(
    path: "/signalements",
    summary: "Créer un signalement",
    tags: ["Signalements"],
    security: [["bearerAuth" => []]],
    responses: [new OA\Response(response: 201, description: "Créé")]
)]

#[OA\Get(
    path: "/signalements/{id}",
    summary: "Détails d'un signalement",
    tags: ["Signalements"],
    security: [["bearerAuth" => []]],
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [new OA\Response(response: 200, description: "Détails")]
)]

#[OA\Put(
    path: "/signalements/{id}",
    summary: "Mise à jour générique",
    description: "Interdit la modification directe de 'statut' et 'priorite'. Permet de modifier la description ou la zone.",
    tags: ["Signalements"],
    security: [["bearerAuth" => []]],
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [
        new OA\Response(response: 200, description: "Mis à jour"),
        new OA\Response(response: 403, description: "Bypass de workflow interdit")
    ]
)]

#[OA\Post(
    path: "/signalements/{id}/valider",
    summary: "Valider un signalement",
    tags: ["Signalements"],
    security: [["bearerAuth" => []]],
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [new OA\Response(response: 200, description: "Validé")]
)]

#[OA\Post(
    path: "/signalements/{id}/rejeter",
    summary: "Rejeter un signalement",
    tags: ["Signalements"],
    security: [["bearerAuth" => []]],
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [new OA\Response(response: 200, description: "Rejeté")]
)]

#[OA\Post(
    path: "/signalements/{id}/prioriser",
    summary: "Prioriser un signalement",
    tags: ["Signalements"],
    security: [["bearerAuth" => []]],
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [new OA\Response(response: 200, description: "Priorisé")]
)]

// --- AFFECTATIONS ---

#[OA\Post(
    path: "/affectations",
    summary: "Affecter une équipe à un signalement",
    tags: ["Affectations"],
    security: [["bearerAuth" => []]],
    responses: [new OA\Response(response: 201, description: "Affecté")]
)]

#[OA\Post(
    path: "/affectations/{id}/reaffecter",
    summary: "Réaffecter une nouvelle équipe",
    tags: ["Affectations"],
    security: [["bearerAuth" => []]],
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [new OA\Response(response: 200, description: "Réaffecté")]
)]

// --- INTERVENTIONS ---

#[OA\Get(
    path: "/interventions",
    summary: "Lister les interventions",
    tags: ["Interventions"],
    security: [["bearerAuth" => []]],
    responses: [new OA\Response(response: 200, description: "Liste")]
)]

#[OA\Put(
    path: "/interventions/{id}",
    summary: "Mettre à jour l'avancement",
    description: "Utilisé par les agents pour passer en cours ou terminer (avec CR obligatoire).",
    tags: ["Interventions"],
    security: [["bearerAuth" => []]],
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [new OA\Response(response: 200, description: "Mis à jour")]
)]

#[OA\Post(
    path: "/interventions/{id}/cloturer",
    summary: "Clôturer le signalement (ADMIN ONLY)",
    description: "Action finale déclenchant l'attribution des points. Préréquis : intervention terminée et signalement à l'état TERMINE.",
    tags: ["Interventions"],
    security: [["bearerAuth" => []]],
    parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
    responses: [
        new OA\Response(response: 200, description: "Clôturé avec succès"),
        new OA\Response(response: 403, description: "Accès réservé à l'administrateur")
    ]
)]

// --- GAMIFICATION ---

#[OA\Get(
    path: "/gamification/leaderboard",
    summary: "Classement des citoyens",
    tags: ["Gamification"],
    security: [["bearerAuth" => []]],
    responses: [new OA\Response(response: 200, description: "Leaderboard")]
)]

#[OA\Get(
    path: "/historique-points",
    summary: "Lister l'historique des points",
    description: "Isolé par utilisateur (RG34). Admin voit tout.",
    tags: ["Gamification"],
    security: [["bearerAuth" => []]],
    responses: [new OA\Response(response: 200, description: "Historique")]
)]

// --- NOTIFICATIONS ---

#[OA\Get(
    path: "/notifications",
    summary: "Mes notifications",
    tags: ["Notifications"],
    security: [["bearerAuth" => []]],
    responses: [new OA\Response(response: 200, description: "Liste")]
)]

// --- ADMINISTRATION ---

#[OA\Get(path: "/users", summary: "Gérer les utilisateurs", tags: ["Administration"], security: [["bearerAuth" => []]], responses: [new OA\Response(response: 200, description: "Liste")])]
#[OA\Get(path: "/zones", summary: "Gérer les zones", tags: ["Administration"], security: [["bearerAuth" => []]], responses: [new OA\Response(response: 200, description: "Liste")])]
#[OA\Get(path: "/types-dechets", summary: "Gérer les types de déchets", tags: ["Administration"], security: [["bearerAuth" => []]], responses: [new OA\Response(response: 200, description: "Liste")])]
#[OA\Get(path: "/dashboard/heatmap", summary: "Heatmap critique", tags: ["Administration"], security: [["bearerAuth" => []]], responses: [new OA\Response(response: 200, description: "Data")])]

final class OpenApi
{
}
