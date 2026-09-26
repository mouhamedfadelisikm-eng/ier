import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { isObservable } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

describe('authGuard', () => {
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

  it('should allow navigation when an authenticated user is already loaded', () => {
    authService.currentUser.set(mockAdminUser);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(result).toBe(true);
  });

  it('should load the authenticated user and allow navigation when the session is valid', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/admin/dashboard' } as any)
    );

    expect(isObservable(result)).toBe(true);
    if (isObservable(result)) {
      result.subscribe((allowed) => {
        expect(allowed).toBe(true);
      });
    }

    const request = httpMock.expectOne(`${environment.apiUrl}/user`);
    expect(request.request.method).toBe('GET');
    request.flush({ data: mockAdminUser });
  });

  it('should redirect to /login when the session is unauthenticated', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/admin/dashboard' } as any)
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
});
