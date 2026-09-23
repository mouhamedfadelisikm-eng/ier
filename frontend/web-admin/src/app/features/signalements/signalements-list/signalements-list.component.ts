import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SignalementService } from '../../../core/services/signalement.service';
import { Signalement, PaginatedResponse } from '../../../core/models/signalement.model';
import { formatStatut, getStatutBadgeClass, formatPriorite, SignalementPriorite } from '../../../core/models/signalement-constants';

@Component({
  selector: 'app-signalements-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signalements-list.component.html',
  styleUrls: ['./signalements-list.component.css']
})
export class SignalementsListComponent implements OnInit {
  private readonly signalementService = inject(SignalementService);
  private readonly router = inject(Router);

  signalements = signal<Signalement[]>([]);
  meta = signal<PaginatedResponse<Signalement>['meta'] | undefined>(undefined);
  links = signal<PaginatedResponse<Signalement>['links'] | undefined>(undefined);
  currentPage = signal<number>(1);

  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  actionInProgressId = signal<number | null>(null);

  // Filters (local filtering as backend search params are not exposed on current list endpoint)
  filterStatus = signal<string>('');
  filterPriority = signal<string>('');
  searchQuery = signal<string>('');

  // Prioritization Modal state
  showPrioritizeModal = signal<boolean>(false);
  selectedSignalementForPrioritize = signal<Signalement | null>(null);
  selectedPriority = signal<SignalementPriorite>('normale');

  // Reject Modal state
  showRejectModal = signal<boolean>(false);
  selectedSignalementForReject = signal<Signalement | null>(null);

  // Deletion Confirmation Modal state
  showDeleteModal = signal<boolean>(false);
  selectedSignalementForDelete = signal<Signalement | null>(null);

  readonly formatStatut = formatStatut;
  readonly getStatutBadgeClass = getStatutBadgeClass;
  readonly formatPriorite = formatPriorite;

  filteredSignalements = computed(() => {
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
        const userMatch = (item.user?.prenom + ' ' + item.user?.nom + ' ' + item.user?.email)?.toLowerCase().includes(q);
        const idMatch = item.id.toString().includes(q);
        if (!descMatch && !zoneMatch && !userMatch && !idMatch) return false;
      }
      return true;
    });
  });

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
        this.errorMessage.set('Impossible de charger la liste des signalements depuis l\'API.');
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && this.meta() && page <= (this.meta()?.last_page || 1)) {
      this.loadSignalements(page);
    }
  }

  validate(id: number, event: Event): void {
    event.stopPropagation();
    if (this.actionInProgressId() !== null) return;

    this.actionInProgressId.set(id);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.signalementService.validate(id).subscribe({
      next: (res) => {
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
      next: (res) => {
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

    const priorite = this.selectedPriority();
    this.actionInProgressId.set(item.id);
    this.closePrioritizeModal();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.signalementService.prioritize(item.id, priorite).subscribe({
      next: (res) => {
        this.updateItemInList(res.data);
        this.actionInProgressId.set(null);
        this.successMessage.set(`Signalement #${item.id} priorisé avec succès (${priorite}).`);
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
        this.signalements.update(list => list.filter(s => s.id !== item.id));
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
      list.map(s => s.id === updated.id ? updated : s)
    );
  }
}
