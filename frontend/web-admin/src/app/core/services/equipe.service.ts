import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Equipe, EquipePage, EquipePayload } from '../models/equipe.model';
import { PaginatedResponse } from '../models/affectation.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class EquipeService {
  private readonly http=inject(HttpClient);
  private readonly baseUrl=environment.apiUrl;

  getAll(page=1):Observable<EquipePage>{ return this.http.get<EquipePage>(`${this.baseUrl}/equipes?page=${page}`); }
  getById(id:number):Observable<{data:Equipe}>{ return this.http.get<{data:Equipe}>(`${this.baseUrl}/equipes/${id}`); }
  create(payload:EquipePayload):Observable<{data:Equipe}>{ return this.http.post<{data:Equipe}>(`${this.baseUrl}/equipes`,payload); }
  update(id:number,payload:Partial<EquipePayload>):Observable<{data:Equipe}>{ return this.http.put<{data:Equipe}>(`${this.baseUrl}/equipes/${id}`,payload); }
  delete(id:number):Observable<void>{ return this.http.delete<void>(`${this.baseUrl}/equipes/${id}`); }
  getAgents():Observable<PaginatedResponse<User>>{ return this.http.get<PaginatedResponse<User>>(`${this.baseUrl}/users?role=agent&per_page=100`); }
}
