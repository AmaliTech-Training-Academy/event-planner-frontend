import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { APP_ROUTES } from '../constants/app-routes.constants';
import { User } from '../models/user.model';
import { AuthBackendService } from './backend/auth-backend.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _loggedIn$ = new BehaviorSubject<boolean>(false);
  private _userInfo$ = new BehaviorSubject<User | null>(null);
  private _loadingStateSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingStateSubject.asObservable();
  private email: string = '';

  constructor(
    private readonly authBackend: AuthBackendService,
    private readonly router: Router,
    private readonly errorHandlerService: ErrorHandlerService
  ) { }

  public login(email: string, password: string) {
    this.setLoading(true);

    return this.authBackend.login(email, password)
      .pipe(
        tap(() => {
          this.email = email;
          this.router.navigate([APP_ROUTES.VERIFY_EMAIL]);
        }),
        catchError(err => this.errorHandlerService.handle(err)),
        finalize(() => this.setLoading(false))
      );


  }
  public adminLogin(email: string, password: string) {
    this.setLoading(true);
    return this.authBackend.adminLogin(email, password).pipe(
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
        tap(() => {

          this.router.navigate([APP_ROUTES.LOGIN]);
        }), catchError(err => this.errorHandlerService.handle(err)),

        finalize(() => this.setLoading(false))
      );
  }

  public verifyEmail(otp: string, email: string) {
    this.setLoading(true);
    return this.authBackend.verifyEmail(otp, email).pipe(
      tap((response) => {
        this._loggedIn$.next(true);
        this.router.navigate([APP_ROUTES.LANDING_PAGE]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }
  public resendOtp(email: string): Observable<any> {
    this.setLoading(true);
    return this.authBackend.resendOtp(email).pipe(
      tap(() => { }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public logout() {
    this.setLoading(true);
    return this.authBackend.logout().pipe(
      tap(() => {
        this._loggedIn$.next(false);
        this._userInfo$.next(null);
        this.router.navigate([APP_ROUTES.LOGIN]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public checkAuthUser(userId: string) {
    this.setLoading(true);
    return this.authBackend.checkAuthUser(userId).pipe(
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
      tap(() => {
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

        tap(() => {
          this.email = email;
          this.router.navigate([APP_ROUTES.RESET_PASSWORD]);
        }),
        catchError(err => this.errorHandlerService.handle(err)),
        finalize(() => this.setLoading(false))
      )

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
    return this.email;
  }
}
