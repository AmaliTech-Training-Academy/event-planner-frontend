import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, take, switchMap } from 'rxjs';
import { APP_ROUTES } from '../constants/app-routes.constants';
import { USER_ROLES } from '../constants/user.constants';

@Injectable({
  providedIn: 'root',
})
export class UnAuthenticatedUsersOnlyGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | boolean {
    // Allow invitation acceptance route without checking authentication
    const url = route.url.map((segment) => segment.path).join('/');
    if (url.includes('invitation/accept')) {
      return true;
    }

    return this.authService.isLoggedIn().pipe(
      take(1),
      switchMap((isLoggedIn) => {
        if (!isLoggedIn) {
          // Not logged in, allow access to auth pages
          return [true];
        }

        // User is logged in, redirect based on role
        return this.authService.currentUser$().pipe(
          take(1),
          map((user) => {
            if (!user) {
              return true;
            }

            // Redirect to appropriate dashboard based on role
            if (user.role === USER_ROLES.ADMIN) {
              return this.router.createUrlTree([APP_ROUTES.ADMIN_DASHBOARD]);
            } else {
              return this.router.createUrlTree([APP_ROUTES.MY_EVENTS]);
            }
          })
        );
      })
    );
  }
}
