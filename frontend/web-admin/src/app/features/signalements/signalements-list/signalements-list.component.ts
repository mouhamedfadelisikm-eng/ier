import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SignalementService } from '../../../core/services/signalement.service';
import { Signalement, PaginatedResponse } from '../../../core/models/signalement.model';
import { formatStatut, formatPriorite, SignalementPriorite } from '../../../core/models/signalement-constants';
import { MapPoint } from '../../../core/models/map.model';
import { MapShellComponent } from '../../../shared/ui/map-shell/map-shell.component';

@Component({
  selector: 'app-signalements-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MapShellComponent],
  templateUrl: './signalements-list.component.html'
})
export class SignalementsListComponent implements OnInit {
  private readonly signalementService = inject(SignalementService);
  private readonly router = inject(Router);

  readonly signalements = signal<Signalement[]>([]);
  readonly meta = signal<PaginatedResponse<Signalement>['meta'] | undefined>(undefined);
  readonly links = signal<PaginatedResponse<Signalement>['links'] | undefined>(undefined);
  readonly currentPage = signal<number>(1);

  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly actionInProgressId = signal<number | null>(null);

  readonly filterStatus = signal<string>('');
  readonly filterPriority = signal<string>('');
  readonly searchQuery = signal<string>('');

  readonly showPrioritizeModal = signal<boolean>(false);
  readonly selectedSignalementForPrioritize = signal<Signalement | null>(null);
  readonly selectedPriority = signal<SignalementPriorite>('normale');

  readonly showRejectModal = signal<boolean>(false);
  readonly selectedSignalementForReject = signal<Signalement | null>(null);

  readonly showDeleteModal = signal<boolean>(false);
  readonly selectedSignalementForDelete = signal<Signalement | null>(null);

  readonly filteredSignalements = computed(() => {
    const list = this.signalements();
    const status = this.filterStatus();
    const priority = this.filterPriority();
    const q = this.searchQuery().toLowerCase().trim();

    return list.filter(item => {
      if (status && item.statut !== status) return false;
      if (priority && item.priorite !== priority) return false;

      if (q) {
        const descMatch = item.description?.toLowerCase().includes(q);
        const zoneMatch = item.zone?.nom_zone?.toLowerCase().includes(q);
        const userMatch = (item.user?.prenom + ' ' + item.user?.nom + ' ' + item.user?.email).toLowerCase().includes(q);
        const idMatch = item.id.toString().includes(q);

        if (!descMatch && !zoneMatch && !userMatch && !idMatch) return false;
      }

      return true;
    });
  });

  readonly mapPoints = computed<MapPoint[]>(() =>
    this.filteredSignalements()
      .filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
      .map(item => ({
        id: item.id,
        latitude: item.latitude,
        longitude: item.longitude,
        kind: 'signalement',
        priority: item.priorite,
        status: item.statut,
        label: item.description || 'Signalement #' + item.id
      }))
  );

  ngOnInit(): void {
    this.loadSignalements(1);
  }

  loadSignalements(page: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.signalementService.getAll(page).subscribe({
      next: (response: PaginatedResponse<Signalement>) => {
        this.signalements.set(response.data || []);
        this.meta.set(response.meta);
        this.links.set(response.links);
        this.currentPage.set(page);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger la liste des signalements depuis l’API.');
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && this.meta() && page <= (this.meta()?.last_page || 1)) {
      this.loadSignalements(page);
    }
  }

  selectPoint(point: MapPoint): void {
    this.router.navigate(['/admin/signalements', Number(point.id)]);
  }

  formatStatut(statut: string): string {
    return formatStatut(statut);
  }

  formatPriorite(priorite?: string | null): string {
    return formatPriorite(priorite);
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'en_attente_validation':
      case 'en_intervention':
        return 'border-ier-orange/25 bg-ier-orange/10 text-ier-orange';
      case 'valide':
      case 'termine':
        return 'border-ier-green/25 bg-ier-green/10 text-ier-green';
      case 'rejete':
        return 'border-ier-red/25 bg-ier-red/10 text-red-200';
      case 'priorise':
        return 'border-ier-cyan/25 bg-ier-cyan/10 text-ier-cyan';
      case 'affecte':
        return 'border-ier-violet/25 bg-ier-violet/10 text-ier-violet';
      case 'cloture':
        return 'border-ier-border bg-ier-elevated text-ier-muted';
      default:
        return 'border-ier-border bg-ier-elevated text-ier-muted';
    }
  }

  getPriorityClasses(priority?: string | null): string {
    switch (priority) {
      case 'urgente':
        return 'border-ier-red/25 bg-ier-red/10 text-red-200';
      case 'haute':
        return 'border-ier-orange/25 bg-ier-orange/10 text-ier-orange';
      case 'normale':
        return 'border-ier-cyan/25 bg-ier-cyan/10 text-ier-cyan';
      default:
        return 'border-ier-border bg-ier-elevated text-ier-muted';
    }
  }

  validate(id: number, event: Event): void {
    event.stopPropagation();
    if (this.actionInProgressId() !== null) return;

    this.actionInProgressId.set(id);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.signalementService.validate(id).subscribe({
      next: res => {
        this.updateItemInList(res.data);
        this.actionInProgressId.set(null);
        this.successMessage.set(`Signalement #${id} validé avec succès.`);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgressId.set(null);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la validation du signalement.');
      }
    });
  }

  promptReject(item: Signalement, event: Event): void {
    event.stopPropagation();
    this.selectedSignalementForReject.set(item);
    this.showRejectModal.set(true);
  }

  closeRejectModal(): void {
    this.showRejectModal.set(false);
    this.selectedSignalementForReject.set(null);
  }

  confirmReject(): void {
    const item = this.selectedSignalementForReject();
    if (!item) return;

    this.actionInProgressId.set(item.id);
    this.closeRejectModal();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.signalementService.reject(item.id).subscribe({
      next: res => {
        this.updateItemInList(res.data);
        this.actionInProgressId.set(null);
        this.successMessage.set(`Signalement #${item.id} rejeté.`);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgressId.set(null);
        this.errorMessage.set(err.error?.message || 'Erreur lors du rejet du signalement.');
      }
    });
  }

  openPrioritizeModal(item: Signalement, event: Event): void {
    event.stopPropagation();
    this.selectedSignalementForPrioritize.set(item);
    this.selectedPriority.set(item.priorite || 'normale');
    this.showPrioritizeModal.set(true);
  }

  closePrioritizeModal(): void {
    this.showPrioritizeModal.set(false);
    this.selectedSignalementForPrioritize.set(null);
  }

  confirmPrioritize(): void {
    const item = this.selectedSignalementForPrioritize();
    if (!item) return;

    const priority = this.selectedPriority();
    this.actionInProgressId.set(item.id);
    this.closePrioritizeModal();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.signalementService.prioritize(item.id, priority).subscribe({
      next: res => {
        this.updateItemInList(res.data);
        this.actionInProgressId.set(null);
        this.successMessage.set(`Signalement #${item.id} priorisé avec succès (${priority}).`);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgressId.set(null);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la priorisation du signalement.');
      }
    });
  }

  promptDeleteSignalement(item: Signalement, event: Event): void {
    event.stopPropagation();
    this.selectedSignalementForDelete.set(item);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedSignalementForDelete.set(null);
  }

  confirmDeleteSignalement(): void {
    const item = this.selectedSignalementForDelete();
    if (!item) return;

    this.actionInProgressId.set(item.id);
    this.closeDeleteModal();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.signalementService.delete(item.id).subscribe({
      next: () => {
        this.signalements.update(list => list.filter(signalement => signalement.id !== item.id));
        this.actionInProgressId.set(null);
        this.successMessage.set(`Signalement #${item.id} supprimé définitivement.`);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgressId.set(null);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la suppression du signalement.');
      }
    });
  }

  private updateItemInList(updated: Signalement): void {
    this.signalements.update(list =>
      list.map(signalement => signalement.id === updated.id ? updated : signalement)
    );
  }
}
