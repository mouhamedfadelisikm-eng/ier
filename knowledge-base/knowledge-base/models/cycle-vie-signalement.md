# Cycle de vie d'un signalement

## 1. Objectif

Le présent document décrit le cycle de vie complet d'un signalement dans la plateforme **ISI-Eco Report**.

Il présente les différentes étapes traversées par un signalement depuis sa création par un utilisateur authentifié jusqu'à sa clôture après intervention des équipes de ramassage.

Ce modèle permet de :

- comprendre les états possibles d'un signalement ;
- identifier les transitions entre ces états ;
- associer chaque étape aux acteurs responsables ;
- garantir la cohérence entre les règles métier, les traitements et les données.

Le cycle présenté respecte :

- les 35 règles de gestion définies ;
- le Modèle Conceptuel de Données (MCD) ;
- le Modèle Logique de Données (MLD) ;
- les processus métier définis dans l'étude préalable.

---

# 2. Vue générale du cycle

Le cycle global d'un signalement est représenté comme suit :

```

Création
|
▼
En attente de validation
|
├──────────────► Rejeté
|
▼
Validé
|
▼
Priorisé
|
▼
Affecté à une équipe
|
▼
Intervention en cours
|
▼
Intervention terminée
|
▼
Signalement clôturé

```

---

# 3. États d'un signalement

## 3.1 BROUILLON

### Description

État temporaire correspondant à la préparation d'un signalement avant son enregistrement définitif.

### Acteur responsable

Utilisateur authentifié.

### Actions possibles

- renseigner la description ;
- transmettre les coordonnées GPS ;
- renseigner éventuellement la zone ;
- renseigner éventuellement les types de déchets ;
- ajouter des photographies.

### Transition suivante

```

BROUILLON
|
▼
EN_ATTENTE_VALIDATION

```

---

# 3.2 EN_ATTENTE_VALIDATION

## Description

Le signalement est enregistré dans le système mais n'a pas encore été examiné par un administrateur.

---

## Acteur responsable

Administrateur.

---

## Informations disponibles

- utilisateur créateur ;
- localisation ;
- description ;
- zone éventuellement déjà qualifiée ;
- types de déchets éventuellement déjà qualifiés ;
- photographies éventuelles.

---

## Actions possibles

Deux décisions sont possibles :

### Validation

```

EN_ATTENTE_VALIDATION
|
▼
VALIDE

```

### Rejet

```

EN_ATTENTE_VALIDATION
|
▼
REJETE

```

---

## Règles associées

- RG4 : Un signalement est créé par un seul utilisateur authentifié.
- RG14 : La photographie est facultative.
- RG15 : Tout signalement doit être validé ou rejeté.

---

# 3.3 REJETE

## Description

Le signalement n'est pas considéré comme recevable par l'administrateur.

---

## Causes possibles

- informations insuffisantes ;
- localisation incorrecte ;
- contenu non conforme ;
- doublon.

---

## Actions possibles

- consultation par le citoyen ;
- conservation dans l'historique.

---

## Limitation

Un signalement rejeté :

- ne peut pas être affecté ;
- ne génère pas d'intervention.

---

## Règle associée

RG16 :

> Un signalement doit être validé puis priorisé avant de pouvoir être affecté.

---

# 3.4 VALIDE

## Description

Le signalement a été accepté par l'administrateur.

Il devient éligible à une prise en charge opérationnelle.

---

## Actions déclenchées

- définition de la priorité ;
- recherche d'une équipe disponible ;
- préparation de l'affectation.

---

## Conséquence métier

Aucune attribution de points n'est effectuée à la validation. Les points liés au signalement sont attribués une seule fois après sa clôture.

---

## Règles associées

- RG15
- RG16
- RG34
- RG35

---

# 3.5 PRIORISE

## Description

Le signalement validé reçoit un niveau de priorité permettant d'organiser les interventions.

---

## Critères possibles

La priorité peut dépendre de :

- la dangerosité ;
- la quantité estimée ;
- le volume estimé ;
- la localisation ;
- l'urgence.

---

## Acteur responsable

Administrateur.

---

# 3.6 AFFECTE

## Description

Une équipe est désignée pour réaliser l'intervention.

---

## Données créées

Création d'une entité :

```

AFFECTATION

```

avec :

- signalement concerné ;
- équipe choisie ;
- date d'affectation ;
- observations.

---

## Acteurs concernés

Administrateur :

- réalise l'affectation.

Équipe :

- reçoit la mission.

---

## Règles associées

- RG25 : Une équipe peut recevoir plusieurs affectations.
- RG26 : Une affectation concerne un seul signalement.
- RG27 : Une affectation est attribuée à une seule équipe.
- RG28 : Un signalement peut être affecté plusieurs fois.

---

# 3.7 EN_INTERVENTION

## Description

L'équipe commence les opérations de terrain.

---

## Actions réalisées

L'équipe :

- consulte les informations du signalement ;
- se déplace sur la zone concernée ;
- réalise les opérations de nettoyage ;
- ajoute éventuellement des photographies.

---

## Données produites

Création d'une :

```

INTERVENTION

```

contenant :

- date de début ;
- statut ;
- observations ;
- compte rendu.

---

## Règles associées

- RG29
- RG30
- RG31
- RG32
- RG33

---

# 3.8 TERMINE

## Description

L'équipe a terminé son intervention.

---

## Informations obligatoires

Une intervention terminée doit contenir :

- un statut final ;
- un compte rendu ;
- les informations nécessaires au suivi.

---

## Acteur responsable

Agent de ramassage.

---

# 3.9 CLOTURE

## Description

Dernière étape du cycle.

Le traitement du signalement est considéré comme terminé.

---

## Conditions nécessaires

La clôture nécessite :

- une intervention réalisée ;
- un compte rendu enregistré ;
- une mise à jour du statut.

---

## Résultat

Le citoyen peut consulter :

- l'état final ;
- les informations de traitement ;
- l'historique.

---

# 4. Diagramme d'état simplifié

```

```
             Création
                |
                ▼
    +-------------------------+
    | En attente validation   |
    +-------------------------+
          |              |
          |              |
    Validation       Rejet
          |              |
          ▼              ▼
      Validé          Rejeté
          |
          ▼
      Priorisé
          |
          ▼
      Affecté
          |
          ▼
   Intervention
          |
          ▼
      Terminé
          |
          ▼
      Clôturé
```

```

---

# 5. Historique des transitions

| État initial | Événement | État suivant | Acteur |
|---|---|---|---|
| Création | Envoi du signalement | En attente validation | Utilisateur authentifié |
| En attente validation | Validation | Validé | Administrateur |
| En attente validation | Rejet | Rejeté | Administrateur |
| Validé | Attribution priorité | Priorisé | Administrateur |
| Priorisé | Affectation équipe | Affecté | Administrateur |
| Affecté | Début intervention | En intervention | Agent |
| En intervention | Fin intervention | Terminé | Agent |
| Terminé | Clôture du signalement après contrôle des prérequis | Clôturé | Administrateur |

---

# 6. Relations avec les entités

Le cycle de vie implique les entités suivantes :

```

UTILISATEUR
|
▼
SIGNALEMENT
|
├────────► PHOTO_SIGNALEMENT
|
├────────► CONTENU_SIGNALEMENT
|
▼
AFFECTATION
|
▼
INTERVENTION
|
▼
PHOTO_INTERVENTION

```

---

# 7. Points importants pour l'implémentation

## Gestion des statuts

Les valeurs possibles du champ :

```

SIGNALEMENT.statut

```

peuvent être :

```

EN_ATTENTE_VALIDATION
VALIDE
REJETE
PRIORISE
AFFECTE
EN_INTERVENTION
TERMINE
CLOTURE

```

---

## Traçabilité

Chaque changement important doit pouvoir être expliqué par :

- l'acteur responsable ;
- la date de modification ;
- l'action réalisée.

---

## Cohérence métier

Les règles suivantes doivent toujours être respectées :

- un signalement appartient à un utilisateur authentifié ;
- un signalement peut être créé sans zone et être qualifié ultérieurement ;
- un signalement rejeté ne possède pas d'affectation ;
- une intervention dépend toujours d'une affectation ;
- les photos restent liées à leur objet métier.

---

# 8. Conclusion

Le cycle de vie du signalement constitue le processus métier central de la plateforme ISI-Eco Report.

Il assure une continuité complète entre :

- la participation citoyenne ;
- la validation administrative ;
- l'organisation des équipes ;
- les interventions terrain ;
- le suivi des résultats.

Ce modèle servira de référence pour la définition des workflows fonctionnels et la réalisation des tests du système.
