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

  const mockCitizenUser: User = {
    id: 3,
    nom: 'Ndiaye',
    prenom: 'Citoyen',
    email: 'citoyen@isi-ecoreport.sn',
    role: 'citizen',
    roles: ['citizen']
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        TokenService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'login', children: [] }])
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

  // 1. admin → autorisé
  it('should allow navigation when role is admin', () => {
    tokenService.setToken('sample-token');
    authService.currentUser.set(mockAdminUser);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(result).toBe(true);
  });

  // 2. agent → refusé
  it('should refuse access when role is agent and redirect to /login with forbidden_role', () => {
    tokenService.setToken('sample-token');
    authService.currentUser.set(mockAgentUser);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toContain('/login');
    expect(tree.queryParams['error']).toBe('forbidden_role');
  });

  // 3. citizen → refusé
  it('should refuse access when role is citizen and redirect to /login with forbidden_role', () => {
    tokenService.setToken('sample-token');
    authService.currentUser.set(mockCitizenUser);

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toContain('/login');
    expect(tree.queryParams['error']).toBe('forbidden_role');
  });

  it('should load user from API if not yet loaded and allow if admin', () => {
    tokenService.setToken('sample-token');

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(isObservable(result)).toBe(true);
    if (isObservable(result)) {
      result.subscribe((allowed) => {
        expect(allowed).toBe(true);
      });
    }

    const req = httpMock.expectOne(`${environment.apiUrl}/user`);
    req.flush({ data: mockAdminUser });
  });

  it('should redirect to /login if token is absent', () => {
    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toContain('/login');
  });
});
