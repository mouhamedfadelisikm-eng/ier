import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-module-placeholder',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="placeholder-card">
      <div class="placeholder-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h2 class="placeholder-title">{{ title }}</h2>
      <p class="placeholder-desc">Ce module sera développé dans la phase suivante conformément à l'API Laravel gelée en v2.2.1.</p>
      <a routerLink="/admin/dashboard" class="btn btn-primary">Retour au tableau de bord</a>
    </div>
  `,
  styles: [`
    .placeholder-card {
      background-color: #ffffff;
      border-radius: var(--radius-md);
      border: 1px solid var(--slate-200);
      padding: 3.5rem 2rem;
      text-align: center;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .placeholder-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-full);
      background-color: var(--primary-50);
      color: var(--primary-600);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }
    .placeholder-icon svg {
      width: 28px;
      height: 28px;
    }
    .placeholder-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--slate-900);
      margin-bottom: 0.5rem;
    }
    .placeholder-desc {
      font-size: 0.9rem;
      color: var(--slate-500);
      max-width: 480px;
      margin-bottom: 1.75rem;
      line-height: 1.5;
    }
  `]
})
export class ModulePlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  readonly title = this.route.snapshot.data['title'] || 'Module en cours de préparation';
}
