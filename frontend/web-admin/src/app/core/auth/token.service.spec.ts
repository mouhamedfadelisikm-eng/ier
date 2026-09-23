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

  it('should store and retrieve token', () => {
    service.setToken('sample-sanctum-token');
    expect(service.getToken()).toBe('sample-sanctum-token');
    expect(service.hasToken()).toBe(true);
  });

  it('should clear stored token', () => {
    service.setToken('sample-sanctum-token');
    service.clearToken();
    expect(service.getToken()).toBeNull();
    expect(service.hasToken()).toBe(false);
  });
});
