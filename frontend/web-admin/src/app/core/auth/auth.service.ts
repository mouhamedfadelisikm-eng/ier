import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
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

  constructor() {
    this.initAuth();
  }

  /**
   * Initialise l'état d'authentification au démarrage de l'application.
   */
  initAuth(): Observable<User | null> {
    if (!this.tokenService.hasToken()) {
      this.currentUser.set(null);
      this.isInitialized.set(true);
      return of(null);
    }

    return this.loadCurrentUser().pipe(
      catchError(() => {
        this.tokenService.clearToken();
        this.currentUser.set(null);
        this.isInitialized.set(true);
        return of(null);
      })
    );
  }

  /**
   * Connexion administrateur
   */
  login(credentials: LoginRequest): Observable<User> {
    this.isLoading.set(true);
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      map(response => response.data),
      tap(data => {
        this.tokenService.setToken(data.token);
        this.currentUser.set(data.user);
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
   * Déconnexion
   */
  logout(): Observable<void> {
    this.isLoading.set(true);
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {}).pipe(
      catchError(() => of(undefined)), // Nettoie même en cas d'erreur réseau / token expiré
      tap(() => {
        this.clearSession();
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      }),
      map(() => void 0)
    );
  }

  /**
   * Charge le profil utilisateur actuel depuis l'API GET /api/user
   */
  loadCurrentUser(): Observable<User> {
    return this.http.get<UserResponse>(`${this.baseUrl}/user`).pipe(
      map(response => response.data),
      tap(user => {
        this.currentUser.set(user);
        this.isInitialized.set(true);
      }),
      catchError(err => {
        this.isInitialized.set(true);
        return throwError(() => err);
      })
    );
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
   * Réinitialise les tokens et l'utilisateur en mémoire
   */
  clearSession(): void {
    this.tokenService.clearToken();
    this.currentUser.set(null);
  }
}
