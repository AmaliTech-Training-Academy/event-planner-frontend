import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, EMPTY } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { APP_ROUTES } from '../constants/app-routes.constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let authReq = req;

  if (authService.isLoggedIn()) {
    authReq = req.clone({
      withCredentials: true,
    });
  }

 return next(authReq).pipe(
   catchError((error: HttpErrorResponse) => {
     if (error.status === 401 || error.status === 403) {
       const authContext = authService.getCurrentAuthContext();
       const currentPath = window.location.pathname;
       const isAdminRoute = currentPath.includes('/admin');

       if (authContext === 'admin' || isAdminRoute) {
         authService.clearAdminSession();
         router.navigate([APP_ROUTES.ADMIN_LOGIN]);
       } else {
         authService.clearUserSession();
         router.navigate([APP_ROUTES.LOGIN]);
       }

       return EMPTY;
     }

     return throwError(() => error);
   })
 );

};
