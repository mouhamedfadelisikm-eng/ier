# Web Admin — État de réalisation

Le Web Admin Angular 22 couvre désormais les modules administratifs suivants :

- Authentification et profil administrateur
- Tableau de bord
- Signalements
- Affectations
- Interventions
- Équipes
- Zones
- Types de déchets
- Utilisateurs
- Gamification
- Notifications

Les routes /admin/* utilisent uniquement des composants réels. Le composant placeholder historique a été supprimé.

La CI vérifie le backend Laravel/PostgreSQL 17, les tests Angular, le build Angular, l’absence de placeholders et de dialogues navigateur (alert / window.confirm), ainsi que la syntaxe OpenAPI JSON/YAML.
