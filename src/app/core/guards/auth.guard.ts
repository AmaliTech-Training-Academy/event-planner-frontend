import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
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

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn().pipe(
      take(1),
      switchMap((isLoggedIn) => {
        if (!isLoggedIn) {
          return of(this.router.createUrlTree([APP_ROUTES.LOGIN]));
        }

        return this.authService.currentUser$().pipe(
          take(1),
          map((user) => {
            const requestedUrl = state.url; // Get the requested URL

            if (!user) {
              return this.router.createUrlTree([APP_ROUTES.LOGIN]);
            }

            // Allow admins to access /app routes
            if (
              user.role === USER_ROLES.ADMIN &&
              requestedUrl.startsWith('/app/')
            ) {
              return true; // ✅ Allow access
            }

            if (user.role === USER_ROLES.ADMIN) {
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
