import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user.model';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const checkRole = (user: User): boolean | UrlTree => {
    const isAdmin = user.role === 'admin' || (user.roles?.includes('admin') ?? false);
    if (isAdmin) {
      return true;
    }

    return router.createUrlTree(['/login'], {
      queryParams: { error: 'forbidden_role' }
    });
  };

  const user = authService.currentUser();
  if (user) {
    return checkRole(user);
  }

  if (authService.isInitialized()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

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
