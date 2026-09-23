import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';

export const guestGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.hasToken() && authService.isAdmin()) {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return true;
};
