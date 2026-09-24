import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ReferenceService } from '../../core/services/reference.service';
import { TypeDechetAdmin } from '../../core/models/reference.model';

@Component({
  selector: 'app-types-dechets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './types-dechets.component.html',
  styleUrls: ['./types-dechets.component.css']
})
export class TypesDechetsComponent implements OnInit {
  private readonly service = inject(ReferenceService);

  types = signal<TypeDechetAdmin[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  search = signal('');
  showForm = signal(false);
  showDelete = signal(false);
  editing = signal<TypeDechetAdmin | null>(null);
  selected = signal<TypeDechetAdmin | null>(null);
  libelle = signal('');
  description = signal('');
  action = signal(false);
  formError = signal<string | null>(null);

  filtered = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.types().filter(type =>
      !query || [type.libelle, type.description || ''].join(' ').toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.service.getTypes().subscribe({
      next: response => {
        this.types.set(response.data || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Impossible de charger les types de déchets.');
      }
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.libelle.set('');
    this.description.set('');
    this.formError.set(null);
    this.showForm.set(true);
  }

  openEdit(type: TypeDechetAdmin): void {
    this.editing.set(type);
    this.libelle.set(type.libelle);
    this.description.set(type.description || '');
    this.formError.set(null);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  save(): void {
    if (!this.libelle().trim()) {
      this.formError.set('Le libellé est obligatoire.');
      return;
    }

    this.action.set(true);
    const payload = {
      libelle: this.libelle().trim(),
      description: this.description() || null
    };

    const request = this.editing()
      ? this.service.updateType(this.editing()!.id, payload)
      : this.service.createType(payload);

    request.subscribe({
      next: () => {
        const isEdit = !!this.editing();
        this.action.set(false);
        this.showForm.set(false);
        this.successMessage.set(isEdit ? 'Type mis à jour.' : 'Type créé.');
        this.load();
      },
      error: (error: HttpErrorResponse) => {
        this.action.set(false);
        this.formError.set(error.error?.message || 'Opération impossible.');
      }
    });
  }

  confirmDelete(type: TypeDechetAdmin): void {
    this.selected.set(type);
    this.showDelete.set(true);
  }

  cancelDelete(): void {
    this.showDelete.set(false);
    this.selected.set(null);
  }

  delete(): void {
    const type = this.selected();
    if (!type) return;

    this.service.deleteType(type.id).subscribe({
      next: () => {
        this.showDelete.set(false);
        this.selected.set(null);
        this.successMessage.set('Type supprimé.');
        this.load();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message || 'Suppression impossible.');
      }
    });
  }
}
