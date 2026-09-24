import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
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
  private readonly csrfUrl = '/sanctum/csrf-cookie';

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

  constructor() {
    this.tokenService.clearLegacyToken();
  }

  login(credentials: LoginRequest): Observable<User> {
    this.isLoading.set(true);

    return this.http.get<void>(this.csrfUrl).pipe(
      switchMap(() =>
        this.http.post<AuthResponse>(
          this.baseUrl + '/auth/session/login',
          credentials
        )
      ),
      map(response => response.data.user),
      tap(user => {
        this.currentUser.set(user);
        this.isInitialized.set(true);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    this.isLoading.set(true);

    return this.http.post<void>(this.baseUrl + '/auth/session/logout', {}).pipe(
      catchError(() => of(undefined)),
      tap(() => {
        this.clearSession();
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      }),
      map(() => void 0)
    );
  }

  loadCurrentUser(forceRefresh = false): Observable<User> {
    if (this.currentUser() && !forceRefresh) {
      return of(this.currentUser()!);
    }

    if (this.loadUserRequest$ && !forceRefresh) {
      return this.loadUserRequest$;
    }

    this.loadUserRequest$ = this.http.get<UserResponse>(this.baseUrl + '/user').pipe(
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

  updateProfile(profileData: Partial<Pick<User, 'nom' | 'prenom' | 'email' | 'telephone' | 'adresse'>> & { password?: string; password_confirmation?: string }): Observable<User> {
    return this.http.put<UserResponse>(this.baseUrl + '/user', profileData).pipe(
      map(response => response.data),
      tap(user => this.currentUser.set(user))
    );
  }

  clearSession(): void {
    this.tokenService.clearLegacyToken();
    this.currentUser.set(null);
    this.loadUserRequest$ = null;
  }
}
