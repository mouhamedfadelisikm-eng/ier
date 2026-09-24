import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReferencePage, ZoneAdmin, TypeDechetAdmin } from '../models/reference.model';

@Injectable({providedIn:'root'})
export class ReferenceService{
  private readonly http=inject(HttpClient); private readonly baseUrl=environment.apiUrl;
  getZones(page=1):Observable<ReferencePage<ZoneAdmin>>{return this.http.get<ReferencePage<ZoneAdmin>>(`${this.baseUrl}/zones?page=${page}`)}
  createZone(payload:{nom_zone:string;description?:string|null}):Observable<{data:ZoneAdmin}>{return this.http.post<{data:ZoneAdmin}>(`${this.baseUrl}/zones`,payload)}
  updateZone(id:number,payload:Partial<{nom_zone:string;description:string|null}>):Observable<{data:ZoneAdmin}>{return this.http.put<{data:ZoneAdmin}>(`${this.baseUrl}/zones/${id}`,payload)}
  deleteZone(id:number):Observable<void>{return this.http.delete<void>(`${this.baseUrl}/zones/${id}`)}
  getTypes(page=1):Observable<ReferencePage<TypeDechetAdmin>>{return this.http.get<ReferencePage<TypeDechetAdmin>>(`${this.baseUrl}/types-dechets?page=${page}`)}
  createType(payload:{libelle:string;description?:string|null}):Observable<{data:TypeDechetAdmin}>{return this.http.post<{data:TypeDechetAdmin}>(`${this.baseUrl}/types-dechets`,payload)}
  updateType(id:number,payload:Partial<{libelle:string;description:string|null}>):Observable<{data:TypeDechetAdmin}>{return this.http.put<{data:TypeDechetAdmin}>(`${this.baseUrl}/types-dechets/${id}`,payload)}
  deleteType(id:number):Observable<void>{return this.http.delete<void>(`${this.baseUrl}/types-dechets/${id}`)}
}
