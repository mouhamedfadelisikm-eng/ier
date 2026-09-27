import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SignalementService } from '../../../core/services/signalement.service';
import { Signalement, ZoneSummary, TypeDechetItem, UpdateSignalementPayload } from '../../../core/models/signalement.model';
import { formatStatut, formatPriorite, SignalementPriorite, DangerositeType } from '../../../core/models/signalement-constants';
import { MapPoint } from '../../../core/models/map.model';
import { MapShellComponent } from '../../../shared/ui/map-shell/map-shell.component';

@Component({
  selector: 'app-signalement-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MapShellComponent],
  templateUrl: './signalement-detail.component.html'
})
export class SignalementDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly signalementService = inject(SignalementService);

  readonly signalement = signal<Signalement | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly actionInProgress = signal<boolean>(false);

  readonly isEditing = signal<boolean>(false);
  readonly editDescription = signal<string | null>('');
  readonly editZoneId = signal<number | null>(null);
  readonly zonesList = signal<ZoneSummary[]>([]);
  readonly typesDechetsList = signal<TypeDechetItem[]>([]);
  readonly editableTypeDechets = signal<Array<{
    type_dechet_id: number;
    libelle?: string;
    quantite_estime?: number | null;
    volume_estime?: number | null;
    dangerosite?: DangerositeType | null;
    remarque?: string | null;
  }>>([]);

  private initialDescription: string | null = null;
  private initialZoneId: number | null = null;
  private initialTypeDechets: Array<{
    type_dechet_id: number;
    quantite_estime?: number | null;
    volume_estime?: number | null;
    dangerosite?: DangerositeType | null;
    remarque?: string | null;
  }> = [];

  readonly showPrioritizeModal = signal<boolean>(false);
  readonly selectedPriority = signal<SignalementPriorite>('normale');
  readonly showRejectModal = signal<boolean>(false);
  readonly showDeleteModal = signal<boolean>(false);

  readonly mapPoint = computed<MapPoint | null>(() => {
    const item = this.signalement();

    if (!item || !Number.isFinite(item.latitude) || !Number.isFinite(item.longitude)) {
      return null;
    }

    return {
      id: item.id,
      latitude: item.latitude,
      longitude: item.longitude,
      kind: 'signalement',
      priority: item.priorite,
      status: item.statut,
      label: item.description || 'Signalement #' + item.id
    };
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.errorMessage.set('Identifiant de signalement invalide.');
      this.isLoading.set(false);
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage.set('Identifiant de signalement invalide.');
      this.isLoading.set(false);
      return;
    }

    this.loadSignalement(id);
  }

  loadSignalement(id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.signalementService.getById(id).subscribe({
      next: res => {
        const item = res.data;

        this.signalement.set(item);
        this.editDescription.set(item.description || '');
        this.editZoneId.set(item.zone?.id || null);
        this.selectedPriority.set(item.priorite || 'normale');

        this.initialDescription = item.description || null;
        this.initialZoneId = item.zone?.id || null;

        const canonicalWastes = (item.type_dechets || []).map(td => ({
          type_dechet_id: td.id || td.type_dechet_id || 0,
          quantite_estime: td.quantite_estime !== undefined && td.quantite_estime !== null
            ? Number(td.quantite_estime)
            : (td.pivot?.quantite_estime !== null && td.pivot?.quantite_estime !== undefined ? Number(td.pivot.quantite_estime) : null),
          volume_estime: td.volume_estime !== undefined && td.volume_estime !== null
            ? Number(td.volume_estime)
            : (td.pivot?.volume_estime !== null && td.pivot?.volume_estime !== undefined ? Number(td.pivot.volume_estime) : null),
          dangerosite: td.dangerosite !== undefined ? (td.dangerosite || null) : ((td.pivot?.dangerosite as DangerositeType) || null),
          remarque: td.remarque !== undefined ? (td.remarque || null) : (td.pivot?.remarque || null)
        }));

        this.initialTypeDechets = JSON.parse(JSON.stringify(canonicalWastes));
        this.editableTypeDechets.set((item.type_dechets || []).map(td => ({
          type_dechet_id: td.id || td.type_dechet_id || 0,
          libelle: td.libelle,
          quantite_estime: td.quantite_estime !== undefined ? td.quantite_estime : td.pivot?.quantite_estime ?? null,
          volume_estime: td.volume_estime !== undefined ? td.volume_estime : td.pivot?.volume_estime ?? null,
          dangerosite: td.dangerosite !== undefined ? td.dangerosite : (td.pivot?.dangerosite as DangerositeType) ?? null,
          remarque: td.remarque !== undefined ? td.remarque : td.pivot?.remarque ?? null
        })));

        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.status === 404
            ? 'Signalement introuvable.'
            : 'Erreur lors du chargement des détails du signalement.'
        );
      }
    });
  }

  startEditing(): void {
    if (!this.zonesList().length) {
      this.signalementService.getZones().subscribe({
        next: res => this.zonesList.set(res.data || [])
      });
    }

    if (!this.typesDechetsList().length) {
      this.signalementService.getTypesDechets().subscribe({
        next: res => this.typesDechetsList.set(res.data || [])
      });
    }

    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);

    const item = this.signalement();

    if (!item) return;

    this.editDescription.set(this.initialDescription);
    this.editZoneId.set(this.initialZoneId);

    const loadedWastes = (item.type_dechets || []).map(td => ({
      type_dechet_id: td.id || td.type_dechet_id || 0,
      libelle: td.libelle,
      quantite_estime: td.quantite_estime !== undefined ? td.quantite_estime : td.pivot?.quantite_estime ?? null,
      volume_estime: td.volume_estime !== undefined ? td.volume_estime : td.pivot?.volume_estime ?? null,
      dangerosite: td.dangerosite !== undefined ? td.dangerosite : (td.pivot?.dangerosite as DangerositeType) ?? null,
      remarque: td.remarque !== undefined ? td.remarque : td.pivot?.remarque ?? null
    }));

    this.editableTypeDechets.set(JSON.parse(JSON.stringify(loadedWastes)));
  }

  addWasteType(typeDechetId: number): void {
    if (!typeDechetId) return;

    const found = this.typesDechetsList().find(type => type.id === Number(typeDechetId));

    if (!found || this.editableTypeDechets().some(item => item.type_dechet_id === found.id)) {
      return;
    }

    this.editableTypeDechets.update(list => [
      ...list,
      {
        type_dechet_id: found.id,
        libelle: found.libelle,
        quantite_estime: null,
        volume_estime: null,
        dangerosite: null,
        remarque: ''
      }
    ]);
  }

  removeWasteType(index: number): void {
    this.editableTypeDechets.update(list => list.filter((_, currentIndex) => currentIndex !== index));
  }

  saveEdition(): void {
    const item = this.signalement();

    if (!item) return;

    this.actionInProgress.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const currentDesc = this.editDescription();
    const currentZoneId = this.editZoneId();
    const currentWastes = this.editableTypeDechets().map(waste => ({
      type_dechet_id: waste.type_dechet_id,
      quantite_estime: waste.quantite_estime !== null && waste.quantite_estime !== undefined && waste.quantite_estime !== ('' as unknown as number)
        ? Number(waste.quantite_estime)
        : null,
      volume_estime: waste.volume_estime !== null && waste.volume_estime !== undefined && waste.volume_estime !== ('' as unknown as number)
        ? Number(waste.volume_estime)
        : null,
      dangerosite: waste.dangerosite || null,
      remarque: waste.remarque || null
    }));

    const descChanged = currentDesc !== this.initialDescription;
    const zoneChanged = currentZoneId !== this.initialZoneId;
    const wastesChanged = JSON.stringify(currentWastes) !== JSON.stringify(this.initialTypeDechets);

    if (!descChanged && !zoneChanged && !wastesChanged) {
      this.successMessage.set('Aucune modification détectée.');
      this.isEditing.set(false);
      this.actionInProgress.set(false);
      return;
    }

    const payload: UpdateSignalementPayload = {};

    if (descChanged) payload.description = currentDesc;
    if (zoneChanged) payload.zone_id = currentZoneId;
    if (wastesChanged) payload.type_dechets = currentWastes;

    this.signalementService.update(item.id, payload).subscribe({
      next: res => {
        const updated = res.data;

        this.signalement.set(updated);
        this.initialDescription = updated.description || null;
        this.initialZoneId = updated.zone?.id || null;

        const newWastes = (updated.type_dechets || []).map(td => ({
          type_dechet_id: td.id || td.type_dechet_id || 0,
          quantite_estime: td.quantite_estime !== undefined && td.quantite_estime !== null
            ? Number(td.quantite_estime)
            : (td.pivot?.quantite_estime !== null && td.pivot?.quantite_estime !== undefined ? Number(td.pivot.quantite_estime) : null),
          volume_estime: td.volume_estime !== undefined && td.volume_estime !== null
            ? Number(td.volume_estime)
            : (td.pivot?.volume_estime !== null && td.pivot?.volume_estime !== undefined ? Number(td.pivot.volume_estime) : null),
          dangerosite: td.dangerosite !== undefined ? (td.dangerosite || null) : ((td.pivot?.dangerosite as DangerositeType) || null),
          remarque: td.remarque !== undefined ? (td.remarque || null) : (td.pivot?.remarque || null)
        }));

        this.initialTypeDechets = JSON.parse(JSON.stringify(newWastes));
        this.editableTypeDechets.set((updated.type_dechets || []).map(td => ({
          type_dechet_id: td.id || td.type_dechet_id || 0,
          libelle: td.libelle,
          quantite_estime: td.quantite_estime !== undefined ? td.quantite_estime : td.pivot?.quantite_estime ?? null,
          volume_estime: td.volume_estime !== undefined ? td.volume_estime : td.pivot?.volume_estime ?? null,
          dangerosite: td.dangerosite !== undefined ? td.dangerosite : (td.pivot?.dangerosite as DangerositeType) ?? null,
          remarque: td.remarque !== undefined ? td.remarque : td.pivot?.remarque ?? null
        })));

        this.isEditing.set(false);
        this.actionInProgress.set(false);
        this.successMessage.set('Signalement mis à jour avec succès.');
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la mise à jour du signalement.');
      }
    });
  }

  validate(): void {
    const item = this.signalement();

    if (!item || this.actionInProgress()) return;

    this.actionInProgress.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.signalementService.validate(item.id).subscribe({
      next: res => {
        this.signalement.set(res.data);
        this.actionInProgress.set(false);
        this.successMessage.set('Signalement validé avec succès.');
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la validation.');
      }
    });
  }

  promptReject(): void {
    this.showRejectModal.set(true);
  }

  closeRejectModal(): void {
    this.showRejectModal.set(false);
  }

  confirmReject(): void {
    const item = this.signalement();

    if (!item) return;

    this.actionInProgress.set(true);
    this.closeRejectModal();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.signalementService.reject(item.id).subscribe({
      next: res => {
        this.signalement.set(res.data);
        this.actionInProgress.set(false);
        this.successMessage.set('Signalement rejeté.');
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors du rejet.');
      }
    });
  }

  openPrioritizeModal(): void {
    this.showPrioritizeModal.set(true);
  }

  closePrioritizeModal(): void {
    this.showPrioritizeModal.set(false);
  }

  confirmPrioritize(): void {
    const item = this.signalement();

    if (!item) return;

    const priority = this.selectedPriority();
    this.actionInProgress.set(true);
    this.closePrioritizeModal();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.signalementService.prioritize(item.id, priority).subscribe({
      next: res => {
        this.signalement.set(res.data);
        this.actionInProgress.set(false);
        this.successMessage.set(`Signalement priorisé avec succès (${priority}).`);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la priorisation.');
      }
    });
  }

  promptDelete(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  confirmDelete(): void {
    const item = this.signalement();

    if (!item) return;

    this.actionInProgress.set(true);
    this.closeDeleteModal();
    this.errorMessage.set(null);

    this.signalementService.delete(item.id).subscribe({
      next: () => {
        this.router.navigate(['/admin/signalements']);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la suppression.');
      }
    });
  }

  setEditZoneId(value: number | string | null): void {
    this.editZoneId.set(value === null || value === '' ? null : Number(value));
  }

  formatStatut(status: string): string {
    return formatStatut(status);
  }

  formatPriorite(priority?: string | null): string {
    return formatPriorite(priority);
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
}
