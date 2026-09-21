# Acteurs du système — ISI-Eco Report

## 1. Introduction

Ce document présente les acteurs intervenant dans la plateforme **ISI-Eco Report** ainsi que leurs responsabilités, leurs interactions avec le système et leurs principales fonctionnalités.

L'identification des acteurs provient de l'étude préalable réalisée selon la démarche Merise. Elle constitue une référence pour :

* la définition des cas d'utilisation ;
* la gestion des autorisations ;
* la conception des interfaces ;
* la compréhension des workflows métier.

Dans le système, chaque utilisateur possède un rôle unique conformément à la règle de gestion :

> **RG2 : Un utilisateur possède un seul rôle (Citoyen, Agent ou Administrateur).**

---

# 2. Vue générale des acteurs

La plateforme ISI-Eco Report possède trois acteurs principaux :

| Acteur         | Type                       | Description                                                                                                              |
| -------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Citoyen        | Utilisateur métier         | Personne utilisant la plateforme pour signaler des dépôts de déchets et participer à l'amélioration de son environnement |
| Agent          | Utilisateur opérationnel   | Membre d'une équipe chargé de réaliser les interventions terrain                                                         |
| Administrateur | Utilisateur de supervision | Responsable de la gestion, du contrôle et du pilotage des opérations                                                     |

---

# 3. Acteur : Citoyen

## 3.1 Description

**Note normative :** le citoyen est le profil usager principal, mais la création d’un signalement est autorisée à tout utilisateur authentifié, conformément à la RG3.

L'utilisateur authentifié peut être à l'origine du processus de gestion des signalements.

Selon son rôle, il peut signaler des problèmes liés aux déchets observés dans son environnement ou assurer les opérations de traitement.

Le citoyen constitue la principale source d'informations alimentant le système.

---

## 3.2 Responsabilités

Le citoyen est responsable de :

* créer un compte utilisateur ;
* gérer ses informations personnelles ;
* déclarer des signalements ;
* fournir les informations relatives aux déchets observés ;
* consulter l'état d'avancement de ses signalements ;
* consulter son historique de participation ;
* suivre les points obtenus grâce au système de gamification.

---

## 3.3 Fonctionnalités accessibles

| Fonctionnalité                | Description                                |
| ----------------------------- | ------------------------------------------ |
| Inscription                   | Création d'un compte sur la plateforme     |
| Authentification              | Accès sécurisé à son espace personnel      |
| Gestion du profil             | Modification des informations personnelles |
| Création d'un signalement     | Déclaration d'un dépôt de déchets          |
| Ajout de photographies        | Ajout éventuel de preuves visuelles        |
| Consultation des signalements | Suivi des demandes effectuées              |
| Consultation des points       | Visualisation des récompenses obtenues     |

---

## 3.4 Données manipulées

Le citoyen interagit principalement avec :

* UTILISATEUR ;
* SIGNALEMENT ;
* PHOTO_SIGNALEMENT ;
* HISTORIQUE_POINT ;
* TYPE_DECHET.

---

## 3.5 Règles métier associées

| Règle | Application                                                  |
| ----- | ------------------------------------------------------------ |
| RG3   | Tout utilisateur authentifié peut créer plusieurs signalements |
| RG4   | Un signalement appartient à un seul utilisateur authentifié                  |
| RG5   | Un utilisateur peut recevoir plusieurs historiques de points |
| RG34  | Chaque attribution de points appartient à un utilisateur     |

---

# 4. Acteur : Agent

## 4.1 Description

L'agent est un utilisateur opérationnel chargé d'exécuter les interventions de collecte sur le terrain.

Il appartient à une ou plusieurs équipes selon son historique d'affectation.

---

## 4.2 Responsabilités

L'agent est responsable de :

* consulter les interventions qui lui sont confiées ;
* prendre connaissance des affectations reçues ;
* réaliser les opérations de nettoyage ;
* renseigner les informations relatives aux interventions ;
* fournir un compte rendu ;
* ajouter des photographies d'intervention.

---

## 4.3 Fonctionnalités accessibles

| Fonctionnalité                | Description                           |
| ----------------------------- | ------------------------------------- |
| Authentification              | Accès à son espace professionnel      |
| Consultation des affectations | Visualisation des missions attribuées |
| Consultation des détails      | Accès aux informations du signalement |
| Réalisation d'intervention    | Exécution des opérations terrain      |
| Mise à jour du statut         | Suivi de l'avancement                 |
| Ajout d'un compte rendu       | Description des travaux réalisés      |
| Ajout de photographies        | Documentation des interventions       |

---

## 4.4 Données manipulées

L'agent interagit principalement avec :

* UTILISATEUR ;
* EQUIPE ;
* APPARTENANCE_EQUIPE ;
* AFFECTATION ;
* INTERVENTION ;
* PHOTO_INTERVENTION.

---

## 4.5 Règles métier associées

| Règle | Application                                     |
| ----- | ----------------------------------------------- |
| RG6   | Seuls les agents peuvent appartenir aux équipes |
| RG7   | Un agent peut changer d'équipe                  |
| RG8   | L'appartenance possède une période historique   |
| RG24  | Une équipe possède plusieurs agents             |
| RG30  | Une intervention appartient à une affectation   |
| RG31  | Une intervention est réalisée par une équipe    |

---

# 5. Acteur : Administrateur

## 5.1 Description

L'administrateur représente le service responsable de la supervision des opérations de collecte.

Il assure la coordination entre les citoyens, les équipes et les interventions.

---

## 5.2 Responsabilités

L'administrateur est responsable de :

* gérer les utilisateurs ;
* contrôler les signalements reçus ;
* valider ou rejeter les signalements ;
* définir les priorités ;
* affecter les équipes ;
* gérer les zones ;
* gérer les équipes ;
* superviser les interventions ;
* consulter les indicateurs statistiques.

---

## 5.3 Fonctionnalités accessibles

| Fonctionnalité                | Description                              |
| ----------------------------- | ---------------------------------------- |
| Gestion des utilisateurs      | Administration des comptes               |
| Consultation des signalements | Analyse des demandes reçues              |
| Validation/Rejet              | Décision métier sur les signalements     |
| Priorisation                  | Définition du niveau d'urgence           |
| Affectation                   | Attribution d'une équipe                 |
| Réaffectation                 | Modification d'une affectation existante |
| Gestion des équipes           | Administration des ressources humaines   |
| Gestion des zones             | Organisation territoriale                |
| Tableau de bord               | Suivi des activités                      |

---

## 5.4 Données manipulées

L'administrateur interagit avec :

* UTILISATEUR ;
* ROLE ;
* SIGNALEMENT ;
* ZONE ;
* EQUIPE ;
* AFFECTATION ;
* INTERVENTION.

---

## 5.5 Règles métier associées

| Règle | Application                                         |
| ----- | --------------------------------------------------- |
| RG15  | Tout signalement doit être validé ou rejeté         |
| RG16  | Seul un signalement validé et priorisé peut être affecté |
| RG25  | Une équipe peut recevoir plusieurs affectations     |
| RG26  | Une affectation concerne un seul signalement        |
| RG27  | Une affectation concerne une seule équipe           |
| RG28  | Un signalement peut recevoir plusieurs affectations |

---

# 6. Relations entre acteurs et système

| Acteur         | Entrées principales                            | Sorties principales                      |
| -------------- | ---------------------------------------------- | ---------------------------------------- |
| Citoyen        | Signalement, informations personnelles, photos | Confirmation, statut, historique, points |
| Agent          | Compte rendu, statut intervention, photos      | Affectations, détails des missions       |
| Administrateur | Validation, décisions, affectations            | Tableaux de bord, statistiques, suivi    |

---

# 7. Synthèse des responsabilités

| Domaine                       | Acteur responsable       |
| ----------------------------- | ------------------------ |
| Création des signalements     | Tout utilisateur authentifié |
| Validation des signalements   | Administrateur           |
| Attribution des équipes       | Administrateur           |
| Réalisation des interventions | Agent                    |
| Documentation terrain         | Agent                    |
| Gestion des utilisateurs      | Administrateur           |
| Gestion des récompenses       | Système / Administrateur |
| Pilotage global               | Administrateur           |

---

# 8. Conclusion

Les acteurs identifiés définissent clairement la répartition des responsabilités au sein de la plateforme ISI-Eco Report.

Le citoyen fournit les informations nécessaires au système, l'administrateur organise et supervise les opérations, tandis que l'agent assure l'exécution des interventions terrain.

Cette séparation des responsabilités garantit :

* une meilleure sécurité des accès ;
* une organisation claire des traitements ;
* une cohérence avec le modèle ROLE du système ;
* une base solide pour la définition des cas d'utilisation et des workflows métier.
