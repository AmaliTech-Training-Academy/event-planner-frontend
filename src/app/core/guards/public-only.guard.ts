import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map, Observable, take } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PublicOnlyGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): Observable<boolean | UrlTree> {
        return this.authService?.isLoggedIn().pipe(
            take(1),
            map(isLoggedIn => {
                return isLoggedIn ? this.router.createUrlTree(['/']) : true;
            })
        );
    }
}
