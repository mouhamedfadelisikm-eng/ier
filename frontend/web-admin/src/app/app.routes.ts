import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SignalementsListComponent } from './features/signalements/signalements-list/signalements-list.component';
import { SignalementDetailComponent } from './features/signalements/signalement-detail/signalement-detail.component';
import { ModulePlaceholderComponent } from './shared/components/module-placeholder/module-placeholder.component';

export const routes: Routes = [
  // Redirection racine
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin/dashboard'
  },

  // Authentification (invités uniquement)
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  },

  // Espace d'administration protégé
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Tableau de bord' }
      },
      {
        path: 'signalements',
        component: SignalementsListComponent,
        data: { title: 'Gestion des Signalements' }
      },
      {
        path: 'signalements/:id',
        component: SignalementDetailComponent,
        data: { title: 'Détail du Signalement' }
      },
      {
        path: 'affectations',
        component: ModulePlaceholderComponent,
        data: { title: 'Gestion des Affectations' }
      },
      {
        path: 'affectations/:id',
        component: ModulePlaceholderComponent,
        data: { title: 'Détail de l\'Affectation' }
      },
      {
        path: 'interventions',
        component: ModulePlaceholderComponent,
        data: { title: 'Suivi des Interventions' }
      },
      {
        path: 'interventions/:id',
        component: ModulePlaceholderComponent,
        data: { title: 'Détail de l\'Intervention' }
      },
      {
        path: 'equipes',
        component: ModulePlaceholderComponent,
        data: { title: 'Gestion des Équipes' }
      },
      {
        path: 'equipes/:id',
        component: ModulePlaceholderComponent,
        data: { title: 'Détail de l\'Équipe' }
      },
      {
        path: 'zones',
        component: ModulePlaceholderComponent,
        data: { title: 'Zones d\'intervention' }
      },
      {
        path: 'types-dechets',
        component: ModulePlaceholderComponent,
        data: { title: 'Types de Déchets' }
      },
      {
        path: 'utilisateurs',
        component: ModulePlaceholderComponent,
        data: { title: 'Gestion des Utilisateurs' }
      },
      {
        path: 'utilisateurs/:id',
        component: ModulePlaceholderComponent,
        data: { title: 'Détail de l\'Utilisateur' }
      },
      {
        path: 'gamification',
        component: ModulePlaceholderComponent,
        data: { title: 'Gamification' }
      },
      {
        path: 'gamification/classement',
        component: ModulePlaceholderComponent,
        data: { title: 'Classement (Leaderboard)' }
      },
      {
        path: 'gamification/historique-points',
        component: ModulePlaceholderComponent,
        data: { title: 'Historique des Points' }
      },
      {
        path: 'notifications',
        component: ModulePlaceholderComponent,
        data: { title: 'Notifications' }
      },
      {
        path: 'profil',
        component: ModulePlaceholderComponent,
        data: { title: 'Profil Administrateur' }
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'admin/dashboard'
  }
];
