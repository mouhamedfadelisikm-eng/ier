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

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should redirect an authenticated admin to the dashboard', () => {
    authService.currentUser.set(mockAdminUser);

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as any, { url: '/login' } as any)
    );

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toContain('/admin/dashboard');
  });

  it('should redirect an authenticated non-admin with forbidden_role', () => {
    authService.currentUser.set(mockAgentUser);

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as any, { url: '/login' } as any)
    );

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toContain('/login');
    expect(tree.queryParams['error']).toBe('forbidden_role');
  });

  it('should load the authenticated admin session and redirect to the dashboard', () => {
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

    const request = httpMock.expectOne(`${environment.apiUrl}/user`);
    expect(request.request.method).toBe('GET');
    request.flush({ data: mockAdminUser });
  });

  it('should load the authenticated non-admin session and redirect with forbidden_role', () => {
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

    const request = httpMock.expectOne(`${environment.apiUrl}/user`);
    request.flush({ data: mockAgentUser });
  });

  it('should allow /login when the session is unauthenticated', () => {
    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as any, { url: '/login' } as any)
    );

    expect(isObservable(result)).toBe(true);
    if (isObservable(result)) {
      result.subscribe((allowed) => {
        expect(allowed).toBe(true);
      });
    }

    const request = httpMock.expectOne(`${environment.apiUrl}/user`);
    request.flush(
      { message: 'Unauthenticated.' },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(authService.currentUser()).toBeNull();
  });

  it('should not reload the session once authentication state is initialized without a user', () => {
    authService.isInitialized.set(true);

    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as any, { url: '/login' } as any)
    );

    expect(result).toBe(true);
  });
});
