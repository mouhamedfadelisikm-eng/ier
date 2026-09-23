import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // 1. set token
  it('should set token in storage', () => {
    service.setToken('my-sanctum-token');
    expect(localStorage.getItem('ier_admin_token')).toBe('my-sanctum-token');
  });

  // 2. get token
  it('should get token from storage', () => {
    localStorage.setItem('ier_admin_token', 'retrieved-token');
    expect(service.getToken()).toBe('retrieved-token');
  });

  // 3. has token
  it('should correctly check if token exists (has token)', () => {
    expect(service.hasToken()).toBe(false);
    service.setToken('valid-token');
    expect(service.hasToken()).toBe(true);
  });

  // 4. clear token
  it('should clear token from storage', () => {
    service.setToken('token-to-remove');
    expect(service.hasToken()).toBe(true);
    service.clearToken();
    expect(service.getToken()).toBeNull();
    expect(service.hasToken()).toBe(false);
  });
});
