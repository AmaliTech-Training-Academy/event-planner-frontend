import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  of,
  take,
  tap,
} from 'rxjs';
import { APP_ROUTES } from '../constants/app-routes.constants';
import { AUTH_STORAGE } from '../constants/storage.constants';
import { OtpBodyData } from '../models/auth-response.model';
import { AuthStorage } from '../models/auth.model';
import { AuthBackendService, EventInvitationPayload } from './backend/auth-backend.service';
import { ErrorHandlerService } from './error-handler.service';
import { UpdateUserPayload, UserBackendService } from './backend/user-backend.service';
import { USER_ROLES } from '../constants/user.constants';
import { User } from '../models';
import { NotificationService } from './notification.service';

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
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private TOKEN_REFRESH_INTERVAL: number = 15 as const;

  constructor(
    private readonly authBackend: AuthBackendService,
    private readonly router: Router,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly userBackendService: UserBackendService,
    private readonly notificationService: NotificationService,
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
      finalize(() => this.setLoading(false)),
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
            'admin',
            new Date(),
          );

          this.notificationService.success(`Welcome back, ${userData.fullName}!`);
        }

        this.startAutomaticRefresh(new Date());
        this.router.navigate([APP_ROUTES.ADMIN_DASHBOARD]);
      }),
      catchError((err) => {
        return this.errorHandlerService.handle(err); // ← ADD 'return' here!
      }),
      finalize(() => {
        this.setLoading(false);
      }),
    );
  }

  public register(
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) {
    this.setLoading(true);
    return this.authBackend
      .register(fullName, email, password, confirmPassword)
      .pipe(
        take(1),
        tap(() => {
          this.router.navigate([APP_ROUTES.LOGIN]);
        }),
        catchError((err) => this.errorHandlerService.handle(err)),
        finalize(() => this.setLoading(false)),
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
            'user',
            new Date(),
            userData.phone || '',
            userData.address || '',
          );

          this.notificationService.success(`Welcome back, ${userData.fullName}!`);
        }
        this.startAutomaticRefresh(new Date());
        this.router.navigate([APP_ROUTES.MY_EVENTS]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false)),
    );
  }

  public resendOtp(email: string): Observable<any> {
    this.setLoading(true);
    return this.authBackend.resendOtp(email).pipe(
      take(1),
      tap(() => { }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false)),
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
      finalize(() => this.setLoading(false)),
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
      finalize(() => this.setLoading(false)),
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
      finalize(() => this.setLoading(false)),
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
      finalize(() => this.setLoading(false)),
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
      finalize(() => this.setLoading(false)),
    );
  }

  public updateUser(userId: string, data: UpdateUserPayload) {
    const formData = new FormData();
    const formDataText: string = JSON.stringify({
      phone: data.phone,
      email: data.email,
      fullName: data.fullName,
      address: data.address,
      status: true,
    });
    formData.append('userUpdateRequest', formDataText);
    this.setLoading(true);
    return this.userBackendService
      .updateUserWithFormData(userId, formData)
      .pipe(
        take(1),
        tap((response) => {
          let user_: User = response.data;

          const data_ = localStorage.getItem(AUTH_STORAGE.AUTH);
          if (!data_ || data_ === '') return;

          const dataPasered = JSON.parse(data_) as AuthStorage;

          this.saveAuthToStorage(
            user_.userId.toString() || dataPasered[AUTH_STORAGE.USER_ID],
            user_.fullName || dataPasered[AUTH_STORAGE.FULL_NAME],
            user_.profileImageUrl || dataPasered[AUTH_STORAGE.PROFILE_PICTURE],
            user_.email || dataPasered[AUTH_STORAGE.EMAIL],
            dataPasered[AUTH_STORAGE.ROLE],
            this.currentUser()?.role === USER_ROLES.ADMIN ? 'admin' : 'user',
            new Date(dataPasered[AUTH_STORAGE.REFRESHED_AT]),
            user_.phone || dataPasered[AUTH_STORAGE.PHONE_NUMBER],
            user_.address || dataPasered[AUTH_STORAGE.ADDRESS],
          );

          const data: OtpBodyData = {
            email: user_.email,
            fullName: user_.fullName,
            role: user_.role,
            profilePicture: user_.profileImageUrl as string,
            id: user_.userId,
            address: user_.address,
            phone: user_.phone,
          };
          this._userInfo$.next(data);
        }),
        catchError((err) => this.errorHandlerService.handle(err)),
        finalize(() => this.setLoading(false)),
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
      context,
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
              context,
            );
          }
        }),
        catchError((err) => this.errorHandlerService.handle(err)),
        finalize(() => this.setLoading(false)),
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
            context,
          );
        }
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false)),
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
            address: data[AUTH_STORAGE.ADDRESS],
            phone: data[AUTH_STORAGE.PHONE_NUMBER],
          };

          this._userInfo$.next(userData);

          const refreshedAt = data[AUTH_STORAGE.REFRESHED_AT];
          this.refreshTimer = setTimeout(() => {
            this.startAutomaticRefresh(refreshedAt);
          }, 500);
        }
      } catch (error) { }
    }
  }

  private saveAuthToStorage(
    userId: string,
    fullName: string,
    profilePicture: string | null,
    email: string,
    role: string,
    context: 'user' | 'admin',
    refreshAt: Date = new Date(),
    phone: string = '',
    address: string = '',
  ) {
    const authData = {
      [AUTH_STORAGE.AUTHENTICATED]: true,
      [AUTH_STORAGE.USER_ID]: userId,
      [AUTH_STORAGE.FULL_NAME]: fullName,
      [AUTH_STORAGE.PROFILE_PICTURE]: profilePicture,
      [AUTH_STORAGE.EMAIL]: email,
      [AUTH_STORAGE.ROLE]: role,
      [AUTH_STORAGE.REFRESHED_AT]: refreshAt.toISOString(),
      [AUTH_STORAGE.PHONE_NUMBER]: phone,
      [AUTH_STORAGE.ADDRESS]: address,
    };

    const storageKey =
      context === 'admin' ? AUTH_STORAGE.AUTH + '_admin' : AUTH_STORAGE.AUTH;

    localStorage.setItem(storageKey, JSON.stringify(authData));
  }

  private startAutomaticRefresh(lastRefresh: Date | string) {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const lastRefresh_ = new Date(lastRefresh);

    if (!lastRefresh_ || isNaN(lastRefresh_.getTime())) {
      return this.refreshToken();
    }

    const now = new Date();
    const refreshIntervalMs = this.TOKEN_REFRESH_INTERVAL * 60 * 1000;
    const nextRefreshTime = new Date(
      lastRefresh_.getTime() + refreshIntervalMs,
    );

    const delay = nextRefreshTime.getTime() - now.getTime();

    if (delay <= 0) {
      this.refreshToken();
    } else {
      this.refreshTimer = setTimeout(() => this.refreshToken(), delay);
    }
  }

  private refreshToken() {
    const newRefreshTime = new Date();
    const context = this._currentAuthContext || 'user';
    const storageKey =
      context === 'admin' ? AUTH_STORAGE.AUTH + '_admin' : AUTH_STORAGE.AUTH;
    const stored = localStorage.getItem(storageKey);

    if (!stored) return;

    const data = JSON.parse(stored) as AuthStorage;

    this.authBackend
      .refreshToken()
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.saveAuthToStorage(
            data[AUTH_STORAGE.USER_ID],
            data[AUTH_STORAGE.FULL_NAME],
            data[AUTH_STORAGE.PROFILE_PICTURE],
            data[AUTH_STORAGE.EMAIL],
            data[AUTH_STORAGE.ROLE],
            context,
            newRefreshTime,
            data[AUTH_STORAGE.PHONE_NUMBER],
            data[AUTH_STORAGE.ADDRESS],
          );

          this.startAutomaticRefresh(newRefreshTime);
        },
        error: () => {
          if (context === 'admin') {
            this.adminLogout();
          } else {
            this.logout();
          }
        },
      });
  }

  private clearAuthStorage(context: 'user' | 'admin') {
    const storageKey =
      context === 'admin' ? AUTH_STORAGE.AUTH + '_admin' : AUTH_STORAGE.AUTH;

    localStorage.removeItem(storageKey);

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
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

  public acceptInvitation(
    fullName: string,
    password: string,
    confirmPassword: string,
    invitationToken: string,
  ) {
    this.setLoading(true);

    return this.authBackend
      .acceptInvitation({
        fullName,
        password,
        confirmPassword,
        invitationToken,
      })
      .pipe(
        take(1),
        tap((response) => {
          const userData = response?.data;

          if (userData) {
            const role = String(userData.role).trim().toUpperCase();

            this._loggedIn$.next(true);
            this._userInfo$.next(userData);

            if (role === 'ADMIN') {
              this._currentAuthContext = 'admin';

              this.saveAuthToStorage(
                userData.id.toString(),
                userData.fullName,
                userData.profilePicture,
                userData.email,
                userData.role,
                'admin',
                new Date(),
              );

              this.startAutomaticRefresh(new Date());

              setTimeout(() => {
                this.router.navigate([APP_ROUTES.ADMIN_DASHBOARD]);
              }, 500);
            } else {
              this._currentAuthContext = 'user';

              this.saveAuthToStorage(
                userData.id.toString(),
                userData.fullName,
                userData.profilePicture,
                userData.email,
                userData.role,
                'user',
                new Date(),
                userData.phone || '',
                userData.address || '',
              );

              this.startAutomaticRefresh(new Date());

              setTimeout(() => {
                this.router.navigate([APP_ROUTES.MY_EVENTS]);
              }, 500);
            }
          }
        }),
        catchError((err) => {
          return this.errorHandlerService.handle(err);
        }),
        finalize(() => {
          this.setLoading(false);
        }),
      );
  }

  public acceptEventInvitation(
    fullName: string,
    invitationCode: string,
    password: string,
  ): Observable<void> {
    this.setLoading(true);

    const payload: EventInvitationPayload = {
      fullName,
      invitationCode,
      password,
    };

    return this.authBackend.acceptEventInvitation(payload).pipe(
      take(1),
      tap(() => {
        this.router.navigate([APP_ROUTES.LOGIN]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false)),
    );
  }
}
