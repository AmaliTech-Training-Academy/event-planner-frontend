import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { APP_ROUTES } from '../constants/app-routes.constants';
import { USER_ROLES } from '../constants/user.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn().pipe(
      take(1),
      switchMap((isLoggedIn) => {
        if (!isLoggedIn) {
          return of(this.router.createUrlTree([APP_ROUTES.LOGIN]));
        }

        return this.authService.currentUser$().pipe(
          take(1),
          map((user) => {
            const context = this.authService.getCurrentAuthContext();

            if (!user) {
              return this.router.createUrlTree([APP_ROUTES.LOGIN]);
            }

            if (user.role === USER_ROLES.ADMIN || context === 'admin') {
              return this.router.createUrlTree([APP_ROUTES.ADMIN_DASHBOARD]);
            }

            return true;
          })
        );
      }),
      catchError((error) => {
        return of(this.router.createUrlTree([APP_ROUTES.LOGIN]));
      })
    );
  }
}
