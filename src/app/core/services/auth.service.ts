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
import { OtpBodyData } from '../models/auth-response.model';
import { USER_ROLES } from '../constants/user.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _loggedIn$ = new BehaviorSubject<boolean>(false);
  private readonly _userInfo$ = new BehaviorSubject<OtpBodyData | null>(null);
  private readonly _loadingStateSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingStateSubject.asObservable();
  private _email: string = '';
  private _otp: string = '';
  private _isResset: boolean = false;
  private _currentAuthContext: 'user' | 'admin' | null = null;

  constructor(
    private readonly authBackend: AuthBackendService,
    private readonly router: Router,
    private readonly errorHandlerService: ErrorHandlerService
  ) {
    this.onload();
  }

  public login(email: string, password: string) {
    this.setLoading(true);

    return this.authBackend.login(email, password).pipe(
      take(1),
      tap(() => {
        this._email = email;
        this._isResset = false;
        this._currentAuthContext = 'user';
        this.router.navigate([APP_ROUTES.VERIFY_EMAIL]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public adminLogin(email: string, password: string) {
    this.setLoading(true);

    return this.authBackend.adminLogin(email, password).pipe(
      take(1),
      tap((response: any) => {
        const userData = response?.data;
        if (userData) {
          this._loggedIn$.next(true);
          this._userInfo$.next(userData);
          this._currentAuthContext = 'admin';

          this.saveAuthToStorage(
            userData.id.toString(),
            userData.fullName,
            userData.profilePicture,
            userData.email,
            userData.role,
            'admin'
          );
        }

        this.router.navigate([APP_ROUTES.ADMIN_DASHBOARD]);
      }),
      catchError((err) => {
        return this.errorHandlerService.handle(err);
      }),
      finalize(() => {
        this.setLoading(false);
      })
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
          this._currentAuthContext = 'user';
          this.router.navigate([APP_ROUTES.LOGIN]);
        }),
        catchError((err) => this.errorHandlerService.handle(err)),
        finalize(() => this.setLoading(false))
      );
  }

  public verifyEmail(otp: string, email: string) {
    this.setLoading(true);

    if (this._isResset) {
      this._email = email;
      this._otp = otp;
      this.router.navigate([APP_ROUTES.RESET_PASSWORD]);
      this.setLoading(false);
      return of(null);
    }

    return this.authBackend.verifyEmail(otp, email).pipe(
      take(1),
      tap((response) => {
        const userData = response?.data;
        if (userData) {
          this._loggedIn$.next(true);
          this._userInfo$.next(userData);
          this._email = '';
          this._otp = '';
          this._currentAuthContext = 'user';

          this.saveAuthToStorage(
            userData.id.toString(),
            userData.fullName,
            userData.profilePicture,
            userData.email,
            userData.role,
            'user'
          );
        }
        this.router.navigate([APP_ROUTES.EXPLORE]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public resendOtp(email: string): Observable<any> {
    this.setLoading(true);
    return this.authBackend.resendOtp(email).pipe(
      take(1),
      tap(() => {}),
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
        this.clearAuthStorage('user');
        this._currentAuthContext = null;
        this.router.navigate([APP_ROUTES.LOGIN]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public adminLogout() {
    this.setLoading(true);
    return this.authBackend.logout().pipe(
      take(1),
      tap(() => {
        this._loggedIn$.next(false);
        this._userInfo$.next(null);
        this.clearAuthStorage('admin');
        this._currentAuthContext = null;
        this.router.navigate([APP_ROUTES.ADMIN_LOGIN]);
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
        const user = response?.data;
        if (user) {
          const userData: OtpBodyData = {
            id: user.userId,
            email: user.email,
            fullName: user.fullName,
            profilePicture: user.avatar || user.profileImageUrl || null,
            role: user.role,
          };
          this._userInfo$.next(userData);
        }
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
        this._email = '';
        this._otp = '';
        this._isResset = false;
        this.router.navigate([APP_ROUTES.LOGIN]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public forgotPassword(email: string) {
    this.setLoading(true);

    return this.authBackend.forgotPassword(email).pipe(
      take(1),
      tap(() => {
        this._email = email;
        this._isResset = true;
        this.router.navigate([APP_ROUTES.VERIFY_EMAIL]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public updateProfile(fullName: string, email: string) {
    const currentUser = this.currentUser();
    if (!currentUser) {
      return of(null);
    }

    this.setLoading(true);
    return this.authBackend
      .updateProfile(currentUser.id.toString(), { fullName, email })
      .pipe(
        take(1),
        tap((response) => {
          const userData = response?.data;
          if (userData) {
            this._userInfo$.next(userData);
            const context = this._currentAuthContext || 'user';
            this.saveAuthToStorage(
              userData.id.toString(),
              userData.fullName,
              userData.profilePicture,
              userData.email,
              userData.role,
              context
            );
          }
        }),
        catchError((err) => this.errorHandlerService.handle(err)),
        finalize(() => this.setLoading(false))
      );
  }

  public uploadAvatar(file: File) {
    const currentUser = this.currentUser();
    if (!currentUser) {
      return of(null);
    }

    this.setLoading(true);
    return this.authBackend.uploadAvatar(currentUser.id.toString(), file).pipe(
      take(1),
      tap((response) => {
        const newAvatarUrl = response?.data?.profilePicture;
        if (newAvatarUrl && currentUser) {
          const updatedUser: OtpBodyData = {
            ...currentUser,
            profilePicture: newAvatarUrl,
          };
          this._userInfo$.next(updatedUser);
          const context = this._currentAuthContext || 'user';
          this.saveAuthToStorage(
            updatedUser.id.toString(),
            updatedUser.fullName,
            updatedUser.profilePicture,
            updatedUser.email,
            updatedUser.role,
            context
          );
        }
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public updateStoredUserInfo(userData: OtpBodyData): void {
    this._userInfo$.next(userData);
    const context =
      this._currentAuthContext ||
      (userData.role === USER_ROLES.ADMIN ? 'admin' : 'user');
    this.saveAuthToStorage(
      userData.id.toString(),
      userData.fullName,
      userData.profilePicture,
      userData.email,
      userData.role,
      context
    );
  }

  private onload() {
    const userStored = localStorage.getItem(AUTH_STORAGE.AUTH);
    const adminStored = localStorage.getItem(AUTH_STORAGE.AUTH + '_admin');

    const currentPath = window.location.pathname;
    const isAdminRoute = currentPath.includes('/admin');

    let stored = null;
    let context: 'user' | 'admin' | null = null;

    if (isAdminRoute && adminStored) {
      stored = adminStored;
      context = 'admin';
    } else if (!isAdminRoute && userStored) {
      stored = userStored;
      context = 'user';
    }

    if (stored && context) {
      try {
        const data = JSON.parse(stored) as AuthStorage;

        this._loggedIn$.next(data[AUTH_STORAGE.AUTHENTICATED]);
        this._currentAuthContext = context;

        if (data[AUTH_STORAGE.AUTHENTICATED]) {
          const userData: OtpBodyData = {
            id: parseInt(data[AUTH_STORAGE.USER_ID], 10),
            email: data[AUTH_STORAGE.EMAIL],
            fullName: data[AUTH_STORAGE.FULL_NAME],
            profilePicture: data[AUTH_STORAGE.PROFILE_PICTURE],
            role: data[AUTH_STORAGE.ROLE],
          };

          this._userInfo$.next(userData);
        }
      } catch (error) {}
    }
  }

  private saveAuthToStorage(
    userId: string,
    fullName: string,
    profilePicture: string | null,
    email: string,
    role: string,
    context: 'user' | 'admin'
  ) {
    const authData = {
      [AUTH_STORAGE.AUTHENTICATED]: true,
      [AUTH_STORAGE.USER_ID]: userId,
      [AUTH_STORAGE.FULL_NAME]: fullName,
      [AUTH_STORAGE.PROFILE_PICTURE]: profilePicture,
      [AUTH_STORAGE.EMAIL]: email,
      [AUTH_STORAGE.ROLE]: role,
    };

    const storageKey =
      context === 'admin' ? AUTH_STORAGE.AUTH + '_admin' : AUTH_STORAGE.AUTH;

    localStorage.setItem(storageKey, JSON.stringify(authData));
  }

  public clearAuthStorage(context: 'user' | 'admin') {
    const storageKey =
      context === 'admin' ? AUTH_STORAGE.AUTH + '_admin' : AUTH_STORAGE.AUTH;

    localStorage.removeItem(storageKey);
  }

  public isLoggedIn(): Observable<boolean> {
    return this._loggedIn$.asObservable();
  }

  public currentUser$(): Observable<OtpBodyData | null> {
    return this._userInfo$.asObservable();
  }

  public currentUser(): OtpBodyData | null {
    return this._userInfo$.getValue();
  }

  public getCurrentAuthContext(): 'user' | 'admin' | null {
    return this._currentAuthContext;
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


  public clearAdminSession(): void {
    this._loggedIn$.next(false);
    this._userInfo$.next(null);
    this._currentAuthContext = null;
    this.clearAuthStorage('admin');
  }

 
  public clearUserSession(): void {
    this._loggedIn$.next(false);
    this._userInfo$.next(null);
    this._currentAuthContext = null;
    this.clearAuthStorage('user');
  }
}
