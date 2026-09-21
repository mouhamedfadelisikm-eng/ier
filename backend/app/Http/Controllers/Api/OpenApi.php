<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "ISI-Eco-Report API",
    version: "1.0.0",
    description: "API de signalement et de gestion des déchets sauvages. Permet l'authentification des utilisateurs (Citoyens, Agents et Administrateurs), le signalement géolocalisé avec photo, l'affectation à des brigades de collecte, le suivi des interventions terrain et l'attribution automatique de points de fidélité."
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
    description: "Insérez votre jeton d'accès brut obtenu lors de la connexion (sans le préfixe 'Bearer ')."
)]

// =========================================================================
// 1. AUTHENTICATION MODULE
// =========================================================================

#[OA\Post(
    path: "/auth/register",
    summary: "Inscription citoyenne",
    description: "Permet aux nouveaux citoyens de créer un compte. Rôle par défaut : 'citizen'.",
    tags: ["Authentification"],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["nom", "prenom", "email", "password", "password_confirmation"],
            properties: [
                new OA\Property(property: "nom", type: "string", example: "Sow"),
                new OA\Property(property: "prenom", type: "string", example: "Mamadou"),
                new OA\Property(property: "email", type: "string", format: "email", example: "mamadou@gmail.com"),
                new OA\Property(property: "telephone", type: "string", example: "775283814"),
                new OA\Property(property: "adresse", type: "string", example: "Fann Résidence, Dakar"),
                new OA\Property(property: "password", type: "string", format: "password", example: "password"),
                new OA\Property(property: "password_confirmation", type: "string", format: "password", example: "password")
            ]
        )
    ),
    responses: [
        new OA\Response(response: 201, description: "Citoyen créé avec succès"),
        new OA\Response(response: 422, description: "Données de validation invalides")
    ]
)]

#[OA\Post(
    path: "/auth/login",
    summary: "Connexion de l'utilisateur",
    description: "Permet aux Citoyens, Agents et Admins de se connecter et d'obtenir un jeton d'accès.",
    tags: ["Authentification"],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["email", "password"],
            properties: [
                new OA\Property(property: "email", type: "string", format: "email", example: "admin@isieco.sn"),
                new OA\Property(property: "password", type: "string", format: "password", example: "password")
            ]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: "Connexion réussie avec token"),
        new OA\Response(response: 401, description: "Identifiants invalides")
    ]
)]

#[OA\Post(
    path: "/auth/logout",
    summary: "Déconnexion de l'utilisateur",
    description: "Révoque le jeton d'accès actuel de l'utilisateur connecté.",
    tags: ["Authentification"],
    security: [["bearerAuth" => []]],
    responses: [
        new OA\Response(response: 204, description: "Déconnexion réussie"),
        new OA\Response(response: 401, description: "Non authentifié")
    ]
)]

#[OA\Post(
    path: "/auth/forgot-password",
    summary: "Demander un lien de réinitialisation de mot de passe",
    description: "Envoie un e-mail contenant le lien de réinitialisation si l'adresse e-mail existe.",
    tags: ["Authentification"],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["email"],
            properties: [
                new OA\Property(property: "email", type: "string", format: "email", example: "mamadou@gmail.com")
            ]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: "Lien envoyé")
    ]
)]

#[OA\Post(
    path: "/auth/reset-password",
    summary: "Réinitialisation du mot de passe",
    description: "Réinitialise le mot de passe de l'utilisateur à l'aide du jeton reçu par e-mail.",
    tags: ["Authentification"],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["token", "email", "password", "password_confirmation"],
            properties: [
                new OA\Property(property: "token", type: "string", example: "token_recu"),
                new OA\Property(property: "email", type: "string", format: "email", example: "mamadou@gmail.com"),
                new OA\Property(property: "password", type: "string", format: "password", example: "newpassword"),
                new OA\Property(property: "password_confirmation", type: "string", format: "password", example: "newpassword")
            ]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: "Mot de passe modifié avec succès")
    ]
)]

// =========================================================================
// 2. USER MODULE (ADMIN ONLY)
// =========================================================================

#[OA\Get(
    path: "/users",
    summary: "Lister les utilisateurs",
    description: "Accès : Admin uniquement.",
    tags: ["Utilisateurs"],
    security: [["bearerAuth" => []]],
    responses: [
        new OA\Response(response: 200, description: "Liste des utilisateurs récupérée")
    ]
)]

#[OA\Post(
    path: "/users",
    summary: "Créer un utilisateur",
    description: "Accès : Admin uniquement. Permet de créer un compte avec un rôle spécifique ('admin', 'agent', 'citizen').",
    tags: ["Utilisateurs"],
    security: [["bearerAuth" => []]],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["nom", "prenom", "email", "password", "role"],
            properties: [
                new OA\Property(property: "nom", type: "string", example: "Diallo"),
                new OA\Property(property: "prenom", type: "string", example: "Aicha"),
                new OA\Property(property: "email", type: "string", format: "email", example: "aicha@isieco.sn"),
                new OA\Property(property: "password", type: "string", example: "password"),
                new OA\Property(property: "telephone", type: "string", example: "776382910"),
                new OA\Property(property: "adresse", type: "string", example: "Medina, Dakar"),
                new OA\Property(property: "role", type: "string", example: "agent")
            ]
        )
    ),
    responses: [
        new OA\Response(response: 201, description: "Utilisateur créé")
    ]
)]

#[OA\Get(
    path: "/users/{id}",
    summary: "Voir les détails d'un utilisateur",
    description: "Accès : Admin uniquement.",
    tags: ["Utilisateurs"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 200, description: "Détails de l'utilisateur")
    ]
)]

#[OA\Put(
    path: "/users/{id}",
    summary: "Modifier un utilisateur",
    description: "Accès : Admin uniquement.",
    tags: ["Utilisateurs"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: "nom", type: "string", example: "Diallo"),
                new OA\Property(property: "prenom", type: "string", example: "Aicha Modifiée"),
                new OA\Property(property: "telephone", type: "string", example: "776382910"),
                new OA\Property(property: "role", type: "string", example: "agent")
            ]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: "Utilisateur mis à jour")
    ]
)]

#[OA\Delete(
    path: "/users/{id}",
    summary: "Supprimer un utilisateur",
    description: "Accès : Admin uniquement.",
    tags: ["Utilisateurs"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 204, description: "Utilisateur supprimé")
    ]
)]

// =========================================================================
// 3. TYPES DE DECHETS MODULE
// =========================================================================

#[OA\Get(
    path: "/types-dechets/{id}",
    summary: "Voir les détails d'un type de déchet",
    description: "Accès : Tout utilisateur connecté.",
    tags: ["Types Déchets"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 200, description: "Détails du type de déchet")
    ]
)]

#[OA\Put(
    path: "/types-dechets/{id}",
    summary: "Modifier un type de déchet",
    description: "Accès : Admin uniquement.",
    tags: ["Types Déchets"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: "libelle", type: "string", example: "Déchets Plastiques Modifiés"),
                new OA\Property(property: "description", type: "string", example: "Description modifiée")
            ]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: "Type de déchet mis à jour")
    ]
)]

#[OA\Delete(
    path: "/types-dechets/{id}",
    summary: "Supprimer un type de déchet",
    description: "Accès : Admin uniquement.",
    tags: ["Types Déchets"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 204, description: "Type de déchet supprimé")
    ]
)]

// =========================================================================
// 4. ZONES MODULE
// =========================================================================

#[OA\Get(
    path: "/zones/{id}",
    summary: "Voir les détails d'une zone",
    description: "Accès : Tout utilisateur connecté.",
    tags: ["Zones"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 200, description: "Détails de la zone")
    ]
)]

#[OA\Put(
    path: "/zones/{id}",
    summary: "Modifier une zone",
    description: "Accès : Admin uniquement.",
    tags: ["Zones"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: "nom_zone", type: "string", example: "Dakar Plateau Nord"),
                new OA\Property(property: "description", type: "string", example: "Zone réévaluée")
            ]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: "Zone mise à jour")
    ]
)]

#[OA\Delete(
    path: "/zones/{id}",
    summary: "Supprimer une zone",
    description: "Accès : Admin uniquement.",
    tags: ["Zones"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 204, description: "Zone supprimée")
    ]
)]

// =========================================================================
// 5. EQUIPES MODULE
// =========================================================================

#[OA\Get(
    path: "/equipes",
    summary: "Lister les équipes",
    description: "Accès : Admin et Agent de collecte.",
    tags: ["Équipes"],
    security: [["bearerAuth" => []]],
    responses: [
        new OA\Response(response: 200, description: "Liste des équipes récupérée")
    ]
)]

#[OA\Get(
    path: "/equipes/{id}",
    summary: "Voir les détails d'une équipe",
    description: "Accès : Admin et Agent. Renvoie les membres (agents) associés.",
    tags: ["Équipes"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 200, description: "Détails de l'équipe")
    ]
)]

#[OA\Put(
    path: "/equipes/{id}",
    summary: "Modifier une équipe",
    description: "Accès : Admin uniquement. Permet également d'associer de nouveaux agents via 'agent_ids'.",
    tags: ["Équipes"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: "nom_equipe", type: "string", example: "Brigade Dakar Est Modifiée"),
                new OA\Property(property: "description", type: "string", example: "Description mise à jour"),
                new OA\Property(property: "agent_ids", type: "array", items: new OA\Items(type: "integer", example: 2))
            ]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: "Équipe mise à jour")
    ]
)]

#[OA\Delete(
    path: "/equipes/{id}",
    summary: "Supprimer une équipe",
    description: "Accès : Admin uniquement.",
    tags: ["Équipes"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 204, description: "Équipe supprimée")
    ]
)]

// =========================================================================
// 6. SIGNALEMENTS MODULE
// =========================================================================

#[OA\Get(
    path: "/signalements",
    summary: "Lister les signalements",
    description: "Accès : Tout utilisateur. Les citoyens voient uniquement leurs propres signalements. Les admins/agents voient tous les signalements.",
    tags: ["Signalements"],
    security: [["bearerAuth" => []]],
    responses: [
        new OA\Response(response: 200, description: "Liste des signalements récupérée")
    ]
)]

#[OA\Get(
    path: "/signalements/{id}",
    summary: "Voir les détails d'un signalement",
    description: "Accès : Propriétaire citoyen, Agent ou Admin.",
    tags: ["Signalements"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 200, description: "Détails du signalement")
    ]
)]

#[OA\Delete(
    path: "/signalements/{id}",
    summary: "Supprimer un signalement",
    description: "Accès : Citoyen (uniquement si le signalement est encore en statut 'brouillon') ou Admin.",
    tags: ["Signalements"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 204, description: "Signalement supprimé")
    ]
)]

// =========================================================================
// 7. AFFECTATIONS MODULE
// =========================================================================

#[OA\Get(
    path: "/affectations",
    summary: "Lister les affectations",
    description: "Accès : Admin et Agent uniquement.",
    tags: ["Affectations"],
    security: [["bearerAuth" => []]],
    responses: [
        new OA\Response(response: 200, description: "Liste des affectations récupérée")
    ]
)]

#[OA\Get(
    path: "/affectations/{id}",
    summary: "Voir une affectation spécifique",
    description: "Accès : Admin et Agent uniquement.",
    tags: ["Affectations"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 200, description: "Détails de l'affectation")
    ]
)]

#[OA\Delete(
    path: "/affectations/{id}",
    summary: "Annuler une affectation",
    description: "Accès : Admin uniquement.",
    tags: ["Affectations"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 204, description: "Affectation annulée")
    ]
)]

// =========================================================================
// 8. INTERVENTIONS MODULE
// =========================================================================

#[OA\Get(
    path: "/interventions",
    summary: "Lister les interventions",
    description: "Accès : Admin et Agent uniquement.",
    tags: ["Interventions"],
    security: [["bearerAuth" => []]],
    responses: [
        new OA\Response(response: 200, description: "Liste des interventions")
    ]
)]

#[OA\Get(
    path: "/interventions/{id}",
    summary: "Voir les détails d'une intervention",
    description: "Accès : Admin et Agent.",
    tags: ["Interventions"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 200, description: "Détails de l'intervention")
    ]
)]

#[OA\Delete(
    path: "/interventions/{id}",
    summary: "Supprimer une intervention",
    description: "Accès : Admin uniquement.",
    tags: ["Interventions"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 204, description: "Intervention supprimée")
    ]
)]

// =========================================================================
// 9. POINTS MODULE
// =========================================================================

#[OA\Get(
    path: "/historique-points/{id}",
    summary: "Consulter un historique de points spécifique",
    description: "Accès : Admin, ou le citoyen propriétaire de l'historique.",
    tags: ["Points"],
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
    ],
    responses: [
        new OA\Response(response: 200, description: "Détails de la transaction de points")
    ]
)]
// =========================================================================
// 10. DASHBOARD MODULE
// =========================================================================

#[OA\Get(
    path: "/dashboard/heatmap",
    summary: "Heatmap des zones les plus critiques",
    description: "Accès : Admin uniquement. Agrège les signalements actifs (ni brouillon, ni rejeté, ni clôturé) par zone : le poids correspond au nombre de signalements actifs et les coordonnées au centroïde de la zone. Aucune donnée personnelle n'est renvoyée.",
    tags: ["Dashboard"],
    security: [["bearerAuth" => []]],
    responses: [
        new OA\Response(response: 200, description: "Tableau de points pour la heatmap", content: new OA\JsonContent(
            type: "array",
            items: new OA\Items(
                properties: [
                    new OA\Property(property: "latitude", type: "number", format: "float", example: 14.7168),
                    new OA\Property(property: "longitude", type: "number", format: "float", example: -17.4677),
                    new OA\Property(property: "weight", type: "integer", example: 3),
                    new OA\Property(property: "zone_id", type: "integer", example: 4),
                    new OA\Property(property: "zone_nom", type: "string", example: "Mermoz")
                ]
            )
        )),
        new OA\Response(response: 401, description: "Non authentifié"),
        new OA\Response(response: 403, description: "Accès réservé à l'administrateur")
    ]
)]

final class OpenApi
{
}
