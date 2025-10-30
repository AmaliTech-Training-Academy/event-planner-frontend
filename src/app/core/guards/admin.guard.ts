import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { APP_ROUTES } from '../constants/app-routes.constants';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.getUserRole().pipe(
      take(1),
      map((role) => {
        if (role === 'admin') return true;
        return this.router.createUrlTree([APP_ROUTES.LANDING_PAGE]); // redirect non-admins
      }),
      catchError(() => of(this.router.createUrlTree([APP_ROUTES.LOGIN])))
    );
  }
}
