import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, take } from 'rxjs';
import { APP_ROUTES } from '../constants/app-routes.constants';

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
      map((isLoggedIn) => {
        // if logged in redirect users to landing or explore else allow access to auth pages
        return isLoggedIn
          ? this.router.createUrlTree([APP_ROUTES.EXPLORE])
          : true;
      })
    );
  }
}
