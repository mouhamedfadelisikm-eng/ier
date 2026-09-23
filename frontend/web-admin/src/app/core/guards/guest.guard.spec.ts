import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { isObservable } from 'rxjs';
import { guestGuard } from './guest.guard';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

describe('guestGuard', () => {
  let tokenService: TokenService;
  let authService: AuthService;
  let router: Router;
  let httpMock: HttpTestingController;

  const mockAdminUser: User = {
    id: 1,
    nom: 'Diallo',
    prenom: 'Admin',
    email: 'admin@isi-ecoreport.sn',
    role: 'admin',
    roles: ['admin']
  };

  const mockAgentUser: User = {
    id: 2,
    nom: 'Sow',
    prenom: 'Agent',
    email: 'agent@isi-ecoreport.sn',
    role: 'agent',
    roles: ['agent']
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        TokenService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'login', children: [] },
          { path: 'admin/dashboard', children: [] }
        ])
      ]
    });

    tokenService = TestBed.inject(TokenService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // 1. token absent
  it('should allow /login when token is absent', () => {
    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as any, { url: '/login' } as any)
    );

    expect(result).toBe(true);
  });

  // 2. token + admin déjà chargé
  it('should redirect to /admin/dashboard when token is present and admin is already loaded', () => {
    tokenService.setToken('sample-token');
    authService.currentUser.set(mockAdminUser);

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as any, { url: '/login' } as any)
    );

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toContain('/admin/dashboard');
  });

  // 3. token + utilisateur non chargé (chargement API retourne admin)
  it('should call GET /api/user and redirect to /admin/dashboard when user is not loaded but turns out to be admin', () => {
    tokenService.setToken('valid-token');

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as any, { url: '/login' } as any)
    );

    expect(isObservable(result)).toBe(true);
    if (isObservable(result)) {
      result.subscribe((res) => {
        expect(res instanceof UrlTree).toBe(true);
        const tree = res as UrlTree;
        expect(router.serializeUrl(tree)).toContain('/admin/dashboard');
      });
    }

    const req = httpMock.expectOne(`${environment.apiUrl}/user`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockAdminUser });
  });

  // 4. token + utilisateur agent
  it('should redirect to /login with error=forbidden_role when user loaded from API is agent', () => {
    tokenService.setToken('agent-token');

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as any, { url: '/login' } as any)
    );

    expect(isObservable(result)).toBe(true);
    if (isObservable(result)) {
      result.subscribe((res) => {
        expect(res instanceof UrlTree).toBe(true);
        const tree = res as UrlTree;
        expect(router.serializeUrl(tree)).toContain('/login');
        expect(tree.queryParams['error']).toBe('forbidden_role');
      });
    }

    const req = httpMock.expectOne(`${environment.apiUrl}/user`);
    req.flush({ data: mockAgentUser });
  });

  // 5. token + API /user → 401
  it('should clear session and allow /login when API /user returns 401', () => {
    tokenService.setToken('expired-token');

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as any, { url: '/login' } as any)
    );

    expect(isObservable(result)).toBe(true);
    if (isObservable(result)) {
      result.subscribe((allowed) => {
        expect(allowed).toBe(true);
        expect(tokenService.hasToken()).toBe(false);
      });
    }

    const req = httpMock.expectOne(`${environment.apiUrl}/user`);
    req.flush({ message: 'Unauthenticated.' }, { status: 401, statusText: 'Unauthorized' });
  });
});
