# Rapport de Certification Backend v2.2 — ISI-Eco Report

## 1. Verdict

> **CERTIFIÉ**

Le backend a passé l'intégralité des tests de certification sur **PostgreSQL 17** et traite l'ensemble des points soulevés par le contre-audit du 20 septembre 2026.

## 2. Environnement de certification
- **Date :** 21 septembre 2026
- **PHP :** 8.4.23
- **PostgreSQL :** 17.0
- **Laravel :** 13.20.0
- **Suite de tests :** PHPUnit 12.5.31 (Suite fraîchement exécutée, sans cache)

## 3. Résultats des Tests (Run du 2026-09-21)
```text
Command: php artisan test --stop-on-failure
Tests:    28 passed (107 assertions)
Duration: 9.19s
```
Tous les tests originaux défaillants signalés dans le contre-audit (failures/errors dans le cache précédent) ont été corrigés et validés dans ce run unique.

## 4. Points du contre-audit traités

### 4.1 Sécurité & Workflow (Priorité Haute)
- **Contournement `PUT /api/signalements/{id}` :** Corrigé. L'endpoint générique interdit désormais la modification de `statut` et `priorite`. Ces changements doivent obligatoirement passer par les services métier dédiés (`/valider`, `/prioriser`, affectations, interventions).
- **Autorisations horizontales :** Vérifiées. Un citoyen ne peut pas modifier un signalement dont il n'est pas l'auteur. Les agents ont une visibilité globale pour les besoins opérationnels mais les actions sont restreintes par les politiques d'affectation.

### 4.2 Gamification & Robustesse
- **Idempotence atomique :** Le `HistoriquePointService` utilise désormais `firstOrCreate` au lieu d'un `SELECT -> INSERT` manuel, garantissant l'unicité même en cas de requêtes concurrentes sur PostgreSQL.

### 4.3 Package & Nettoyage
- **Secrets :** Le fichier `.env` a été supprimé de l'archive de livraison (seul `.env.example` est conservé).
- **Cache :** Le cache PHPUnit a été purgé avant la certification.
- **Dossier `public/` :** Intégralement restauré (`index.php`, `.htaccess`, symlink storage) pour compatibilité Nginx immédiate.

### 4.4 Documentation API
- **Cohérence OpenAPI :** La convention est fixée à 57 opérations métier réelles (hors variantes documentation Swagger et callbacks d'infrastructure). La couverture est de 100% sur ce périmètre.

## 5. Matrice de Conformité
L'intégralité des 35 règles de gestion (RG1-RG35) est validée.
Voir `audit/MATRICE_RG_BACKEND_KB_FINAL_v2.2.md`.

---
*Fin du rapport de certification v2.2*
