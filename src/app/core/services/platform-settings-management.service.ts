import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  of,
  take,
  tap,
} from 'rxjs';
import { PlatformSettingsBackendService } from './backend/platform-settings-backend.service';
import { ErrorHandlerService } from './error-handler.service';
import {
  SecuritySettings,
  NotificationSettings,
  TeamMember,
  UpdateSecuritySettingsPayload,
  UpdateNotificationSettingsPayload,
  SecuritySettingsResponse,
  NotificationSettingsResponse,
  TeamMembersResponse,
  SettingsUpdateResponse,
} from '../models/platform-settings.model';

@Injectable({ providedIn: 'root' })
export class PlatformSettingsService {
  private readonly _securitySettings$: BehaviorSubject<SecuritySettings | null> =
    new BehaviorSubject<SecuritySettings | null>(null);
  private readonly _notificationSettings$: BehaviorSubject<NotificationSettings | null> =
    new BehaviorSubject<NotificationSettings | null>(null);
  private readonly _teamMembers$: BehaviorSubject<TeamMember[]> =
    new BehaviorSubject<TeamMember[]>([]);
  private readonly _loadingStateSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public readonly loading$: Observable<boolean> =
    this._loadingStateSubject.asObservable();
  public readonly securitySettings$: Observable<SecuritySettings | null> =
    this._securitySettings$.asObservable();
  public readonly notificationSettings$: Observable<NotificationSettings | null> =
    this._notificationSettings$.asObservable();
  public readonly teamMembers$: Observable<TeamMember[]> =
    this._teamMembers$.asObservable();

  constructor(
    private readonly _platformSettingsBackend: PlatformSettingsBackendService,
    private readonly _errorHandlerService: ErrorHandlerService
  ) {}

  public loadSecuritySettings(): Observable<SecuritySettingsResponse | null> {
    this._setLoading(true);
    return this._platformSettingsBackend.getSecuritySettings().pipe(
      take(1),
      tap((response: SecuritySettingsResponse): void => {
        this._securitySettings$.next(response.data);
      }),
      catchError((err: any) => this._errorHandlerService.handle(err)),
      finalize((): void => this._setLoading(false))
    );
  }

  public updateSecuritySettings(
    payload: UpdateSecuritySettingsPayload
  ): Observable<SettingsUpdateResponse | null> {
    this._setLoading(true);
    return this._platformSettingsBackend.updateSecuritySettings(payload).pipe(
      take(1),
      tap((): void => {
        this.loadSecuritySettings().subscribe();
      }),
      catchError((err: any) => this._errorHandlerService.handle(err)),
      finalize((): void => this._setLoading(false))
    );
  }

  public loadNotificationSettings(): Observable<NotificationSettingsResponse | null> {
    this._setLoading(true);
    return this._platformSettingsBackend.getNotificationSettings().pipe(
      take(1),
      tap((response: NotificationSettingsResponse): void => {
        this._notificationSettings$.next(response.data);
      }),
      catchError((err: any) => this._errorHandlerService.handle(err)),
      finalize((): void => this._setLoading(false))
    );
  }

  public updateNotificationSettings(
    payload: UpdateNotificationSettingsPayload
  ): Observable<SettingsUpdateResponse | null> {
    this._setLoading(true);
    return this._platformSettingsBackend
      .updateNotificationSettings(payload)
      .pipe(
        take(1),
        tap((): void => {
          this.loadNotificationSettings().subscribe();
        }),
        catchError((err: any) => this._errorHandlerService.handle(err)),
        finalize((): void => this._setLoading(false))
      );
  }

  public loadTeamMembers(): Observable<TeamMembersResponse | null> {
    this._setLoading(true);
    return this._platformSettingsBackend.getTeamMembers().pipe(
      take(1),
      tap((response: TeamMembersResponse): void => {
        this._teamMembers$.next(response.data);
      }),
      catchError((err: any) => this._errorHandlerService.handle(err)),
      finalize((): void => this._setLoading(false))
    );
  }

  public loadAllSettings(): void {
    this.loadSecuritySettings().subscribe();
    this.loadNotificationSettings().subscribe();
    this.loadTeamMembers().subscribe();
  }

  public getCurrentSecuritySettings(): SecuritySettings | null {
    return this._securitySettings$.getValue();
  }

  public getCurrentNotificationSettings(): NotificationSettings | null {
    return this._notificationSettings$.getValue();
  }

  public getCurrentTeamMembers(): TeamMember[] {
    return this._teamMembers$.getValue();
  }

  public toggleMaintenanceMode(
    enabled: boolean
  ): Observable<SettingsUpdateResponse | null> {
    return this.updateSecuritySettings({ maintenanceMode: enabled });
  }

  public isInMaintenanceMode(): boolean {
    return this._securitySettings$.getValue()?.maintenanceMode ?? false;
  }

  private _setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }
}
