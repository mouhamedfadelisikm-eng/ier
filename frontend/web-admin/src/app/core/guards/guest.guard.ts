import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';

export const guestGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // 1. Aucun token : autoriser /login
  if (!tokenService.hasToken()) {
    return true;
  }

  // 2. Token présent + utilisateur déjà chargé en mémoire
  const currentUser = authService.currentUser();
  if (currentUser) {
    if (authService.isAdmin()) {
      return router.createUrlTree(['/admin/dashboard']);
    }
    // Utilisateur connecté non-admin (agent / citoyen) : rester sur /login avec message
    if (state.url.includes('error=forbidden_role')) {
      return true;
    }
    return router.createUrlTree(['/login'], {
      queryParams: { error: 'forbidden_role' }
    });
  }

  // 3. Token présent + utilisateur non encore chargé :
  // Ne pas considérer immédiatement comme non-authentifié, recharger le profil via GET /api/user
  return authService.loadCurrentUser().pipe(
    map((user) => {
      const isAdmin = user.role === 'admin' || (user.roles?.includes('admin') ?? false);
      if (isAdmin) {
        return router.createUrlTree(['/admin/dashboard']);
      }
      // Non-admin : rester sur /login avec message approprié
      if (state.url.includes('error=forbidden_role')) {
        return true;
      }
      return router.createUrlTree(['/login'], {
        queryParams: { error: 'forbidden_role' }
      });
    }),
    catchError(() => {
      // En cas de 401 ou token invalide : nettoyer la session et autoriser /login
      authService.clearSession();
      return of(true);
    })
  );
};
