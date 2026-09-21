# Audit final — ISI-Eco Report backend v2.1

Date : 19 septembre 2026

## 1. Référentiel retenu

Le référentiel métier backend est `knowledge-base` v2.1, en particulier `models/regles-gestion.md` (RG1 à RG35).

Les décisions suivantes sont considérées comme normatives :

1. Tout utilisateur authentifié peut créer un signalement.
2. `zone_id` et les types de déchets sont facultatifs à la création et peuvent être qualifiés après coup.
3. `dateHeureSignalement` correspond à `signalements.created_at` Laravel.
4. Les points liés à un signalement sont attribués après clôture et une seule fois.
5. Le MPD cible PostgreSQL 17.
6. Frontend Angular/Flutter, dépôt et démo sont hors périmètre de la présente phase.

## 2. Résultat de l'alignement

### Backend ↔ Knowledge Base

Les 35 règles RG1-RG35 sont maintenant alignées avec le schéma et le code backend sur le chemin API normal.

Les principaux écarts identifiés lors de l'audit initial ont été traités :

- unicité réelle du rôle utilisateur ;
- contrôle Agent pour l'appartenance aux équipes ;
- historisation des changements d'équipe ;
- priorité obligatoire avant affectation ;
- réaffectation avec conservation de l'historique ;
- portée des Agents sur leurs équipes ;
- exigence du compte rendu avant fin d'intervention ;
- upload effectif des photos ;
- notifications de changement de statut ;
- attribution de points après clôture, avec idempotence ;
- endpoint de leaderboard ;
- harmonisation des routes et du contrat OpenAPI ;
- suppression du `.env` du livrable ;
- README backend spécifique au projet.

### Knowledge Base ↔ rapport d'analyse

Le rapport d'analyse a été réaligné sur la KB v2.1 :

- référentiel RG1-RG35 repris avec la même numérotation ;
- PostgreSQL 17 retenu ;
- points attribués après clôture ;
- création ouverte à tout utilisateur authentifié ;
- zone/type de déchet facultatifs à la création ;
- date métier `dateHeureSignalement` explicitée comme `created_at` ;
- documentation frontend/repo/démo explicitement indiquée comme hors périmètre de cette phase.

### Rapport d'analyse ↔ cahier des charges

Le rapport ne prétend plus que le frontend, le dépôt ou la démo sont déjà livrés : ils sont explicitement différés.

Les capacités backend utiles aux exigences du cahier des charges sont préparées : authentification, signalement avec géolocalisation, stockage de photos, suivi de statut, notifications, affectation d'équipes, points et leaderboard.

Le cahier des charges demande également une interface cartographique, un dashboard/heatmap et un prototype/démo final ; ces éléments relèvent de la phase frontend/livraison ultérieure et ne sont pas utilisés comme critères de blocage du backend actuel.

## 3. Vérifications techniques effectuées

### Syntaxe

Lint PHP sur l'ensemble du périmètre `app/`, `database/`, `routes/`, `tests/` : **197 fichiers, aucune erreur de syntaxe**.

### Routes

Laravel : **51 lignes de routes API**.
Après expansion des variantes HTTP (`GET|HEAD`, `PUT|PATCH`) : **77 opérations méthode/URI**.

### OpenAPI

`docs/openapi.json` et `docs/openapi.yaml` : **77 opérations**.
Comparaison normalisée avec le routeur Laravel : **77/77 couvertes**, 0 manquante, 0 en trop.

### Analyse statique

PHPStan niveau 0 : **OK / aucune erreur**.

La commande Composer de validation n'a pas pu être exécutée car le binaire `composer` n'est pas installé dans l'environnement d'audit ; les dépendances présentes dans `vendor/` ont toutefois permis l'exécution de Laravel et de PHPStan.

## 4. Limite de certification d'exécution

Les tests PHPUnit n'ont pas pu être exécutés dans l'environnement actuel.

Le runtime PHP disponible (PHP 8.4.23) ne fournit que PDO, sans driver SQLite/PostgreSQL, et les extensions `dom`, `mbstring` et `xmlwriter` sont absentes. Laravel/PHPUnit échouent donc avant l'exécution de la suite.

Cette limite ne constitue pas un défaut du code livré, mais elle empêche de produire ici une preuve d'exécution des migrations, requêtes SQL et tests Feature contre PostgreSQL 17.

## 5. Ce qui reste avant la certification finale

La prochaine étape est une recette technique dans un environnement PostgreSQL 17 complet :

`composer install`
→ `.env` de recette
→ PostgreSQL 17
→ `php artisan migrate --seed`
→ `php artisan test`
→ contrôle des uploads et du stockage public
→ vérification des notifications DB
→ vérification du leaderboard
→ contrôle final des 35 RG.

La formulation correcte à ce stade est donc :

> **Backend aligné sur la KB v2.1 au niveau du schéma, des règles métier, des workflows et du contrat API ; certification d'exécution PostgreSQL 17 encore à réaliser dans un environnement disposant des extensions/drivers PHP requis.**
