// src/app/services/backend/platform-settings-backend.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SecuritySettingsResponse,
  UpdateSecuritySettingsPayload,
  NotificationSettingsResponse,
  UpdateNotificationSettingsPayload,
  TeamMembersResponse,
  SettingsUpdateResponse,
} from '../../models/platform-settings.model';

const API_BASE = '/api/v1/auth/platform-settings';

@Injectable({ providedIn: 'root' })
export class PlatformSettingsBackendService {
  constructor(private readonly http: HttpClient) {}

  public getSecuritySettings(): Observable<SecuritySettingsResponse> {
    return this.http.get<SecuritySettingsResponse>(`${API_BASE}/security`);
  }

  public updateSecuritySettings(
    payload: UpdateSecuritySettingsPayload
  ): Observable<SettingsUpdateResponse> {
    return this.http.put<SettingsUpdateResponse>(
      `${API_BASE}/security`,
      payload
    );
  }

  // Notification Settings
  public getNotificationSettings(): Observable<NotificationSettingsResponse> {
    return this.http.get<NotificationSettingsResponse>(
      `${API_BASE}/notifications`
    );
  }

  public updateNotificationSettings(
    payload: UpdateNotificationSettingsPayload
  ): Observable<SettingsUpdateResponse> {
    return this.http.put<SettingsUpdateResponse>(
      `${API_BASE}/notifications`,
      payload
    );
  }

  // Team Members
  public getTeamMembers(): Observable<TeamMembersResponse> {
    return this.http.get<TeamMembersResponse>(`${API_BASE}/team-members`);
  }
}
