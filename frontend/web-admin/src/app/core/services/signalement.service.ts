import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Signalement, PaginatedResponse, ZoneSummary, TypeDechetItem, UpdateSignalementPayload } from '../models/signalement.model';
import { SignalementPriorite } from '../models/signalement-constants';

@Injectable({
  providedIn: 'root'
})
export class SignalementService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Récupère la liste paginée des signalements (15 par page)
   */
  getAll(page = 1): Observable<PaginatedResponse<Signalement>> {
    return this.http.get<PaginatedResponse<Signalement>>(`${this.baseUrl}/signalements?page=${page}`);
  }

  /**
   * Récupère un signalement par son ID avec ses relations
   */
  getById(id: number): Observable<{ data: Signalement }> {
    return this.http.get<{ data: Signalement }>(`${this.baseUrl}/signalements/${id}`);
  }

  /**
   * Met à jour un signalement (description, zone_id, type_dechets).
   * Règle backend stricte : n'envoie jamais statut ni priorite.
   */
  update(id: number, payload: UpdateSignalementPayload): Observable<{ data: Signalement }> {
    return this.http.put<{ data: Signalement }>(`${this.baseUrl}/signalements/${id}`, payload);
  }

  /**
   * Supprime un signalement
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/signalements/${id}`);
  }

  /**
   * Valide un signalement (statut en_attente_validation → valide)
   */
  validate(id: number): Observable<{ data: Signalement }> {
    return this.http.post<{ data: Signalement }>(`${this.baseUrl}/signalements/${id}/valider`, {});
  }

  /**
   * Rejette un signalement (statut en_attente_validation → rejete)
   */
  reject(id: number): Observable<{ data: Signalement }> {
    return this.http.post<{ data: Signalement }>(`${this.baseUrl}/signalements/${id}/rejeter`, {});
  }

  /**
   * Priorise un signalement validé
   */
  prioritize(id: number, priorite: SignalementPriorite): Observable<{ data: Signalement }> {
    return this.http.post<{ data: Signalement }>(`${this.baseUrl}/signalements/${id}/prioriser`, { priorite });
  }

  /**
   * Récupère la liste des zones pour les formulaires d'édition
   */
  getZones(): Observable<{ data: ZoneSummary[] }> {
    return this.http.get<{ data: ZoneSummary[] }>(`${this.baseUrl}/zones`);
  }

  /**
   * Récupère la liste des types de déchets pour les formulaires d'édition
   */
  getTypesDechets(): Observable<{ data: TypeDechetItem[] }> {
    return this.http.get<{ data: TypeDechetItem[] }>(`${this.baseUrl}/types-dechets`);
  }
}
