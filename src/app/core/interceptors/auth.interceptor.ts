import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)

  let authReq = req;
  const accessToken = authService.getAccessToken();

  if (accessToken) {
    authReq = req.clone({
      withCredentials: true,
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error?.status === 401) {
        authService?.logout();
      }
      return throwError(() => error);
    })
  );
};
