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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _loggedIn$ = new BehaviorSubject<boolean>(false);
  private readonly _userInfo$ = new BehaviorSubject<OtpBodyData | null>(null);
  private readonly _loadingStateSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingStateSubject.asObservable();
  private _email: string = '';
  private _otp: string = '';
  private _isResset: boolean = false;

  constructor(
    private readonly authBackend: AuthBackendService,
    private readonly router: Router,
    private readonly errorHandlerService: ErrorHandlerService
  ) {
    console.log('🔧 AuthService - Constructor called');
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
    console.log('🔐 ADMIN LOGIN - Starting admin login process', { email });
    this.setLoading(true);

    return this.authBackend.adminLogin(email, password).pipe(
      take(1),
      tap((response: any) => {
        console.log('✅ ADMIN LOGIN - Backend response received', response);

        const userData = response?.data;
        if (userData) {
          console.log(
            '👤 ADMIN LOGIN - User data found in response:',
            userData
          );

          this._loggedIn$.next(true);
          this._userInfo$.next(userData);

          // Save admin data to localStorage
          this.saveAuthToStorage(
            userData.id.toString(),
            userData.fullName,
            userData.profilePicture,
            userData.email,
            userData.role
          );

          console.log(
            '💾 ADMIN LOGIN - Data saved to localStorage. Checking storage...'
          );
          this.checkLocalStorage();
        } else {
          console.warn('⚠️ ADMIN LOGIN - No user data in response');
        }

        this.router.navigate([APP_ROUTES.ADMIN_DASHBOARD]);
      }),
      catchError((err) => {
        console.error('❌ ADMIN LOGIN - Error occurred:', err);
        return this.errorHandlerService.handle(err);
      }),
      finalize(() => {
        console.log('🏁 ADMIN LOGIN - Process completed');
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
        console.log('📧 VERIFY EMAIL - Response received', response);
        const userData = response?.data;
        if (userData) {
          console.log('👤 VERIFY EMAIL - User data found:', userData);
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

          console.log('💾 VERIFY EMAIL - Data saved to localStorage');
          this.checkLocalStorage();
        }
        // Route to Explore page instead
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
    console.log('🚪 LOGOUT - Starting logout process');
    this.setLoading(true);
    return this.authBackend.logout().pipe(
      take(1),
      tap(() => {
        console.log('✅ LOGOUT - Backend logout successful');
        this._loggedIn$.next(false);
        this._userInfo$.next(null);
        this.clearAuthStorage();
        console.log('🧹 LOGOUT - LocalStorage cleared');
        this.router.navigate([APP_ROUTES.LOGIN]);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public adminLogout() {
    console.log('🚪 ADMIN LOGOUT - Starting admin logout process');
    this.setLoading(true);
    return this.authBackend.logout().pipe(
      take(1),
      tap(() => {
        console.log('✅ ADMIN LOGOUT - Backend logout successful');
        this._loggedIn$.next(false);
        this._userInfo$.next(null);
        this.clearAuthStorage();
        console.log('🧹 ADMIN LOGOUT - LocalStorage cleared');
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
            this.saveAuthToStorage(
              userData.id.toString(),
              userData.fullName,
              userData.profilePicture,
              userData.email,
              userData.role
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
          this.saveAuthToStorage(
            updatedUser.id.toString(),
            updatedUser.fullName,
            updatedUser.profilePicture,
            updatedUser.email,
            updatedUser.role
          );
        }
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  private onload() {
    console.log('🔍 AUTH SERVICE ONLOAD - Checking localStorage for auth data');
    const stored = localStorage.getItem(AUTH_STORAGE.AUTH);
    console.log('📦 AUTH SERVICE ONLOAD - Raw localStorage data:', stored);

    if (stored) {
      try {
        const data = JSON.parse(stored) as AuthStorage;
        console.log('📋 AUTH SERVICE ONLOAD - Parsed auth data:', data);

        this._loggedIn$.next(data[AUTH_STORAGE.AUTHENTICATED]);

        if (data[AUTH_STORAGE.AUTHENTICATED]) {
          const userData: OtpBodyData = {
            id: parseInt(data[AUTH_STORAGE.USER_ID], 10),
            email: data[AUTH_STORAGE.EMAIL],
            fullName: data[AUTH_STORAGE.FULL_NAME],
            profilePicture: data[AUTH_STORAGE.PROFILE_PICTURE],
            role: data[AUTH_STORAGE.ROLE],
          };
          console.log('👤 AUTH SERVICE ONLOAD - Setting user data:', userData);
          this._userInfo$.next(userData);
        }
      } catch (error) {
        console.error(
          '❌ AUTH SERVICE ONLOAD - Error parsing stored data:',
          error
        );
      }
    } else {
      console.log(
        '📭 AUTH SERVICE ONLOAD - No auth data found in localStorage'
      );
    }
  }

  private saveAuthToStorage(
    userId: string,
    fullName: string,
    profilePicture: string | null,
    email: string,
    role: string
  ) {
    console.log('💾 SAVE TO STORAGE - Saving auth data:', {
      userId,
      fullName,
      profilePicture,
      email,
      role,
    });

    const authData = {
      [AUTH_STORAGE.AUTHENTICATED]: true,
      [AUTH_STORAGE.USER_ID]: userId,
      [AUTH_STORAGE.FULL_NAME]: fullName,
      [AUTH_STORAGE.PROFILE_PICTURE]: profilePicture,
      [AUTH_STORAGE.EMAIL]: email,
      [AUTH_STORAGE.ROLE]: role,
    };

    localStorage.setItem(AUTH_STORAGE.AUTH, JSON.stringify(authData));
    console.log('✅ SAVE TO STORAGE - Data saved to localStorage');
  }

  private clearAuthStorage() {
    console.log('🧹 CLEAR STORAGE - Removing auth data from localStorage');
    localStorage.removeItem(AUTH_STORAGE.AUTH);
    console.log('✅ CLEAR STORAGE - LocalStorage cleared');
  }

  // Helper method to check localStorage contents
  private checkLocalStorage() {
    console.log('🔍 CHECKING LOCALSTORAGE - Current state:');
    const authData = localStorage.getItem(AUTH_STORAGE.AUTH);
    console.log('📦 LocalStorage auth data:', authData);

    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        console.log('📋 Parsed auth data:', parsed);
      } catch (error) {
        console.error('❌ Error parsing localStorage data:', error);
      }
    }

    // Log all localStorage for debugging
    console.log('🏪 Full localStorage contents:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log(`   ${key}:`, localStorage.getItem(key));
      }
    }
  }

  public isLoggedIn(): Observable<boolean> {
    const isLoggedIn = this._loggedIn$.getValue();
    console.log('🔐 IS LOGGED IN - Current state:', isLoggedIn);
    return this._loggedIn$.asObservable();
  }

  public currentUser$(): Observable<OtpBodyData | null> {
    const currentUser = this._userInfo$.getValue();
    console.log('👤 CURRENT USER$ - Current user:', currentUser);
    return this._userInfo$.asObservable();
  }

  public currentUser(): OtpBodyData | null {
    const currentUser = this._userInfo$.getValue();
    console.log('👤 CURRENT USER - Current user:', currentUser);
    return currentUser;
  }

  private setLoading(isLoading: boolean): void {
    console.log('⏳ LOADING STATE - Setting to:', isLoading);
    this._loadingStateSubject.next(isLoading);
  }

  public getEmail(): string {
    return this._email;
  }

  public getOtp(): string {
    return this._otp;
  }
}
