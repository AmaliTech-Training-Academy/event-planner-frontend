// src/app/models/platform-settings.model.ts

/** Security Settings */
export interface SecuritySettings {
  platformName: string;
  platformUrl: string;
  contactEmail: string;
  platformDescription: string;
  maintenanceMode: boolean;
}

export interface SecuritySettingsResponse {
  description: string;
  data: SecuritySettings;
}

export interface UpdateSecuritySettingsPayload {
  platformName?: string;
  platformUrl?: string;
  contactEmail?: string;
  platformDescription?: string;
  maintenanceMode?: boolean;
}

/** Notification Settings */
export interface NotificationSettings {
  eventCreation: boolean;
  paymentFailures: boolean;
  platformErrors: boolean;
}

export interface NotificationSettingsResponse {
  description: string;
  data: NotificationSettings;
}

export interface UpdateNotificationSettingsPayload {
  eventCreation?: boolean;
  paymentFailures?: boolean;
  platformErrors?: boolean;
}

/** Team Members */
export interface TeamMember {
  id: number;
  email: string;
  fullName: string;
  profilePicture: string | null;
  role: 'ADMIN';
}

export interface TeamMembersResponse {
  description: string;
  data: TeamMember[];
}

/** Generic Update Response */
export interface SettingsUpdateResponse {
  description: string;
  data: null;
}

/** Validation Error Response */
export interface ValidationErrorResponse {
  description: string;
  data: string[];
}
