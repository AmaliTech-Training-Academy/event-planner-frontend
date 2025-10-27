import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { APP_ROUTES } from '../constants/app-routes.constants';
import { User } from '../models/user.model';
import { AuthBackendService } from './backend/auth-backend.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private _loggedIn$ = new BehaviorSubject<boolean>(false);
    private _userInfo$ = new BehaviorSubject<User | null>(null);

    constructor(private readonly authBackend: AuthBackendService, private readonly router: Router) { }

    public login(email: string, password: string) {
        return this.authBackend.login(email, password)
            .pipe(
                tap(() => {
                    this.router.navigate([APP_ROUTES.VERIFY_EMAIL], {
                        queryParams: { email },
                    });
                }),
                catchError(err => {
                    //TODO: error handling implimentation goes here
                    return of(err);
                })
            );
    }

    public register(fullName: string, email: string, password: string, confirmPassword: string) {
        return this.authBackend.register(fullName, email, password, confirmPassword)
            .pipe(
                tap(() => {
                    this.router.navigate([APP_ROUTES.LOGIN], {
                        queryParams: { email },
                    });
                }), catchError(err => {
                    //TODO: error handling implimentation goes here
                    return of(err);
                })
            );
    }


    public verifyEmail(otp: string, email: string) {
        return this.authBackend.verifyEmail(otp, email)
            .pipe(
                tap((response) => {
                    this._loggedIn$.next(true);
                    this.router.navigate([APP_ROUTES.LANDING_PAGE]);
                }),
                catchError(err => {
                    //TODO: error handling implimentation goes here
                    return of(err);
                })
            )
    }
    
    public forgotPassword(email: string) {
        return this.authBackend.forgotPassword(email)
            .pipe(
                catchError(err => {
                    //TODO: error handling implimentation goes here
                    return of(err);
                })
            )
    }

    public logout() {
        return this.authBackend.logout()
            .pipe(
                tap(() => {
                    this._loggedIn$.next(false);
                    this._userInfo$.next(null);
                    this.router.navigate([APP_ROUTES.LOGIN]);
                }),
                catchError(err => {
                    //TODO: error handling implimentation goes here
                    return of(err);
                })
            );
    }

    public checkAuthUser(userId: string) {
        return this.authBackend.checkAuthUser(userId)
            .pipe(
                tap(response => {
                    this._userInfo$.next(response?.data)
                }),
                catchError(err => {
                    //TODO: error handling implimentation goes here
                    return of(err);
                })
            );
    }


    public isLoggedIn(): Observable<boolean> {
        return this._loggedIn$.asObservable();
    }

    public currentUser(): User | null {
        return this._userInfo$.getValue()
    }

}
