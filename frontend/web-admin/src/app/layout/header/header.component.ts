import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  toggleSidebar = output<void>();

  readonly currentUser = this.authService.currentUser;
  readonly isLoggingOut = this.authService.isLoading;

  onLogout(): void {
    if (confirm('Êtes-vous certain de vouloir vous déconnecter de la session administrateur ?')) {
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigate(['/login']);
        }
      });
    }
  }
}
