---
title: Règles de gestion
project: ISI-Eco Report
version: 2.1
type: Business Rules
status: Normative
---

# Règles de gestion

## Objectif

Les règles de gestion définissent les contraintes fonctionnelles qui régissent le fonctionnement de la plateforme **ISI-Eco Report**.

Elles sont indépendantes de toute technologie et constituent la référence officielle pour :

- la modélisation Merise (MCD, MLD) ;
- le développement de l'application ;
- la validation métier ;
- les tests fonctionnels.

---

# 1. Règles relatives aux utilisateurs

## RG1 — Identification unique

Chaque utilisateur est identifié de manière unique dans le système.

---

## RG2 — Unicité du rôle

Un utilisateur possède exactement un seul rôle.

Rôles autorisés :

- Citoyen
- Agent
- Administrateur

---

## RG3 — Création des signalements

Tout utilisateur authentifié peut créer plusieurs signalements.

---

## RG4 — Propriétaire d'un signalement

Chaque signalement est créé par un seul utilisateur authentifié.

---

## RG5 — Historique des points

Un utilisateur peut recevoir plusieurs attributions de points. Les points liés à un signalement sont attribués une seule fois après la clôture du signalement.

---

## RG6 — Appartenance aux équipes

Seuls les utilisateurs ayant le rôle **Agent** peuvent appartenir à une ou plusieurs équipes.

---

## RG7 — Mobilité des agents

Un agent peut changer d'équipe au cours du temps.

---

## RG8 — Historique des appartenances

Toute appartenance à une équipe possède :

- une date de début ;
- éventuellement une date de fin.

Cette règle garantit la conservation de l'historique des affectations des agents.

---

# 2. Règles relatives aux signalements

## RG9 — Identifiant

Chaque signalement possède un identifiant unique.

---

## RG10 — Localisation

Un signalement peut être créé sans zone lorsque l'utilisateur ne connaît pas son secteur.
Après qualification, un signalement est rattaché à au plus une zone.

---

## RG11 — Composition d'une zone

Une zone peut contenir plusieurs signalements.

---

## RG12 — Types de déchets

Un signalement peut être créé sans type de déchet lorsque l'utilisateur ne peut pas le déterminer.
Après qualification, un signalement peut être associé à un ou plusieurs types de déchets.

---

## RG13 — Réutilisation des types

Un type de déchet peut apparaître dans plusieurs signalements.

---

## RG14 — Photographie facultative

La présence d'une photographie lors de la création d'un signalement est facultative. Les photographies transmises par l'application sont stockées par le backend et associées au signalement.

---

## RG15 — Décision administrative

Tout signalement doit être validé ou rejeté.

---

## RG16 — Condition d'affectation

Seul un signalement validé et préalablement priorisé peut être affecté à une équipe. La validation et la priorisation constituent deux étapes distinctes.

---

# 3. Règles relatives aux types de déchets

## RG17 — Identification

Chaque type de déchet est identifié de manière unique.

---

## RG18 — Mutualisation

Un type de déchet peut être associé à plusieurs signalements.

---

# 4. Règles relatives aux photographies des signalements

## RG19 — Appartenance

Une photographie appartient à un seul signalement.

---

## RG20 — Multiplicité

Un signalement peut posséder plusieurs photographies.

---

# 5. Règles relatives aux zones

## RG21 — Contenu

Une zone regroupe plusieurs signalements.

---

## RG22 — Couverture

Une zone peut être couverte par plusieurs équipes.

---

# 6. Règles relatives aux équipes

## RG23 — Couverture territoriale

Une équipe peut intervenir dans plusieurs zones.

---

## RG24 — Composition

Une équipe peut regrouper plusieurs agents. Seuls les utilisateurs ayant le rôle Agent peuvent en faire partie.

---

## RG25 — Affectations

Une équipe peut recevoir plusieurs affectations.

---

# 7. Règles relatives aux affectations

## RG26 — Cible

Une affectation concerne un seul signalement.

---

## RG27 — Responsable

Une affectation est attribuée à une seule équipe.

---

## RG28 — Réaffectation

Un signalement peut être affecté plusieurs fois au cours de son cycle de vie.

---

## RG29 — Interventions

Une affectation peut générer plusieurs interventions.

---

# 8. Règles relatives aux interventions

## RG30 — Origine

Une intervention appartient à une seule affectation.

---

## RG31 — Exécution

Une intervention est réalisée par une seule équipe.

---

## RG32 — Documentation

Une intervention peut posséder plusieurs photographies ; les photographies d’intervention sont facultatives.

---

## RG33 — Suivi

Toute intervention possède un statut permettant de suivre son avancement et doit avoir un compte rendu non vide avant de passer à l’état TERMINEE.

---

# 9. Règles relatives aux points

## RG34 — Attribution

Chaque historique de points appartient à un seul utilisateur.

---

## RG35 — Cumul

Un utilisateur peut cumuler plusieurs historiques de points.

---

# Synthèse

| Domaine | Nombre de règles |
|----------|-----------------:|
| Utilisateurs | 8 |
| Signalements | 8 |
| Types de déchets | 2 |
| Photos des signalements | 2 |
| Zones | 2 |
| Équipes | 3 |
| Affectations | 4 |
| Interventions | 4 |
| Historique des points | 2 |
| **Total** | **35** |

---

# Références

Ces règles sont utilisées par les documents suivants :

- `models/mcd.md`
- `models/mld.md`
- `02-etude-prealable.md`
- `03-conception-des-donnees.md`

Toute modification du modèle conceptuel ou logique doit rester conforme à ces règles de gestion.


---

# 10. Précisions normatives d'implémentation

## Date métier du signalement

La date et l'heure métier du signalement correspondent à `created_at` Laravel. Le modèle conceptuel conserve le nom `dateHeureSignalement` pour la lisibilité métier ; le modèle physique n'ajoute pas de seconde colonne temporelle.

## Qualification différée

`zone_id` et l'association `CONTENU_SIGNALEMENT` peuvent être absents à la création. La qualification est réalisée ultérieurement et peut compléter ou corriger ces informations sans changer le créateur.

## Rôles

Le système utilise Spatie Permission pour les rôles. Une contrainte d'unicité sur `(model_type, model_id)` dans `model_has_roles` garantit qu'un utilisateur ne peut avoir qu'un seul rôle simultanément.

## Points

Les points liés à un signalement sont attribués une seule fois, après clôture du signalement.
