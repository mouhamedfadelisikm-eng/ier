import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send API requests with credentials and JSON Accept header', () => {
    http.get('/api/test').subscribe();

    const request = httpMock.expectOne('/api/test');
    expect(request.request.withCredentials).toBe(true);
    expect(request.request.headers.get('Accept')).toBe('application/json');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  it('should send Sanctum CSRF requests with credentials', () => {
    http.get('/sanctum/csrf-cookie').subscribe();

    const request = httpMock.expectOne('/sanctum/csrf-cookie');
    expect(request.request.withCredentials).toBe(true);
    expect(request.request.headers.get('Accept')).toBe('application/json');
    request.flush(null);
  });

  it('should not attach credentials to third-party requests', () => {
    http.get('https://example.com/resource').subscribe();

    const request = httpMock.expectOne('https://example.com/resource');
    expect(request.request.withCredentials).toBe(false);
    expect(request.request.headers.get('Accept')).toBe('application/json');
    request.flush({});
  });

  it('should preserve an explicitly provided Authorization header', () => {
    http.get('/api/test', {
      headers: { Authorization: 'CustomCustomKey' }
    }).subscribe();

    const request = httpMock.expectOne('/api/test');
    expect(request.request.headers.get('Authorization')).toBe('CustomCustomKey');
    request.flush({});
  });
});
