import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';

describe('authGuard', () => {
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

  it('should redirect to /login if no token is present', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toContain('/login');
  });

  it('should allow navigation if user is authenticated in memory', () => {
    tokenService.setToken('sample-token');
    authService.currentUser.set({
      id: 1,
      nom: 'Diallo',
      prenom: 'Admin',
      email: 'admin@isi-ecoreport.sn',
      role: 'admin'
    });

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(result).toBe(true);
  });
});
