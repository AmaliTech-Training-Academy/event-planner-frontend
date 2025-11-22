// src/app/services/backend/platform-settings-backend.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PLATFORM_SETTINGS_ENDPOINTS } from '../../constants/api-endpoints.constants';
import {
  SecuritySettingsResponse,
  UpdateSecuritySettingsPayload,
  NotificationSettingsResponse,
  UpdateNotificationSettingsPayload,
  TeamMembersResponse,
  SettingsUpdateResponse,
} from '../../models/platform-settings.model';

@Injectable({ providedIn: 'root' })
export class PlatformSettingsBackendService {
  constructor(private readonly http: HttpClient) {}

  public getSecuritySettings(): Observable<SecuritySettingsResponse> {
    return this.http.get<SecuritySettingsResponse>(
      PLATFORM_SETTINGS_ENDPOINTS.SECURITY_SETTINGS
    );
  }

  public updateSecuritySettings(
    payload: UpdateSecuritySettingsPayload
  ): Observable<SettingsUpdateResponse> {
    return this.http.put<SettingsUpdateResponse>(
      PLATFORM_SETTINGS_ENDPOINTS.SECURITY_SETTINGS,
      payload
    );
  }

  public getNotificationSettings(): Observable<NotificationSettingsResponse> {
    return this.http.get<NotificationSettingsResponse>(
      PLATFORM_SETTINGS_ENDPOINTS.NOTIFICATION_SETTINGS
    );
  }

  public updateNotificationSettings(
    payload: UpdateNotificationSettingsPayload
  ): Observable<SettingsUpdateResponse> {
    return this.http.put<SettingsUpdateResponse>(
      PLATFORM_SETTINGS_ENDPOINTS.NOTIFICATION_SETTINGS,
      payload
    );
  }

  public getTeamMembers(): Observable<TeamMembersResponse> {
    return this.http.get<TeamMembersResponse>(
      PLATFORM_SETTINGS_ENDPOINTS.TEAM_MEMBERS
    );
  }
}
