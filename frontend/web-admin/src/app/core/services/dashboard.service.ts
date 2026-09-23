import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HeatmapPoint } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Récupère les points chauds réels de signalements depuis GET /api/dashboard/heatmap
   */
  getHeatmapData(): Observable<HeatmapPoint[]> {
    return this.http.get<HeatmapPoint[]>(`${this.baseUrl}/dashboard/heatmap`);
  }
}
