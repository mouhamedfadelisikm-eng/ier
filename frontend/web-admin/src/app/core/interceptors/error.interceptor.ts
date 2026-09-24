import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../auth/token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401:
            tokenService.clearLegacyToken();
            if (!router.url.startsWith('/login')) {
              router.navigate(['/login'], {
                queryParams: { returnUrl: router.url }
              });
            }
            break;

          case 419:
            tokenService.clearLegacyToken();
            if (!router.url.startsWith('/login')) {
              router.navigate(['/login'], {
                queryParams: { returnUrl: router.url }
              });
            }
            break;

          case 403:
            console.error('Accès refusé (403) : permissions insuffisantes', error.error);
            break;

          case 404:
            console.error('Ressource introuvable (404)', error.error);
            break;

          case 409:
            console.warn('Conflit métier (409) détecté', error.error);
            break;

          case 422:
            console.warn('Erreur de validation (422)', error.error);
            break;

          case 500:
            console.error('Erreur interne du serveur (500)', error.error);
            break;

          default:
            console.error('Erreur HTTP inattendue (' + error.status + ')', error);
        }
      }

      return throwError(() => error);
    })
  );
};
