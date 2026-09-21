# Cas d'utilisation — ISI-Eco Report

## 1. Introduction

Ce document présente les principaux cas d'utilisation de la plateforme **ISI-Eco Report**.

Les cas d'utilisation décrivent les fonctionnalités offertes par le système ainsi que les interactions entre les acteurs et la plateforme.

Ils sont dérivés :

* de l'étude préalable ;
* de l'identification des acteurs ;
* des règles de gestion métier ;
* du modèle conceptuel de données.

Ils constituent une base essentielle pour :

* la conception fonctionnelle ;
* la réalisation des interfaces ;
* la définition des API ;
* la planification du développement.

---

# 2. Acteurs du système

La plateforme comporte trois acteurs principaux :

| Acteur         | Description                                                           |
| -------------- | --------------------------------------------------------------------- |
| Citoyen        | Utilisateur qui signale les dépôts de déchets et suit leur traitement |
| Agent          | Utilisateur chargé des interventions terrain                          |
| Administrateur | Responsable de la gestion et du pilotage de la plateforme             |

---

# 3. Diagramme général des cas d'utilisation

```text
                         ISI-Eco Report

        +---------------------------------------------+
        |                                             |
        |  Gestion du compte                          |
        |                                             |
Citoyen |----> Créer un compte                        |
        |----> S'authentifier                         |
        |----> Gérer son profil                       |
        |                                             |
        |  Gestion des signalements                   |
        |                                             |
        |----> Créer un signalement                   |
        |----> Ajouter des photos                     |
        |----> Consulter ses signalements             |
        |----> Consulter son historique               |
        |                                             |
        |  Gamification                               |
        |                                             |
        |----> Consulter ses points                   |
        |                                             |
        +---------------------------------------------+


        +---------------------------------------------+
        |                                             |
Admin   |----> Gérer les utilisateurs                 |
        |----> Examiner les signalements              |
        |----> Valider un signalement                 |
        |----> Rejeter un signalement                 |
        |----> Définir la priorité                    |
        |----> Affecter une équipe                    |
        |----> Réaffecter une équipe                  |
        |----> Gérer les équipes                      |
        |----> Gérer les zones                        |
        |----> Consulter les statistiques             |
        |                                             |
        +---------------------------------------------+


        +---------------------------------------------+
        |                                             |
Agent   |----> Consulter ses affectations             |
        |----> Réaliser une intervention              |
        |----> Modifier le statut                     |
        |----> Ajouter un compte rendu                |
        |----> Ajouter des photos                     |
        |                                             |
        +---------------------------------------------+
```

---

# 4. Cas d'utilisation du Citoyen

## UC01 — Créer un compte

### Acteur principal

Citoyen

### Objectif

Permettre à un nouvel utilisateur de créer un compte sur la plateforme.

### Préconditions

* L'utilisateur ne possède pas encore de compte.

### Scénario principal

1. Le citoyen accède au formulaire d'inscription.
2. Il renseigne ses informations personnelles.
3. Le système vérifie les informations fournies.
4. Le système crée le compte utilisateur.
5. Le système attribue automatiquement le rôle Citoyen.

### Postconditions

Un compte utilisateur actif est créé.

### Règles associées

* RG1 : identification unique d'un utilisateur.
* RG2 : un utilisateur possède un seul rôle.

---

# UC02 — S'authentifier

### Acteur principal

Citoyen / Agent / Administrateur

### Objectif

Permettre l'accès sécurisé à la plateforme.

### Scénario principal

1. L'utilisateur saisit ses identifiants.
2. Le système vérifie les informations.
3. Le système récupère le rôle associé.
4. Le système ouvre l'espace correspondant.

### Règles associées

* RG2 : un utilisateur possède un seul rôle.

---

# UC03 — Créer un signalement

### Acteur principal

Utilisateur authentifié (parcours citoyen principal).

### Objectif

Déclarer un dépôt de déchets observé.

### Préconditions

* L’utilisateur est authentifié.

### Scénario principal

1. L’utilisateur saisit les informations du dépôt.
2. Il transmet les coordonnées GPS.
3. Il peut laisser la zone et les types de déchets non renseignés s'ils ne sont pas connus.
4. Il ajoute éventuellement des photographies.
5. Le système enregistre le signalement.
6. Le signalement reçoit l'état initial.

### Données manipulées

* SIGNALEMENT ;
* TYPE_DECHET ;
* CONTENU_SIGNALEMENT ;
* PHOTO_SIGNALEMENT.

### Règles associées

* RG3 : tout utilisateur authentifié peut créer plusieurs signalements.
* RG4 : un signalement appartient à un seul utilisateur authentifié.
* RG12 : un signalement concerne un ou plusieurs déchets.
* RG14 : les photos sont facultatives.

---

# UC04 — Consulter ses signalements

### Acteur principal

Citoyen

### Objectif

Permettre au citoyen de suivre ses demandes.

### Scénario principal

1. Le citoyen ouvre son historique.
2. Le système récupère ses signalements.
3. Le système affiche leur état.

---

# UC05 — Consulter ses points

### Acteur principal

Citoyen

### Objectif

Afficher les récompenses obtenues.

### Données manipulées

* HISTORIQUE_POINT.

### Règles associées

* RG5 ;
* RG34 ;
* RG35.

---

# 5. Cas d'utilisation de l'Administrateur

## UC06 — Examiner un signalement

### Acteur principal

Administrateur

### Objectif

Contrôler la validité d'un signalement.

### Scénario principal

1. L'administrateur consulte les nouveaux signalements.
2. Il analyse les informations fournies.
3. Il prend une décision.

---

## UC07 — Valider ou rejeter un signalement

### Acteur principal

Administrateur

### Objectif

Décider du traitement d'un signalement.

### Résultats possibles

* Signalement validé ;
* Signalement rejeté.

### Règles associées

* RG15 : un signalement doit être validé ou rejeté.

---

## UC08 — Affecter une équipe

### Acteur principal

Administrateur

### Objectif

Attribuer un signalement validé et priorisé à une équipe.

### Précondition

Le signalement doit être validé.

### Scénario principal

1. L'administrateur consulte les équipes disponibles.
2. Il choisit une équipe.
3. Le système crée une affectation.

### Règles associées

* RG16 ;
* RG25 ;
* RG26 ;
* RG27.

---

## UC09 — Réaffecter un signalement

### Acteur principal

Administrateur

### Objectif

Modifier l'équipe responsable.

### Règle associée

* RG28 : un signalement peut recevoir plusieurs affectations.

---

## UC10 — Gérer les équipes

### Acteur principal

Administrateur

### Objectif

Administrer les équipes d'intervention.

Fonctions :

* création ;
* modification ;
* consultation ;
* organisation territoriale.

---

## UC11 — Consulter les statistiques

### Acteur principal

Administrateur

### Objectif

Analyser les activités de la plateforme.

Indicateurs possibles :

* nombre de signalements ;
* nombre d'interventions ;
* délais de traitement ;
* participation citoyenne.

---

# 6. Cas d'utilisation de l'Agent

## UC12 — Consulter ses affectations

### Acteur principal

Agent

### Objectif

Afficher les missions attribuées à son équipe.

### Données manipulées

* AFFECTATION ;
* SIGNALEMENT ;
* EQUIPE.

---

## UC13 — Réaliser une intervention

### Acteur principal

Agent

### Objectif

Effectuer le nettoyage demandé.

### Scénario principal

1. L'agent consulte une affectation.
2. Il réalise l'opération terrain.
3. Il renseigne les informations.
4. Il met à jour le statut.

### Règles associées

* RG29 ;
* RG30 ;
* RG31 ;
* RG33.

---

## UC14 — Ajouter un compte rendu

### Acteur principal

Agent

### Objectif

Documenter l'intervention réalisée.

Données manipulées :

* INTERVENTION.

---

## UC15 — Ajouter des photographies d'intervention

### Acteur principal

Agent

### Objectif

Ajouter des preuves visuelles des travaux.

Règle associée :

* RG32 : une intervention peut posséder plusieurs photos.

---

# 7. Tableau de synthèse

| Code | Cas d'utilisation                 | Acteur         |
| ---- | --------------------------------- | -------------- |
| UC01 | Créer un compte                   | Citoyen        |
| UC02 | S'authentifier                    | Tous           |
| UC03 | Créer un signalement              | Utilisateur authentifié |
| UC04 | Consulter ses signalements        | Citoyen        |
| UC05 | Consulter ses points              | Citoyen        |
| UC06 | Examiner un signalement           | Administrateur |
| UC07 | Valider/Rejeter un signalement    | Administrateur |
| UC08 | Affecter une équipe               | Administrateur |
| UC09 | Réaffecter un signalement         | Administrateur |
| UC10 | Gérer les équipes                 | Administrateur |
| UC11 | Consulter les statistiques        | Administrateur |
| UC12 | Consulter ses affectations        | Agent          |
| UC13 | Réaliser une intervention         | Agent          |
| UC14 | Ajouter un compte rendu           | Agent          |
| UC15 | Ajouter des photos d'intervention | Agent          |

---

# 8. Conclusion

Les cas d'utilisation définissent les interactions principales entre les acteurs et la plateforme ISI-Eco Report.

Ils constituent une référence fonctionnelle permettant d'assurer la cohérence entre :

* les besoins métier ;
* les règles de gestion ;
* les modèles de données ;
* les futures fonctionnalités applicatives.

Ils serviront également de base pour la conception des workflows métier et la réalisation technique de la solution.
