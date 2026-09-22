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

#[OA\Post(path: "/auth/register", summary: "Inscription citoyenne", tags: ["Authentification"], responses: [new OA\Response(response: 201, description: "Citoyen créé")])]
#[OA\Post(path: "/auth/login", summary: "Connexion", tags: ["Authentification"], responses: [new OA\Response(response: 200, description: "Token retourné")])]
#[OA\Post(path: "/auth/logout", summary: "Déconnexion", security: [['bearerAuth' => []]], tags: ["Authentification"], responses: [new OA\Response(response: 204, description: "Succès")])]
#[OA\Post(path: "/auth/forgot-password", summary: "Oubli mot de passe", tags: ["Authentification"], responses: [new OA\Response(response: 200, description: "Email envoyé")])]
#[OA\Post(path: "/auth/reset-password", summary: "Réinitialisation mot de passe", tags: ["Authentification"], responses: [new OA\Response(response: 200, description: "Succès")])]
#[OA\Get(path: "/user", summary: "Profil actuel", security: [['bearerAuth' => []]], tags: ["Authentification"], responses: [new OA\Response(response: 200, description: "Utilisateur connecté")])]
#[OA\Put(path: "/user", summary: "Mettre à jour mon profil", security: [['bearerAuth' => []]], tags: ["Authentification"], responses: [new OA\Response(response: 200, description: "Profil mis à jour")])]

// --- USERS ---

#[OA\Get(path: "/users", summary: "Lister les utilisateurs (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], responses: [new OA\Response(response: 200, description: "Liste")])]
#[OA\Post(path: "/users", summary: "Créer un utilisateur (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], responses: [new OA\Response(response: 201, description: "Créé")])]
#[OA\Get(path: "/users/{id}", summary: "Détails utilisateur (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Détails")])]
#[OA\Put(path: "/users/{id}", summary: "Modifier utilisateur (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Mis à jour"), new OA\Response(response: 409, description: "Conflit rôle/équipe")])]
#[OA\Delete(path: "/users/{id}", summary: "Supprimer utilisateur (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 204, description: "Supprimé")])]

// --- TYPES DE DECHETS ---

#[OA\Get(path: "/types-dechets", summary: "Lister types déchets", security: [['bearerAuth' => []]], tags: ["Types Déchets"], responses: [new OA\Response(response: 200, description: "Liste")])]
#[OA\Post(path: "/types-dechets", summary: "Créer type déchet (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], responses: [new OA\Response(response: 201, description: "Créé")])]
#[OA\Get(path: "/types-dechets/{id}", summary: "Détails type déchet", security: [['bearerAuth' => []]], tags: ["Types Déchets"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Détails")])]
#[OA\Put(path: "/types-dechets/{id}", summary: "Modifier type déchet (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Mis à jour")])]
#[OA\Delete(path: "/types-dechets/{id}", summary: "Supprimer type déchet (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 204, description: "Supprimé")])]

// --- ZONES ---

#[OA\Get(path: "/zones", summary: "Lister les zones", security: [['bearerAuth' => []]], tags: ["Zones"], responses: [new OA\Response(response: 200, description: "Liste")])]
#[OA\Post(path: "/zones", summary: "Créer une zone (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], responses: [new OA\Response(response: 201, description: "Créée")])]
#[OA\Get(path: "/zones/{id}", summary: "Détails zone", security: [['bearerAuth' => []]], tags: ["Zones"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Détails")])]
#[OA\Put(path: "/zones/{id}", summary: "Modifier zone (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Mise à jour")])]
#[OA\Delete(path: "/zones/{id}", summary: "Supprimer zone (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 204, description: "Supprimée")])]

// --- EQUIPES ---

#[OA\Get(path: "/equipes", summary: "Lister les équipes", security: [['bearerAuth' => []]], tags: ["Équipes"], responses: [new OA\Response(response: 200, description: "Liste")])]
#[OA\Post(path: "/equipes", summary: "Créer une équipe (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], responses: [new OA\Response(response: 201, description: "Créée")])]
#[OA\Get(path: "/equipes/{id}", summary: "Détails équipe", security: [['bearerAuth' => []]], tags: ["Équipes"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Détails")])]
#[OA\Put(path: "/equipes/{id}", summary: "Modifier équipe (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Mise à jour")])]
#[OA\Delete(path: "/equipes/{id}", summary: "Supprimer équipe (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 204, description: "Supprimée")])]

// --- SIGNALEMENTS ---

#[OA\Get(path: "/signalements", summary: "Lister les signalements", description: "Citoyen : voit les siens. Admin/Agent : voit tout.", security: [['bearerAuth' => []]], tags: ["Signalements"], responses: [new OA\Response(response: 200, description: "Liste")])]
#[OA\Post(path: "/signalements", summary: "Créer un signalement", security: [['bearerAuth' => []]], tags: ["Signalements"], responses: [new OA\Response(response: 201, description: "Créé")])]
#[OA\Get(path: "/signalements/{id}", summary: "Détails d'un signalement", security: [['bearerAuth' => []]], tags: ["Signalements"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Détails")])]
#[OA\Put(path: "/signalements/{id}", summary: "Mise à jour générique", description: "Interdit la modification directe de 'statut' et 'priorite'. Permet de modifier la description ou la zone.", security: [['bearerAuth' => []]], tags: ["Signalements"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Mis à jour"), new OA\Response(response: 403, description: "Bypass workflow interdit")])]
#[OA\Delete(path: "/signalements/{id}", summary: "Supprimer un signalement", security: [['bearerAuth' => []]], tags: ["Signalements"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 204, description: "Supprimé")])]
#[OA\Post(path: "/signalements/{id}/valider", summary: "Valider (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Validé")])]
#[OA\Post(path: "/signalements/{id}/rejeter", summary: "Rejeter (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Rejeté")])]
#[OA\Post(path: "/signalements/{id}/prioriser", summary: "Prioriser (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Priorisé")])]

// --- AFFECTATIONS ---

#[OA\Get(path: "/affectations", summary: "Lister les affectations", security: [['bearerAuth' => []]], tags: ["Affectations"], responses: [new OA\Response(response: 200, description: "Liste")])]
#[OA\Post(path: "/affectations", summary: "Affecter une équipe (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], responses: [new OA\Response(response: 201, description: "Affecté")])]
#[OA\Get(path: "/affectations/{id}", summary: "Détails affectation", security: [['bearerAuth' => []]], tags: ["Affectations"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Détails")])]
#[OA\Delete(path: "/affectations/{id}", summary: "Supprimer affectation (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 204, description: "Supprimée")])]
#[OA\Post(path: "/affectations/{id}/reaffecter", summary: "Réaffecter (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Réaffecté")])]

// --- INTERVENTIONS ---

#[OA\Get(path: "/interventions", summary: "Lister les interventions", security: [['bearerAuth' => []]], tags: ["Interventions"], responses: [new OA\Response(response: 200, description: "Liste")])]
#[OA\Post(path: "/interventions", summary: "Démarrer intervention (AGENT)", security: [['bearerAuth' => []]], tags: ["Interventions"], responses: [new OA\Response(response: 201, description: "Créée")])]
#[OA\Get(path: "/interventions/{id}", summary: "Détails intervention", security: [['bearerAuth' => []]], tags: ["Interventions"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Détails")])]
#[OA\Put(path: "/interventions/{id}", summary: "Mise à jour avancement (AGENT)", security: [['bearerAuth' => []]], tags: ["Interventions"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Mis à jour")])]
#[OA\Delete(path: "/interventions/{id}", summary: "Supprimer intervention (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 204, description: "Supprimée")])]
#[OA\Post(path: "/interventions/{id}/cloturer", summary: "Clôturer le signalement (ADMIN ONLY)", description: "Action finale déclenchant l'attribution des points. Préréquis : intervention terminée et signalement TERMINE.", security: [['bearerAuth' => []]], tags: ["Administration"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Clôturé"), new OA\Response(response: 403, description: "Réservé Admin")])]

// --- GAMIFICATION ---

#[OA\Get(path: "/gamification/leaderboard", summary: "Classement", security: [['bearerAuth' => []]], tags: ["Gamification"], responses: [new OA\Response(response: 200, description: "Leaderboard")])]
#[OA\Get(path: "/historique-points", summary: "Mon historique de points", description: "Isolé par utilisateur (RG34). Admin voit tout.", security: [['bearerAuth' => []]], tags: ["Gamification"], responses: [new OA\Response(response: 200, description: "Liste")])]
#[OA\Get(path: "/historique-points/{id}", summary: "Détails d'un point", security: [['bearerAuth' => []]], tags: ["Gamification"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))], responses: [new OA\Response(response: 200, description: "Détails")])]

// --- NOTIFICATIONS ---

#[OA\Get(path: "/notifications", summary: "Mes notifications", security: [['bearerAuth' => []]], tags: ["Notifications"], responses: [new OA\Response(response: 200, description: "Liste")])]
#[OA\Post(path: "/notifications/{id}/read", summary: "Marquer comme lu", security: [['bearerAuth' => []]], tags: ["Notifications"], parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "string"))], responses: [new OA\Response(response: 200, description: "Succès")])]

// --- DASHBOARD ---

#[OA\Get(path: "/dashboard/heatmap", summary: "Heatmap critique (ADMIN)", security: [['bearerAuth' => []]], tags: ["Administration"], responses: [new OA\Response(response: 200, description: "Data")])]

final class OpenApi
{
}
