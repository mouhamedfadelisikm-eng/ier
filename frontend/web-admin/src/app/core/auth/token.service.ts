import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'ier_admin_token';

  /**
   * One-time cleanup for tokens issued by the legacy localStorage flow.
   * Session authentication must never read or write this value.
   */
  clearLegacyToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch {
      // localStorage may be unavailable in restricted browser contexts.
    }
  }
}
