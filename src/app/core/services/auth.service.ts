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
import { AuthBackendService } from './backend/auth-backend.service';
import { UpdateUserPayload, UserBackendService } from './backend/user-backend.service';
import { ErrorHandlerService } from './error-handler.service';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _loggedIn$ = new BehaviorSubject<boolean>(false);
  private _userInfo$ = new BehaviorSubject<OtpBodyData | null>(null);
  private _loadingStateSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingStateSubject.asObservable();
  private _email: string = '';
  private _otp: string = '';
  private _isResset: boolean = false;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private TOKEN_REFRESH_INTERVAL:number = 15 as const;

  constructor(
    private readonly authBackend: AuthBackendService,
    private readonly router: Router,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly userBackendService: UserBackendService
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

          this.saveAuthToStorage(
            userData.id.toString(),
            userData.fullName,
            userData.profilePicture,
            userData.email,
            userData.role
          );
        }
        this.startAutomaticRefresh(new Date());

        // Route to Explore page instead
        this.router.navigate([APP_ROUTES.MY_EVENTS]);
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
        this.clearAuthStorage();
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
        this.clearAuthStorage();
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
          console.log(response);
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

  public updateUser(userId: string, data: UpdateUserPayload) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    this.setLoading(true);
    return this.userBackendService
      .updateUserWithFormData(userId, formData)
      .pipe(
        take(1),
        tap((response) => {
          let user_: User = response.data;
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
        finalize(() => this.setLoading(false))
      );
  }

  private onload() {
    const stored = localStorage.getItem(AUTH_STORAGE.AUTH);

    if (stored) {
      const data = JSON.parse(stored) as AuthStorage;
      this._loggedIn$.next(data[AUTH_STORAGE.AUTHENTICATED]);

      if (data[AUTH_STORAGE.AUTHENTICATED]) {
        const userData: OtpBodyData = {
          id: parseInt(data[AUTH_STORAGE.USER_ID], 10),
          email: data[AUTH_STORAGE.EMAIL],
          fullName: data[AUTH_STORAGE.FULL_NAME],
          profilePicture: data[AUTH_STORAGE.PROFILE_PICTURE],
          role: data[AUTH_STORAGE.ROLE],
          address: data[AUTH_STORAGE.PHONE_NUMBER],
          phone: data[AUTH_STORAGE.ADDRESS],
        };
        this._userInfo$.next(userData);
        const refreshedAt = data[AUTH_STORAGE.REFRESHED_AT]
        this.refreshTimer = setTimeout(() => {
          this.startAutomaticRefresh(refreshedAt);
        }, 500);
      }
    }
  }

  private saveAuthToStorage(
    userId: string,
    fullName: string,
    profilePicture: string | null,
    email: string,
    role: string,
    refreshAt: Date = new Date(),
    phone: string = "",
    address:string = ""
  ) {
    localStorage.setItem(
      AUTH_STORAGE.AUTH,
      JSON.stringify({
        [AUTH_STORAGE.AUTHENTICATED]: true,
        [AUTH_STORAGE.USER_ID]: userId,
        [AUTH_STORAGE.FULL_NAME]: fullName,
        [AUTH_STORAGE.PROFILE_PICTURE]: profilePicture,
        [AUTH_STORAGE.EMAIL]: email,
        [AUTH_STORAGE.ROLE]: role,
        [AUTH_STORAGE.REFRESHED_AT]: refreshAt.toISOString(),
        [AUTH_STORAGE.PHONE_NUMBER]: phone,
        [AUTH_STORAGE.ADDRESS]: address
      })
    );
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
    const nextRefreshTime = new Date(lastRefresh_.getTime() + refreshIntervalMs);

    const delay = nextRefreshTime.getTime() - now.getTime();

    if (delay <= 0) {
      this.refreshToken();
    } else {
      this.refreshTimer = setTimeout(() => this.refreshToken(), delay);
    }
  }



  private refreshToken() {
    const newRefreshTime = new Date();
    const stored = localStorage.getItem(AUTH_STORAGE.AUTH);
    if (!stored) return;

    const data = JSON.parse(stored) as AuthStorage;

    this.authBackend.refreshToken().pipe(take(1)).subscribe({
      next: (response) => {
        console.log(response, "token")
        this.saveAuthToStorage(
          data[AUTH_STORAGE.USER_ID],
          data[AUTH_STORAGE.FULL_NAME],
          data[AUTH_STORAGE.PROFILE_PICTURE],
          data[AUTH_STORAGE.EMAIL],
          data[AUTH_STORAGE.ROLE],
          newRefreshTime
        )

        this.startAutomaticRefresh(newRefreshTime);
      },
      error: () => {
        this.logout()
      }
    })
  }

  private clearAuthStorage() {
    localStorage.removeItem(AUTH_STORAGE.AUTH);
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

  private setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }

  public getEmail(): string {
    return this._email;
  }

  public getOtp(): string {
    return this._otp;
  }
  public acceptInvitation(
    fullName: string,
    password: string,
    confirmPassword: string,
    invitationToken: string
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
            if (userData.role === 'ADMIN') {
              this.router.navigate([APP_ROUTES.ADMIN_LOGIN]);
            } else {
              this.router.navigate([APP_ROUTES.LOGIN]);
            }
          }
        }),
        catchError((err) => {
          return this.errorHandlerService.handle(err);
        }),
        finalize(() => {
          this.setLoading(false);
        })
      );
  }
}
