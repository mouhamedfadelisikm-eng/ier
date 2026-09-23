import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';
import { User } from '../models/user.model';

export const adminGuard: CanActivateFn = (
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

  const checkRole = (user: User): boolean | UrlTree => {
    const isAdmin = user.role === 'admin' || (user.roles?.includes('admin') ?? false);
    if (isAdmin) {
      return true;
    }
    // Profil non-admin (agent / citizen) → accès refusé
    return router.createUrlTree(['/login'], {
      queryParams: { error: 'forbidden_role' }
    });
  };

  // 2. Utilisateur déjà chargé en mémoire
  const user = authService.currentUser();
  if (user) {
    return checkRole(user);
  }

  // 3. Utilisateur à charger depuis l'API
  return authService.loadCurrentUser().pipe(
    map((loadedUser) => checkRole(loadedUser)),
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
