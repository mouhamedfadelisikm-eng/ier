import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenService: TokenService;

  const mockAdminUser: User = {
    id: 1,
    nom: 'Diallo',
    prenom: 'Admin',
    name: 'Admin Diallo',
    email: 'admin@isi-ecoreport.sn',
    role: 'admin',
    roles: ['admin']
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

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // 1. login admin réussi
  it('should handle login admin réussi', () => {
    service.login({ email: 'admin@isi-ecoreport.sn', password: 'Password123!' }).subscribe({
      next: (user) => {
        expect(user).toEqual(mockAdminUser);
        expect(service.currentUser()).toEqual(mockAdminUser);
        expect(service.isAuthenticated()).toBe(true);
        expect(service.isAdmin()).toBe(true);
        expect(tokenService.getToken()).toBe('valid-token-123');
        expect(service.isLoading()).toBe(false);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'admin@isi-ecoreport.sn', password: 'Password123!' });
    req.flush({
      data: {
        token: 'valid-token-123',
        user: mockAdminUser
      }
    });
  });

  // 2. login échoué 401
  it('should handle login échoué 401', () => {
    let errorResponse: any;

    service.login({ email: 'admin@isi-ecoreport.sn', password: 'WrongPassword' }).subscribe({
      next: () => {
        throw new Error('Should have failed with 401');
      },
      error: (err) => {
        errorResponse = err;
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ message: 'Identifiants incorrects' }, { status: 401, statusText: 'Unauthorized' });

    expect(errorResponse.status).toBe(401);
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(tokenService.hasToken()).toBe(false);
    expect(service.isLoading()).toBe(false);
  });

  // 3. loadCurrentUser réussi
  it('should handle loadCurrentUser réussi', () => {
    tokenService.setToken('valid-token-123');

    service.loadCurrentUser().subscribe({
      next: (user) => {
        expect(user).toEqual(mockAdminUser);
        expect(service.currentUser()).toEqual(mockAdminUser);
        expect(service.isInitialized()).toBe(true);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockAdminUser });
  });

  // 4. loadCurrentUser 401
  it('should handle loadCurrentUser 401 and clear session', () => {
    tokenService.setToken('expired-token');
    let errorCaught: any;

    service.loadCurrentUser().subscribe({
      next: () => {
        throw new Error('Should have failed with 401');
      },
      error: (err) => {
        errorCaught = err;
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user`);
    req.flush({ message: 'Unauthenticated.' }, { status: 401, statusText: 'Unauthorized' });

    expect(errorCaught.status).toBe(401);
    expect(tokenService.hasToken()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  // 5. logout réussi
  it('should handle logout réussi', () => {
    tokenService.setToken('active-token');
    service.currentUser.set(mockAdminUser);

    service.logout().subscribe({
      next: () => {
        expect(tokenService.hasToken()).toBe(false);
        expect(service.currentUser()).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
        expect(service.isLoading()).toBe(false);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  // 6. logout avec erreur réseau
  it('should handle logout avec erreur réseau and still clear session', () => {
    tokenService.setToken('active-token');
    service.currentUser.set(mockAdminUser);

    service.logout().subscribe({
      next: () => {
        expect(tokenService.hasToken()).toBe(false);
        expect(service.currentUser()).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
        expect(service.isLoading()).toBe(false);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    req.error(new ProgressEvent('Network error'));
  });

  // 7. clearSession
  it('should clearSession properly', () => {
    tokenService.setToken('active-token');
    service.currentUser.set(mockAdminUser);

    service.clearSession();

    expect(tokenService.hasToken()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
