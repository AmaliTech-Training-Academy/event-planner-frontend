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
} from '../models/platform-settings.model';

@Injectable({ providedIn: 'root' })
export class PlatformSettingsService {
  private readonly _securitySettings$ =
    new BehaviorSubject<SecuritySettings | null>(null);
  private readonly _notificationSettings$ =
    new BehaviorSubject<NotificationSettings | null>(null);
  private readonly _teamMembers$ = new BehaviorSubject<TeamMember[]>([]);
  private readonly _loadingStateSubject = new BehaviorSubject<boolean>(false);

  public readonly loading$ = this._loadingStateSubject.asObservable();
  public readonly securitySettings$ = this._securitySettings$.asObservable();
  public readonly notificationSettings$ =
    this._notificationSettings$.asObservable();
  public readonly teamMembers$ = this._teamMembers$.asObservable();

  constructor(
    private readonly platformSettingsBackend: PlatformSettingsBackendService,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  public loadSecuritySettings() {
    this.setLoading(true);
    return this.platformSettingsBackend.getSecuritySettings().pipe(
      take(1),
      tap((response) => {
        this._securitySettings$.next(response.data);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public updateSecuritySettings(payload: UpdateSecuritySettingsPayload) {
    this.setLoading(true);
    return this.platformSettingsBackend.updateSecuritySettings(payload).pipe(
      take(1),
      tap(() => {
        this.loadSecuritySettings().subscribe();
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public loadNotificationSettings() {
    this.setLoading(true);
    return this.platformSettingsBackend.getNotificationSettings().pipe(
      take(1),
      tap((response) => {
        this._notificationSettings$.next(response.data);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public updateNotificationSettings(
    payload: UpdateNotificationSettingsPayload
  ) {
    this.setLoading(true);
    return this.platformSettingsBackend
      .updateNotificationSettings(payload)
      .pipe(
        take(1),
        tap(() => {
          this.loadNotificationSettings().subscribe();
        }),
        catchError((err) => this.errorHandlerService.handle(err)),
        finalize(() => this.setLoading(false))
      );
  }

  public loadTeamMembers() {
    this.setLoading(true);
    return this.platformSettingsBackend.getTeamMembers().pipe(
      take(1),
      tap((response) => {
        this._teamMembers$.next(response.data);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public loadAllSettings() {
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

  public toggleMaintenanceMode(enabled: boolean) {
    return this.updateSecuritySettings({ maintenanceMode: enabled });
  }

  public isInMaintenanceMode(): boolean {
    return this._securitySettings$.getValue()?.maintenanceMode ?? false;
  }

  private setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }
}
