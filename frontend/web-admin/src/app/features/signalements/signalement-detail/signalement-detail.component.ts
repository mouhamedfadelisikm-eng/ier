import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SignalementService } from '../../../core/services/signalement.service';
import { Signalement, ZoneSummary, TypeDechetItem } from '../../../core/models/signalement.model';

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
  actionInProgress = signal<boolean>(false);

  // Edit form state
  isEditing = signal<boolean>(false);
  editDescription = signal<string>('');
  editZoneId = signal<number | null>(null);
  zonesList = signal<ZoneSummary[]>([]);
  typesDechetsList = signal<TypeDechetItem[]>([]);
  selectedTypeDechets = signal<Array<{ type_dechet_id: number; quantite_estime?: number; volume_estime?: number; dangerosite?: string; remarque?: string }>>([]);

  // Prioritize modal state
  showPrioritizeModal = signal<boolean>(false);
  selectedPriority = signal<string>('normale');

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

    this.signalementService.getById(id).subscribe({
      next: (res) => {
        const item = res.data;
        this.signalement.set(item);
        this.editDescription.set(item.description || '');
        this.editZoneId.set(item.zone?.id || null);
        this.selectedPriority.set(item.priorite || 'normale');

        if (item.type_dechets) {
          this.selectedTypeDechets.set(
            item.type_dechets.map(td => ({
              type_dechet_id: td.id,
              quantite_estime: td.pivot?.quantite_estime,
              volume_estime: td.pivot?.volume_estime,
              dangerosite: td.pivot?.dangerosite,
              remarque: td.pivot?.remarque
            }))
          );
        }

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
      this.editDescription.set(item.description || '');
      this.editZoneId.set(item.zone?.id || null);
    }
  }

  saveEdition(): void {
    const item = this.signalement();
    if (!item) return;

    this.actionInProgress.set(true);

    // CRITICAL: Ensure PUT request does NOT send statut or priorite
    const payload = {
      description: this.editDescription(),
      zone_id: this.editZoneId(),
      type_dechets: this.selectedTypeDechets()
    };

    this.signalementService.update(item.id, payload).subscribe({
      next: (res) => {
        this.signalement.set(res.data);
        this.isEditing.set(false);
        this.actionInProgress.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        alert(err.error?.message || 'Erreur lors de la mise à jour du signalement.');
      }
    });
  }

  validate(): void {
    const item = this.signalement();
    if (!item || this.actionInProgress()) return;

    this.actionInProgress.set(true);
    this.signalementService.validate(item.id).subscribe({
      next: (res) => {
        this.signalement.set(res.data);
        this.actionInProgress.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        alert(err.error?.message || 'Erreur lors de la validation.');
      }
    });
  }

  reject(): void {
    const item = this.signalement();
    if (!item || this.actionInProgress()) return;

    if (!confirm('Êtes-vous sûr de vouloir rejeter ce signalement ?')) return;

    this.actionInProgress.set(true);
    this.signalementService.reject(item.id).subscribe({
      next: (res) => {
        this.signalement.set(res.data);
        this.actionInProgress.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        alert(err.error?.message || 'Erreur lors du rejet.');
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

    this.signalementService.prioritize(item.id, priorite).subscribe({
      next: (res) => {
        this.signalement.set(res.data);
        this.actionInProgress.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        alert(err.error?.message || 'Erreur lors de la priorisation.');
      }
    });
  }

  deleteSignalement(): void {
    const item = this.signalement();
    if (!item) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce signalement ?')) return;

    this.actionInProgress.set(true);
    this.signalementService.delete(item.id).subscribe({
      next: () => {
        this.router.navigate(['/admin/signalements']);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        alert(err.error?.message || 'Erreur lors de la suppression.');
      }
    });
  }

  formatStatut(statut: string): string {
    const map: Record<string, string> = {
      'brouillon': 'Brouillon',
      'en_attente_validation': 'En attente de validation',
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
