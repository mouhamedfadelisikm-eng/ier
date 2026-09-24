import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { InterventionService } from '../../../core/services/intervention.service';
import { Intervention, InterventionStatut } from '../../../core/models/intervention.model';

@Component({
  selector: 'app-intervention-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './intervention-detail.component.html',
  styleUrls: ['./intervention-detail.component.css']
})
export class InterventionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(InterventionService);

  intervention = signal<Intervention | null>(null);
  isLoading = signal(true);
  isSaving = signal(false);
  isClosing = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  statut = signal<InterventionStatut>('en_cours');
  dateFin = signal('');
  compteRendu = signal('');
  observation = signal('');
  files = signal<File[]>([]);
  showDelete = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      this.errorMessage.set('Identifiant d’intervention invalide.');
      this.isLoading.set(false);
      return;
    }
    this.load(id);
  }

  load(id = this.id()): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.service.getById(id).subscribe({
      next: response => {
        const item=response.data;
        this.intervention.set(item);
        this.statut.set(item.statut);
        this.dateFin.set(item.date_heure_fin ? this.toInputDate(item.date_heure_fin) : '');
        this.compteRendu.set(item.compte_rendu ?? '');
        this.observation.set(item.observation ?? '');
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.status === 404 ? 'Intervention introuvable.' : 'Impossible de charger l’intervention.');
      }
    });
  }

  save(): void {
    const item=this.intervention();
    if (!item) return;
    this.isSaving.set(true);
    this.errorMessage.set(null);
    const payload: any = {
      statut: this.statut(),
      date_heure_fin: this.dateFin() ? this.toBackendDate(this.dateFin()) : undefined,
      compte_rendu: this.compteRendu() || null,
      observation: this.observation() || null,
      photos: this.files()
    };
    this.service.update(item.id, payload).subscribe({
      next: response => {
        this.intervention.set(response.data);
        this.isSaving.set(false);
        this.files.set([]);
        this.successMessage.set('Intervention mise à jour.');
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMessage.set(this.validationMessage(err));
      }
    });
  }

  closeIntervention(): void {
    const item=this.intervention();
    if (!item) return;
    this.isClosing.set(true);
    this.errorMessage.set(null);
    this.service.cloturer(item.id).subscribe({
      next: response => {
        this.intervention.set(response.data);
        this.isClosing.set(false);
        this.successMessage.set('Intervention clôturée et signalement clôturé.');
      },
      error: (err: HttpErrorResponse) => {
        this.isClosing.set(false);
        this.errorMessage.set(err.error?.message || 'La clôture de l’intervention a échoué.');
      }
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.files.set(input.files ? Array.from(input.files) : []);
  }

  promptDelete(): void { this.showDelete.set(true); }
  cancelDelete(): void { this.showDelete.set(false); }

  confirmDelete(): void {
    const item=this.intervention();
    if (!item) return;
    this.service.delete(item.id).subscribe({
      next: () => this.router.navigate(['/admin/interventions']),
      error: (err: HttpErrorResponse) => this.errorMessage.set(err.error?.message || 'Suppression impossible.')
    });
  }

  get id(): () => number {
    return () => Number(this.route.snapshot.paramMap.get('id'));
  }

  statusLabel(status: InterventionStatut): string {
    return ({ en_cours: 'En cours', suspendue: 'Suspendue', terminee: 'Terminée' } as Record<InterventionStatut,string>)[status];
  }

  statusClass(status: InterventionStatut): string {
    return ({ en_cours: 'badge-info', suspendue: 'badge-warning', terminee: 'badge-success' } as Record<InterventionStatut,string>)[status];
  }

  private now(): string {
    const d=new Date(); const pad=(n:number)=>String(n).padStart(2,'0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  private toInputDate(value:string): string {
    const d=new Date(value.replace(' ','T'));
    return Number.isNaN(d.getTime()) ? value : `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
  private toBackendDate(value:string): string {
    return value.length===16 ? value.replace('T',' ')+':00' : value.replace('T',' ');
  }
  private validationMessage(err:HttpErrorResponse):string {
    const errors=err.error?.errors as Record<string,string[]>|undefined;
    if(errors) return Object.values(errors).flat().join(' ');
    return err.error?.message || 'La mise à jour a échoué.';
  }
}
