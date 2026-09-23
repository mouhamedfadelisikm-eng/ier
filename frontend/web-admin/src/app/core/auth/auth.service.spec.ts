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

  it('should login and set current user and token', () => {
    service.login({ email: 'admin@isi-ecoreport.sn', password: 'Password123!' }).subscribe((user) => {
      expect(user).toEqual(mockAdminUser);
      expect(service.currentUser()).toEqual(mockAdminUser);
      expect(service.isAuthenticated()).toBe(true);
      expect(service.isAdmin()).toBe(true);
      expect(tokenService.getToken()).toBe('fake-token-xyz');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({
      data: {
        token: 'fake-token-xyz',
        user: mockAdminUser
      }
    });
  });

  it('should clear token and user on logout', () => {
    tokenService.setToken('fake-token-xyz');
    service.currentUser.set(mockAdminUser);

    service.logout().subscribe(() => {
      expect(tokenService.hasToken()).toBe(false);
      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should load current user from /api/user', () => {
    tokenService.setToken('fake-token-xyz');

    service.loadCurrentUser().subscribe((user) => {
      expect(user).toEqual(mockAdminUser);
      expect(service.currentUser()).toEqual(mockAdminUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockAdminUser });
  });
});
