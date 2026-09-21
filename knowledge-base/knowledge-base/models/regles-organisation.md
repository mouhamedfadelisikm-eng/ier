# Dépendances entre entités

## 1. Objectif

Ce document décrit les dépendances entre les différentes entités du système **ISI-Eco Report**.

L'objectif est de fournir une vision claire des relations structurelles entre les données afin de :

- faciliter la compréhension du modèle de données ;
- garantir la cohérence lors de l'évolution du système ;
- aider les développeurs et les agents IA à manipuler correctement les entités ;
- identifier les contraintes d'ordre lors de la création, modification ou suppression des données.

Les dépendances présentées sont issues du **Modèle Conceptuel de Données (MCD)** et du **Modèle Logique de Données (MLD)** définis selon la méthode Merise.

---

# 2. Vue générale des dépendances

Le système ISI-Eco Report repose sur plusieurs niveaux de dépendances.

## Niveau 1 : Référentiels de base

Ces entités peuvent exister indépendamment des autres.

- ROLE
- ZONE
- TYPE_DECHET
- EQUIPE

Elles constituent les référentiels utilisés par les autres entités.

---

## Niveau 2 : Données utilisateurs

Ces entités dépendent des référentiels précédents.

- UTILISATEUR
- HISTORIQUE_POINT
- APPARTENANCE_EQUIPE

---

## Niveau 3 : Gestion des signalements

Ces entités représentent le cœur fonctionnel de la plateforme.

- SIGNALEMENT
- CONTENU_SIGNALEMENT
- PHOTO_SIGNALEMENT

---

## Niveau 4 : Gestion opérationnelle

Ces entités dépendent des signalements validés.

- AFFECTATION
- INTERVENTION
- PHOTO_INTERVENTION

---

# 3. Dépendances principales

---

# ROLE

## Description

L'entité ROLE définit les profils autorisés dans l'application.

Rôles disponibles :

- Citoyen ;
- Agent ;
- Administrateur.

---

## Dépendances

### Dépendances sortantes

ROLE est utilisée par :

- UTILISATEUR

Relation :

```

ROLE (0,N) ---- AVOIR ---- (1,1) UTILISATEUR

```

---

## Contraintes

- Un utilisateur possède obligatoirement un rôle.
- Un rôle peut être attribué à plusieurs utilisateurs.

Référence :

- RG2

---

# UTILISATEUR

## Description

L'entité UTILISATEUR représente toutes les personnes utilisant la plateforme.

---

## Dépendances entrantes

UTILISATEUR dépend de :

- ROLE

---

## Dépendances sortantes

UTILISATEUR est utilisée par :

- SIGNALEMENT ;
- HISTORIQUE_POINT ;
- APPARTENANCE_EQUIPE.

---

## Relations

### Création des signalements

```

UTILISATEUR (1,N)
|
EMETTRE
|
SIGNALEMENT (1,1)

```

---

### Historique des points

```

UTILISATEUR (1,N)
|
OBTENIR
|
HISTORIQUE_POINT (1,1)

```

---

### Appartenance aux équipes

```

UTILISATEUR (0,N)
|
APPARTENANCE_EQUIPE
|
EQUIPE (0,N)

```

---

## Contraintes

- Un utilisateur doit avoir un rôle.
- Seuls les agents peuvent appartenir à une équipe.

Références :

- RG1
- RG2
- RG5
- RG6

---

# HISTORIQUE_POINT

## Description

Cette entité conserve les gains de points obtenus par les utilisateurs.

---

## Dépendances

Dépend de :

- UTILISATEUR

---

Relation :

```

UTILISATEUR
|
|
HISTORIQUE_POINT

```

---

## Contraintes

- Chaque attribution appartient à un seul utilisateur.
- Un utilisateur peut posséder plusieurs historiques.

Références :

- RG34
- RG35

---

# ZONE

## Description

Une zone représente un secteur géographique couvert par le système.

---

## Dépendances sortantes

ZONE est utilisée par :

- SIGNALEMENT ;
- COUVERTURE_ZONE.

---

Relations :

```

ZONE (0,N)
|
SIGNALEMENT (1,1)

```

et

```

ZONE (0,N)
|
COUVERTURE_ZONE
|
EQUIPE (0,N)

```

---

## Contraintes

- Une zone contient plusieurs signalements.
- Une zone peut être couverte par plusieurs équipes.

Références :

- RG10
- RG11
- RG21
- RG22

---

# TYPE_DECHET

## Description

Référentiel contenant les catégories de déchets gérées.

---

## Dépendances

Utilisé par :

- CONTENU_SIGNALEMENT

---

Relation :

```

SIGNALEMENT
|
CONTENU_SIGNALEMENT
|
TYPE_DECHET

```

---

## Contraintes

- Un type de déchet peut être associé à plusieurs signalements.
- Un signalement peut être créé sans type de déchet ; la qualification peut être complétée ultérieurement.

Références :

- RG12
- RG13
- RG17
- RG18

---

# SIGNALEMENT

## Description

Le signalement constitue l'objet métier principal du système.

Il représente une déclaration de présence de déchets réalisée par un citoyen.

---

## Dépendances entrantes

SIGNALEMENT dépend de :

- UTILISATEUR ;
- ZONE.

---

## Dépendances sortantes

SIGNALEMENT est utilisé par :

- PHOTO_SIGNALEMENT ;
- CONTENU_SIGNALEMENT ;
- AFFECTATION.

---

Relations :

```

UTILISATEUR
|
SIGNALEMENT
|
ZONE

```

---

## Contraintes

- Un signalement appartient à une seule zone.
- Un signalement doit être validé ou rejeté.
- Un signalement doit être validé puis priorisé avant d'être affecté.

Références :

- RG4
- RG9
- RG10
- RG15
- RG16

---

# PHOTO_SIGNALEMENT

## Description

Stocke les images associées aux signalements.

---

## Dépendance

Dépend de :

- SIGNALEMENT

---

Relation :

```

SIGNALEMENT (1,1)
|
PHOTO_SIGNALEMENT (0,N)

```

---

## Contraintes

- Une photo appartient à un seul signalement.
- Un signalement peut posséder plusieurs photos.

Références :

- RG14
- RG19
- RG20

---

# EQUIPE

## Description

Représente les équipes opérationnelles chargées des interventions.

---

## Dépendances sortantes

EQUIPE est utilisée par :

- APPARTENANCE_EQUIPE ;
- COUVERTURE_ZONE ;
- AFFECTATION.

---

Relations :

```

EQUIPE
|
APPARTENANCE_EQUIPE
|
UTILISATEUR

```

et

```

EQUIPE
|
AFFECTATION

```

---

## Contraintes

- Une équipe peut posséder zéro ou plusieurs agents ; toute appartenance enregistrée doit concerner un utilisateur ayant le rôle Agent.
- Une équipe peut recevoir plusieurs affectations.
- Une équipe peut couvrir plusieurs zones.

Références :

- RG23
- RG24
- RG25

---

# APPARTENANCE_EQUIPE

## Description

Association historique permettant de gérer l'évolution des affectations des agents.

---

## Dépendances

Dépend de :

- UTILISATEUR ;
- EQUIPE.

---

Clé primaire :

```

(idUtilisateur, idEquipe, dateDebut)

```

---

## Contraintes

Conserve :

- date de début ;
- date de fin ;
- fonction.

Références :

- RG6
- RG7
- RG8

---

# COUVERTURE_ZONE

## Description

Association représentant les zones couvertes par les équipes.

---

## Dépendances

Dépend de :

- EQUIPE ;
- ZONE.

---

Clé primaire :

```

(idEquipe,idZone)

```

---

## Contraintes

- Une équipe peut couvrir plusieurs zones.
- Une zone peut être couverte par plusieurs équipes.

Références :

- RG22
- RG23

---

# AFFECTATION

## Description

Représente l'attribution d'un signalement validé et priorisé à une équipe.

---

## Dépendances entrantes

Dépend de :

- SIGNALEMENT ;
- EQUIPE.

---

## Dépendances sortantes

Utilisée par :

- INTERVENTION.

---

Relations :

```

SIGNALEMENT
|
AFFECTATION
|
EQUIPE

```

---

## Contraintes

- Une affectation concerne un seul signalement.
- Une affectation appartient à une seule équipe.
- Un signalement peut avoir plusieurs affectations.

Références :

- RG26
- RG27
- RG28

---

# INTERVENTION

## Description

Représente l'action réalisée sur le terrain.

---

## Dépendance

Dépend de :

- AFFECTATION.

---

Utilisée par :

- PHOTO_INTERVENTION.

---

Relation :

```

AFFECTATION
|
INTERVENTION
|
PHOTO_INTERVENTION

```

---

## Contraintes

- Une intervention appartient à une seule affectation.
- Une intervention possède un statut.
- Une intervention peut avoir plusieurs photos.

Références :

- RG29
- RG30
- RG32
- RG33

---

# PHOTO_INTERVENTION

## Description

Contient les photographies prises pendant les interventions.

---

## Dépendance

Dépend de :

- INTERVENTION.

---

Relation :

```

INTERVENTION (1,1)
|
PHOTO_INTERVENTION (0,N)

```

---

## Contraintes

- Une photo appartient à une seule intervention.

Référence :

- RG32

---

# 4. Graphe des dépendances

Vue simplifiée :

```

ROLE
|
▼
UTILISATEUR
|
├──────────────► HISTORIQUE_POINT
|
├──────────────► SIGNALEMENT
|                    |
|                    ├──► PHOTO_SIGNALEMENT
|                    |
|                    ├──► CONTENU_SIGNALEMENT ◄── TYPE_DECHET
|                    |
|                    └──► AFFECTATION ◄── EQUIPE
|
└──► APPARTENANCE_EQUIPE ◄── EQUIPE
|
▼
COUVERTURE_ZONE
|
▼
ZONE

AFFECTATION
|
▼
INTERVENTION
|
▼
PHOTO_INTERVENTION

```

---

# 5. Ordre recommandé de création des données

Lors de l'initialisation de la base de données, l'ordre recommandé est :

## Étape 1 : Référentiels

1. ROLE
2. ZONE
3. TYPE_DECHET
4. EQUIPE

---

## Étape 2 : Utilisateurs

5. UTILISATEUR

---

## Étape 3 : Associations utilisateurs

6. APPARTENANCE_EQUIPE
7. HISTORIQUE_POINT

---

## Étape 4 : Signalements

8. SIGNALEMENT
9. PHOTO_SIGNALEMENT
10. CONTENU_SIGNALEMENT

---

## Étape 5 : Organisation opérationnelle

11. COUVERTURE_ZONE
12. AFFECTATION
13. INTERVENTION
14. PHOTO_INTERVENTION

---

# 6. Contraintes d'intégrité référentielle

Le système doit respecter les contraintes suivantes :

- impossible de créer un utilisateur sans rôle ;
- impossible de créer un signalement sans utilisateur authentifié associé ;
- impossible d'affecter un signalement non validé ou non priorisé ;
- impossible de créer une intervention sans affectation ;
- impossible de créer une photographie sans objet associé ;
- impossible de supprimer une équipe possédant des affectations actives ;
- conservation obligatoire de l'historique des appartenances aux équipes.

---

# 7. Impacts métier

Les dépendances entre entités garantissent :

- la traçabilité complète d'un signalement ;
- l'historique des actions réalisées ;
- la séparation des responsabilités entre acteurs ;
- la cohérence entre données métier et règles de gestion ;
- la possibilité d'évolution future de la plateforme.

Ce modèle constitue une référence pour :

- la conception de la base de données ;
- le développement backend ;
- la génération des API ;
- les tests fonctionnels ;
- l'exploitation par des agents IA.
