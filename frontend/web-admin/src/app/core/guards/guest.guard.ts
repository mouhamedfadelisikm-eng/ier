import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const guestGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser();
  if (currentUser) {
    if (authService.isAdmin()) {
      return router.createUrlTree(['/admin/dashboard']);
    }

    if (state.url.includes('error=forbidden_role')) {
      return true;
    }

    return router.createUrlTree(['/login'], {
      queryParams: { error: 'forbidden_role' }
    });
  }

  if (authService.isInitialized()) {
    return true;
  }

  return authService.loadCurrentUser().pipe(
    map((user) => {
      const isAdmin = user.role === 'admin' || (user.roles?.includes('admin') ?? false);
      if (isAdmin) {
        return router.createUrlTree(['/admin/dashboard']);
      }

      if (state.url.includes('error=forbidden_role')) {
        return true;
      }

      return router.createUrlTree(['/login'], {
        queryParams: { error: 'forbidden_role' }
      });
    }),
    catchError(() => {
      authService.clearSession();
      return of(true);
    })
  );
};
