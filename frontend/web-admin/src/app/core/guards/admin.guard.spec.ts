import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { isObservable } from 'rxjs';
import { adminGuard } from './admin.guard';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

describe('adminGuard', () => {
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

  const mockCitizenUser: User = {
    id: 3,
    nom: 'Ndiaye',
    prenom: 'Citoyen',
    email: 'citoyen@isi-ecoreport.sn',
    role: 'citizen',
    roles: ['citizen']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        TokenService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'login', children: [] }])
      ]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should allow navigation when role is admin', () => {
    authService.currentUser.set(mockAdminUser);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(result).toBe(true);
  });

  it('should refuse access when role is agent and redirect with forbidden_role', () => {
    authService.currentUser.set(mockAgentUser);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toContain('/login');
    expect(tree.queryParams['error']).toBe('forbidden_role');
  });

  it('should refuse access when role is citizen and redirect with forbidden_role', () => {
    authService.currentUser.set(mockCitizenUser);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toContain('/login');
    expect(tree.queryParams['error']).toBe('forbidden_role');
  });

  it('should load the current session and allow navigation when the user is an admin', () => {
    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(isObservable(result)).toBe(true);
    if (isObservable(result)) {
      result.subscribe((allowed) => {
        expect(allowed).toBe(true);
      });
    }

    const request = httpMock.expectOne(`${environment.apiUrl}/user`);
    request.flush({ data: mockAdminUser });
  });

  it('should redirect to /login when the session is unauthenticated', () => {
    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(isObservable(result)).toBe(true);
    if (isObservable(result)) {
      result.subscribe((res) => {
        expect(res instanceof UrlTree).toBe(true);
        const tree = res as UrlTree;
        expect(router.serializeUrl(tree)).toContain('/login');
        expect(tree.queryParams['returnUrl']).toBe('/admin/dashboard');
      });
    }

    const request = httpMock.expectOne(`${environment.apiUrl}/user`);
    request.flush(
      { message: 'Unauthenticated.' },
      { status: 401, statusText: 'Unauthorized' }
    );
  });

  it('should redirect to /login when authentication was initialized without a user', () => {
    authService.isInitialized.set(true);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toContain('/login');
    expect(tree.queryParams['returnUrl']).toBe('/admin/dashboard');
  });
});
