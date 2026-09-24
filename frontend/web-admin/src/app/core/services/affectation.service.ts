import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Affectation, PaginatedResponse, CreateAffectationPayload, ReassignAffectationPayload, EquipeSummary } from '../models/affectation.model';
import { Signalement } from '../models/signalement.model';

@Injectable({
  providedIn: 'root'
})
export class AffectationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAll(page = 1): Observable<PaginatedResponse<Affectation>> {
    return this.http.get<PaginatedResponse<Affectation>>(`${this.baseUrl}/affectations?page=${page}`);
  }

  getById(id: number): Observable<{ data: Affectation }> {
    return this.http.get<{ data: Affectation }>(`${this.baseUrl}/affectations/${id}`);
  }

  create(payload: CreateAffectationPayload): Observable<{ data: Affectation }> {
    return this.http.post<{ data: Affectation }>(`${this.baseUrl}/affectations`, payload);
  }

  reassign(id: number, payload: ReassignAffectationPayload): Observable<{ data: Affectation }> {
    return this.http.post<{ data: Affectation }>(`${this.baseUrl}/affectations/${id}/reaffecter`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/affectations/${id}`);
  }

  getEquipes(): Observable<PaginatedResponse<EquipeSummary>> {
    return this.http.get<PaginatedResponse<EquipeSummary>>(`${this.baseUrl}/equipes`);
  }

  getSignalements(): Observable<PaginatedResponse<Signalement>> {
    return this.http.get<PaginatedResponse<Signalement>>(`${this.baseUrl}/signalements`);
  }
}
