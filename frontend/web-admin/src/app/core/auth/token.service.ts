import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'ier_admin_token';

  getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du token', e);
    }
  }

  clearToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (e) {
      console.error('Erreur lors de la suppression du token', e);
    }
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}
