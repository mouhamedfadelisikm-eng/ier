# ISI-Eco Report — Backend

Backend Laravel de la plateforme ISI-Eco Report. Cette phase vise à livrer un backend métier complet et testable, sans frontend Angular/Flutter ni dépôt/démo de production pour le moment.

## Référentiel métier

La source normative est `knowledge-base` v2.1, en particulier `models/regles-gestion.md` (RG1 à RG35). Les décisions structurantes sont :

- tout utilisateur authentifié peut créer un signalement ;
- `zone_id` et les types de déchets sont facultatifs à la création et peuvent être qualifiés plus tard ;
- `dateHeureSignalement` est matérialisée par `signalements.created_at` ;
- les points sont attribués une seule fois après clôture ;
- PostgreSQL 17 est la cible SGBD.

## Stack

- PHP 8.3+
- Laravel 13
- Laravel Sanctum
- Spatie Permission
- PostgreSQL 17
- Stockage des photos via le disque Laravel `public` par défaut (S3/Cloudinary pouvant être configurés ensuite).

## Installation

1. Copier `.env.example` vers `.env`.
2. Générer la clé : `php artisan key:generate`.
3. Configurer PostgreSQL 17 dans `.env`.
4. Installer les dépendances : `composer install`.
5. Appliquer les migrations et seeders : `php artisan migrate --seed`.
6. Pour le stockage local public : `php artisan storage:link`.

## API

Les endpoints sont exposés sous `/api`. Le contrat OpenAPI de référence est `docs/openapi.yaml` (et `docs/openapi.json`). Les routes réelles sont exposées sous `/api`.

Principaux parcours métier :

`POST /api/signalements` → validation/rejet → priorisation → affectation → intervention → clôture.

Notifications persistées :

`GET /api/notifications`
`POST /api/notifications/{notification}/read`

## Photos

Les photos de signalement et d’intervention sont envoyées en `multipart/form-data` via des champs `photos[]`. Les fichiers sont validés comme images JPG/JPEG/PNG/WEBP (10 Mo maximum par fichier) puis stockés par Laravel.

## Tests

La suite PHPUnit couvre notamment les autorisations, transitions, réaffectations, notifications et attribution idempotente des points. L’environnement de CI doit fournir un driver PDO PostgreSQL (ou SQLite pour un environnement de test explicitement configuré) ainsi que les extensions PHP requises par PHPUnit.
