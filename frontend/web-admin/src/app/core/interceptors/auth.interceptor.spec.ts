import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { TokenService } from '../auth/token.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        TokenService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // 1. requête sans token
  it('should not add Authorization header when no token is present', () => {
    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    expect(req.request.headers.get('Accept')).toBe('application/json');
    req.flush({});
  });

  // 2. requête avec token & Authorization Bearer
  it('should add Authorization Bearer header when token exists', () => {
    tokenService.setToken('sample-jwt-token');

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer sample-jwt-token');
    expect(req.request.headers.get('Accept')).toBe('application/json');
    req.flush({});
  });

  // 3. Accept application/json
  it('should always include Accept: application/json header', () => {
    http.post('/api/data', { some: 'payload' }).subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.get('Accept')).toBe('application/json');
    req.flush({});
  });

  // 4. ne pas écraser un header Authorization déjà spécifié
  it('should not overwrite an existing Authorization header', () => {
    tokenService.setToken('stored-token');

    http.get('/api/test', {
      headers: { Authorization: 'CustomCustomKey' }
    }).subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('CustomCustomKey');
    req.flush({});
  });
});
