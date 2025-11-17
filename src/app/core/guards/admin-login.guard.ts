import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { APP_ROUTES } from '../constants/app-routes.constants';
import { USER_ROLES } from '../constants/user.constants';

/**
 * Guard for admin login page only
 * - Allows access if not logged in
 * - Redirects to admin dashboard if already logged in as admin
 * - Redirects to explore if logged in as regular user
 */
@Injectable({
  providedIn: 'root',
})
export class AdminLoginGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn().pipe(
      take(1),
      switchMap((isLoggedIn) => {
        if (!isLoggedIn) {
          // Not logged in, allow access to admin login page
          return of(true);
        }

        // Already logged in, check role and redirect accordingly
        return this.authService.currentUser$().pipe(
          take(1),
          map((user) => {
            if (user?.role === USER_ROLES.ADMIN) {
              // Already logged in as admin, redirect to admin dashboard
              return this.router.createUrlTree([APP_ROUTES.ADMIN_DASHBOARD]);
            }
            // Logged in as regular user, redirect to explore
            return this.router.createUrlTree([APP_ROUTES.EXPLORE]);
          })
        );
      }),
      catchError(() => of(true)) // On error, allow access to login page
    );
  }
}
