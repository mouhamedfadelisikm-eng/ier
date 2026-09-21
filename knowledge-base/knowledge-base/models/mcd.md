---
title: Modèle Conceptuel de Données (MCD)
project: ISI-Eco Report
version: 2.1
methodology: Merise
type: Conceptual Data Model
status: Normative
---

# Modèle Conceptuel de Données (MCD)

## Objectif

Le Modèle Conceptuel de Données (MCD) représente les données manipulées par le système ainsi que leurs relations, indépendamment de toute considération technique.

Il constitue la base de conception de la base de données et garantit le respect des règles de gestion définies dans le projet.

---

# Vue d'ensemble

Le domaine métier est organisé autour des entités suivantes :

- ROLE
- UTILISATEUR
- SIGNALEMENT
- TYPE_DECHET
- PHOTO_SIGNALEMENT
- ZONE
- EQUIPE
- AFFECTATION
- INTERVENTION
- PHOTO_INTERVENTION
- HISTORIQUE_POINT

Ces entités collaborent pour couvrir l'ensemble du cycle de vie d'un signalement.

---

# Entités

## ROLE

Décrit les différents profils d'utilisateurs.

### Attributs

| Attribut | Description |
|----------|-------------|
| idRole | Identifiant unique |
| libelleRole | Nom du rôle |

---

## UTILISATEUR

Représente une personne utilisant la plateforme.

### Attributs

| Attribut | Description |
|----------|-------------|
| idUtilisateur | Identifiant unique |
| nom | Nom |
| prenom | Prénom |
| email | Adresse électronique |
| telephone | Téléphone |
| adresse | Adresse |
| dateInscription | Date d'inscription |
| etatCompte | État du compte |

---

## SIGNALEMENT

Représente un dépôt de déchets déclaré par un utilisateur authentifié.

### Attributs

| Attribut | Description |
|----------|-------------|
| idSignalement | Identifiant |
| description | Description |
| dateHeureSignalement | Date et heure métier, matérialisée par `created_at` Laravel |
| latitude | Latitude |
| longitude | Longitude |
| statut | État du signalement |
| priorite | Niveau de priorité |

---

## TYPE_DECHET

Catégorise les déchets.

| Attribut | Description |
|----------|-------------|
| idTypeDechet | Identifiant |
| libelle | Libellé |
| description | Description |

---

## PHOTO_SIGNALEMENT

Photographie illustrant un signalement.

| Attribut | Description |
|----------|-------------|
| idPhoto | Identifiant |
| url | URL de l'image |
| description | Description |

---

## ZONE

Zone géographique couverte par les équipes.

| Attribut | Description |
|----------|-------------|
| idZone | Identifiant |
| nomZone | Nom |
| description | Description |

---

## EQUIPE

Groupe d'agents chargé des interventions.

| Attribut | Description |
|----------|-------------|
| idEquipe | Identifiant |
| nomEquipe | Nom |
| description | Description |

---

## AFFECTATION

Décision d'affecter une équipe à un signalement.

| Attribut | Description |
|----------|-------------|
| idAffectation | Identifiant |
| dateHeureAffectation | Date d'affectation |
| observation | Observation |

---

## INTERVENTION

Action réalisée sur le terrain.

| Attribut | Description |
|----------|-------------|
| idIntervention | Identifiant |
| dateHeureDebut | Début |
| dateHeureFin | Fin |
| statut | Statut |
| compteRendu | Compte rendu |
| observation | Observation |

---

## PHOTO_INTERVENTION

Photographies prises lors d'une intervention.

| Attribut | Description |
|----------|-------------|
| idPhotoIntervention | Identifiant |
| url | URL |
| description | Description |

---

## HISTORIQUE_POINT

Historique des points attribués aux utilisateurs.

| Attribut | Description |
|----------|-------------|
| idHistoriquePoint | Identifiant |
| nombrePoints | Nombre de points |
| motif | Motif |
| description | Description |
| dateAttribution | Date |

---

# Associations

## AVOIR

```
ROLE (0,N)
        │
        │ AVOIR
        │
UTILISATEUR (1,1)
```

Un rôle peut être attribué à plusieurs utilisateurs.

Chaque utilisateur possède exactement un rôle.

---

## EMETTRE

```
UTILISATEUR (1,N)
        │
        │ EMETTRE
        │
SIGNALEMENT (1,1)
```

Tout utilisateur authentifié peut créer plusieurs signalements.

Chaque signalement appartient à un seul utilisateur authentifié.

---

## SE_SITUER_DANS

```
ZONE (0,N)
        │
        │ SE_SITUER_DANS
        │
SIGNALEMENT (0,1)
```

Chaque signalement appartient à une seule zone.

Une zone peut contenir plusieurs signalements.

---

## CONTENU_SIGNALEMENT

```
SIGNALEMENT (0,N)
        │
        │ CONTENU_SIGNALEMENT
        │
TYPE_DECHET (0,N)
```

### Attributs de l'association

- quantiteEstime
- volumeEstime
- dangerosite
- remarque

Cette association permet de représenter plusieurs types de déchets dans un même signalement.

---

## ASSOCIER

```
SIGNALEMENT (1,1)
        │
        │ ASSOCIER
        │
PHOTO_SIGNALEMENT (0,N)
```

Un signalement peut être illustré par plusieurs photographies.

---

## APPARTENANCE_EQUIPE

```
UTILISATEUR (0,N)
        │
        │ APPARTENANCE_EQUIPE
        │
EQUIPE (0,N)
```

### Attributs

- dateDebut
- dateFin
- fonction

Cette association historise les changements d'équipe des agents.

---

## COUVERTURE_ZONE

```
EQUIPE (0,N)
        │
        │ COUVERTURE_ZONE
        │
ZONE (0,N)
```

Une équipe peut couvrir plusieurs zones.

Une zone peut être couverte par plusieurs équipes.

---

## FAIRE_OBJET_DE

```
SIGNALEMENT (1,N)
        │
        │ FAIRE_OBJET_DE
        │
AFFECTATION (1,1)
```

Un signalement peut être réaffecté plusieurs fois.

---

## ATTRIBUER

```
EQUIPE (1,N)
        │
        │ ATTRIBUER
        │
AFFECTATION (1,1)
```

Chaque affectation est attribuée à une seule équipe.

---

## DONNER_LIEU_A

```
AFFECTATION (1,N)
        │
        │ DONNER_LIEU_A
        │
INTERVENTION (1,1)
```

Une affectation peut produire plusieurs interventions.

---

## ILLUSTRER

```
INTERVENTION (1,1)
        │
        │ ILLUSTRER
        │
PHOTO_INTERVENTION (0,N)
```

Une intervention peut être illustrée par plusieurs photographies.

---

## OBTENIR

```
UTILISATEUR (1,N)
        │
        │ OBTENIR
        │
HISTORIQUE_POINT (1,1)
```

Chaque attribution de points appartient à un seul utilisateur.

---

# Validation du modèle

Le MCD est conforme :

- aux 35 règles de gestion ;
- aux besoins fonctionnels du projet ;
- aux principes de normalisation Merise.

Ce modèle constitue la référence conceptuelle utilisée pour produire le Modèle Logique de Données (MLD).
