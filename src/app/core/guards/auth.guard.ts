import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { APP_ROUTES } from '../constants/app-routes.constants';
import { USER_ROLES } from '../constants/user.constants';

/**
 * Guard for regular user protected routes
 * - Allows access only if logged in as a regular user
 * - Redirects to login if not logged in
 * - Redirects to admin dashboard if logged in as admin
 */
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
          // Not logged in, redirect to regular login
          return of(this.router.createUrlTree([APP_ROUTES.LOGIN]));
        }

        // Check user role
        return this.authService.currentUser$().pipe(
          take(1),
          map((user) => {
            if (user?.role === USER_ROLES.ADMIN) {
              // Admin trying to access user routes, redirect to admin dashboard
              return this.router.createUrlTree([APP_ROUTES.ADMIN_DASHBOARD]);
            }
            // Regular user, allow access
            return true;
          })
        );
      }),
      catchError(() => of(this.router.createUrlTree([APP_ROUTES.LOGIN])))
    );
  }
}
