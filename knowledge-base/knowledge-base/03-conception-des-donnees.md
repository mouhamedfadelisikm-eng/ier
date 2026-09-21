# CHAPITRE 3 : CONCEPTION DES DONNÉES

## Introduction

Après l'étude préalable du système et l'identification des besoins fonctionnels, la phase de conception des données consiste à définir la structure des informations manipulées par la plateforme **ISI-Eco Report**.

Cette étape constitue une phase essentielle de la démarche **Merise**, car elle permet de représenter les données indépendamment des traitements et des choix techniques liés à l'implémentation.

L'objectif de cette phase est de concevoir une organisation cohérente, fiable et évolutive des données permettant d'assurer :

* la gestion des utilisateurs et de leurs rôles ;
* la gestion des signalements de déchets ;
* la classification des types de déchets ;
* la gestion des zones géographiques ;
* l'organisation des équipes d'intervention ;
* le suivi des affectations ;
* la traçabilité des interventions ;
* la gestion de la participation citoyenne à travers le système de points.

Conformément à la méthode Merise, la conception des données suit plusieurs étapes successives :

1. l'identification des données nécessaires au système ;
2. l'élaboration du dictionnaire de données ;
3. la construction du **Modèle Conceptuel de Données (MCD)** ;
4. la transformation en **Modèle Logique de Données (MLD)** ;
5. la définition du **Modèle Physique de Données (MPD)**.

Ces différents modèles permettent d'obtenir une représentation progressive de la base de données, allant de la vision métier jusqu'à l'implémentation physique.

---

# 3.1 Liste brute des données

La liste brute des données consiste à recenser l'ensemble des informations manipulées par le système sans tenir compte de leur organisation ni des relations existantes entre elles.

Cette étape constitue le point de départ de la conception des données. Elle permet d'identifier les informations nécessaires au fonctionnement de la plateforme ISI-Eco Report.

Les données identifiées sont regroupées par domaine fonctionnel.

---

## Données relatives aux rôles

* Identifiant du rôle
* Libellé du rôle

---

## Données relatives aux utilisateurs

* Identifiant utilisateur
* Nom
* Prénom
* Adresse électronique
* Numéro de téléphone
* Adresse
* Date d'inscription
* État du compte
* Rôle associé

---

## Données relatives aux historiques de points

* Identifiant historique
* Nombre de points attribués
* Motif d'attribution
* Description
* Date d'attribution
* Utilisateur concerné

---

## Données relatives aux signalements

* Identifiant signalement
* Description
* Date et heure du signalement
* Latitude
* Longitude
* Statut
* Priorité
* Utilisateur créateur
* Zone concernée

---

## Données relatives aux types de déchets

* Identifiant type de déchet
* Libellé
* Description

---

## Données relatives au contenu des signalements

* Quantité estimée
* Volume estimé
* Niveau de dangerosité
* Remarque

---

## Données relatives aux photographies de signalements

* Identifiant photo
* URL
* Description
* Signalement associé

---

## Données relatives aux zones

* Identifiant zone
* Nom de la zone
* Description

---

## Données relatives aux équipes

* Identifiant équipe
* Nom de l'équipe
* Description

---

## Données relatives aux appartenances aux équipes

* Utilisateur concerné
* Équipe concernée
* Date de début
* Date de fin
* Fonction occupée

---

## Données relatives à la couverture des zones

* Équipe concernée
* Zone couverte

---

## Données relatives aux affectations

* Identifiant affectation
* Date et heure d'affectation
* Observation
* Signalement concerné
* Équipe affectée

---

## Données relatives aux interventions

* Identifiant intervention
* Date et heure de début
* Date et heure de fin
* Statut
* Compte rendu
* Observation
* Affectation concernée

---

## Données relatives aux photographies d'intervention

* Identifiant photographie
* URL
* Description
* Intervention associée

---

La liste brute permet d'obtenir une vision globale des informations nécessaires au fonctionnement de la plateforme. Cependant, ces données doivent encore être structurées et caractérisées afin de faciliter leur exploitation dans la base de données.

La prochaine étape consiste donc à élaborer le dictionnaire de données.

---

# 3.2 Dictionnaire de données

Le dictionnaire de données constitue un référentiel décrivant précisément les informations manipulées par le système.

Pour chaque donnée, il précise :

* sa signification ;
* son type ;
* sa taille ;
* ses contraintes d'intégrité.

Cette étape garantit une compréhension commune des données et prépare la construction du Modèle Conceptuel de Données.

---

# 3.2.1 Entité ROLE

| Attribut    | Description                | Type    | Taille | Contraintes |
| ----------- | -------------------------- | ------- | ------ | ----------- |
| idRole      | Identifiant unique du rôle | INT     | —      | PK, NN      |
| libelleRole | Nom du rôle utilisateur    | VARCHAR | 50     | NN, UQ      |

---

# 3.2.2 Entité UTILISATEUR

| Attribut        | Description                    | Type    | Taille | Contraintes |
| --------------- | ------------------------------ | ------- | ------ | ----------- |
| idUtilisateur   | Identifiant unique utilisateur | INT     | —      | PK, NN      |
| nom             | Nom utilisateur                | VARCHAR | 100    | NN          |
| prenom          | Prénom utilisateur             | VARCHAR | 100    | NN          |
| email           | Adresse électronique           | VARCHAR | 150    | NN, UQ      |
| telephone       | Numéro téléphone               | VARCHAR | 20     | NN          |
| adresse         | Adresse utilisateur            | VARCHAR | 255    | NN          |
| dateInscription | Date de création du compte     | DATE    | —      | NN          |
| etatCompte      | État du compte                 | VARCHAR | 20     | NN          |
| idRole          | Rôle associé                   | INT     | —      | FK, NN      |

---

# 3.2.3 Entité HISTORIQUE_POINT

| Attribut          | Description                | Type    | Taille | Contraintes |
| ----------------- | -------------------------- | ------- | ------ | ----------- |
| idHistoriquePoint | Identifiant historique     | INT     | —      | PK, NN      |
| nombrePoints      | Nombre de points attribués | INT     | —      | NN          |
| motif             | Motif d'attribution        | VARCHAR | 100    | NN          |
| description       | Description complémentaire | TEXT    | —      | NULL        |
| dateAttribution   | Date d'attribution         | DATE    | —      | NN          |
| idUtilisateur     | Utilisateur bénéficiaire   | INT     | —      | FK, NN      |

---

# 3.2.4 Entité ZONE

| Attribut    | Description                   | Type    | Taille | Contraintes |
| ----------- | ----------------------------- | ------- | ------ | ----------- |
| idZone      | Identifiant unique de la zone | INT     | —      | PK, NN      |
| nomZone     | Nom de la zone géographique   | VARCHAR | 100    | NN          |
| description | Description de la zone        | TEXT    | —      | NULL        |

---

# 3.2.5 Entité TYPE_DECHET

| Attribut     | Description                          | Type    | Taille | Contraintes |
| ------------ | ------------------------------------ | ------- | ------ | ----------- |
| idTypeDechet | Identifiant unique du type de déchet | INT     | —      | PK, NN      |
| libelle      | Désignation du type de déchet        | VARCHAR | 100    | NN          |
| description  | Description du type de déchet        | TEXT    | —      | NULL        |

---

# 3.2.6 Entité SIGNALEMENT

| Attribut             | Description                       | Type     | Taille | Contraintes |
| -------------------- | --------------------------------- | -------- | ------ | ----------- |
| idSignalement        | Identifiant unique du signalement | INT      | —      | PK, NN      |
| description          | Description du dépôt constaté     | TEXT     | —      | NULL          |
| dateHeureSignalement | Date et heure métier              | TIMESTAMP | —      | DÉRIVÉ DE `created_at` |
| latitude             | Coordonnée GPS latitude           | DECIMAL  | 10,8   | NN          |
| longitude            | Coordonnée GPS longitude          | DECIMAL  | 11,8   | NN          |
| statut               | État du signalement               | VARCHAR  | 30     | NN          |
| priorite             | Niveau de priorité                | VARCHAR  | 20     | NN          |
| idUtilisateur        | Utilisateur créateur              | INT      | —      | FK, NN      |
| idZone               | Zone concernée                    | INT      | —      | FK, NULLABLE |

---

# 3.2.7 Association CONTENU_SIGNALEMENT

L'association **CONTENU_SIGNALEMENT** représente la relation entre un signalement et les types de déchets concernés.

Elle possède ses propres attributs permettant de caractériser précisément les déchets observés.

| Attribut       | Description                  | Type    | Taille | Contraintes |
| -------------- | ---------------------------- | ------- | ------ | ----------- |
| idSignalement  | Signalement concerné         | INT     | —      | PK, FK      |
| idTypeDechet   | Type de déchet concerné      | INT     | —      | PK, FK      |
| quantiteEstime | Quantité estimée             | DECIMAL | 10,2   | NULL        |
| volumeEstime   | Volume estimé                | DECIMAL | 10,2   | NULL        |
| dangerosite    | Niveau de dangerosité        | VARCHAR | 30     | NULL        |
| remarque       | Informations complémentaires | TEXT    | —      | NULL        |

---

# 3.2.8 Entité PHOTO_SIGNALEMENT

| Attribut      | Description                    | Type    | Taille | Contraintes |
| ------------- | ------------------------------ | ------- | ------ | ----------- |
| idPhoto       | Identifiant unique photo       | INT     | —      | PK, NN      |
| url           | Adresse du fichier image       | VARCHAR | 255    | NN          |
| description   | Description de la photographie | TEXT    | —      | NULL        |
| idSignalement | Signalement associé            | INT     | —      | FK, NN      |

---

# 3.2.9 Entité EQUIPE

| Attribut    | Description               | Type    | Taille | Contraintes |
| ----------- | ------------------------- | ------- | ------ | ----------- |
| idEquipe    | Identifiant unique équipe | INT     | —      | PK, NN      |
| nomEquipe   | Nom de l'équipe           | VARCHAR | 100    | NN          |
| description | Description de l'équipe   | TEXT    | —      | NULL        |

---

# 3.2.10 Association APPARTENANCE_EQUIPE

L'association **APPARTENANCE_EQUIPE** permet de conserver l'historique des appartenances entre les utilisateurs et les équipes.

Elle permet notamment de suivre les changements d'équipe des agents dans le temps.

| Attribut      | Description                  | Type    | Taille | Contraintes |
| ------------- | ---------------------------- | ------- | ------ | ----------- |
| idUtilisateur | Agent concerné               | INT     | —      | PK, FK      |
| idEquipe      | Équipe concernée             | INT     | —      | PK, FK      |
| dateDebut     | Date de début d'appartenance | DATE    | —      | PK          |
| dateFin       | Date de fin d'appartenance   | DATE    | —      | NULL        |
| fonction      | Fonction occupée             | VARCHAR | 100    | NN          |

---

# 3.2.11 Association COUVERTURE_ZONE

Cette association représente la relation entre les équipes et les zones géographiques couvertes.

| Attribut | Description      | Type | Taille | Contraintes |
| -------- | ---------------- | ---- | ------ | ----------- |
| idEquipe | Équipe concernée | INT  | —      | PK, FK      |
| idZone   | Zone couverte    | INT  | —      | PK, FK      |

---

# 3.2.12 Entité AFFECTATION

| Attribut             | Description                    | Type     | Taille | Contraintes |
| -------------------- | ------------------------------ | -------- | ------ | ----------- |
| idAffectation        | Identifiant unique affectation | INT      | —      | PK, NN      |
| dateHeureAffectation | Date de l'affectation          | TIMESTAMP | —      | NN          |
| observation          | Observation liée               | TEXT     | —      | NULL        |
| idEquipe             | Équipe affectée                | INT      | —      | FK, NN      |
| idSignalement        | Signalement traité             | INT      | —      | FK, NN      |

---

# 3.2.13 Entité INTERVENTION

| Attribut       | Description                     | Type     | Taille | Contraintes |
| -------------- | ------------------------------- | -------- | ------ | ----------- |
| idIntervention | Identifiant unique intervention | INT      | —      | PK, NN      |
| dateHeureDebut | Date début intervention         | TIMESTAMP | —      | NN          |
| dateHeureFin   | Date fin intervention           | TIMESTAMP | —      | NULL        |
| statut         | État de l'intervention          | VARCHAR  | 30     | NN          |
| compteRendu    | Rapport d'exécution             | TEXT     | —      | NULL        |
| observation    | Informations complémentaires    | TEXT     | —      | NULL        |
| idAffectation  | Affectation associée            | INT      | —      | FK, NN      |

---

# 3.2.14 Entité PHOTO_INTERVENTION

| Attribut            | Description                    | Type    | Taille | Contraintes |
| ------------------- | ------------------------------ | ------- | ------ | ----------- |
| idPhotoIntervention | Identifiant photo intervention | INT     | —      | PK, NN      |
| url                 | Adresse du fichier image       | VARCHAR | 255    | NN          |
| description         | Description de la photographie | TEXT    | —      | NULL        |
| idIntervention      | Intervention associée          | INT     | —      | FK, NN      |

---

Le dictionnaire de données obtenu constitue une référence complète des informations manipulées par la plateforme **ISI-Eco Report**.

Il intègre désormais les nouvelles règles de gestion, notamment :

* la séparation entre les utilisateurs et leurs rôles ;
* l'historisation des appartenances aux équipes ;
* la gestion normalisée des relations plusieurs-à-plusieurs ;
* la traçabilité complète du cycle de vie d'un signalement.

Ces éléments serviront de base à l'élaboration du **Modèle Conceptuel de Données (MCD)** présenté dans la section suivante.

---

# 3.3 Modèle Conceptuel de Données (MCD)

## 3.3.1 Présentation du MCD

Le **Modèle Conceptuel de Données (MCD)** constitue une étape fondamentale de la méthode Merise. Il permet de représenter les données manipulées par le système d'information ainsi que leurs relations, indépendamment des contraintes techniques liées à l'implémentation.

Le MCD de la plateforme **ISI-Eco Report** a été construit à partir :

* des besoins fonctionnels identifiés dans l'étude préalable ;
* des 35 règles de gestion métier ;
* du dictionnaire de données précédemment défini.

Il représente les informations nécessaires à :

* l'identification des utilisateurs ;
* la gestion des rôles ;
* la création et le suivi des signalements ;
* la classification des déchets ;
* la gestion des équipes ;
* l'organisation des interventions ;
* le suivi de la participation citoyenne.

---

## 3.3.2 Composition du modèle

Le MCD est composé des entités suivantes :

| Entités            | Description                                      |
| ------------------ | ------------------------------------------------ |
| ROLE               | Définit les profils utilisateurs                 |
| UTILISATEUR        | Représente les personnes utilisant la plateforme |
| HISTORIQUE_POINT   | Stocke les récompenses citoyennes                |
| SIGNALEMENT        | Représente une déclaration de déchets            |
| ZONE               | Définit les secteurs géographiques               |
| TYPE_DECHET        | Définit les catégories de déchets                |
| PHOTO_SIGNALEMENT  | Stocke les preuves photographiques               |
| EQUIPE             | Représente les équipes d'intervention            |
| AFFECTATION        | Représente l'attribution d'un signalement        |
| INTERVENTION       | Décrit les opérations réalisées                  |
| PHOTO_INTERVENTION | Stocke les photos des interventions              |

Les associations porteuses de propriétés sont :

* **CONTENU_SIGNALEMENT**
* **APPARTENANCE_EQUIPE**
* **COUVERTURE_ZONE**

---

# 3.3.3 Description des associations du MCD

Le Modèle Conceptuel de Données repose sur plusieurs associations permettant de traduire les règles de gestion définies lors de l'étude préalable.

Chaque association représente un lien métier entre deux ou plusieurs entités. Les cardinalités associées traduisent les contraintes imposées par les règles de gestion **RG1 à RG35**.

---

# Association AVOIR : ROLE — UTILISATEUR

## Description

L'association **AVOIR** permet de définir le rôle attribué à chaque utilisateur de la plateforme.

Un rôle correspond à un profil fonctionnel permettant de différencier les responsabilités des utilisateurs :

* Citoyen ;
* Agent ;
* Administrateur.

## Cardinalités

```
ROLE (0,N) -------- AVOIR -------- (1,1) UTILISATEUR
```

## Justification

* Un rôle peut être attribué à plusieurs utilisateurs.
* Chaque utilisateur possède obligatoirement un seul rôle.

Cette association traduit les règles :

* **RG1** : Un utilisateur est identifié de manière unique.
* **RG2** : Un utilisateur possède un seul rôle.

---

# Association EMETTRE : UTILISATEUR — SIGNALEMENT

## Description

L'association **EMETTRE** représente la création des signalements par les utilisateurs authentifiés.

## Cardinalités

```
UTILISATEUR (1,N) -------- EMETTRE -------- (1,1) SIGNALEMENT
```

## Justification

* Tout utilisateur authentifié peut créer plusieurs signalements.
* Un signalement appartient à un seul utilisateur authentifié.

Cette association traduit :

* **RG3** : Tout utilisateur authentifié peut créer plusieurs signalements.
* **RG4** : Un signalement est créé par un seul utilisateur authentifié.

---

# Association OBTENIR : UTILISATEUR — HISTORIQUE_POINT

## Description

Cette association permet de gérer le système de récompense citoyenne.

Chaque attribution de points est enregistrée afin de conserver un historique complet des participations.

## Cardinalités

```
UTILISATEUR (1,N) -------- OBTENIR -------- (1,1) HISTORIQUE_POINT
```

## Justification

* Un utilisateur peut recevoir plusieurs attributions de points.
* Chaque historique de points appartient à un seul utilisateur.

Cette association traduit :

* **RG5** : Un utilisateur peut recevoir plusieurs historiques.
* **RG34** : Chaque attribution appartient à un seul utilisateur.
* **RG35** : Un utilisateur peut cumuler plusieurs historiques.

---

# Association SE_SITUER_DANS : SIGNALEMENT — ZONE

## Description

Cette association représente la localisation géographique des signalements.

## Cardinalités

```
SIGNALEMENT (1,1) -------- SE_SITUER_DANS -------- (0,N) ZONE
```

## Justification

* Chaque signalement est obligatoirement situé dans une seule zone.
* Une zone peut contenir plusieurs signalements.

Cette association traduit :

* **RG10** : Un signalement peut être créé sans zone puis être qualifié ultérieurement.
* **RG11** : Une zone peut contenir plusieurs signalements.
* **RG21** : Une zone possède plusieurs signalements.

---

# Association CONTENU_SIGNALEMENT : SIGNALEMENT — TYPE_DECHET

## Description

Cette association permet de représenter les types de déchets présents dans un signalement.

Elle possède plusieurs attributs complémentaires :

* quantité estimée ;
* volume estimé ;
* dangerosité ;
* remarque.

## Cardinalités

```
SIGNALEMENT (1,N) -------- CONTENU_SIGNALEMENT -------- (1,N) TYPE_DECHET
```

## Justification

* Un signalement concerne au moins un type de déchet.
* Un type de déchet peut apparaître dans plusieurs signalements.

Cette association traduit :

* **RG12** : Un signalement peut être créé sans type de déchet puis être qualifié ultérieurement.
* **RG13** : Un type de déchet peut apparaître dans plusieurs signalements.
* **RG17** : Chaque type de déchet possède un identifiant unique.
* **RG18** : Un type de déchet peut être associé à plusieurs signalements.

---

# Association ASSOCIER : SIGNALEMENT — PHOTO_SIGNALEMENT

## Description

Cette association permet de rattacher les photographies prises lors de la création d'un signalement.

## Cardinalités

```
SIGNALEMENT (1,1) -------- ASSOCIER -------- (0,N) PHOTO_SIGNALEMENT
```

## Justification

* Un signalement peut ne contenir aucune photographie ou plusieurs photographies.
* Une photographie appartient obligatoirement à un seul signalement.

Cette association traduit :

* **RG14** : La photo d'un signalement est facultative.
* **RG19** : Une photo appartient à un seul signalement.
* **RG20** : Un signalement peut posséder plusieurs photos.

---

# Association APPARTENANCE_EQUIPE : UTILISATEUR — EQUIPE

## Description

Cette association représente l'appartenance des agents aux équipes de collecte.

Elle possède des attributs permettant l'historisation :

* date de début ;
* date de fin ;
* fonction.

## Cardinalités

```
UTILISATEUR (0,N)
          |
APPARTENANCE_EQUIPE
          |
EQUIPE (0,N)
```

## Justification

* Un agent peut appartenir à plusieurs équipes au cours du temps.
* Une équipe peut être composée de plusieurs agents.
* Les périodes d'appartenance sont conservées.

Cette association traduit :

* **RG6** : Seuls les agents peuvent appartenir aux équipes.
* **RG7** : Un agent peut changer d'équipe.
* **RG8** : Une appartenance possède une date de début et éventuellement une date de fin.
* **RG24** : Une équipe possède plusieurs agents.

---

# Association COUVERTURE_ZONE : EQUIPE — ZONE

## Description

Cette association représente la couverture géographique assurée par les équipes.

## Cardinalités

```
EQUIPE (0,N) -------- COUVERTURE_ZONE -------- (0,N) ZONE
```

## Justification

* Une équipe peut intervenir dans plusieurs zones.
* Une zone peut être couverte par plusieurs équipes.

Cette association traduit :

* **RG22** : Une zone peut être couverte par plusieurs équipes.
* **RG23** : Une équipe peut intervenir dans plusieurs zones.

---

# Association ATTRIBUER : EQUIPE — AFFECTATION

## Description

Cette association représente l'attribution d'un signalement validé et priorisé à une équipe.

## Cardinalités

```
EQUIPE (1,N) -------- ATTRIBUER -------- (1,1) AFFECTATION
```

## Justification

* Une équipe peut recevoir plusieurs affectations.
* Une affectation concerne une seule équipe.

Cette association traduit :

* **RG25** : Une équipe peut recevoir plusieurs affectations.
* **RG27** : Une affectation est attribuée à une seule équipe.

---

# Association FAIRE_OBJET_DE : SIGNALEMENT — AFFECTATION

## Description

Cette association permet de gérer les différentes affectations possibles d'un même signalement.

Elle permet notamment la réaffectation d'un signalement lorsque cela est nécessaire.

## Cardinalités

```
SIGNALEMENT (1,N) -------- FAIRE_OBJET_DE -------- (1,1) AFFECTATION
```

## Justification

* Un signalement peut avoir plusieurs affectations successives.
* Une affectation concerne un seul signalement.

Cette association traduit :

* **RG16** : Seul un signalement validé et priorisé peut être affecté.
* **RG26** : Une affectation concerne un seul signalement.
* **RG28** : Un signalement peut être affecté plusieurs fois.

---

# Association DONNER_LIEU_A : AFFECTATION — INTERVENTION

## Description

Cette association représente les opérations réalisées après affectation d'une équipe.

## Cardinalités

```
AFFECTATION (1,N) -------- DONNER_LIEU_A -------- (1,1) INTERVENTION
```

## Justification

* Une affectation peut générer plusieurs interventions.
* Une intervention appartient à une seule affectation.

Cette association traduit :

* **RG29** : Une affectation peut générer plusieurs interventions.
* **RG30** : Une intervention appartient à une seule affectation.

---

# Association ILLUSTRER : INTERVENTION — PHOTO_INTERVENTION

## Description

Cette association permet de conserver les preuves photographiques des travaux réalisés.

## Cardinalités

```
INTERVENTION (1,1) -------- ILLUSTRER -------- (0,N) PHOTO_INTERVENTION
```

## Justification

* Une intervention peut posséder plusieurs photographies.
* Une photographie appartient à une seule intervention.

Cette association traduit :

* **RG32** : Une intervention peut posséder plusieurs photos.

---

# Synthèse du MCD

Le modèle conceptuel obtenu respecte les principes de la méthode Merise :

* séparation claire entre données et traitements ;
* identification unique des entités ;
* normalisation des relations plusieurs-à-plusieurs ;
* prise en compte des contraintes métier ;
* conservation de l'historique des évolutions organisationnelles.

Le MCD constitue ainsi une représentation fidèle du fonctionnement métier de la plateforme **ISI-Eco Report**.

# 3.4 Modèle Logique de Données (MLD)

## Introduction

Le **Modèle Logique de Données (MLD)** représente la transformation du **Modèle Conceptuel de Données (MCD)** en un modèle relationnel exploitable par un système de gestion de base de données relationnelle.

Cette transformation respecte les règles de passage de la méthode **Merise** :

* chaque entité du MCD devient une relation (table) ;
* l'identifiant de chaque entité devient une clé primaire ;
* les associations de type **1,N** sont transformées par l'ajout d'une clé étrangère dans la relation située du côté **N** ;
* les associations de type **N,N** deviennent des tables d'association contenant les clés étrangères des entités participantes ainsi que les éventuels attributs propres à l'association.

Le modèle logique obtenu permet ainsi de représenter la structure relationnelle de la base de données de la plateforme **ISI-Eco Report**.

---

# 3.4.1 Schéma relationnel

## ROLE

```text
ROLE(
    idRole,
    libelleRole
)
```

**Clé primaire :**

```text
idRole
```

---

## UTILISATEUR

```text
UTILISATEUR(
    idUtilisateur,
    nom,
    prenom,
    email,
    telephone,
    adresse,
    dateInscription,
    etatCompte,
    #idRole
)
```

**Clé primaire :**

```text
idUtilisateur
```

**Clé étrangère :**

```text
#idRole → ROLE(idRole)
```

---

## HISTORIQUE_POINT

```text
HISTORIQUE_POINT(
    idHistoriquePoint,
    nombrePoints,
    motif,
    description,
    dateAttribution,
    #idUtilisateur
)
```

**Clé primaire :**

```text
idHistoriquePoint
```

**Clé étrangère :**

```text
#idUtilisateur → UTILISATEUR(idUtilisateur)
```

---

## ZONE

```text
ZONE(
    idZone,
    nomZone,
    description
)
```

**Clé primaire :**

```text
idZone
```

---

## TYPE_DECHET

```text
TYPE_DECHET(
    idTypeDechet,
    libelle,
    description
)
```

**Clé primaire :**

```text
idTypeDechet
```

---

## SIGNALEMENT

```text
SIGNALEMENT(
    idSignalement,
    description,
    dateHeureSignalement,
    latitude,
    longitude,
    statut,
    priorite,
    #idUtilisateur,
    #idZone
)
```

**Clé primaire :**

```text
idSignalement
```

**Clés étrangères :**

```text
#idUtilisateur → UTILISATEUR(idUtilisateur)

#idZone → ZONE(idZone)
```

---

## CONTENU_SIGNALEMENT

Cette relation provient de la transformation de l'association plusieurs-à-plusieurs entre **SIGNALEMENT** et **TYPE_DECHET**.

Elle conserve également les propriétés de l'association.

```text
CONTENU_SIGNALEMENT(
    #idSignalement,
    #idTypeDechet,
    quantiteEstime,
    volumeEstime,
    dangerosite,
    remarque
)
```

**Clé primaire composée :**

```text
(#idSignalement, #idTypeDechet)
```

**Clés étrangères :**

```text
#idSignalement → SIGNALEMENT(idSignalement)

#idTypeDechet → TYPE_DECHET(idTypeDechet)
```

---

## PHOTO_SIGNALEMENT

```text
PHOTO_SIGNALEMENT(
    idPhoto,
    url,
    description,
    #idSignalement
)
```

**Clé primaire :**

```text
idPhoto
```

**Clé étrangère :**

```text
#idSignalement → SIGNALEMENT(idSignalement)
```

---

## EQUIPE

```text
EQUIPE(
    idEquipe,
    nomEquipe,
    description
)
```

**Clé primaire :**

```text
idEquipe
```

---

## APPARTENANCE_EQUIPE

Cette relation provient de l'association plusieurs-à-plusieurs entre **UTILISATEUR** et **EQUIPE**.

Elle possède ses propres attributs permettant de gérer l'historique des affectations.

```text
APPARTENANCE_EQUIPE(
    #idUtilisateur,
    #idEquipe,
    dateDebut,
    dateFin,
    fonction
)
```

**Clé primaire composée :**

```text
(#idUtilisateur, #idEquipe, dateDebut)
```

**Clés étrangères :**

```text
#idUtilisateur → UTILISATEUR(idUtilisateur)

#idEquipe → EQUIPE(idEquipe)
```

Cette clé composée permet de conserver plusieurs périodes d'appartenance d'un même agent à une même équipe.

---

## COUVERTURE_ZONE

Cette relation représente l'association plusieurs-à-plusieurs entre les équipes et les zones.

```text
COUVERTURE_ZONE(
    #idEquipe,
    #idZone
)
```

**Clé primaire composée :**

```text
(#idEquipe, #idZone)
```

**Clés étrangères :**

```text
#idEquipe → EQUIPE(idEquipe)

#idZone → ZONE(idZone)
```

---

## AFFECTATION

```text
AFFECTATION(
    idAffectation,
    dateHeureAffectation,
    observation,
    #idEquipe,
    #idSignalement
)
```

**Clé primaire :**

```text
idAffectation
```

**Clés étrangères :**

```text
#idEquipe → EQUIPE(idEquipe)

#idSignalement → SIGNALEMENT(idSignalement)
```

---

## INTERVENTION

```text
INTERVENTION(
    idIntervention,
    dateHeureDebut,
    dateHeureFin,
    statut,
    compteRendu,
    observation,
    #idAffectation
)
```

**Clé primaire :**

```text
idIntervention
```

**Clé étrangère :**

```text
#idAffectation → AFFECTATION(idAffectation)
```

---

## PHOTO_INTERVENTION

```text
PHOTO_INTERVENTION(
    idPhotoIntervention,
    url,
    description,
    #idIntervention
)
```

**Clé primaire :**

```text
idPhotoIntervention
```

**Clé étrangère :**

```text
#idIntervention → INTERVENTION(idIntervention)
```

---

# 3.4.2 Analyse du MLD

Le Modèle Logique de Données obtenu respecte les règles de normalisation relationnelle et traduit fidèlement le modèle métier défini précédemment.

Les principales améliorations apportées par rapport à l'ancien modèle sont :

## Séparation du rôle utilisateur

L'ancien attribut :

```text
role
```

présent directement dans la table **UTILISATEUR** a été remplacé par une relation dédiée :

```text
ROLE
```

Cette évolution permet :

* d'éviter la duplication des valeurs ;
* de garantir l'intégrité des rôles autorisés ;
* de faciliter l'évolution future des profils utilisateurs.

---

## Gestion historique des équipes

L'association :

```text
APPARTENANCE_EQUIPE
```

permet désormais de conserver l'évolution organisationnelle des agents.

Elle prend en compte :

* la date d'entrée dans l'équipe ;
* la date éventuelle de sortie ;
* la fonction occupée.

Cette structure répond directement aux règles :

* **RG6**
* **RG7**
* **RG8**

---

## Gestion complète du cycle de vie d'un signalement

Le modèle permet de représenter l'ensemble du processus :

```text
Citoyen
   ↓
Signalement
   ↓
Validation
   ↓
Affectation
   ↓
Intervention
   ↓
Compte rendu
```

La possibilité de créer plusieurs affectations permet également de gérer les réaffectations :

```text
SIGNALEMENT (1,N)
        |
        |
AFFECTATION (1,1)
```

conformément à la règle :

**RG28 : Un signalement peut être affecté plusieurs fois.**

---

## Gestion des relations complexes

Les associations plusieurs-à-plusieurs ont été correctement transformées :

| Association MCD     | Table MLD           |
| ------------------- | ------------------- |
| CONTENU_SIGNALEMENT | CONTENU_SIGNALEMENT |
| APPARTENANCE_EQUIPE | APPARTENANCE_EQUIPE |
| COUVERTURE_ZONE     | COUVERTURE_ZONE     |

Ces tables permettent de conserver les informations spécifiques portées par ces relations.

---

# Conclusion du MLD

Le Modèle Logique de Données obtenu constitue une représentation relationnelle cohérente de la plateforme **ISI-Eco Report**.

Il assure :

* la cohérence des données ;
* le respect des règles métier ;
* la traçabilité des opérations ;
* l'évolutivité du système.

Ce modèle servira de référence pour la dernière étape de conception des données : le **Modèle Physique de Données (MPD)**, qui décrira l'implémentation réelle dans le système de gestion de base de données.

---

## 3.5 Modèle Physique de Données (MPD)

Le Modèle Physique de Données (MPD) constitue la dernière étape de la conception des données selon la méthode Merise. Il correspond à la traduction du Modèle Logique de Données (MLD) en une structure physique directement exploitable par un Système de Gestion de Base de Données (SGBD).

Dans le cadre de la plateforme **ISI-Eco Report**, le MPD est implémenté dans une base de données relationnelle. Il définit précisément les tables, les attributs, les types de données ainsi que les contraintes permettant d'assurer la cohérence, la sécurité et la fiabilité des informations manipulées par le système.

La conception physique respecte les principes suivants :

* chaque entité du MCD est représentée par une table ;
* chaque table possède une clé primaire garantissant l'unicité des enregistrements ;
* les relations de type 1,N sont représentées par l'ajout de clés étrangères ;
* les relations de type N,N sont transformées en tables d'association ;
* les contraintes d'intégrité assurent la cohérence entre les différentes tables.

Le modèle physique obtenu comprend les tables suivantes :

* ROLE ;
* UTILISATEUR ;
* HISTORIQUE_POINT ;
* ZONE ;
* TYPE_DECHET ;
* SIGNALEMENT ;
* CONTENU_SIGNALEMENT ;
* PHOTO_SIGNALEMENT ;
* EQUIPE ;
* APPARTENANCE_EQUIPE ;
* COUVERTURE_ZONE ;
* AFFECTATION ;
* INTERVENTION ;
* PHOTO_INTERVENTION.

---

### Structure physique des tables

### Table ROLE

| Attribut    | Type        | Contraintes        |
| ----------- | ----------- | ------------------ |
| idRole      | INT         | PK, GENERATED BY DEFAULT AS IDENTITY |
| libelleRole | VARCHAR(50) | NOT NULL, UNIQUE   |

Cette table permet de gérer les différents profils utilisateurs de la plateforme :

* Citoyen ;
* Agent ;
* Administrateur.

Elle respecte la règle **RG2** indiquant qu'un utilisateur possède un seul rôle.

---

### Table UTILISATEUR

| Attribut        | Type         | Contraintes        |
| --------------- | ------------ | ------------------ |
| idUtilisateur   | INT          | PK, GENERATED BY DEFAULT AS IDENTITY |
| nom             | VARCHAR(100) | NOT NULL           |
| prenom          | VARCHAR(100) | NOT NULL           |
| email           | VARCHAR(150) | NOT NULL, UNIQUE   |
| telephone       | VARCHAR(20)  | NOT NULL           |
| adresse         | VARCHAR(255) | NOT NULL           |
| dateInscription | DATE         | NOT NULL           |
| etatCompte      | VARCHAR(30)  | NOT NULL           |
| idRole          | INT          | FK, NOT NULL       |

La clé étrangère **idRole** permet d'associer chaque utilisateur à un rôle unique conformément aux règles **RG1** et **RG2**.

---

### Table HISTORIQUE_POINT

| Attribut          | Type         | Contraintes        |
| ----------------- | ------------ | ------------------ |
| idHistoriquePoint | INT          | PK, GENERATED BY DEFAULT AS IDENTITY |
| nombrePoints      | INT          | NOT NULL           |
| motif             | VARCHAR(100) | NOT NULL           |
| description       | TEXT         | NULL               |
| dateAttribution   | DATE         | NOT NULL           |
| idUtilisateur     | INT          | FK, NOT NULL       |
| idSignalement    | INT          | FK, NULL           |

Cette table conserve l'historique des récompenses attribuées aux utilisateurs.

Elle respecte les règles :

* **RG5** : un utilisateur peut recevoir plusieurs historiques de points ;
* **RG34** : chaque attribution appartient à un seul utilisateur.

---

### Table ZONE

| Attribut    | Type         | Contraintes        |
| ----------- | ------------ | ------------------ |
| idZone      | INT          | PK, GENERATED BY DEFAULT AS IDENTITY |
| nomZone     | VARCHAR(100) | NOT NULL           |
| description | TEXT         | NULL               |

Cette table représente les secteurs géographiques couverts par la plateforme.

---

### Table TYPE_DECHET

| Attribut     | Type         | Contraintes        |
| ------------ | ------------ | ------------------ |
| idTypeDechet | INT          | PK, GENERATED BY DEFAULT AS IDENTITY |
| libelle      | VARCHAR(100) | NOT NULL           |
| description  | TEXT         | NULL               |

Cette table contient les catégories de déchets pouvant être signalées.

Elle respecte les règles **RG17** et **RG18**.

---

### Table SIGNALEMENT

| Attribut             | Type          | Contraintes        |
| -------------------- | ------------- | ------------------ |
| idSignalement        | INT           | PK, GENERATED BY DEFAULT AS IDENTITY |
| description          | TEXT          | NOT NULL           |
| dateHeureSignalement | TIMESTAMP     | DÉRIVÉ DE `created_at` |
| latitude             | DECIMAL(10,8) | NOT NULL           |
| longitude            | DECIMAL(11,8) | NOT NULL           |
| statut               | VARCHAR(30)   | NOT NULL           |
| priorite             | VARCHAR(20)   | NOT NULL           |
| idUtilisateur        | INT           | FK, NOT NULL       |
| idZone               | INT           | FK, NULLABLE       |

Cette table représente les signalements effectués par les utilisateurs authentifiés. La zone et les types de déchets peuvent être complétés après création.

Elle respecte notamment :

* **RG3** : tout utilisateur authentifié peut créer plusieurs signalements ;
* **RG4** : un signalement appartient à un seul utilisateur authentifié ;
* **RG10** : un signalement peut être créé sans zone et être qualifié ultérieurement ;
* **RG15** : un signalement doit être validé ou rejeté.

---

### Table CONTENU_SIGNALEMENT

| Attribut       | Type          | Contraintes |
| -------------- | ------------- | ----------- |
| idSignalement  | INT           | PK, FK      |
| idTypeDechet   | INT           | PK, FK      |
| quantiteEstime | DECIMAL(10,2) | NOT NULL    |
| volumeEstime   | DECIMAL(10,2) | NOT NULL    |
| dangerosite    | VARCHAR(30)   | NOT NULL    |
| remarque       | TEXT          | NULL        |

Cette table matérialise l'association plusieurs-à-plusieurs entre les signalements et les types de déchets.

Elle respecte :

* **RG12** : un signalement peut être créé sans type de déchet et être qualifié ultérieurement ;
* **RG13** : un type de déchet peut apparaître dans plusieurs signalements.

---

### Table PHOTO_SIGNALEMENT

| Attribut      | Type         | Contraintes        |
| ------------- | ------------ | ------------------ |
| idPhoto       | INT          | PK, GENERATED BY DEFAULT AS IDENTITY |
| url           | VARCHAR(255) | NOT NULL           |
| description   | TEXT         | NULL               |
| idSignalement | INT          | FK, NOT NULL       |

Cette table permet de gérer les photographies associées aux signalements.

Elle respecte :

* **RG14** : la photo est facultative ;
* **RG19** : une photo appartient à un seul signalement ;
* **RG20** : un signalement peut posséder plusieurs photos.

---

### Table EQUIPE

| Attribut    | Type         | Contraintes        |
| ----------- | ------------ | ------------------ |
| idEquipe    | INT          | PK, GENERATED BY DEFAULT AS IDENTITY |
| nomEquipe   | VARCHAR(100) | NOT NULL           |
| description | TEXT         | NULL               |

Cette table représente les équipes chargées des interventions.

---

### Table APPARTENANCE_EQUIPE

| Attribut      | Type         | Contraintes |
| ------------- | ------------ | ----------- |
| idUtilisateur | INT          | PK, FK      |
| idEquipe      | INT          | PK, FK      |
| dateDebut     | DATE         | PK          |
| dateFin       | DATE         | NULL        |
| fonction      | VARCHAR(100) | NOT NULL    |

Cette table permet de conserver l'historique des appartenances entre agents et équipes.

La clé primaire composée :

**(idUtilisateur, idEquipe, dateDebut)**

permet d'enregistrer plusieurs périodes d'appartenance pour un même agent.

Elle respecte :

* **RG6** : seuls les agents appartiennent aux équipes ;
* **RG7** : un agent peut changer d'équipe ;
* **RG8** : une appartenance possède une date de début et éventuellement une date de fin.

---

### Table COUVERTURE_ZONE

| Attribut | Type | Contraintes |
| -------- | ---- | ----------- |
| idEquipe | INT  | PK, FK      |
| idZone   | INT  | PK, FK      |

Cette table représente la couverture territoriale des équipes.

Elle respecte :

* **RG22** : une zone peut être couverte par plusieurs équipes ;
* **RG23** : une équipe peut intervenir dans plusieurs zones.

---

### Table AFFECTATION

| Attribut             | Type     | Contraintes        |
| -------------------- | -------- | ------------------ |
| idAffectation        | INT      | PK, GENERATED BY DEFAULT AS IDENTITY |
| dateHeureAffectation | TIMESTAMP | NOT NULL           |
| observation          | TEXT     | NULL               |
| idEquipe             | INT      | FK, NOT NULL       |
| idSignalement        | INT      | FK, NOT NULL       |

Cette table conserve l'historique des affectations réalisées par les administrateurs.

Elle respecte :

* **RG16** : seul un signalement validé et priorisé peut être affecté ;
* **RG25** : une équipe peut recevoir plusieurs affectations ;
* **RG28** : un signalement peut être affecté plusieurs fois.

---

### Table INTERVENTION

| Attribut       | Type        | Contraintes        |
| -------------- | ----------- | ------------------ |
| idIntervention | INT         | PK, GENERATED BY DEFAULT AS IDENTITY |
| dateHeureDebut | TIMESTAMP    | NOT NULL           |
| dateHeureFin   | TIMESTAMP    | NULL               |
| statut         | VARCHAR(30) | NOT NULL           |
| compteRendu    | TEXT        | NULL               |
| observation    | TEXT        | NULL               |
| idAffectation  | INT         | FK, NOT NULL       |

Cette table représente les opérations réalisées sur le terrain.

Elle respecte :

* **RG29** : une affectation peut générer plusieurs interventions ;
* **RG30** : une intervention appartient à une seule affectation ;
* **RG33** : une intervention possède un statut.

---

### Table PHOTO_INTERVENTION

| Attribut            | Type         | Contraintes        |
| ------------------- | ------------ | ------------------ |
| idPhotoIntervention | INT          | PK, GENERATED BY DEFAULT AS IDENTITY |
| url                 | VARCHAR(255) | NOT NULL           |
| description         | TEXT         | NULL               |
| idIntervention      | INT          | FK, NOT NULL       |

Cette table permet d'assurer la documentation photographique des interventions.

Elle respecte :

* **RG32** : une intervention peut posséder plusieurs photos.

---

## Contraintes d'intégrité du MPD

Afin de garantir la qualité des données, plusieurs contraintes sont appliquées :

* les clés primaires assurent l'unicité de chaque enregistrement ;
* les clés étrangères garantissent l'intégrité référentielle entre les tables ;
* les champs obligatoires sont définis avec la contrainte `NOT NULL` ;
* les emails utilisateurs sont uniques afin d'éviter les doublons ;
* les valeurs des rôles sont limitées aux profils autorisés ;
* les statuts des signalements et des interventions sont contrôlés ;
* les suppressions doivent respecter les dépendances entre les tables.

---

## Analyse du modèle physique

Le MPD obtenu traduit fidèlement le modèle conceptuel défini précédemment. La séparation des responsabilités entre les différentes tables permet une meilleure organisation des données et facilite l'évolution future de la plateforme.

L'introduction de la table **ROLE** améliore la gestion des utilisateurs en séparant l'identification du profil utilisateur de ses informations personnelles. De même, la conservation des historiques d'appartenance aux équipes permet de suivre l'évolution organisationnelle des agents.

Les tables d'association :

* CONTENU_SIGNALEMENT ;
* APPARTENANCE_EQUIPE ;
* COUVERTURE_ZONE ;

permettent de représenter correctement les relations plusieurs-à-plusieurs identifiées dans le MCD.

Ainsi, le modèle physique obtenu constitue une base de données relationnelle cohérente, normalisée et directement exploitable pour l'implémentation de la plateforme ISI-Eco Report.



# Cible SGBD v2.1

La cible technique du modèle physique est **PostgreSQL 17**. Les types `TIMESTAMP`, les identités générées et les contraintes de nullabilité de cette section constituent la cible normative de la phase backend.
