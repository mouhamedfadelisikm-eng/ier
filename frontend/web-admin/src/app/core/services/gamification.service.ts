import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LeaderboardRow { rank:number; user:{id:number;nom:string;prenom:string}; total_points:number; }
export interface LeaderboardResponse { data:LeaderboardRow[]; meta:{limit:number;count:number}; }
export interface HistoriquePoint { id:number; nombre_points:number; motif:string; description?:string|null; date_attribution:string; user?:{id:number;nom:string;prenom:string}; signalement_id?:number|null; created_at?:string; updated_at?:string; }
export interface HistoriquePointPage { data:HistoriquePoint[]; meta?:{current_page:number;from:number;last_page:number;per_page:number;to:number;total:number}; }

@Injectable({providedIn:'root'})
export class GamificationService {
  private readonly http=inject(HttpClient); private readonly baseUrl=environment.apiUrl;
  leaderboard(limit=100):Observable<LeaderboardResponse>{return this.http.get<LeaderboardResponse>(`${this.baseUrl}/gamification/leaderboard?limit=${limit}`);}
  history(page=1):Observable<HistoriquePointPage>{return this.http.get<HistoriquePointPage>(`${this.baseUrl}/historique-points?page=${page}`);}
}
