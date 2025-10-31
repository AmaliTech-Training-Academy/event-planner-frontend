import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { APP_ROUTES } from '../constants/app-routes.constants';
import { USER_ROLES } from '../constants/user.constants';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  canActivate(): Observable<boolean | UrlTree> {
    if (this.authService.currentUser()?.role == USER_ROLES.ADMIN) {
      return of(true);
    }
    return of(this.router.createUrlTree([APP_ROUTES.ADMIN_LOGIN]));
  }
}
