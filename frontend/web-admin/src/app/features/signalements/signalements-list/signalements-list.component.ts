import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SignalementService } from '../../../core/services/signalement.service';
import { Signalement, PaginatedResponse } from '../../../core/models/signalement.model';

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
  actionInProgressId = signal<number | null>(null);

  // Filters (local filtering as backend search params are not exposed on current list endpoint)
  filterStatus = signal<string>('');
  filterPriority = signal<string>('');
  searchQuery = signal<string>('');

  // Prioritization Modal state
  showPrioritizeModal = signal<boolean>(false);
  selectedSignalementForPrioritize = signal<Signalement | null>(null);
  selectedPriority = signal<string>('normale');

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

    this.signalementService.getAll(page).subscribe({
      next: (response: PaginatedResponse<Signalement>) => {
        this.signalements.set(response.data || []);
        this.meta.set(response.meta);
        this.links.set(response.links);
        this.currentPage.set(page);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
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
    this.signalementService.validate(id).subscribe({
      next: (res) => {
        this.updateItemInList(res.data);
        this.actionInProgressId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgressId.set(null);
        alert(err.error?.message || 'Erreur lors de la validation du signalement.');
      }
    });
  }

  reject(id: number, event: Event): void {
    event.stopPropagation();
    if (this.actionInProgressId() !== null) return;

    if (!confirm('Êtes-vous sûr de vouloir rejeter ce signalement ?')) return;

    this.actionInProgressId.set(id);
    this.signalementService.reject(id).subscribe({
      next: (res) => {
        this.updateItemInList(res.data);
        this.actionInProgressId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgressId.set(null);
        alert(err.error?.message || 'Erreur lors du rejet du signalement.');
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

    this.signalementService.prioritize(item.id, priorite).subscribe({
      next: (res) => {
        this.updateItemInList(res.data);
        this.actionInProgressId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgressId.set(null);
        alert(err.error?.message || 'Erreur lors de la priorisation du signalement.');
      }
    });
  }

  deleteSignalement(id: number, event: Event): void {
    event.stopPropagation();
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce signalement ? Cette action est irréversible.')) return;

    this.actionInProgressId.set(id);
    this.signalementService.delete(id).subscribe({
      next: () => {
        this.signalements.update(list => list.filter(s => s.id !== id));
        this.actionInProgressId.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgressId.set(null);
        alert(err.error?.message || 'Erreur lors de la suppression du signalement.');
      }
    });
  }

  private updateItemInList(updated: Signalement): void {
    this.signalements.update(list =>
      list.map(s => s.id === updated.id ? updated : s)
    );
  }

  formatStatut(statut: string): string {
    const map: Record<string, string> = {
      'brouillon': 'Brouillon',
      'en_attente_validation': 'En attente',
      'valide': 'Validé',
      'rejete': 'Rejeté',
      'priorise': 'Priorisé',
      'affecte': 'Affecté',
      'en_intervention': 'En intervention',
      'termine': 'Terminé',
      'cloture': 'Clôturé'
    };
    return map[statut] || statut;
  }

  getStatutBadgeClass(statut: string): string {
    switch (statut) {
      case 'brouillon': return 'badge-secondary';
      case 'en_attente_validation': return 'badge-warning';
      case 'valide': return 'badge-success';
      case 'rejete': return 'badge-danger';
      case 'priorise': return 'badge-primary';
      case 'affecte': return 'badge-info';
      case 'en_intervention': return 'badge-warning';
      case 'termine': return 'badge-success';
      case 'cloture': return 'badge-dark';
      default: return 'badge-secondary';
    }
  }

  formatPriorite(priorite?: string | null): string {
    if (!priorite) return 'Non priorisé';
    const map: Record<string, string> = {
      'faible': 'Faible',
      'normale': 'Normale',
      'haute': 'Haute',
      'urgente': 'Urgente'
    };
    return map[priorite] || priorite;
  }
}
