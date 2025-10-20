import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';



@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly _apiUrl = `${environment.API_URL}/auth`;

    private _loggedIn$ = new BehaviorSubject<boolean>(false);
    private _userInfo$ = new BehaviorSubject<User | null>(null);
    private _access_token: string | null = null
    private _refresh_token: string | null = null

    constructor(private http: HttpClient, private router: Router) { }

    public login(email: string, password: string) {
        return this.http.post(`${this._apiUrl}/login`, { email, password }, { withCredentials: true })
            .pipe(
                tap(() => {
                    this.router.navigate(['/auth/verify-email']);
                }),
                catchError(err => {
                    // error handling implimentation goes here
                    return of(err);
                })
            );
    }

    public register(fullName: string, email: string, password: string, confirmPassword: string) {
        return this.http.post(`${this._apiUrl}/register`, { fullName, email, password, confirmPassword }, { withCredentials: true })
            .pipe(
                tap(() => {
                    this.router.navigate(['/auth/verify-email']);
                }), catchError(err => {
                    // error handling implimentation goes here
                    return of(err);
                })
            );
    }


    public verifyEmail(otp: string, email: string) {
        return this.http.post<{ access_token: string, refresh_token: string }>(`${this._apiUrl}/auth/verify-otp`, { otp, email }, { withCredentials: true })
            .pipe(
                tap((response) => {
                    this._access_token = response.access_token;
                    this._refresh_token = response.refresh_token;
                    this._loggedIn$.next(true);
                    this.router.navigate(['/']);
                }),
                catchError(err => {
                    // error handling implimentation goes here
                    return of(err);
                })
            )
    }

    public logout() {
        return this.http.post(`${this._apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
            tap(() => {
                this._loggedIn$.next(false);
                this._userInfo$.next(null);
                this._access_token = null;
                this._refresh_token = null;
                this.router.navigate(['/auth/login']);
            }),
            catchError(err => {
                // error handling implimentation goes here
                return of(err);
            })
        );
    }

    public checkAuthUser(userId: string) {
        return this.http.get<{ data: User }>(`${this._apiUrl}/users/${userId}`, { withCredentials: true }).pipe(
            tap(response => {
                this._userInfo$.next(response?.data)
            }),
            catchError(err => {
                // error handling implimentation goes here
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

    public getAccessToken(){
        return this._access_token;
    }

    public getRefreshToken(){
        return this._refresh_token;
    }

}
