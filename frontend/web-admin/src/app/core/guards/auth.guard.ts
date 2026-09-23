import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // 1. Sans token → redirection /login avec returnUrl
  if (!tokenService.hasToken()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // 2. Utilisateur déjà hydraté en mémoire → autorisé
  if (authService.isAuthenticated()) {
    return true;
  }

  // 3. Token valide mais utilisateur à charger → GET /api/user puis autorisé
  return authService.loadCurrentUser().pipe(
    map(() => true),
    catchError(() => {
      // 401 ou token invalide
      authService.clearSession();
      return of(
        router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url }
        })
      );
    })
  );
};
