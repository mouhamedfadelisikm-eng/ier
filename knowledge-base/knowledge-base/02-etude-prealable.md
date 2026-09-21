# CHAPITRE 2 : ÉTUDE PRÉALABLE

## Introduction

La réussite d’un système d’information dépend principalement d’une compréhension précise du fonctionnement de l’organisation qu’il doit accompagner. Avant toute phase de conception ou de développement, il est nécessaire d’analyser les processus existants, d’identifier les acteurs impliqués, de comprendre les échanges d’informations et de déterminer les contraintes qui régissent l’activité étudiée.

Dans le cadre du projet **ISI-Eco Report**, cette étude préalable a pour objectif d’analyser le processus de gestion des signalements de déchets afin d’identifier les limites du fonctionnement actuel et de définir les besoins auxquels devra répondre la future plateforme numérique.

Cette étape constitue le point de départ de la démarche **Merise**. Elle permet de préparer la modélisation du système d’information à travers l’identification :

* des acteurs métier ;
* des processus existants ;
* des documents manipulés ;
* des événements déclencheurs ;
* des règles de gestion ;
* des règles d’organisation ;
* des échanges d’informations entre les différents intervenants.

Les résultats obtenus dans ce chapitre serviront de base à l’élaboration des modèles conceptuels, notamment le **Modèle Conceptuel des Données (MCD)** et le **Modèle Conceptuel des Traitements (MCT)**.

---

# 2.1 Analyse de l’existant

L’analyse de l’existant consiste à étudier le fonctionnement actuel du processus de gestion des signalements de déchets afin d’identifier les pratiques utilisées, les acteurs concernés ainsi que les difficultés rencontrées.

Cette analyse permet de mettre en évidence les insuffisances du système actuel et de déterminer les améliorations attendues à travers la mise en place d’un système d’information.

Deux situations sont étudiées :

* **le fonctionnement sans système d’information**, représentant les pratiques actuelles ;
* **le fonctionnement avec système d’information**, correspondant au processus cible proposé par la plateforme **ISI-Eco Report**.

---

# 2.1.1 Analyse sans système d’information

Avant la mise en place d’une plateforme numérique dédiée, la gestion des signalements de déchets repose principalement sur des méthodes manuelles et des moyens de communication dispersés.

Lorsqu’un citoyen constate un dépôt de déchets dans son environnement, il peut transmettre l’information aux services concernés par différents moyens :

* appel téléphonique ;
* déplacement physique auprès des services compétents ;
* publication sur les réseaux sociaux ;
* message électronique ou autre canal de communication.

Les informations reçues sont ensuite traitées manuellement par le service de collecte. Un responsable examine le signalement afin d’évaluer sa pertinence et de déterminer si une intervention est nécessaire.

Après validation, une équipe de ramassage est désignée pour effectuer l’opération de nettoyage. Une fois l’intervention réalisée, l’équipe transmet les informations relatives aux travaux effectués au responsable concerné afin de permettre la clôture du traitement.

Cependant, ce mode de fonctionnement présente plusieurs limites :

| Limite identifiée                          | Conséquence                                                           |
| ------------------------------------------ | --------------------------------------------------------------------- |
| Multiplication des canaux de communication | Difficulté de centralisation des informations                         |
| Absence d’une base de données unique       | Perte possible d’informations et absence d’historique fiable          |
| Suivi limité des signalements              | Les citoyens ne connaissent pas l’état d’avancement de leurs demandes |
| Gestion manuelle des affectations          | Difficulté de coordination des équipes                                |
| Faible traçabilité des interventions       | Difficulté à contrôler les opérations réalisées                       |
| Production complexe des statistiques       | Absence d’indicateurs fiables pour la prise de décision               |

Ainsi, le fonctionnement actuel limite la capacité des responsables à organiser efficacement les opérations de collecte et empêche la mise en place d’un suivi transparent auprès des citoyens.

Ces contraintes justifient la nécessité d’un système d’information capable de centraliser les données, d’automatiser les traitements et d’améliorer la coordination entre les différents acteurs.

---

# 2.1.2 Analyse avec système d’information

Afin de répondre aux limites observées dans le fonctionnement actuel, le projet **ISI-Eco Report** propose la mise en place d’une plateforme numérique dédiée à la gestion des signalements de déchets.

Cette plateforme permettra de centraliser l’ensemble du cycle de traitement d’un signalement, depuis sa création par un utilisateur authentifié jusqu’à la clôture de l’intervention.

## Fonctionnement cible

### Création des signalements

Tout utilisateur authentifié pourra créer un signalement en renseignant :

* la localisation du dépôt de déchets ;
* la zone concernée ;
* la description du problème observé ;
* les types de déchets présents ;
* une ou plusieurs photographies facultatives.

Chaque signalement sera enregistré dans une base de données centralisée permettant d’assurer :

* son identification unique ;
* sa traçabilité ;
* son suivi durant tout son cycle de vie.

---

### Traitement administratif

Les administrateurs disposeront d’un espace de gestion permettant de :

* consulter les nouveaux signalements ;
* vérifier leur conformité ;
* valider ou rejeter les demandes ;
* définir leur priorité ;
* affecter les équipes compétentes ;
* effectuer une réaffectation si nécessaire ;
* gérer les zones et les équipes ;
* consulter les statistiques d’activité.

Des tableaux de bord permettront également d’obtenir une vision globale des opérations réalisées.

---

### Intervention des équipes de ramassage

Les agents de ramassage pourront :

* consulter les affectations reçues ;
* accéder aux détails des signalements concernés ;
* réaliser les interventions terrain ;
* renseigner un compte rendu ;
* ajouter des photographies d’intervention ;
* mettre à jour le statut de l’intervention.

Ces informations garantiront une meilleure traçabilité des opérations.

---

### Participation citoyenne et gamification

La plateforme intégrera également un mécanisme de participation citoyenne basé sur un système de points.

Les utilisateurs pourront obtenir des points selon les actions réalisées conformément aux règles définies dans le système.

Cette fonctionnalité vise à :

* encourager la participation citoyenne ;
* améliorer la quantité et la qualité des signalements ;
* renforcer l’implication des utilisateurs dans la gestion environnementale.

---

# Comparaison entre le fonctionnement actuel et le fonctionnement proposé

**Tableau 2.1 : Comparaison entre le fonctionnement actuel et ISI-Eco Report**

| Critère                         | Sans système d’information              | Avec ISI-Eco Report                        |
| ------------------------------- | --------------------------------------- | ------------------------------------------ |
| Transmission des signalements   | Téléphone, déplacement, réseaux sociaux | Plateforme numérique centralisée           |
| Enregistrement des informations | Manuel et dispersé                      | Base de données unique                     |
| Identification des signalements | Limitée                                 | Identifiant unique et traçabilité complète |
| Suivi des signalements          | Très limité                             | Consultation des statuts en temps réel     |
| Validation des demandes         | Traitement manuel                       | Gestion structurée par les administrateurs |
| Affectation des équipes         | Organisation manuelle                   | Affectation centralisée                    |
| Suivi des interventions         | Peu structuré                           | Historique détaillé des interventions      |
| Gestion documentaire            | Documents dispersés                     | Informations numériques centralisées       |
| Production de statistiques      | Complexe                                | Tableaux de bord et indicateurs            |
| Participation citoyenne         | Faible interaction                      | Système de points et gamification          |

---

L’analyse de l’existant met en évidence la nécessité d’une plateforme capable d’améliorer la circulation de l’information, la coordination des acteurs et le suivi des opérations.

Après cette analyse, il convient d’identifier précisément les acteurs intervenant dans le processus métier ainsi que leurs responsabilités respectives.

La section suivante présente donc l’identification des acteurs du système **ISI-Eco Report**.

---

**Fin de la Partie 1/4**.

# 2.2 Identification des acteurs

L’identification des acteurs constitue une étape essentielle de l’étude préalable. Dans la démarche **Merise**, un acteur représente toute personne physique ou morale, ou toute entité organisationnelle, capable d’échanger des informations avec le système d’information.

L’analyse des acteurs permet de déterminer :

* les responsabilités de chaque intervenant ;
* les informations manipulées ;
* les interactions avec la future plateforme ;
* les traitements auxquels ils participent.

Dans le cadre du projet **ISI-Eco Report**, trois acteurs principaux interviennent dans le processus de gestion des signalements de déchets :

* le **Citoyen** ;
* l’**Administrateur** ;
* l’**Agent de ramassage**.

Chaque acteur possède des responsabilités spécifiques permettant d’assurer le bon déroulement du cycle de vie d’un signalement.

---

## Tableau 2.2 : Identification des acteurs

| Acteur                 | Description                                                                                                                           | Responsabilités principales                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Citoyen**            | Utilisateur inscrit sur la plateforme souhaitant contribuer à l’amélioration de son environnement en signalant des dépôts de déchets. | Créer un compte, s’authentifier, gérer son profil, créer des signalements, consulter leur état d’avancement, consulter son historique et participer au système de points.       |
| **Administrateur**     | Responsable opérationnel représentant le service de collecte et chargé de superviser le traitement des signalements.                  | Gérer les utilisateurs, contrôler les signalements, valider ou rejeter les demandes, définir les priorités, affecter les équipes, gérer les zones et consulter les indicateurs. |
| **Agent de ramassage** | Utilisateur chargé d’effectuer les interventions terrain suite aux affectations reçues.                                               | Consulter ses missions, réaliser les interventions, renseigner les comptes rendus, ajouter les photographies et mettre à jour les statuts des interventions.                    |

---

# 2.2.1 Interactions des acteurs avec le système

Les interactions entre les acteurs et la plateforme **ISI-Eco Report** sont présentées dans le tableau suivant.

## Tableau 2.3 : Interactions des acteurs avec le système

| Acteur                 | Données fournies au système                                                    | Informations reçues                                                           |
| ---------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| **Citoyen**            | Informations personnelles, signalements, photographies éventuelles             | Confirmation de création, statut des signalements, historique, points obtenus |
| **Administrateur**     | Décisions de validation, priorités, affectations, gestion des équipes et zones | Liste des signalements, tableaux de bord, statistiques, notifications         |
| **Agent de ramassage** | Comptes rendus d’intervention, photographies terrain, mise à jour des statuts  | Liste des affectations, détails des interventions à réaliser                  |

---

# 2.2.2 Description détaillée des acteurs

## Le citoyen

Le citoyen représente l’acteur à l’origine du processus de signalement.

Après création de son compte et authentification, il peut utiliser la plateforme afin de déclarer un problème environnemental observé dans son espace de vie.

Ses principales actions sont :

* créer un signalement ;
* préciser la localisation du dépôt de déchets ;
* sélectionner les types de déchets concernés ;
* joindre des photographies si nécessaire ;
* suivre l’évolution de ses demandes ;
* consulter son historique de participation ;
* consulter les points obtenus grâce au système de gamification.

Le citoyen constitue donc la principale source d’informations alimentant le système.

---

## L’administrateur

L’administrateur représente le service chargé de la gestion opérationnelle des déchets.

Il assure la supervision complète du processus métier.

Ses responsabilités principales sont :

* contrôler les signalements reçus ;
* vérifier leur conformité ;
* accepter ou refuser leur traitement ;
* définir les niveaux de priorité ;
* sélectionner les équipes adaptées ;
* gérer les zones couvertes ;
* suivre les interventions réalisées ;
* exploiter les statistiques générées par le système.

Il joue un rôle central de coordination entre les citoyens et les équipes terrain.

---

## L’agent de ramassage

L’agent de ramassage intervient dans la phase opérationnelle du processus.

Après réception d’une affectation attribuée à son équipe, il réalise les opérations nécessaires sur le terrain.

Ses principales missions sont :

* consulter les interventions qui lui sont attribuées ;
* se déplacer sur la zone concernée ;
* effectuer les opérations de nettoyage ;
* renseigner un compte rendu d’intervention ;
* ajouter des photographies justificatives ;
* modifier l’état d’avancement de l’intervention.

Les informations fournies par l’agent permettent d’assurer la traçabilité des opérations et d’alimenter l’historique des interventions.

---

# Synthèse de l’identification des acteurs

L’analyse des acteurs met en évidence une organisation basée sur une séparation claire des responsabilités :

| Acteur             | Rôle principal                        |
| ------------------ | ------------------------------------- |
| Citoyen            | Déclaration et suivi des signalements |
| Administrateur     | Contrôle, organisation et supervision |
| Agent de ramassage | Exécution des interventions terrain   |

Cette répartition facilite la modélisation du système d’information en distinguant :

* les acteurs producteurs d’informations ;
* les acteurs responsables des décisions ;
* les acteurs réalisant les opérations terrain.

Elle constitue une base essentielle pour l’identification des traitements métier et la construction du **Modèle Conceptuel des Traitements (MCT)**.

---

# 2.3 Description des processus métier

Après l’identification des acteurs, il est nécessaire d’étudier les activités réalisées par chacun d’eux.

La description des processus métier permet de comprendre :

* les opérations effectuées ;
* l’ordre d’exécution des activités ;
* les responsabilités associées ;
* les informations nécessaires à chaque traitement.

Cette étape constitue une base importante pour :

* l’identification des événements déclencheurs ;
* la construction du Modèle Conceptuel des Traitements (MCT) ;
* la définition des fonctionnalités futures de la plateforme.

---

## Tableau 2.4 : Description des processus métier

| Acteur             | Processus / Tâche              | Description                                                                                                      |
| ------------------ | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Citoyen            | Création d’un compte           | Enregistrement d’un nouvel utilisateur dans la plateforme.                                                       |
| Citoyen            | Authentification               | Connexion permettant l’accès à son espace personnel.                                                             |
| Citoyen            | Gestion du profil              | Modification des informations personnelles.                                                                      |
| Utilisateur authentifié | Création d’un signalement | Déclaration d’un dépôt de déchets avec localisation, description, types de déchets et photographies éventuelles. |
| Citoyen / utilisateur authentifié | Consultation des signalements | Suivi de l’état d’avancement des signalements créés. |
| Citoyen / utilisateur authentifié | Consultation de l’historique | Accès aux signalements précédemment effectués. |
| Citoyen            | Consultation des points        | Visualisation des récompenses obtenues.                                                                          |
| Administrateur     | Authentification               | Accès à l’espace d’administration.                                                                               |
| Administrateur     | Gestion des utilisateurs       | Consultation et administration des comptes.                                                                      |
| Administrateur     | Consultation des signalements  | Analyse des demandes reçues.                                                                                     |
| Administrateur     | Validation ou rejet            | Décision administrative concernant un signalement.                                                               |
| Administrateur     | Gestion des priorités          | Définition du niveau d’urgence d’un signalement.                                                                 |
| Administrateur     | Affectation d’une équipe       | Attribution d’un signalement validé et priorisé à une équipe compétente.                                                     |
| Administrateur     | Réaffectation                  | Modification d’une affectation existante si nécessaire.                                                          |
| Administrateur     | Gestion des équipes            | Création, modification et suivi des équipes.                                                                     |
| Administrateur     | Gestion des zones              | Définition des zones couvertes par les équipes.                                                                  |
| Administrateur     | Consultation des statistiques  | Analyse des indicateurs produits par le système.                                                                 |
| Agent de ramassage | Authentification               | Accès à son espace de travail.                                                                                   |
| Agent de ramassage | Consultation des affectations  | Visualisation des missions attribuées.                                                                           |
| Agent de ramassage | Réalisation d’une intervention | Exécution des opérations de collecte sur le terrain.                                                             |
| Agent de ramassage | Saisie du compte rendu         | Description des travaux réalisés.                                                                                |
| Agent de ramassage | Ajout de photographies         | Documentation visuelle de l’intervention.                                                                        |
| Agent de ramassage | Mise à jour du statut          | Évolution de l’état de l’intervention.                                                                           |

---

L’étude des processus métier montre une organisation structurée autour du cycle de vie d’un signalement :

1. Création par un utilisateur authentifié ;
2. Contrôle administratif ;
3. Validation ou rejet ;
4. Affectation d’une équipe ;
5. Réalisation de l’intervention ;
6. Enregistrement du compte rendu ;
7. Clôture et conservation de l’historique.

Cette organisation servira de référence pour la modélisation des traitements du système.

---

**Fin de la Partie 2/4**.

# 2.4 Documents manipulés

Les processus métier reposent sur l’échange et la manipulation d’informations entre les différents acteurs du système. Ces informations sont matérialisées sous forme de documents, qu’ils soient physiques ou numériques.

Dans la démarche **Merise**, l’identification des documents manipulés permet de comprendre les flux d’informations circulant entre les acteurs. Elle constitue une étape préparatoire à l’élaboration du **Modèle Conceptuel de la Communication (MCC)**.

Dans le cadre du projet **ISI-Eco Report**, les documents identifiés couvrent l’ensemble du cycle de vie d’un signalement, depuis sa création par un utilisateur authentifié jusqu’à la clôture de l’intervention.

---

## Tableau 2.5 : Documents manipulés

| Document                         | Producteur         | Destinataire                 | Description                                                                                                                                                   |
| -------------------------------- | ------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Signalement**                  | Utilisateur authentifié | Administrateur               | Document contenant les informations relatives au dépôt de déchets : localisation, zone, description, types de déchets concernés et photographies éventuelles. |
| **Décision administrative**      | Administrateur     | Système / Citoyen            | Résultat de l’analyse du signalement : validation ou rejet.                                                                                                   |
| **Affectation**                  | Administrateur     | Équipe de ramassage          | Document indiquant l’équipe chargée de traiter un signalement validé.                                                                                         |
| **Réaffectation**                | Administrateur     | Nouvelle équipe de ramassage | Document représentant un changement d’équipe lorsque l’affectation initiale doit être modifiée.                                                               |
| **Compte rendu d’intervention**  | Agent de ramassage | Administrateur               | Informations décrivant les opérations réalisées sur le terrain, les observations et le résultat de l’intervention.                                            |
| **Photographies d’intervention** | Agent de ramassage | Administrateur               | Images permettant de justifier et documenter les travaux réalisés.                                                                                            |
| **Historique des points**        | Système            | Citoyen                      | Informations relatives aux points attribués dans le cadre de la gamification.                                                                                 |
| **Rapport statistique**          | Système            | Administrateur               | Synthèse des indicateurs relatifs aux signalements, interventions et activités citoyennes.                                                                    |

---

## Dématérialisation des documents

Dans le fonctionnement actuel, certains documents peuvent prendre différentes formes :

* formulaires papier ;
* appels téléphoniques retranscrits ;
* messages électroniques ;
* échanges via les réseaux sociaux ;
* comptes rendus informels.

Avec la mise en place de **ISI-Eco Report**, ces informations seront entièrement numérisées et stockées dans une base de données centralisée.

Cette dématérialisation permettra :

* une meilleure conservation des informations ;
* une recherche rapide des données ;
* une traçabilité complète des opérations ;
* une réduction des pertes d’informations ;
* une amélioration de la communication entre les acteurs.

---

L’identification des documents manipulés permet de déterminer les principaux flux d’informations échangés entre les acteurs. Ces flux seront représentés dans le **Diagramme des Flux (DAF)** correspondant au **Modèle Conceptuel de la Communication (MCC)**.

Avant de construire ce modèle, il est nécessaire d’identifier les événements qui déclenchent les différents traitements métier.

---

# 2.5 Événements déclencheurs

Dans un système d’information, les traitements ne sont pas exécutés de manière spontanée. Ils sont déclenchés par des événements provenant :

* d’un acteur interne ;
* d’un acteur externe ;
* d’une situation particulière du processus métier.

L’identification des événements déclencheurs permet de déterminer :

* quand un traitement doit être exécuté ;
* quel acteur est à l’origine de l’action ;
* quelles opérations doivent être réalisées.

Ces événements constituent une base essentielle pour l’élaboration du **Modèle Conceptuel des Traitements (MCT)**.

Dans le cadre du projet **ISI-Eco Report**, les événements déclencheurs suivent le cycle de vie complet d’un signalement.

---

## Tableau 2.6 : Événements déclencheurs

| Code | Événement déclencheur                          | Acteur à l’origine | Traitement déclenché                           |
| ---- | ---------------------------------------------- | ------------------ | ---------------------------------------------- |
| ED1  | Un dépôt de déchets est constaté               | Utilisateur authentifié | Création d’un signalement                      |
| ED2  | Un signalement est enregistré dans le système  | Utilisateur authentifié | Vérification du signalement                    |
| ED3  | Le signalement est conforme                    | Administrateur     | Validation et définition de la priorité        |
| ED4  | Le signalement est non conforme                | Administrateur     | Rejet du signalement                           |
| ED5  | Un signalement validé et priorisé est disponible           | Administrateur     | Recherche et affectation d’une équipe          |
| ED6  | Une modification d’organisation est nécessaire | Administrateur     | Réaffectation du signalement                   |
| ED7  | Une équipe reçoit une affectation              | Administrateur     | Préparation de l’intervention                  |
| ED8  | L’équipe réalise l’intervention                | Agent de ramassage | Enregistrement de l’intervention               |
| ED9  | Le compte rendu est transmis                   | Agent de ramassage | Mise à jour du statut et clôture du traitement |

---

## Analyse du cycle de vie d’un signalement

Les événements identifiés décrivent les différentes étapes parcourues par un signalement :

```text
Constat d'un dépôt de déchets
            |
            ▼
Création du signalement
            |
            ▼
Vérification administrative
            |
      ┌─────────────┐
      │             │
      ▼             ▼
 Validation       Rejet
      |
      ▼
Définition de la priorité
      |
      ▼
Affectation d'une équipe
      |
      ▼
Intervention terrain
      |
      ▼
Compte rendu
      |
      ▼
Clôture du signalement
```

---

L’analyse des événements déclencheurs permet donc de comprendre l’enchaînement logique des traitements métier.

Cependant, l’exécution de ces traitements est encadrée par des contraintes précises qui définissent les règles de fonctionnement du système.

La section suivante présente les **règles de gestion**, qui constituent une référence fondamentale pour la conception du **MCD**, du **MLD** et des traitements applicatifs.

---

# 2.6 Règles de gestion

Les règles de gestion représentent l’ensemble des contraintes métier qui régissent le fonctionnement du système d’information.

Elles sont indépendantes de toute technologie et traduisent les besoins fonctionnels de l’organisation.

Dans la méthode **Merise**, elles permettent notamment de :

* justifier les cardinalités du MCD ;
* définir les associations entre les entités ;
* contrôler la cohérence des données ;
* guider la conception de la base de données.

Dans le cadre du projet **ISI-Eco Report**, les règles de gestion sont organisées par domaine fonctionnel.

---

# 2.6.1 Règles relatives aux utilisateurs

| Code    | Règle de gestion                                                                             |
| ------- | -------------------------------------------------------------------------------------------- |
| **RG1** | Chaque utilisateur est identifié de manière unique dans le système.                          |
| **RG2** | Un utilisateur possède exactement un seul rôle parmi : Citoyen, Agent ou Administrateur.     |
| **RG3** | Tout utilisateur authentifié peut créer plusieurs signalements.                                |
| **RG4** | Chaque signalement est créé par un seul utilisateur authentifié.                             |
| **RG5** | Un utilisateur peut recevoir plusieurs attributions de points.                               |
| **RG6** | Seuls les utilisateurs ayant le rôle Agent peuvent appartenir à une ou plusieurs équipes.    |
| **RG7** | Un agent peut changer d’équipe au cours du temps.                                            |
| **RG8** | Toute appartenance à une équipe possède une date de début et éventuellement une date de fin. |

---

# 2.6.2 Règles relatives aux signalements

| Code     | Règle de gestion                                                                     |
| -------- | ------------------------------------------------------------------------------------ |
| **RG9**  | Chaque signalement possède un identifiant unique.                                    |
| **RG10** | Un signalement appartient à une seule zone.                                          |
| **RG11** | Une zone peut contenir plusieurs signalements.                                       |
| **RG12** | Un signalement concerne un ou plusieurs types de déchets.                            |
| **RG13** | Un type de déchet peut apparaître dans plusieurs signalements.                       |
| **RG14** | La présence d’une photographie lors de la création d’un signalement est facultative. |
| **RG15** | Tout signalement doit être validé ou rejeté par un administrateur.                   |
| **RG16** | Seul un signalement validé et priorisé peut être affecté à une équipe.                           |

---

**Fin de la Partie 3/4 (suite : RG17 à RG35, règles d’organisation, MCC et MCT).**

# 2.6.3 Règles relatives aux types de déchets

Les types de déchets représentent les catégories utilisées pour caractériser les déchets signalés par les citoyens. Leur gestion permet d’assurer une classification cohérente des signalements et facilite l’exploitation statistique des données.

| Code     | Règle de gestion                                              |
| -------- | ------------------------------------------------------------- |
| **RG17** | Chaque type de déchet est identifié de manière unique.        |
| **RG18** | Un type de déchet peut être associé à plusieurs signalements. |

---

# 2.6.4 Règles relatives aux photographies des signalements

Les photographies permettent d’enrichir les informations fournies par les citoyens et facilitent l’analyse administrative des signalements.

| Code     | Règle de gestion                                      |
| -------- | ----------------------------------------------------- |
| **RG19** | Une photographie appartient à un seul signalement.    |
| **RG20** | Un signalement peut posséder plusieurs photographies. |

---

# 2.6.5 Règles relatives aux zones géographiques

Les zones permettent d’organiser la couverture territoriale du service de collecte et d’orienter l’affectation des équipes.

| Code     | Règle de gestion                                   |
| -------- | -------------------------------------------------- |
| **RG21** | Une zone regroupe plusieurs signalements.          |
| **RG22** | Une zone peut être couverte par plusieurs équipes. |

---

# 2.6.6 Règles relatives aux équipes

Les équipes représentent les unités opérationnelles chargées de réaliser les interventions terrain.

| Code     | Règle de gestion                                 |
| -------- | ------------------------------------------------ |
| **RG23** | Une équipe peut intervenir dans plusieurs zones. |
| **RG24** | Une équipe est composée de plusieurs agents.     |
| **RG25** | Une équipe peut recevoir plusieurs affectations. |

---

# 2.6.7 Règles relatives aux affectations

L’affectation représente l’opération administrative consistant à attribuer un signalement validé et priorisé à une équipe compétente.

| Code     | Règle de gestion                                                              |
| -------- | ----------------------------------------------------------------------------- |
| **RG26** | Une affectation concerne un seul signalement.                                 |
| **RG27** | Une affectation est attribuée à une seule équipe.                             |
| **RG28** | Un signalement peut être affecté plusieurs fois au cours de son cycle de vie. |
| **RG29** | Une affectation peut générer plusieurs interventions.                         |

---

# 2.6.8 Règles relatives aux interventions

Les interventions correspondent aux opérations réalisées sur le terrain par les équipes de ramassage.

| Code     | Règle de gestion                                                          |
| -------- | ------------------------------------------------------------------------- |
| **RG30** | Une intervention appartient à une seule affectation.                      |
| **RG31** | Une intervention est réalisée par une seule équipe.                       |
| **RG32** | Une intervention peut posséder plusieurs photographies.                   |
| **RG33** | Toute intervention possède un statut permettant de suivre son avancement. |

---

# 2.6.9 Règles relatives aux points

Le système de points permet d’encourager la participation citoyenne à travers un mécanisme de gamification.

| Code     | Règle de gestion                                              |
| -------- | ------------------------------------------------------------- |
| **RG34** | Chaque historique de points appartient à un seul utilisateur. |
| **RG35** | Un utilisateur peut cumuler plusieurs historiques de points.  |

---

Les règles de gestion précédentes constituent la référence fonctionnelle du projet **ISI-Eco Report**.

Elles seront utilisées dans les étapes suivantes pour :

* définir les entités et associations du **Modèle Conceptuel des Données (MCD)** ;
* déterminer les cardinalités ;
* construire le **Modèle Logique des Données (MLD)** ;
* contrôler la cohérence des traitements métier.

---

# 2.7 Règles d’organisation

Contrairement aux règles de gestion qui décrivent les contraintes métier fondamentales, les règles d’organisation définissent la manière dont l’organisation choisit d’appliquer ces traitements.

Elles traduisent les procédures internes de fonctionnement et peuvent évoluer selon les besoins du service de collecte.

Dans le cadre du projet **ISI-Eco Report**, les règles d’organisation retenues sont les suivantes.

---

# 2.7.1 Organisation des signalements

| Code    | Règle d’organisation                                                                      |
| ------- | ----------------------------------------------------------------------------------------- |
| **RO1** | Les signalements reçus sont examinés par un administrateur avant toute prise en charge.   |
| **RO2** | Les signalements rejetés ne sont pas transmis aux équipes de ramassage.                   |
| **RO3** | Les signalements validés sont classés selon un niveau de priorité avant leur affectation. |

---

# 2.7.2 Organisation des affectations

| Code    | Règle d’organisation                                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **RO4** | Les affectations sont réalisées exclusivement par un administrateur.                                                                  |
| **RO5** | Une réaffectation peut être effectuée lorsqu’une équipe est indisponible ou lorsqu’une modification organisationnelle est nécessaire. |
| **RO6** | Le choix d’une équipe tient compte des zones géographiques couvertes.                                                                 |

---

# 2.7.3 Organisation des interventions

| Code    | Règle d’organisation                                                                            |
| ------- | ----------------------------------------------------------------------------------------------- |
| **RO7** | Les interventions sont réalisées par les équipes auxquelles les signalements ont été affectés.  |
| **RO8** | Chaque intervention doit produire un compte rendu permettant d’assurer le suivi des opérations. |
| **RO9** | Les photographies peuvent être utilisées comme éléments justificatifs des travaux réalisés.     |

---

# 2.7.4 Organisation du pilotage

| Code     | Règle d’organisation                                                                          |
| -------- | --------------------------------------------------------------------------------------------- |
| **RO10** | Les administrateurs assurent le suivi des signalements et des interventions.                  |
| **RO11** | Les données collectées sont exploitées afin de produire des indicateurs d’aide à la décision. |
| **RO12** | Un mécanisme de gamification peut être utilisé pour encourager la participation citoyenne.    |

---

Les règles d’organisation permettent ainsi de définir le cadre opérationnel de fonctionnement de la plateforme.

Elles précisent notamment :

* le rôle central de l’administrateur ;
* la séparation entre validation et exécution ;
* l’importance du suivi des interventions ;
* l’exploitation des données pour le pilotage du service.

Après l’étude des règles métier et organisationnelles, l’étape suivante consiste à représenter les échanges d’informations entre les acteurs à travers le **Modèle Conceptuel de la Communication (MCC)**.

---

# 2.8 Modèle Conceptuel de la Communication (MCC)

Le **Modèle Conceptuel de la Communication (MCC)** constitue une étape importante de la méthode Merise.

Il permet de représenter les échanges d’informations entre les différents acteurs d’un système, indépendamment des choix techniques d’implémentation.

Le MCC répond principalement aux questions suivantes :

* Quels sont les acteurs qui communiquent ?
* Quelles informations échangent-ils ?
* Dans quel sens circulent les flux ?
* Quels documents ou données sont transmis ?

Dans le cadre du projet **ISI-Eco Report**, le MCC décrit les communications entre :

* le Citoyen ;
* l’Administrateur ;
* l’Équipe de ramassage.

---

## Figure 2.1 : Diagramme des Flux (DAF) représentant le MCC

> **Emplacement réservé pour l’insertion du schéma MCC/DAF**

---

# Description des flux de communication

## Flux 1 : Citoyen → Administrateur

Le citoyen transmet un signalement contenant :

* la localisation ;
* la zone concernée ;
* la description du problème ;
* les types de déchets observés ;
* les photographies éventuelles.

Ce flux constitue le point de départ du processus métier.

---

## Flux 2 : Administrateur → Citoyen

Après analyse du signalement, l’administrateur transmet une décision :

* validation du signalement ;
* rejet du signalement ;
* évolution du statut.

Le citoyen peut ainsi suivre l’avancement de sa demande.

---

## Flux 3 : Administrateur → Équipe de ramassage

Lorsqu’un signalement est validé, l’administrateur transmet une affectation contenant :

* le signalement concerné ;
* la zone d’intervention ;
* les informations nécessaires à l’exécution.

---

## Flux 4 : Équipe de ramassage → Administrateur

Après réalisation des travaux, l’équipe transmet :

* le compte rendu d’intervention ;
* le statut de l’intervention ;
* les photographies éventuelles.

Ces informations permettent d’assurer la traçabilité des opérations.

---

## Flux 5 : Système → Administrateur

La plateforme produit automatiquement :

* des statistiques ;
* des indicateurs ;
* des tableaux de bord.

Ces informations facilitent le pilotage des activités.

---

# Synthèse du MCC

Le Modèle Conceptuel de la Communication met en évidence une organisation centrée autour du cycle de vie du signalement.

Le processus global est résumé comme suit :

```text
Citoyen
   |
   | Signalement
   ▼
Administrateur
   |
   | Validation / Affectation
   ▼
Équipe de ramassage
   |
   | Compte rendu d'intervention
   ▼
Administrateur
   |
   | Suivi et statistiques
   ▼
Pilotage du service
```

Le MCC constitue ainsi une base essentielle pour l’identification des traitements métier qui seront représentés dans le **Modèle Conceptuel des Traitements (MCT)**.

---

**Fin de la Partie 4/4 (prochaine section : Modèle Conceptuel des Traitements MCT + synthèse du chapitre).**

Nous poursuivons avec la dernière partie du chapitre.

---

# 2.9 Modèle Conceptuel des Traitements (MCT)

Le **Modèle Conceptuel des Traitements (MCT)** constitue un modèle fondamental de la méthode **Merise**. Il permet de représenter les traitements réalisés par le système d’information indépendamment des choix techniques liés à son implémentation.

Le MCT décrit :

* les événements déclencheurs ;
* les opérations réalisées ;
* les règles de gestion appliquées ;
* les résultats produits.

Dans le cadre du projet **ISI-Eco Report**, le MCT décrit le cycle complet de traitement d’un signalement, depuis sa création par un utilisateur authentifié jusqu’à la clôture de l’intervention.

Le processus global est décomposé en trois grands traitements :

1. **Gestion des signalements** ;
2. **Gestion des affectations** ;
3. **Gestion des interventions**.

---

# 2.9.1 MCT n°1 : Gestion des signalements

## Objectif

Ce traitement couvre toutes les opérations réalisées depuis la création d’un signalement jusqu’à la décision administrative de validation ou de rejet.

---

## Événement déclencheur

**E1 : Un signalement est créé par un utilisateur authentifié.**

---

## Opération O1 : Vérification du signalement

L’administrateur analyse les informations fournies afin de contrôler :

* la présence des informations obligatoires ;
* la cohérence de la localisation ;
* la pertinence du contenu ;
* la catégorie des déchets déclarés ;
* la conformité des photographies éventuelles.

---

## Règles de gestion appliquées

| Référence | Règle appliquée                                                       |
| --------- | --------------------------------------------------------------------- |
| RG14      | La photographie lors de la création d’un signalement est facultative. |
| RG15      | Tout signalement doit être validé ou rejeté.                          |
| RG16      | Seul un signalement validé et priorisé peut être affecté à une équipe.            |

---

## Résultats possibles

Deux situations peuvent se produire :

### Résultat R1 : Signalement validé

Le signalement est accepté et devient disponible pour une affectation.

### Résultat R2 : Signalement rejeté

Le signalement est refusé et ne poursuit pas le processus de traitement.

---

## Représentation simplifiée

```text
Événement :
Signalement créé

        |
        ▼

+-------------------------+
| Vérifier le signalement |
+-------------------------+

        |
        +------------------+
        |                  |
        ▼                  ▼

Signalement validé     Signalement rejeté

        |
        ▼

Vers MCT n°2
```

---

# 2.9.2 MCT n°2 : Gestion des affectations

## Objectif

Ce traitement organise la prise en charge opérationnelle d’un signalement validé par une équipe de ramassage.

---

## Événement déclencheur

**E2 : Un signalement validé et priorisé est disponible.**

---

## Opérations réalisées

### O2 : Définir la priorité

L’administrateur attribue un niveau de priorité au signalement selon son importance et son urgence.

---

### O3 : Sélectionner une équipe

Le choix de l’équipe prend en compte :

* la zone géographique concernée ;
* les équipes disponibles ;
* la couverture territoriale.

---

### O4 : Créer l’affectation

L’administrateur associe le signalement à l’équipe sélectionnée.

---

### O5 : Effectuer une réaffectation si nécessaire

Une nouvelle affectation peut être créée lorsqu’une modification devient nécessaire.

---

## Règles de gestion appliquées

| Référence | Règle appliquée                                       |
| --------- | ----------------------------------------------------- |
| RG22      | Une zone peut être couverte par plusieurs équipes.    |
| RG23      | Une équipe peut intervenir dans plusieurs zones.      |
| RG25      | Une équipe peut recevoir plusieurs affectations.      |
| RG26      | Une affectation concerne un seul signalement.         |
| RG27      | Une affectation est attribuée à une seule équipe.     |
| RG28      | Un signalement peut être affecté plusieurs fois.      |
| RG29      | Une affectation peut générer plusieurs interventions. |

---

## Résultats

Le traitement produit :

* une affectation créée ;
* éventuellement une réaffectation ;
* une intervention à réaliser.

---

## Représentation simplifiée

```text
Événement :
Signalement validé

        |
        ▼

+----------------------+
| Définir la priorité  |
+----------------------+

        |
        ▼

+----------------------+
| Choisir une équipe   |
+----------------------+

        |
        ▼

+----------------------+
| Créer l'affectation  |
+----------------------+

        |
        ▼

Affectation créée

        |
        ▼

Vers MCT n°3
```

---

# 2.9.3 MCT n°3 : Gestion des interventions

## Objectif

Ce traitement décrit les opérations réalisées par les équipes terrain jusqu’à la clôture du signalement.

---

## Événement déclencheur

**E3 : Une équipe reçoit une affectation.**

---

## Opérations réalisées

### O6 : Réaliser l’intervention

L’équipe de ramassage intervient sur la zone concernée et effectue les opérations nécessaires.

---

### O7 : Enregistrer le compte rendu

L’agent renseigne :

* les actions réalisées ;
* les observations ;
* le résultat de l’intervention ;
* les photographies éventuelles.

---

### O8 : Mettre à jour le statut

Le statut de l’intervention est modifié afin de suivre son avancement.

---

### O9 : Clôturer le traitement

Après validation du compte rendu, le signalement est considéré comme traité.

---

## Règles de gestion appliquées

| Référence | Règle appliquée                                         |
| --------- | ------------------------------------------------------- |
| RG29      | Une affectation peut générer plusieurs interventions.   |
| RG30      | Une intervention appartient à une seule affectation.    |
| RG31      | Une intervention est réalisée par une seule équipe.     |
| RG32      | Une intervention peut posséder plusieurs photographies. |
| RG33      | Toute intervention possède un statut de suivi.          |

---

## Résultat final

Le traitement produit :

* une intervention enregistrée ;
* un historique des opérations ;
* un signalement clôturé.

---

## Représentation globale du cycle de traitement

```text
+-----------------------------+
| Création du signalement     |
| par le citoyen              |
+-----------------------------+
              |
              ▼
+-----------------------------+
| Vérification administrative |
+-----------------------------+
              |
        +-----+-----+
        |           |
        ▼           ▼
    Validation     Rejet
        |
        ▼
+-----------------------------+
| Affectation d'une équipe    |
+-----------------------------+
              |
              ▼
+-----------------------------+
| Intervention terrain        |
+-----------------------------+
              |
              ▼
+-----------------------------+
| Compte rendu et suivi       |
+-----------------------------+
              |
              ▼
+-----------------------------+
| Clôture du signalement      |
+-----------------------------+
```

---

# Conclusion du chapitre 2

L’étude préalable du projet **ISI-Eco Report** a permis d’analyser le fonctionnement actuel de la gestion des signalements de déchets et de définir les besoins auxquels devra répondre la future plateforme.

Cette analyse a permis d’identifier :

* les limites du fonctionnement sans système d’information ;
* les acteurs intervenant dans le processus métier ;
* leurs responsabilités respectives ;
* les documents échangés ;
* les événements déclencheurs ;
* les règles de gestion et d’organisation ;
* les traitements métier nécessaires.

Les **35 règles de gestion** définies constituent une base essentielle pour la suite de la conception. Elles permettront notamment de construire :

* le **Modèle Conceptuel des Données (MCD)** ;
* le **Modèle Logique des Données (MLD)** ;
* l’architecture fonctionnelle de la plateforme.

Le chapitre suivant sera consacré à la **conception des données**, où seront présentés :

* le dictionnaire des données ;
* les dépendances fonctionnelles ;
* le Modèle Conceptuel des Données ;
* les cardinalités ;
* le passage vers le Modèle Logique des Données.

---
