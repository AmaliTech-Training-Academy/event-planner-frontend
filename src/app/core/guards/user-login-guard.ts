import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, switchMap, take } from 'rxjs';
import { APP_ROUTES } from '../constants/app-routes.constants';
import { USER_ROLES } from '../constants/user.constants';

/**
 * Guard for regular user login/register pages
 * - Allows access if not logged in
 * - Redirects to explore if already logged in as regular user
 * - Redirects to admin dashboard if logged in as admin
 */
@Injectable({
  providedIn: 'root',
})
export class UserLoginGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn().pipe(
      take(1),
      switchMap((isLoggedIn) => {
        if (!isLoggedIn) {
          // Not logged in, allow access to login/register pages
          return [true];
        }

        // Already logged in, check role and redirect accordingly
        return this.authService.currentUser$().pipe(
          take(1),
          map((user) => {
            if (user?.role === USER_ROLES.ADMIN) {
              // Admin logged in, redirect to admin dashboard
              return this.router.createUrlTree([APP_ROUTES.ADMIN_DASHBOARD]);
            }
            // Regular user logged in, redirect to explore
            return this.router.createUrlTree([APP_ROUTES.EXPLORE]);
          })
        );
      })
    );
  }
}
