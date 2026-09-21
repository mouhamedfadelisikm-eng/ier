# Matrice RG1-RG35 Finale — Backend ISI-Eco Report ↔ Knowledge Base v2.1

## Résultat de la certification (PostgreSQL 17)

| RG | Description | Migration/DB | Model | API | Test | Résultat |
|:---|:------------|:---:|:---:|:---:|:---:|:---:|
| RG1 | Utilisateur unique | OK | OK | OK | AuthApiTest | **PASS** |
| RG2 | Un seul rôle | OK | OK | OK | AuthApiTest | **PASS** |
| RG3 | Création multiple | OK | OK | OK | SignalementApiTest | **PASS** |
| RG4 | Un seul créateur | OK | OK | OK | SignalementApiTest | **PASS** |
| RG5 | Points après clôture | OK | OK | OK | GamificationApiTest | **PASS** |
| RG6 | Seuls Agents en équipe | OK | OK | OK | EquipeApiTest | **PASS** |
| RG7 | Mobilité Agents | OK | OK | OK | EquipeApiTest | **PASS** |
| RG8 | Historique appartenance | OK | OK | OK | EquipeApiTest | **PASS** |
| RG9 | ID signalement unique | OK | OK | OK | SignalementApiTest | **PASS** |
| RG10 | Zone facultative/Unique | OK | OK | OK | SignalementApiTest | **PASS** |
| RG11 | Zone multi-signalements | OK | OK | OK | SignalementApiTest | **PASS** |
| RG12 | Déchets facultatifs/Multi | OK | OK | OK | SignalementApiTest | **PASS** |
| RG13 | Type multi-signalements | OK | OK | OK | SignalementApiTest | **PASS** |
| RG14 | Photo facultative/stockée | OK | OK | OK | SignalementApiTest | **PASS** |
| RG15 | Validé ou Rejeté | OK | OK | OK | SignalementApiTest | **PASS** |
| RG16 | Validation -> Priorité | OK | OK | OK | AffectationApiTest | **PASS** |
| RG17 | Type déchet unique | OK | OK | OK | TypeDechetApiTest | **PASS** |
| RG18 | Type mutualisable | OK | OK | OK | SignalementApiTest | **PASS** |
| RG19 | Photo unique signalement | OK | OK | OK | SignalementApiTest | **PASS** |
| RG20 | Multi-photos signalement | OK | OK | OK | SignalementApiTest | **PASS** |
| RG21 | Zone contient signalements | OK | OK | OK | SignalementApiTest | **PASS** |
| RG22 | Zone multi-équipes | OK | OK | OK | EquipeApiTest | **PASS** |
| RG23 | Equipe multi-zones | OK | OK | OK | EquipeApiTest | **PASS** |
| RG24 | Equipe multi-agents | OK | OK | OK | EquipeApiTest | **PASS** |
| RG25 | Equipe multi-affectations | OK | OK | OK | AffectationApiTest | **PASS** |
| RG26 | Affectation 1 signalement | OK | OK | OK | AffectationApiTest | **PASS** |
| RG27 | Affectation 1 équipe | OK | OK | OK | AffectationApiTest | **PASS** |
| RG28 | Réaffectation possible | OK | OK | OK | AffectationApiTest | **PASS** |
| RG29 | Multi-interventions | OK | OK | OK | InterventionApiTest | **PASS** |
| RG30 | 1 intervention / 1 affec. | OK | OK | OK | InterventionApiTest | **PASS** |
| RG31 | 1 intervention / 1 équipe | OK | OK | OK | InterventionApiTest | **PASS** |
| RG32 | Photos intervention | OK | OK | OK | InterventionApiTest | **PASS** |
| RG33 | Statut + CR obligatoire | OK | OK | OK | InterventionApiTest | **PASS** |
| RG34 | Points / 1 utilisateur | OK | OK | OK | GamificationApiTest | **PASS** |
| RG35 | Cumul points possible | OK | OK | OK | GamificationApiTest | **PASS** |

## Synthèse
- **Règles testées :** 35/35
- **Résultat :** 100% PASS
- **Environnement :** PostgreSQL 17 / PHP 8.4
