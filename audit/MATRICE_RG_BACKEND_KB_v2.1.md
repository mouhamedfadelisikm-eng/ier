# Matrice RG1-RG35 — Backend ISI-Eco Report ↔ Knowledge Base v2.1

## Décisions normatives intégrées

- Tout utilisateur authentifié peut créer un signalement.
- `zone_id` et les types de déchets sont facultatifs à la création et peuvent être qualifiés ensuite.
- `dateHeureSignalement` est matérialisée par `signalements.created_at` et exposée par `date_heure_signalement` dans l'API.
- Les points liés à un signalement sont attribués une seule fois après sa clôture.
- PostgreSQL 17 est la cible du modèle physique.
- Le frontend Angular/Flutter, le dépôt final et la démo restent hors périmètre de la phase backend.

## Lecture de la matrice

« Aligné » signifie que le schéma et/ou le code métier garantissent la règle sur le chemin API normal.
La présence d'un test ciblé indique une preuve automatisée dans la suite PHPUnit ; la suite n'a pas pu être exécutée dans l'environnement d'audit faute des extensions/drivers PHP nécessaires.

| RG | Règle | Implémentation backend de référence | Statut structurel | Test/preuve automatisée |
|---:|---|---|---|---|
| RG1 | Utilisateur identifié de manière unique | `users.id` + email unique | Aligné | Tests utilisateur/auth existants |
| RG2 | Un seul rôle parmi Citoyen/Agent/Admin | Spatie Permission + migration `000013` unique sur `(model_type, model_id)` + `UserService::syncRoles()` | Aligné | `UserRoleInvariantTest` |
| RG3 | Tout utilisateur authentifié peut créer plusieurs signalements | `SignalementPolicy::create()`, `StoreSignalementRequest`, `SignalementService::create()` | Aligné | `SignalementApiTest` |
| RG4 | Un signalement a un seul créateur authentifié | FK `signalements.user_id` non nullable + création issue de l'utilisateur authentifié | Aligné | `SignalementApiTest` |
| RG5 | Plusieurs historiques de points ; un seul lié à un signalement après clôture | `historique_points` + `signalement_id` unique + attribution dans `InterventionService::cloturer()` | Aligné | `InterventionApiTest` |
| RG6 | Seuls les Agents appartiennent aux équipes | `EquipeService::assertAgentIds()` | Aligné | `BusinessRulesRegressionTest` |
| RG7 | Un Agent peut changer d'équipe dans le temps | Gestion des appartenances par périodes dans `EquipeService` | Aligné | Régression prévue ; à exécuter |
| RG8 | Historique avec date début/fin | `appartenance_equipe.date_debut/date_fin` + conservation des lignes historiques | Aligné | Régression prévue ; à exécuter |
| RG9 | Identifiant signalement unique | `signalements.id` | Aligné | Intégrité DB |
| RG10 | Zone facultative à la création, au plus une après qualification | `signalements.zone_id` nullable, FK simple | Aligné | API/update |
| RG11 | Une zone peut contenir plusieurs signalements | FK `signalements.zone_id` non unique | Aligné | Intégrité DB |
| RG12 | Type de déchet facultatif à la création, plusieurs après qualification | `CONTENU_SIGNALEMENT` / relation `typeDechets()` + validation nullable | Aligné | `SignalementApiTest` |
| RG13 | Un type peut être dans plusieurs signalements | relation N-N `contenu_signalement` | Aligné | Intégrité DB |
| RG14 | Photo de signalement facultative et stockée | upload `multipart/form-data` + disque Laravel `public` + `PhotoSignalement` | Aligné | `SignalementApiTest` |
| RG15 | Chaque signalement doit être validé ou rejeté | endpoints dédiés + policy Admin + machine à états | Aligné | `SignalementApiTest` |
| RG16 | Validation puis priorisation avant affectation | transitions `VALIDE -> PRIORISE -> AFFECTE` + `PrioritizeSignalementRequest` + contrôle `peutEtreAffecte()` | Aligné | `AffectationApiTest` + `BusinessRulesRegressionTest` |
| RG17 | Type de déchet identifié de façon unique | `types_dechets.id` + libellé unique | Aligné | API/type tests |
| RG18 | Type mutualisable entre signalements | N-N `contenu_signalement` | Aligné | Intégrité DB |
| RG19 | Une photo appartient à un seul signalement | `photo_signalements.signalement_id` FK | Aligné | API upload |
| RG20 | Signalement multi-photos | relation `hasMany` + boucle d'upload | Aligné | API upload |
| RG21 | Une zone regroupe plusieurs signalements | FK simple vers `zones` | Aligné | Intégrité DB |
| RG22 | Une zone peut être couverte par plusieurs équipes | table `couverture_zone` N-N | Aligné | API zone/équipe |
| RG23 | Une équipe peut intervenir dans plusieurs zones | N-N `couverture_zone` | Aligné | Intégrité DB |
| RG24 | Une équipe peut regrouper plusieurs Agents seulement | `EquipeService` contrôle les rôles + appartenance N-N | Aligné | `BusinessRulesRegressionTest` |
| RG25 | Une équipe peut recevoir plusieurs affectations | FK `affectations.equipe_id` non unique | Aligné | `AffectationApiTest` |
| RG26 | Une affectation concerne un signalement | FK `affectations.signalement_id` | Aligné | `AffectationApiTest` |
| RG27 | Une affectation concerne une équipe | FK `affectations.equipe_id` | Aligné | `AffectationApiTest` |
| RG28 | Un signalement peut être affecté plusieurs fois | historique des lignes `affectations` + endpoint `/reaffecter` | Aligné | `BusinessRulesRegressionTest` |
| RG29 | Une affectation peut générer plusieurs interventions | `interventions.affectation_id` non unique + autorisation d'une nouvelle intervention après clôture/suspension précédente | Aligné | `InterventionApiTest` |
| RG30 | Une intervention appartient à une seule affectation | FK `interventions.affectation_id` | Aligné | Intégrité DB |
| RG31 | Une intervention est exécutée par une seule équipe via l'affectation | équipe portée par `affectations.equipe_id` | Aligné | `InterventionPolicy/Service` |
| RG32 | Photos d'intervention multiples et facultatives | upload `multipart/form-data` + `photo_interventions` | Aligné | `InterventionApiTest` |
| RG33 | Statut d'intervention + compte rendu non vide avant TERMINEE | enum de transitions + validation dans `InterventionService::update()` et clôture | Aligné | `InterventionApiTest` |
| RG34 | Historique de points appartient à un utilisateur | FK `historique_points.user_id` | Aligné | API/gamification |
| RG35 | Un utilisateur peut cumuler plusieurs historiques | aucune unicité sur `user_id`, seule `signalement_id` est idempotente | Aligné | `GamificationApiTest` |

## Couverture des parcours métier

### Signalement

`POST /api/signalements`
→ `EN_ATTENTE_VALIDATION`
→ `VALIDE` ou `REJETE`
→ `PRIORISE`
→ `AFFECTE`
→ `EN_INTERVENTION`
→ `TERMINE`
→ `CLOTURE`

### Affectation

Une affectation ne peut être créée que pour un signalement `PRIORISE`.
La réaffectation conserve l'ancienne affectation et crée une nouvelle affectation courante.

### Intervention

Une intervention est liée à une affectation. Une nouvelle intervention peut être créée pour la même affectation lorsqu'aucune intervention `EN_COURS` n'est active.
La clôture exige un compte rendu non vide et déclenche une attribution de points idempotente.

### Notifications

Chaque changement de statut d'un signalement notifie son créateur par notification persistée en base.

### Gamification

`GET /api/gamification/leaderboard` expose un classement calculé à partir du total des points cumulés.

## Contrat API

Le fichier `docs/openapi.yaml` / `docs/openapi.json` utilise le serveur `/api` et couvre exactement les 77 combinaisons méthode/route issues de `php artisan route:list` (après expansion de `GET|HEAD` et `PUT|PATCH`).

## Limite de certification

Le code a passé le lint PHP complet et PHPStan niveau 0. Les tests PHPUnit n'ont pas pu être exécutés dans l'environnement d'audit actuel : le runtime ne fournit ni driver PDO SQLite/PostgreSQL, ni les extensions `dom`, `mbstring` et `xmlwriter` requises par PHPUnit/Laravel pour cette suite.

La conformité fonctionnelle doit donc être déclarée **alignée structurellement**, avec une **certification d'exécution encore à effectuer dans un environnement PostgreSQL 17 complet**.
