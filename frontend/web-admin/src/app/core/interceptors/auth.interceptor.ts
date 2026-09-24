import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isFirstPartyRequest =
    req.url.startsWith(environment.apiUrl) ||
    req.url.startsWith('/sanctum/');

  const clonedRequest = req.clone({
    setHeaders: {
      Accept: 'application/json'
    },
    withCredentials: isFirstPartyRequest
  });

  return next(clonedRequest);
};
