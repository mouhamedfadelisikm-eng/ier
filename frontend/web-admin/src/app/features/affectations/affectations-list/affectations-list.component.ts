import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AffectationService } from '../../../core/services/affectation.service';
import { Affectation, PaginatedResponse, EquipeSummary } from '../../../core/models/affectation.model';
import { Signalement } from '../../../core/models/signalement.model';
import { formatStatut, getStatutBadgeClass, formatPriorite } from '../../../core/models/signalement-constants';

@Component({
  selector: 'app-affectations-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './affectations-list.component.html',
  styleUrls: ['./affectations-list.component.css']
})
export class AffectationsListComponent implements OnInit {
  private readonly affectationService = inject(AffectationService);
  private readonly router = inject(Router);

  affectations = signal<Affectation[]>([]);
  meta = signal<PaginatedResponse<Affectation>['meta'] | undefined>(undefined);
  links = signal<PaginatedResponse<Affectation>['links'] | undefined>(undefined);
  currentPage = signal<number>(1);

  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  actionInProgress = signal<boolean>(false);

  // Filters
  filterStatus = signal<string>('');
  filterTeam = signal<string>('');
  searchQuery = signal<string>('');

  // Creation Modal state
  showCreateModal = signal<boolean>(false);
  equipesList = signal<EquipeSummary[]>([]);
  eligibleSignalements = signal<Signalement[]>([]);
  newSignalementId = signal<number | null>(null);
  newEquipeId = signal<number | null>(null);
  newDateHeure = signal<string>('');
  newObservation = signal<string>('');

  // Delete Modal state
  showDeleteModal = signal<boolean>(false);
  selectedAffectationForDelete = signal<Affectation | null>(null);

  readonly formatStatut = formatStatut;
  readonly getStatutBadgeClass = getStatutBadgeClass;
  readonly formatPriorite = formatPriorite;

  filteredAffectations = computed(() => {
    const list = this.affectations();
    const status = this.filterStatus();
    const team = this.filterTeam();
    const q = this.searchQuery().toLowerCase().trim();

    return list.filter(item => {
      if (status && item.signalement?.statut !== status) return false;
      if (team && item.equipe?.id.toString() !== team) return false;
      if (q) {
        const teamMatch = item.equipe?.nom_equipe?.toLowerCase().includes(q);
        const sigDescMatch = item.signalement?.description?.toLowerCase().includes(q);
        const zoneMatch = item.signalement?.zone?.nom_zone?.toLowerCase().includes(q);
        const obsMatch = item.observation?.toLowerCase().includes(q);
        const idMatch = item.id.toString().includes(q);
        const sigIdMatch = item.signalement?.id.toString().includes(q);
        if (!teamMatch && !sigDescMatch && !zoneMatch && !obsMatch && !idMatch && !sigIdMatch) return false;
      }
      return true;
    });
  });

  ngOnInit(): void {
    this.loadAffectations(1);
  }

  loadAffectations(page: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.affectationService.getAll(page).subscribe({
      next: (response: PaginatedResponse<Affectation>) => {
        this.affectations.set(response.data || []);
        this.meta.set(response.meta);
        this.links.set(response.links);
        this.currentPage.set(page);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger la liste des affectations depuis l\'API.');
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && this.meta() && page <= (this.meta()?.last_page || 1)) {
      this.loadAffectations(page);
    }
  }

  openCreateModal(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.newSignalementId.set(null);
    this.newEquipeId.set(null);
    this.newObservation.set('');

    // Default current datetime formatted as Y-m-d H:i:s
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    this.newDateHeure.set(formatted);

    // Fetch equipes and signalements (filter signalements to those with statut === 'priorise' for first affectation)
    this.affectationService.getEquipes().subscribe({
      next: (res) => this.equipesList.set(res.data || [])
    });

    this.affectationService.getSignalements().subscribe({
      next: (res) => {
        // RG16: Seuls les signalements validés et priorisés (statut == 'priorise') peuvent être affectés
        const priors = (res.data || []).filter(s => s.statut === 'priorise');
        this.eligibleSignalements.set(priors);
      }
    });

    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  confirmCreate(): void {
    const sigId = this.newSignalementId();
    const eqId = this.newEquipeId();
    const dt = this.newDateHeure();

    if (!sigId || !eqId || !dt) {
      alert('Veuillez remplir tous les champs obligatoires (Signalement, Équipe, Date/Heure).');
      return;
    }

    this.actionInProgress.set(true);
    this.closeCreateModal();

    this.affectationService.create({
      date_heure_affectation: dt,
      equipe_id: Number(eqId),
      signalement_id: Number(sigId),
      observation: this.newObservation() || null
    }).subscribe({
      next: () => {
        this.actionInProgress.set(false);
        this.successMessage.set('Affectation créée avec succès.');
        this.loadAffectations(this.currentPage());
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la création de l\'affectation.');
      }
    });
  }

  promptDelete(item: Affectation, event: Event): void {
    event.stopPropagation();
    this.selectedAffectationForDelete.set(item);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedAffectationForDelete.set(null);
  }

  confirmDelete(): void {
    const item = this.selectedAffectationForDelete();
    if (!item) return;

    this.actionInProgress.set(true);
    this.closeDeleteModal();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.affectationService.delete(item.id).subscribe({
      next: () => {
        this.affectations.update(list => list.filter(a => a.id !== item.id));
        this.actionInProgress.set(false);
        this.successMessage.set(`Affectation #${item.id} supprimée.`);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la suppression de l\'affectation.');
      }
    });
  }
}
