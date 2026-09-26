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
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle session login successfully', () => {
    service.login({ email: 'admin@isi-ecoreport.sn', password: 'Password123!' }).subscribe({
      next: (user) => {
        expect(user).toEqual(mockAdminUser);
        expect(service.currentUser()).toEqual(mockAdminUser);
        expect(service.isAuthenticated()).toBe(true);
        expect(service.isAdmin()).toBe(true);
        expect(localStorage.getItem('ier_admin_token')).toBeNull();
        expect(service.isLoading()).toBe(false);
      }
    });

    const csrfRequest = httpMock.expectOne('/sanctum/csrf-cookie');
    expect(csrfRequest.request.method).toBe('GET');
    csrfRequest.flush(null);

    const loginRequest = httpMock.expectOne(`${environment.apiUrl}/auth/session/login`);
    expect(loginRequest.request.method).toBe('POST');
    expect(loginRequest.request.body).toEqual({
      email: 'admin@isi-ecoreport.sn',
      password: 'Password123!'
    });
    loginRequest.flush({ data: { user: mockAdminUser } });
  });

  it('should handle session login failure with 401', () => {
    let errorResponse: any;

    service.login({ email: 'admin@isi-ecoreport.sn', password: 'WrongPassword' }).subscribe({
      next: () => {
        throw new Error('Should have failed with 401');
      },
      error: (err) => {
        errorResponse = err;
      }
    });

    const csrfRequest = httpMock.expectOne('/sanctum/csrf-cookie');
    csrfRequest.flush(null);

    const loginRequest = httpMock.expectOne(`${environment.apiUrl}/auth/session/login`);
    loginRequest.flush(
      { message: 'Identifiants incorrects' },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(errorResponse.status).toBe(401);
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('ier_admin_token')).toBeNull();
    expect(service.isLoading()).toBe(false);
  });

  it('should load the current user from the authenticated session', () => {
    service.loadCurrentUser().subscribe({
      next: (user) => {
        expect(user).toEqual(mockAdminUser);
        expect(service.currentUser()).toEqual(mockAdminUser);
        expect(service.isInitialized()).toBe(true);
      }
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/user`);
    expect(request.request.method).toBe('GET');
    request.flush({ data: mockAdminUser });
  });

  it('should clear the session when loadCurrentUser returns 401', () => {
    let errorCaught: any;

    service.loadCurrentUser().subscribe({
      next: () => {
        throw new Error('Should have failed with 401');
      },
      error: (err) => {
        errorCaught = err;
      }
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/user`);
    request.flush(
      { message: 'Unauthenticated.' },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(errorCaught.status).toBe(401);
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should handle session logout successfully', () => {
    service.currentUser.set(mockAdminUser);

    service.logout().subscribe({
      next: () => {
        expect(service.currentUser()).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
        expect(service.isLoading()).toBe(false);
      }
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/auth/session/logout`);
    expect(request.request.method).toBe('POST');
    request.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should clear the local session state even when logout fails', () => {
    service.currentUser.set(mockAdminUser);

    service.logout().subscribe({
      next: () => {
        expect(service.currentUser()).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
        expect(service.isLoading()).toBe(false);
      }
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/auth/session/logout`);
    request.error(new ProgressEvent('Network error'));
  });

  it('should clear the session state and remove the legacy token', () => {
    localStorage.setItem('ier_admin_token', 'legacy-token');
    service.currentUser.set(mockAdminUser);

    service.clearSession();

    expect(localStorage.getItem('ier_admin_token')).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
