import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  of,
  tap,
  take,
} from 'rxjs';
import { APP_ROUTES } from '../constants/app-routes.constants';
import { User } from '../models/user.model';
import { AuthBackendService } from './backend/auth-backend.service';
import { ErrorHandlerService } from './error-handler.service';
import { AUTH_STORAGE } from '../constants/storage.constants';
import { AuthStorage } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _loggedIn$ = new BehaviorSubject<boolean>(false);
  private _userInfo$ = new BehaviorSubject<User | null>(null);
  private _loadingStateSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingStateSubject.asObservable();
  private _email: string = '';
  private _otp: string = '';
  private _isResset: boolean = false;

  constructor(
    private readonly authBackend: AuthBackendService,
    private readonly router: Router,
    private readonly errorHandlerService: ErrorHandlerService
  ) {
    this.onload()
  }

  public login(email: string, password: string) {
    this.setLoading(true);

    return this.authBackend.login(email, password)
      .pipe(
        take(1),
        tap(() => {
          this._email = email;
          this._isResset = false;
          this.router.navigate([APP_ROUTES.VERIFY_EMAIL]);
        }),
        catchError(err => this.errorHandlerService.handle(err)),
        finalize(() => this.setLoading(false))
      );


  }
  public adminLogin(email: string, password: string) {
    this.setLoading(true);
    return this.authBackend.adminLogin(email, password).pipe(
      take(1),
      tap(() => {
        this.router.navigate([APP_ROUTES.ADMIN_DASHBOARD]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );

  }

  public register(
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    this.setLoading(true);
    return this.authBackend
      .register(fullName, email, password, confirmPassword)
      .pipe(
        take(1),
        tap(() => {

          this.router.navigate([APP_ROUTES.LOGIN]);
        }), catchError(err => this.errorHandlerService.handle(err)),

        finalize(() => this.setLoading(false))
      );
  }

  public verifyEmail(otp: string, email: string) {
    this.setLoading(true);

    if (this._isResset) {
      this._email = email;
      this._otp = otp;
      this.router.navigate([APP_ROUTES.RESET_PASSWORD])
      this.setLoading(false);

      return of(null);
    }

    return this.authBackend.verifyEmail(otp, email).pipe(
      take(1),
      tap((response) => {
        this._loggedIn$.next(true);
        this._email = "";
        this._otp = "";
        this.saveAuthToStorage(response?.data?.id || '')
        this.router.navigate([APP_ROUTES.LANDING_PAGE]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }


  public resendOtp(email: string): Observable<any> {
    this.setLoading(true);
    return this.authBackend.resendOtp(email).pipe(
      take(1),
      tap(() => { }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public logout() {
    this.setLoading(true);
    return this.authBackend.logout().pipe(
      take(1),
      tap(() => {
        this._loggedIn$.next(false);
        this._userInfo$.next(null);
        this.clearAuthStorage()
        this.router.navigate([APP_ROUTES.LOGIN]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public checkAuthUser(userId: string) {
    this.setLoading(true);
    return this.authBackend.checkAuthUser(userId).pipe(
      take(1),
      tap((response) => {
        this._userInfo$.next(response?.data);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }
  public resetPassword(otp: string, email: string, password: string) {
    this.setLoading(true);
    return this.authBackend.resetPassword(otp, email, password).pipe(
      take(1),
      tap(() => {
        this._email = "";
        this._otp = "";
        this._isResset = false;
        this.router.navigate([APP_ROUTES.LOGIN]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public forgotPassword(email: string) {
    this.setLoading(true);

    return this.authBackend.forgotPassword(email)
      .pipe(
        take(1),
        tap(() => {
          this._email = email;
          this._isResset = true;
          this.router.navigate([APP_ROUTES.VERIFY_EMAIL]);
        }),
        catchError(err => this.errorHandlerService.handle(err)),
        finalize(() => this.setLoading(false))
      )

  }

  private onload() {
    const stored = localStorage.getItem(AUTH_STORAGE.AUTH);
    if (stored) {
      const data = JSON.parse(stored) as AuthStorage;
      this._loggedIn$.next(data[AUTH_STORAGE.AUTHENTICATED]);
      if (data[AUTH_STORAGE.USER_ID]) {
        this.checkAuthUser(data[AUTH_STORAGE.USER_ID]).subscribe();
      }
    }
  }

  private saveAuthToStorage(userId: string) {
    localStorage.setItem(AUTH_STORAGE.AUTH, JSON.stringify({
      [AUTH_STORAGE.AUTHENTICATED]: true,
      [AUTH_STORAGE.USER_ID]: userId
    }));
  }

  private clearAuthStorage() {
    localStorage.removeItem(AUTH_STORAGE.AUTH);
  }

  public isLoggedIn(): Observable<boolean> {
    return this._loggedIn$.asObservable();
  }

  public currentUser(): User | null {
    return this._userInfo$.getValue();
  }

  private setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }

  public getEmail(): string {
    return this._email;
  }

  public getOtp(): string {
    return this._otp;
  }
}
