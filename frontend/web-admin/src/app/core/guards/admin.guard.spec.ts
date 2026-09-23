import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';

describe('adminGuard', () => {
  let tokenService: TokenService;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        TokenService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    tokenService = TestBed.inject(TokenService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should redirect if user is not admin', () => {
    tokenService.setToken('sample-token');
    authService.currentUser.set({
      id: 2,
      nom: 'Sow',
      prenom: 'Agent',
      email: 'agent@isi-ecoreport.sn',
      role: 'agent'
    });

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toContain('/login');
  });

  it('should allow navigation if user is admin', () => {
    tokenService.setToken('sample-token');
    authService.currentUser.set({
      id: 1,
      nom: 'Diallo',
      prenom: 'Admin',
      email: 'admin@isi-ecoreport.sn',
      role: 'admin'
    });

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(result).toBe(true);
  });
});
