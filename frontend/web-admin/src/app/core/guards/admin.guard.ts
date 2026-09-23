import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';

export const adminGuard: CanActivateFn = (route, state): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.hasToken()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  const verifyRole = (): boolean | UrlTree => {
    if (authService.isAdmin()) {
      return true;
    }
    // L'utilisateur est connecté mais n'a pas les droits administrateur
    return router.createUrlTree(['/login'], {
      queryParams: { error: 'forbidden_role' }
    });
  };

  if (authService.isAuthenticated()) {
    return verifyRole();
  }

  return authService.loadCurrentUser().pipe(
    map(() => verifyRole()),
    catchError(() => {
      authService.clearSession();
      return of(
        router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url }
        })
      );
    })
  );
};
