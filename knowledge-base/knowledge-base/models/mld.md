---
title: Modèle Logique de Données (MLD)
project: ISI-Eco Report
version: 2.1
methodology: Merise
type: Logical Data Model
status: Normative
---

# Modèle Logique de Données (MLD)

## Objectif

Le Modèle Logique de Données (MLD) traduit le Modèle Conceptuel de Données (MCD) en un schéma relationnel exploitable pour une base de données relationnelle.

Il constitue la référence pour l'implémentation physique de la base de données.

---

# Principes de conception

Le MLD respecte les principes suivants :

- Chaque entité du MCD est transformée en table relationnelle.
- Chaque identifiant devient une clé primaire (PK).
- Les associations 1,N deviennent des clés étrangères (FK).
- Les associations N,N deviennent des tables d'association.
- Les associations porteuses d'attributs deviennent des tables relationnelles.
- Les règles de gestion (RG1 à RG35) sont respectées.

---

# Schéma relationnel

## ROLE

```text
ROLE(
    idRole PK,
    libelleRole
)
```

### Description

Contient les différents rôles disponibles dans l'application.

Exemples :

- Citoyen
- Agent
- Administrateur

---

## UTILISATEUR

```text
UTILISATEUR(
    idUtilisateur PK,
    nom,
    prenom,
    email,
    telephone,
    adresse,
    dateInscription,
    etatCompte,
    idRole FK
)
```

### Contraintes

- email unique
- un seul rôle par utilisateur
- idRole référence ROLE(idRole)

---

## HISTORIQUE_POINT

```text
HISTORIQUE_POINT(
    idHistoriquePoint PK,
    nombrePoints,
    motif,
    description,
    dateAttribution,
    idUtilisateur FK
)
```

### Contraintes

- appartient à un seul utilisateur
- conservation de l'historique

---

## ZONE

```text
ZONE(
    idZone PK,
    nomZone,
    description
)
```

---

## TYPE_DECHET

```text
TYPE_DECHET(
    idTypeDechet PK,
    libelle,
    description
)
```

---

## SIGNALEMENT

```text
SIGNALEMENT(
    idSignalement PK,
    description,
    dateHeureSignalement,
    latitude,
    longitude,
    statut,
    priorite,
    idUtilisateur FK,
    idZone FK
)
```

### Contraintes

- appartient à un seul utilisateur
- appartient à une seule zone
- ne peut être affecté qu'après validation

---

## CONTENU_SIGNALEMENT

```text
CONTENU_SIGNALEMENT(
    idSignalement PK FK,
    idTypeDechet PK FK,
    quantiteEstime,
    volumeEstime,
    dangerosite,
    remarque
)
```

### Description

Association entre un signalement et un ou plusieurs types de déchets.

---

## PHOTO_SIGNALEMENT

```text
PHOTO_SIGNALEMENT(
    idPhoto PK,
    url,
    description,
    idSignalement FK
)
```

---

## EQUIPE

```text
EQUIPE(
    idEquipe PK,
    nomEquipe,
    description
)
```

---

## APPARTENANCE_EQUIPE

```text
APPARTENANCE_EQUIPE(
    idUtilisateur PK FK,
    idEquipe PK FK,
    dateDebut PK,
    dateFin,
    fonction
)
```

### Description

Historise les changements d'équipe des agents.

L'utilisation de `dateDebut` dans la clé primaire permet plusieurs appartenances successives entre un même agent et une même équipe.

---

## COUVERTURE_ZONE

```text
COUVERTURE_ZONE(
    idEquipe PK FK,
    idZone PK FK
)
```

---

## AFFECTATION

```text
AFFECTATION(
    idAffectation PK,
    dateHeureAffectation,
    observation,
    idEquipe FK,
    idSignalement FK
)
```

### Contraintes

- une équipe
- un signalement

---

## INTERVENTION

```text
INTERVENTION(
    idIntervention PK,
    dateHeureDebut,
    dateHeureFin,
    statut,
    compteRendu,
    observation,
    idAffectation FK
)
```

---

## PHOTO_INTERVENTION

```text
PHOTO_INTERVENTION(
    idPhotoIntervention PK,
    url,
    description,
    idIntervention FK
)
```

---

# Dépendances fonctionnelles

| Table | Dépendance |
|--------|------------|
| UTILISATEUR | idUtilisateur → nom, prénom, email... |
| ROLE | idRole → libelleRole |
| SIGNALEMENT | idSignalement → description, statut... |
| TYPE_DECHET | idTypeDechet → libelle |
| ZONE | idZone → nomZone |
| EQUIPE | idEquipe → nomEquipe |
| AFFECTATION | idAffectation → dateHeureAffectation |
| INTERVENTION | idIntervention → dateHeureDebut... |

---

# Intégrité référentielle

Les principales contraintes d'intégrité sont :

- Un utilisateur doit référencer un rôle existant.
- Un signalement doit référencer un utilisateur et une zone existants.
- Une affectation doit référencer une équipe et un signalement existants.
- Une intervention doit référencer une affectation existante.
- Une photographie doit référencer un signalement ou une intervention existante.
- Une appartenance à une équipe doit référencer un utilisateur (agent) et une équipe existants.

---

# Correspondance avec le MCD

| MCD | MLD |
|-----|-----|
| ROLE | ROLE |
| UTILISATEUR | UTILISATEUR |
| SIGNALEMENT | SIGNALEMENT |
| TYPE_DECHET | TYPE_DECHET |
| PHOTO_SIGNALEMENT | PHOTO_SIGNALEMENT |
| ZONE | ZONE |
| EQUIPE | EQUIPE |
| AFFECTATION | AFFECTATION |
| INTERVENTION | INTERVENTION |
| PHOTO_INTERVENTION | PHOTO_INTERVENTION |
| HISTORIQUE_POINT | HISTORIQUE_POINT |

Les associations N,N sont matérialisées par les tables :

- CONTENU_SIGNALEMENT
- APPARTENANCE_EQUIPE
- COUVERTURE_ZONE

---

# Références

Ce document est conforme :

- au Modèle Conceptuel de Données (`models/mcd.md`) ;
- aux Règles de Gestion (`models/regles-gestion.md`) ;
- à la méthode Merise.

Il constitue la référence pour l'implémentation de la base de données relationnelle du projet ISI-Eco Report.


# Mapping physique PostgreSQL 17

Le backend Laravel utilise PostgreSQL 17 avec les correspondances suivantes :

- `users` représente UTILISATEUR ; les rôles fonctionnels sont gérés par Spatie Permission via `roles` et `model_has_roles`.
- `signalements.created_at` matérialise `dateHeureSignalement`.
- `signalements.zone_id` est nullable à la création et peut être complété lors de la qualification.
- `contenu_signalement` peut être vide à la création et être complété lors de la qualification.
- `historique_points.signalement_id` rattache une attribution au signalement clôturé et est unique lorsqu'il est renseigné.
- `notifications` stocke les notifications persistantes de changement de statut.

Les contraintes d'intégrité applicatives complètent les contraintes relationnelles lorsque la règle dépend du rôle, du statut courant ou du contexte opérationnel.
