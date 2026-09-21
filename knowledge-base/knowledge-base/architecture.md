---
title: Architecture métier
project: ISI-Eco Report
version: 2.1
type: Domain Model
target:
  - GPT
  - Claude
  - Gemini
  - Cursor
  - Copilot
  - RAG
---

# Architecture métier

## Objectif du document

Ce document décrit le fonctionnement métier de la plateforme **ISI-Eco Report** indépendamment de toute technologie.

Il constitue la référence permettant de comprendre :

- le domaine métier ;
- les acteurs ;
- les objets manipulés ;
- les processus ;
- les règles fonctionnelles ;
- le cycle de vie des données.

Ce document est destiné aux développeurs, analystes, concepteurs et agents IA.

---

# Vision métier

ISI-Eco Report est une plateforme collaborative de gestion des signalements de déchets.

Elle permet :

- aux citoyens de signaler des dépôts de déchets ;
- aux administrateurs de coordonner les opérations ;
- aux agents de terrain d'exécuter les interventions ;
- au système de conserver un historique complet de toutes les opérations.

L'objectif principal est d'améliorer la rapidité, la traçabilité et la qualité de la gestion des déchets.

---

# Les acteurs

## Citoyen

Le citoyen est un utilisateur authentifié.

### Responsabilités

- créer un ou plusieurs signalements ;
- consulter ses signalements ;
- consulter ses points ;
- consulter son historique ;
- modifier son profil.

---

## Agent

L'agent est un utilisateur appartenant à une équipe.

Il intervient sur le terrain.

### Responsabilités

- consulter ses affectations ;
- réaliser une intervention ;
- rédiger un compte rendu ;
- ajouter des photographies ;
- clôturer une intervention.

---

## Administrateur

L'administrateur supervise la plateforme.

### Responsabilités

- gérer les utilisateurs ;
- gérer les équipes ;
- gérer les zones ;
- gérer les types de déchets ;
- consulter les signalements ;
- valider ou rejeter un signalement ;
- définir les priorités ;
- affecter une équipe ;
- consulter les statistiques.

---

## Système

Le système automatise plusieurs traitements.

### Responsabilités

- enregistrer les données ;
- attribuer les points ;
- produire les statistiques ;
- générer les tableaux de bord ;
- conserver les historiques.

---

# Les objets métier

Le système repose sur les objets métier suivants.

## ROLE

Détermine le rôle fonctionnel d'un utilisateur.

Valeurs :

- Citoyen
- Agent
- Administrateur

---

## UTILISATEUR

Représente une personne utilisant la plateforme.

Un utilisateur possède :

- une identité ;
- un rôle ;
- un compte.

---

## SIGNALEMENT

Représente un dépôt de déchets déclaré par un utilisateur authentifié.

Il possède notamment :

- une localisation GPS ;
- une description ;
- un statut ;
- une priorité ;
- une zone facultativement renseignée à la création ;
- des types de déchets facultativement renseignés à la création ;
- une date métier représentée physiquement par `created_at`.

---

## TYPE_DECHET

Décrit la nature d'un déchet.

Exemples :

- Plastique
- Métal
- Papier
- Verre
- Déchets organiques
- Déchets électroniques

---

## PHOTO_SIGNALEMENT

Illustration d'un signalement.

Plusieurs photographies peuvent être associées au même signalement.

---

## ZONE

Secteur géographique utilisé pour organiser les interventions.

Une zone peut contenir plusieurs signalements.

---

## EQUIPE

Groupe d'agents chargé d'effectuer les interventions.

Une équipe peut couvrir plusieurs zones.

---

## AFFECTATION

Décision administrative consistant à confier un signalement à une équipe.

Une même demande peut être réaffectée plusieurs fois.

---

## INTERVENTION

Action réalisée sur le terrain.

Une intervention est toujours liée à une affectation.

---

## PHOTO_INTERVENTION

Photographie prise pendant ou après une intervention.

---

## HISTORIQUE_POINT

Historique des récompenses attribuées à un utilisateur.

Chaque attribution est conservée afin d'assurer une traçabilité complète.

---

# Processus métier

Le fonctionnement global repose sur le processus suivant.

```text
Création d'un signalement

        │

        ▼

Validation ou rejet

        │

        ▼

Priorisation

        │

        ▼

Affectation d'une équipe

        │

        ▼

Intervention terrain

        │

        ▼

Compte rendu

        │

        ▼

Photographies

        │

        ▼

Clôture

        │

        ▼

Attribution automatique de points

Les points du signalement sont attribués une seule fois après clôture.
```

---

# États d'un signalement

Un signalement peut évoluer entre plusieurs états.

```text
Créé

↓

En attente de validation

↓

Validé
    │
    ▼
Priorisé
    │
    ▼
Affecté

↓

En intervention

↓

Traité

↓

Clôturé
```

---

# Relations principales

Le domaine métier repose sur les relations suivantes.

```text
ROLE
        │
        ▼
UTILISATEUR

UTILISATEUR
        │
        ▼
SIGNALEMENT

SIGNALEMENT
        │
        ▼
ZONE

SIGNALEMENT
        │
        ▼
TYPE_DECHET

SIGNALEMENT
        │
        ▼
PHOTO_SIGNALEMENT

UTILISATEUR
        │
        ▼
EQUIPE

EQUIPE
        │
        ▼
ZONE

SIGNALEMENT
        │
        ▼
AFFECTATION

AFFECTATION
        │
        ▼
INTERVENTION

INTERVENTION
        │
        ▼
PHOTO_INTERVENTION

UTILISATEUR
        │
        ▼
HISTORIQUE_POINT
```

---

# Principes métier

Le système respecte les principes suivants.

- Un utilisateur possède exactement un rôle.
- Un utilisateur authentifié est le propriétaire de ses signalements.
- Une équipe ne traite que les affectations qui lui sont attribuées.
- Toute intervention est traçable.
- Toute attribution de points est historisée.
- Les données ne sont jamais dupliquées inutilement.
- Les relations respectent les règles de normalisation Merise.

---

# Objectifs de la plateforme

La plateforme vise à :

- améliorer la propreté des espaces publics ;
- accélérer les interventions ;
- faciliter la coordination des équipes ;
- fournir des indicateurs fiables ;
- renforcer la participation citoyenne ;
- assurer une traçabilité complète des opérations.

---

# Documents de référence

Les documents suivants complètent cette architecture :

- `01-contexte-general.md`
- `02-etude-prealable.md`
- `03-conception-des-donnees.md`
- `models/regles-gestion.md`
- `models/regles-organisation.md`
- `models/mcd.md`
- `models/mld.md`
- `models/dictionnaire-des-donnees.md`
