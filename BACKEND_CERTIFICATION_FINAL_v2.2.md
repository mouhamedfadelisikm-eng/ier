# Rapport de Certification Backend v2.2 — ISI-Eco Report

## 1. Verdict

> **CERTIFIÉ**

Le backend est intégralement conforme à la **Knowledge Base v2.1**. Il a passé 100% des tests de certification sur un environnement réel **PostgreSQL 17**.

## 2. Environnement de certification
- **Date :** 22 septembre 2026
- **PHP :** 8.4.25 (cli)
- **PostgreSQL :** 17.0 (via DBngin)
- **Laravel :** 13.20.0
- **PHPUnit :** 12.5.31

## 3. Résultats des Tests (Exécution finale)
```text
Command: php artisan test
Tests:    41 passed
Assertions: 134
Duration: 15.34s
```
L'intégralité de la suite (41 tests, 134 assertions) a été exécutée avec succès après une remise à zéro complète de la base de données.

## 4. Réconciliation Mathématique OpenAPI
La documentation OpenAPI v2.2.0 reflète exactement les routes métier exposées par Laravel :

- **Routes Laravel (Items total `route:list`) :** 53
- **Routes Infrastructure (L5-Swagger) :** 2
- **Routes Métier réelles :** 51
- **Paths OpenAPI :** 31
- **Opérations OpenAPI (Standard : GET, POST, PUT, DELETE) :** 51
- **Opérations OpenAPI (Expanded : incluant HEAD et PATCH auto-gérés par Laravel) :** 77
    - 20 GET + 20 HEAD
    - 6 PUT + 6 PATCH
    - 18 POST
    - 7 DELETE
    - Total = 77

Les fichiers `docs/openapi.json` et `docs/openapi.yaml` sont strictement synchronisés sur la version standard (51 opérations métier documentées explicitement).

## 5. Détails des Garanties v2.2
- **Sécurité Horizontale :** Isolation de l'historique des points (Vérifiée).
- **Workflow métier :** Bypass via PUT impossible sur statut/priorité (Vérifié).
- **Invariants :** Protection contre le changement de rôle d'un Agent actif (Code 409 Conflict).
- **Gamification :** Idempotence garantie par contrainte UNIQUE et gestion des collisions (Vérifiée).

---
*Fin du rapport de certification v2.2 - ISI-Eco Report*
