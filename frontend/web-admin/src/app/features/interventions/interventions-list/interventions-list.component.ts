import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { InterventionService } from '../../../core/services/intervention.service';
import { Affectation } from '../../../core/models/affectation.model';
import { Intervention, InterventionStatut, InterventionPage } from '../../../core/models/intervention.model';
import { MapPoint } from '../../../core/models/map.model';
import { MapShellComponent } from '../../../shared/ui/map-shell/map-shell.component';

@Component({
  selector: 'app-interventions-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MapShellComponent],
  templateUrl: './interventions-list.component.html'
})
export class InterventionsListComponent implements OnInit {
  private readonly service = inject(InterventionService);
  private readonly router = inject(Router);

  readonly interventions = signal<Intervention[]>([]);
  readonly affectations = signal<Affectation[]>([]);
  readonly meta = signal<InterventionPage['meta']>(undefined);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly statusFilter = signal('');
  readonly search = signal('');
  readonly showCreate = signal(false);
  readonly actionInProgress = signal(false);
  readonly affectationId = signal<number | null>(null);
  readonly dateDebut = signal('');
  readonly createError = signal<string | null>(null);

  readonly statuses: InterventionStatut[] = ['en_cours', 'suspendue', 'terminee'];

  readonly filtered = computed(() => {
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

  readonly mapPoints = computed<MapPoint[]>(() =>
    this.filtered()
      .filter(item =>
        Number.isFinite(item.affectation?.signalement?.latitude) &&
        Number.isFinite(item.affectation?.signalement?.longitude)
      )
      .map(item => ({
        id: item.id,
        latitude: item.affectation!.signalement!.latitude,
        longitude: item.affectation!.signalement!.longitude,
        kind: 'intervention',
        status: item.statut,
        priority: item.affectation?.signalement?.priorite,
        label: item.affectation?.signalement?.description || `Intervention #${item.id}`
      }))
  );

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
      next: response => {
        this.affectations.set(
          response.data.filter(a =>
            a.signalement?.statut === 'affecte' ||
            a.signalement?.statut === 'en_intervention'
          )
        );
      },
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
    this.createError.set(null);

    this.service.create({
      affectation_id: affectation,
      date_heure_debut: this.toBackendDate(date)
    }).subscribe({
      next: () => {
        this.actionInProgress.set(false);
        this.showCreate.set(false);
        this.successMessage.set('Intervention créée et démarrée.');
        this.load(this.meta()?.current_page ?? 1);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        this.createError.set(
          err.error?.message || 'Erreur lors de la création de l’intervention.'
        );
      }
    });
  }

  closeCreate(): void {
    this.showCreate.set(false);
    this.createError.set(null);
  }

  onPageChange(page: number): void {
    const m = this.meta();

    if (m && page >= 1 && page <= m.last_page && page !== m.current_page) {
      this.load(page);
    }
  }

  openDetail(point: MapPoint): void {
    this.router.navigate(['/admin/interventions', point.id]);
  }

  statusLabel(status: InterventionStatut): string {
    return ({
      en_cours: 'En cours',
      suspendue: 'Suspendue',
      terminee: 'Terminée'
    } as Record<InterventionStatut, string>)[status];
  }

  statusClass(status: InterventionStatut): string {
    switch (status) {
      case 'en_cours':
        return 'border-ier-cyan/25 bg-ier-cyan/10 text-ier-cyan';
      case 'suspendue':
        return 'border-ier-orange/25 bg-ier-orange/10 text-ier-orange';
      case 'terminee':
        return 'border-ier-green/25 bg-ier-green/10 text-ier-green';
    }
  }

  private now(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  private toBackendDate(value: string): string {
    return value.length === 16 ? value.replace('T', ' ') + ':00' : value.replace('T', ' ');
  }
}
