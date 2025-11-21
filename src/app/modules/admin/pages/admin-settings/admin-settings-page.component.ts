import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component';
import { TeamManagementComponent } from './components/team-management/team-management.component';
import { PlatformSettingsService } from '@app/core/services/platform-settings-management.service';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
import {
  SecuritySettings,
  NotificationSettings,
  TeamMember,
  UpdateSecuritySettingsPayload,
  UpdateNotificationSettingsPayload,
} from '@app/core/models/platform-settings.model';

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    GeneralSettingsComponent,
    NotificationSettingsComponent,
    TeamManagementComponent,
  ],
  templateUrl: './admin-settings-page.component.html',
  styleUrls: ['./admin-settings-page.component.scss'],
})
export class AdminSettingsPageComponent implements OnInit, OnDestroy {
  private readonly _platformSettingsService = inject(PlatformSettingsService);
  private readonly _destroy$ = new Subject<void>();

  protected readonly activeTab = signal<'general' | 'notifications' | 'team'>(
    'general'
  );

  protected readonly securitySettings = signal<SecuritySettings | null>(null);
  protected readonly notificationSettings = signal<NotificationSettings | null>(
    null
  );
  protected readonly teamMembers = signal<TeamMember[]>([]);

  ngOnInit(): void {
    this._loadAllSettings();
    this._subscribeToSettingsChanges();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  protected switchTab(tab: 'general' | 'notifications' | 'team'): void {
    this.activeTab.set(tab);
  }

  protected handleSecuritySettingsUpdate(
    payload: UpdateSecuritySettingsPayload
  ): void {
    this._platformSettingsService
      .updateSecuritySettings(payload)
      .pipe(takeUntil(this._destroy$))
      .subscribe();
  }

  protected handleNotificationSettingsUpdate(
    payload: UpdateNotificationSettingsPayload
  ): void {
    this._platformSettingsService
      .updateNotificationSettings(payload)
      .pipe(takeUntil(this._destroy$))
      .subscribe();
  }

  private _loadAllSettings(): void {
    this._platformSettingsService.loadAllSettings();
  }

  private _subscribeToSettingsChanges(): void {
    this._platformSettingsService.securitySettings$
      .pipe(takeUntil(this._destroy$))
      .subscribe((settings) => {
        this.securitySettings.set(settings);
      });

    this._platformSettingsService.notificationSettings$
      .pipe(takeUntil(this._destroy$))
      .subscribe((settings) => {
        this.notificationSettings.set(settings);
      });

    this._platformSettingsService.teamMembers$
      .pipe(takeUntil(this._destroy$))
      .subscribe((members) => {
        this.teamMembers.set(members);
      });
  }
}
