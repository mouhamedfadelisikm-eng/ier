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

  it('should remove the legacy token from storage', () => {
    localStorage.setItem('ier_admin_token', 'legacy-token');

    service.clearLegacyToken();

    expect(localStorage.getItem('ier_admin_token')).toBeNull();
  });

  it('should be a no-op when no legacy token exists', () => {
    service.clearLegacyToken();

    expect(localStorage.getItem('ier_admin_token')).toBeNull();
  });
});
