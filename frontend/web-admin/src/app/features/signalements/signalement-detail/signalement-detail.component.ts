import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SignalementService } from '../../../core/services/signalement.service';
import { Signalement, ZoneSummary, TypeDechetItem, UpdateSignalementPayload } from '../../../core/models/signalement.model';
import { formatStatut, getStatutBadgeClass, formatPriorite, SignalementPriorite, DangerositeType } from '../../../core/models/signalement-constants';

@Component({
  selector: 'app-signalement-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signalement-detail.component.html',
  styleUrls: ['./signalement-detail.component.css']
})
export class SignalementDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly signalementService = inject(SignalementService);

  signalement = signal<Signalement | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  actionInProgress = signal<boolean>(false);

  // Edit form state
  isEditing = signal<boolean>(false);
  editDescription = signal<string | null>('');
  editZoneId = signal<number | null>(null);
  zonesList = signal<ZoneSummary[]>([]);
  typesDechetsList = signal<TypeDechetItem[]>([]);
  editableTypeDechets = signal<Array<{
    type_dechet_id: number;
    libelle?: string;
    quantite_estime?: number | null;
    volume_estime?: number | null;
    dangerosite?: DangerositeType | null;
    remarque?: string | null;
  }>>([]);

  // Initial state snapshots for dirty-checking
  private initialDescription: string | null = null;
  private initialZoneId: number | null = null;
  private initialTypeDechets: Array<{
    type_dechet_id: number;
    quantite_estime?: number | null;
    volume_estime?: number | null;
    dangerosite?: DangerositeType | null;
    remarque?: string | null;
  }> = [];

  // Prioritize modal state
  showPrioritizeModal = signal<boolean>(false);
  selectedPriority = signal<SignalementPriorite>('normale');

  // Reject modal state
  showRejectModal = signal<boolean>(false);

  // Delete modal state
  showDeleteModal = signal<boolean>(false);

  readonly formatStatut = formatStatut;
  readonly getStatutBadgeClass = getStatutBadgeClass;
  readonly formatPriorite = formatPriorite;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.loadSignalement(id);
    } else {
      this.errorMessage.set('Identifiant de signalement invalide.');
      this.isLoading.set(false);
    }
  }

  loadSignalement(id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.signalementService.getById(id).subscribe({
      next: (res) => {
        const item = res.data;
        this.signalement.set(item);
        this.editDescription.set(item.description || '');
        this.editZoneId.set(item.zone?.id || null);
        this.selectedPriority.set(item.priorite || 'normale');

        this.initialDescription = item.description || null;
        this.initialZoneId = item.zone?.id || null;

        const canonicalWastes = (item.type_dechets || []).map(td => ({
          type_dechet_id: td.id || td.type_dechet_id || 0,
          quantite_estime: td.quantite_estime !== undefined && td.quantite_estime !== null ? Number(td.quantite_estime) : (td.pivot?.quantite_estime !== null && td.pivot?.quantite_estime !== undefined ? Number(td.pivot.quantite_estime) : null),
          volume_estime: td.volume_estime !== undefined && td.volume_estime !== null ? Number(td.volume_estime) : (td.pivot?.volume_estime !== null && td.pivot?.volume_estime !== undefined ? Number(td.pivot.volume_estime) : null),
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
        if (err.status === 404) {
          this.errorMessage.set('Signalement introuvable.');
        } else {
          this.errorMessage.set('Erreur lors du chargement des détails du signalement.');
        }
      }
    });
  }

  startEditing(): void {
    if (!this.zonesList().length) {
      this.signalementService.getZones().subscribe({
        next: (res) => this.zonesList.set(res.data || [])
      });
    }
    if (!this.typesDechetsList().length) {
      this.signalementService.getTypesDechets().subscribe({
        next: (res) => this.typesDechetsList.set(res.data || [])
      });
    }
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
    const item = this.signalement();
    if (item) {
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
  }

  addWasteType(typeDechetId: number): void {
    if (!typeDechetId) return;
    const found = this.typesDechetsList().find(t => t.id === Number(typeDechetId));
    if (!found) return;

    const current = this.editableTypeDechets();
    if (current.some(item => item.type_dechet_id === found.id)) return;

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
    this.editableTypeDechets.update(list => list.filter((_, i) => i !== index));
  }

  saveEdition(): void {
    const item = this.signalement();
    if (!item) return;

    this.actionInProgress.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const currentDesc = this.editDescription();
    const currentZoneId = this.editZoneId();
    const currentWastes = this.editableTypeDechets().map(w => ({
      type_dechet_id: w.type_dechet_id,
      quantite_estime: w.quantite_estime !== null && w.quantite_estime !== undefined && w.quantite_estime !== ('' as unknown as number) ? Number(w.quantite_estime) : null,
      volume_estime: w.volume_estime !== null && w.volume_estime !== undefined && w.volume_estime !== ('' as unknown as number) ? Number(w.volume_estime) : null,
      dangerosite: w.dangerosite || null,
      remarque: w.remarque || null
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
      next: (res) => {
        const updated = res.data;
        this.signalement.set(updated);
        this.initialDescription = updated.description || null;
        this.initialZoneId = updated.zone?.id || null;
        const newWastes = (updated.type_dechets || []).map(td => ({
          type_dechet_id: td.id || td.type_dechet_id || 0,
          quantite_estime: td.quantite_estime !== undefined && td.quantite_estime !== null ? Number(td.quantite_estime) : (td.pivot?.quantite_estime !== null && td.pivot?.quantite_estime !== undefined ? Number(td.pivot.quantite_estime) : null),
          volume_estime: td.volume_estime !== undefined && td.volume_estime !== null ? Number(td.volume_estime) : (td.pivot?.volume_estime !== null && td.pivot?.volume_estime !== undefined ? Number(td.pivot.volume_estime) : null),
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
      next: (res) => {
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
      next: (res) => {
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

    const priorite = this.selectedPriority();
    this.actionInProgress.set(true);
    this.closePrioritizeModal();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.signalementService.prioritize(item.id, priorite).subscribe({
      next: (res) => {
        this.signalement.set(res.data);
        this.actionInProgress.set(false);
        this.successMessage.set(`Signalement priorisé avec succès (${priorite}).`);
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
}
