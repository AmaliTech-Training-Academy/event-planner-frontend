import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, map, switchMap, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): Observable<boolean | UrlTree> {
        return this.authService?.isLoggedIn().pipe(
            take(1),
            switchMap(isLoggedIn => {
                if (isLoggedIn) {
                    return of(true);
                } else {
                    return of(this.router.createUrlTree(['/auth/login']));
                }
            }),
            catchError(() => of(this.router.createUrlTree(['/auth/login'])))
        );
    }
}
