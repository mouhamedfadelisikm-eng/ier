import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest } from '../models/auth.model';
import { User, UserResponse } from '../models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  private readonly baseUrl = environment.apiUrl;

  readonly currentUser = signal<User | null>(null);
  readonly isInitialized = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => {
    const user = this.currentUser();
    if (!user) return false;
    return user.role === 'admin' || (user.roles ? user.roles.includes('admin') : false);
  });

  private loadUserRequest$: Observable<User> | null = null;

  /**
   * Connexion utilisateur
   */
  login(credentials: LoginRequest): Observable<User> {
    this.isLoading.set(true);
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      map(response => response.data),
      tap(data => {
        this.tokenService.setToken(data.token);
        this.currentUser.set(data.user);
        this.isInitialized.set(true);
        this.isLoading.set(false);
      }),
      map(data => data.user),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Déconnexion sécurisée (nettoie la session même en cas d'erreur réseau / token expiré)
   */
  logout(): Observable<void> {
    this.isLoading.set(true);
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {}).pipe(
      catchError(() => of(undefined)),
      tap(() => {
        this.clearSession();
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      }),
      map(() => void 0)
    );
  }

  /**
   * Charge le profil utilisateur actuel depuis l'API GET /api/user.
   * Évite les requêtes concurrentes en vol via un partage d'observable.
   */
  loadCurrentUser(forceRefresh = false): Observable<User> {
    if (this.currentUser() && !forceRefresh) {
      return of(this.currentUser()!);
    }

    if (this.loadUserRequest$ && !forceRefresh) {
      return this.loadUserRequest$;
    }

    this.loadUserRequest$ = this.http.get<UserResponse>(`${this.baseUrl}/user`).pipe(
      map(response => response.data),
      tap(user => {
        this.currentUser.set(user);
        this.isInitialized.set(true);
        this.loadUserRequest$ = null;
      }),
      catchError(err => {
        this.isInitialized.set(true);
        this.loadUserRequest$ = null;
        if (err.status === 401) {
          this.clearSession();
        }
        return throwError(() => err);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    return this.loadUserRequest$;
  }

  /**
   * Mise à jour du profil utilisateur connecté (sans altération de rôle)
   */
  updateProfile(profileData: Partial<Pick<User, 'nom' | 'prenom' | 'telephone' | 'adresse'>>): Observable<User> {
    return this.http.put<UserResponse>(`${this.baseUrl}/user`, profileData).pipe(
      map(response => response.data),
      tap(user => this.currentUser.set(user))
    );
  }

  /**
   * Réinitialise les tokens, observables en attente et l'utilisateur en mémoire
   */
  clearSession(): void {
    this.tokenService.clearToken();
    this.currentUser.set(null);
    this.loadUserRequest$ = null;
  }
}
