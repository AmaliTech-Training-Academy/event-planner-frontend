import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
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

    canActivate(): Observable<boolean | UrlTree> {
        return this.authService.isLoggedIn().pipe(
            take(1),
            map(isLoggedIn => {
                return isLoggedIn ? this.router.createUrlTree([APP_ROUTES.EXPLORE]) : true;
            })
        );
    }
}
