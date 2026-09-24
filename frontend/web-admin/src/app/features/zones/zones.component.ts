import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ReferenceService } from '../../core/services/reference.service';
import { ZoneAdmin, ReferencePage } from '../../core/models/reference.model';

@Component({
  selector: 'app-zones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})
export class ZonesComponent implements OnInit {
  private readonly service = inject(ReferenceService);

  zones = signal<ZoneAdmin[]>([]);
  meta = signal<ReferencePage<ZoneAdmin>['meta']>(undefined);
  search = signal('');
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showForm = signal(false);
  showDelete = signal(false);
  editing = signal<ZoneAdmin | null>(null);
  selected = signal<ZoneAdmin | null>(null);
  name = signal('');
  description = signal('');
  action = signal(false);
  formError = signal<string | null>(null);

  filtered = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.zones().filter(zone =>
      !query || [zone.nom_zone, zone.description || ''].join(' ').toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.load(1);
  }

  load(page: number): void {
    this.isLoading.set(true);
    this.service.getZones(page).subscribe({
      next: response => {
        this.zones.set(response.data || []);
        this.meta.set(response.meta);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger les zones.');
      }
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.name.set('');
    this.description.set('');
    this.formError.set(null);
    this.showForm.set(true);
  }

  openEdit(zone: ZoneAdmin): void {
    this.editing.set(zone);
    this.name.set(zone.nom_zone);
    this.description.set(zone.description || '');
    this.formError.set(null);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  save(): void {
    if (!this.name().trim()) {
      this.formError.set('Le nom de zone est obligatoire.');
      return;
    }

    this.action.set(true);
    const payload = {
      nom_zone: this.name().trim(),
      description: this.description() || null
    };

    const request = this.editing()
      ? this.service.updateZone(this.editing()!.id, payload)
      : this.service.createZone(payload);

    request.subscribe({
      next: () => {
        const isEdit = !!this.editing();
        this.action.set(false);
        this.showForm.set(false);
        this.successMessage.set(isEdit ? 'Zone mise à jour.' : 'Zone créée.');
        this.load(this.meta()?.current_page || 1);
      },
      error: (error: HttpErrorResponse) => {
        this.action.set(false);
        this.formError.set(error.error?.message || 'Opération impossible.');
      }
    });
  }

  confirmDelete(zone: ZoneAdmin): void {
    this.selected.set(zone);
    this.showDelete.set(true);
  }

  cancelDelete(): void {
    this.showDelete.set(false);
    this.selected.set(null);
  }

  delete(): void {
    const zone = this.selected();
    if (!zone) return;

    this.service.deleteZone(zone.id).subscribe({
      next: () => {
        this.showDelete.set(false);
        this.selected.set(null);
        this.successMessage.set('Zone supprimée.');
        this.load(1);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message || 'Suppression impossible.');
      }
    });
  }
}
