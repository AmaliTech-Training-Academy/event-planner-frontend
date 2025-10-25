import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { APP_ROUTES } from '../constants/app-routes.constants';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService, private readonly router: Router) { }

    canActivate(): Observable<boolean | UrlTree> {
        return this.authService.isLoggedIn().pipe(
            take(1),
            switchMap(isLoggedIn => {
                if (isLoggedIn) {
                    return of(true);
                } else {
                    return of(this.router.createUrlTree([APP_ROUTES.LOGIN]));
                }
            }),
            catchError(() => of(this.router.createUrlTree([APP_ROUTES.LOGIN])))
        );
    }
}
