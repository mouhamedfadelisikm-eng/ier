import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isOpen = input<boolean>(true);
  closeSidebar = output<void>();

  navItems: NavItem[] = [
    { label: 'Tableau de bord', route: '/admin/dashboard', icon: 'dashboard', exact: true },
    { label: 'Signalements', route: '/admin/signalements', icon: 'signalement' },
    { label: 'Affectations', route: '/admin/affectations', icon: 'affectation' },
    { label: 'Interventions', route: '/admin/interventions', icon: 'intervention' },
    { label: 'Équipes', route: '/admin/equipes', icon: 'equipe' },
    { label: 'Zones d\'intervention', route: '/admin/zones', icon: 'zone' },
    { label: 'Types de déchets', route: '/admin/types-dechets', icon: 'dechet' },
    { label: 'Utilisateurs & Rôles', route: '/admin/utilisateurs', icon: 'users' },
    { label: 'Gamification', route: '/admin/gamification', icon: 'trophy' },
    { label: 'Notifications', route: '/admin/notifications', icon: 'bell' },
    { label: 'Mon Profil', route: '/admin/profil', icon: 'user' }
  ];
}
