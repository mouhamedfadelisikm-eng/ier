import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SignalementsListComponent } from './features/signalements/signalements-list/signalements-list.component';
import { SignalementDetailComponent } from './features/signalements/signalement-detail/signalement-detail.component';
import { AffectationsListComponent } from './features/affectations/affectations-list/affectations-list.component';
import { AffectationDetailComponent } from './features/affectations/affectation-detail/affectation-detail.component';
import { InterventionsListComponent } from './features/interventions/interventions-list/interventions-list.component';
import { InterventionDetailComponent } from './features/interventions/intervention-detail/intervention-detail.component';
import { EquipesListComponent } from './features/equipes/equipes-list/equipes-list.component';
import { EquipeDetailComponent } from './features/equipes/equipe-detail/equipe-detail.component';
import { ZonesComponent } from './features/zones/zones.component';
import { TypesDechetsComponent } from './features/types-dechets/types-dechets.component';
import { UtilisateursListComponent } from './features/utilisateurs/utilisateurs-list/utilisateurs-list.component';
import { UtilisateurDetailComponent } from './features/utilisateurs/utilisateur-detail/utilisateur-detail.component';
import { GamificationDashboardComponent } from './features/gamification/gamification-dashboard.component';
import { ClassementComponent } from './features/gamification/classement.component';
import { HistoriquePointsComponent } from './features/gamification/historique-points.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { ProfilComponent } from './features/profil/profil.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin/dashboard' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Tableau de bord' } },
      { path: 'signalements', component: SignalementsListComponent, data: { title: 'Gestion des Signalements' } },
      { path: 'signalements/:id', component: SignalementDetailComponent, data: { title: 'Détail du Signalement' } },
      { path: 'affectations', component: AffectationsListComponent, data: { title: 'Gestion des Affectations' } },
      { path: 'affectations/:id', component: AffectationDetailComponent, data: { title: "Détail de l'Affectation" } },
      { path: 'interventions', component: InterventionsListComponent, data: { title: 'Suivi des Interventions' } },
      { path: 'interventions/:id', component: InterventionDetailComponent, data: { title: "Détail de l'Intervention" } },
      { path: 'equipes', component: EquipesListComponent, data: { title: 'Gestion des Équipes' } },
      { path: 'equipes/:id', component: EquipeDetailComponent, data: { title: "Détail de l'Équipe" } },
      { path: 'zones', component: ZonesComponent, data: { title: "Zones d'intervention" } },
      { path: 'types-dechets', component: TypesDechetsComponent, data: { title: 'Types de Déchets' } },
      { path: 'utilisateurs', component: UtilisateursListComponent, data: { title: 'Gestion des Utilisateurs' } },
      { path: 'utilisateurs/:id', component: UtilisateurDetailComponent, data: { title: "Détail de l'Utilisateur" } },
      { path: 'gamification/classement', component: ClassementComponent, data: { title: 'Classement (Leaderboard)' } },
      { path: 'gamification/historique-points', component: HistoriquePointsComponent, data: { title: 'Historique des Points' } },
      { path: 'gamification', component: GamificationDashboardComponent, data: { title: 'Gamification' } },
      { path: 'notifications', component: NotificationsComponent, data: { title: 'Notifications' } },
      { path: 'profil', component: ProfilComponent, data: { title: 'Profil Administrateur' } }
    ]
  },
  { path: '**', redirectTo: 'admin/dashboard' }
];
