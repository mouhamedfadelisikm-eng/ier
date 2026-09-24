import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { InterventionService } from '../../../core/services/intervention.service';
import { Affectation } from '../../../core/models/affectation.model';
import { Intervention, InterventionStatut, InterventionPage } from '../../../core/models/intervention.model';

@Component({
  selector: 'app-interventions-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './interventions-list.component.html',
  styleUrls: ['./interventions-list.component.css']
})
export class InterventionsListComponent implements OnInit {
  private readonly service = inject(InterventionService);

  interventions = signal<Intervention[]>([]);
  affectations = signal<Affectation[]>([]);
  meta = signal<Intervention['id'] extends never ? never : {
    current_page: number; from: number; last_page: number; per_page: number; to: number; total: number;
  } | undefined>(undefined);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  statusFilter = signal('');
  search = signal('');
  showCreate = signal(false);
  actionInProgress = signal(false);
  affectationId = signal<number | null>(null);
  dateDebut = signal('');
  createError = signal<string | null>(null);

  readonly statuses: InterventionStatut[] = ['en_cours', 'suspendue', 'terminee'];

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    return this.interventions().filter(item => {
      if (status && item.statut !== status) return false;
      if (!q) return true;
      const haystack = [
        String(item.id),
        item.affectation?.equipe?.nom_equipe ?? '',
        item.affectation?.signalement?.description ?? '',
        item.compte_rendu ?? ''
      ].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  });

  ngOnInit(): void {
    this.load(1);
  }

  load(page: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.service.getAll(page).subscribe({
      next: response => {
        this.interventions.set(response.data ?? []);
        this.meta.set(response.meta);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger les interventions.');
      }
    });
  }

  openCreate(): void {
    this.createError.set(null);
    this.affectationId.set(null);
    this.dateDebut.set(this.now());
    this.service.getAffectations().subscribe({
      next: response => this.affectations.set(response.data.filter(a => a.signalement?.statut === 'affecte' || a.signalement?.statut === 'en_intervention')),
      error: () => this.createError.set('Impossible de charger les affectations disponibles.')
    });
    this.showCreate.set(true);
  }

  create(): void {
    const affectation = this.affectationId();
    const date = this.dateDebut();
    if (!affectation || !date) {
      this.createError.set('L’affectation et la date de début sont obligatoires.');
      return;
    }
    this.actionInProgress.set(true);
    this.service.create({ affectation_id: affectation, date_heure_debut: date }).subscribe({
      next: () => {
        this.actionInProgress.set(false);
        this.showCreate.set(false);
        this.successMessage.set('Intervention créée et démarrée.');
        this.load(this.meta()?.current_page ?? 1);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        this.createError.set(err.error?.message || 'Erreur lors de la création de l’intervention.');
      }
    });
  }

  closeCreate(): void {
    this.showCreate.set(false);
    this.createError.set(null);
  }

  onPageChange(page: number): void {
    const m = this.meta();
    if (m && page >= 1 && page <= m.last_page && page !== m.current_page) this.load(page);
  }

  statusLabel(status: InterventionStatut): string {
    return ({ en_cours: 'En cours', suspendue: 'Suspendue', terminee: 'Terminée' } as Record<InterventionStatut, string>)[status];
  }

  statusClass(status: InterventionStatut): string {
    return ({ en_cours: 'badge-info', suspendue: 'badge-warning', terminee: 'badge-success' } as Record<InterventionStatut, string>)[status];
  }

  private now(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
}
