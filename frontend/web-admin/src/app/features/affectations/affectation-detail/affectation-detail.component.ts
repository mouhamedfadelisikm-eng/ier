import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AffectationService } from '../../../core/services/affectation.service';
import { Affectation, EquipeSummary, ReassignAffectationPayload } from '../../../core/models/affectation.model';
import { formatStatut, getStatutBadgeClass, formatPriorite } from '../../../core/models/signalement-constants';

@Component({
  selector: 'app-affectation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './affectation-detail.component.html',
  styleUrls: ['./affectation-detail.component.css']
})
export class AffectationDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly affectationService = inject(AffectationService);

  affectation = signal<Affectation | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  actionInProgress = signal<boolean>(false);

  // Reassignment modal state
  showReassignModal = signal<boolean>(false);
  equipesList = signal<EquipeSummary[]>([]);
  reassignEquipeId = signal<number | null>(null);
  reassignDateHeure = signal<string>('');
  reassignObservation = signal<string>('');

  // Delete modal state
  showDeleteModal = signal<boolean>(false);

  readonly formatStatut = formatStatut;
  readonly getStatutBadgeClass = getStatutBadgeClass;
  readonly formatPriorite = formatPriorite;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadAffectation(Number(idParam));
    } else {
      this.errorMessage.set('Identifiant d\'affectation invalide.');
      this.isLoading.set(false);
    }
  }

  loadAffectation(id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.affectationService.getById(id).subscribe({
      next: (res) => {
        this.affectation.set(res.data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        if (err.status === 404) {
          this.errorMessage.set('Affectation introuvable.');
        } else {
          this.errorMessage.set('Erreur lors du chargement de l\'affectation.');
        }
      }
    });
  }

  openReassignModal(): void {
    const item = this.affectation();
    if (!item) return;

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.reassignEquipeId.set(null);
    this.reassignObservation.set(item.observation || '');

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    this.reassignDateHeure.set(formatted);

    this.affectationService.getEquipes().subscribe({
      next: (res) => {
        // Exclude current team from reassignable list
        const currentTeamId = item.equipe?.id;
        const otherTeams = (res.data || []).filter(e => e.id !== currentTeamId);
        this.equipesList.set(otherTeams);
        this.showReassignModal.set(true);
      }
    });
  }

  closeReassignModal(): void {
    this.showReassignModal.set(false);
  }

  confirmReassign(): void {
    const item = this.affectation();
    const newEqId = this.reassignEquipeId();
    const dt = this.reassignDateHeure();

    if (!item || !newEqId || !dt) {
      this.errorMessage.set('Veuillez sélectionner une nouvelle équipe et renseigner la date/heure.');
      return;
    }

    if (newEqId === item.equipe?.id) {
      this.errorMessage.set('La nouvelle équipe doit être différente de l\'équipe actuelle.');
      return;
    }

    this.actionInProgress.set(true);
    this.closeReassignModal();

    const payload: ReassignAffectationPayload = {
      date_heure_affectation: dt,
      equipe_id: Number(newEqId),
      observation: this.reassignObservation() || null
    };

    this.affectationService.reassign(item.id, payload).subscribe({
      next: (res) => {
        this.affectation.set(res.data);
        this.actionInProgress.set(false);
        this.successMessage.set('Affectation réaffectée avec succès à la nouvelle équipe.');
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la réaffectation.');
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
    const item = this.affectation();
    if (!item) return;

    this.actionInProgress.set(true);
    this.closeDeleteModal();
    this.errorMessage.set(null);

    this.affectationService.delete(item.id).subscribe({
      next: () => {
        this.router.navigate(['/admin/affectations']);
      },
      error: (err: HttpErrorResponse) => {
        this.actionInProgress.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la suppression.');
      }
    });
  }
}
