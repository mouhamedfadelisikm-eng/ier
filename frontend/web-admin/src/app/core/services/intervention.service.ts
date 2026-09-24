import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateInterventionPayload,
  Intervention,
  InterventionPage,
  UpdateInterventionPayload
} from '../models/intervention.model';
import { Affectation, PaginatedResponse } from '../models/affectation.model';

@Injectable({ providedIn: 'root' })
export class InterventionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAll(page = 1): Observable<InterventionPage> {
    return this.http.get<InterventionPage>(`${this.baseUrl}/interventions?page=${page}`);
  }

  getById(id: number): Observable<{ data: Intervention }> {
    return this.http.get<{ data: Intervention }>(`${this.baseUrl}/interventions/${id}`);
  }

  create(payload: CreateInterventionPayload): Observable<{ data: Intervention }> {
    return this.http.post<{ data: Intervention }>(`${this.baseUrl}/interventions`, payload);
  }

  update(id: number, payload: UpdateInterventionPayload): Observable<{ data: Intervention }> {
    if (payload.photos?.length) {
      const form = new FormData();
      form.append('_method', 'PUT');
      if (payload.date_heure_fin) form.append('date_heure_fin', payload.date_heure_fin);
      if (payload.statut) form.append('statut', payload.statut);
      if (payload.compte_rendu !== undefined && payload.compte_rendu !== null) form.append('compte_rendu', payload.compte_rendu);
      if (payload.observation !== undefined && payload.observation !== null) form.append('observation', payload.observation);
      payload.photos.forEach(photo => form.append('photos[]', photo));
      return this.http.post<{ data: Intervention }>(`${this.baseUrl}/interventions/${id}`, form);
    }

    return this.http.put<{ data: Intervention }>(`${this.baseUrl}/interventions/${id}`, payload);
  }

  cloturer(id: number): Observable<{ data: Intervention }> {
    return this.http.post<{ data: Intervention }>(`${this.baseUrl}/interventions/${id}/cloturer`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/interventions/${id}`);
  }

  getAffectations(): Observable<PaginatedResponse<Affectation>> {
    return this.http.get<PaginatedResponse<Affectation>>(`${this.baseUrl}/affectations`);
  }
}
