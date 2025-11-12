import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { APP_ROUTES } from '../constants/app-routes.constants';
import { USER_ROLES } from '../constants/user.constants';

/**
 * Guard for admin-only protected routes
 * - Allows access only if logged in as admin
 * - Redirects to admin login if not logged in
 * - Redirects to explore if logged in as regular user
 */
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn().pipe(
      take(1),
      switchMap((isLoggedIn) => {
        if (!isLoggedIn) {
          // Not logged in at all, redirect to admin login
          return of(this.router.createUrlTree([APP_ROUTES.ADMIN_LOGIN]));
        }

        // Check if user is admin
        return this.authService.currentUser$().pipe(
          take(1),
          map((user) => {
            if (user?.role === USER_ROLES.ADMIN) {
              // Is admin, allow access
              return true;
            }
            // Regular user trying to access admin routes, redirect to explore
            return this.router.createUrlTree([APP_ROUTES.EXPLORE]);
          })
        );
      }),
      catchError(() => of(this.router.createUrlTree([APP_ROUTES.ADMIN_LOGIN])))
    );
  }
}
