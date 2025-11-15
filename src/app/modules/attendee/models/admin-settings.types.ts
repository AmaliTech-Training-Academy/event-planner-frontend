import { FormControl } from '@angular/forms';

/**
 * Security settings configuration
 */
export interface SecuritySettings {
  readonly platformName: string;
  readonly platformUrl: string;
  readonly contactEmail: string;
  readonly platformDescription: string;
  readonly maintenanceMode: boolean;
}

/**
 * Notification setting item
 */
export interface NotificationSetting {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly enabled: boolean;
}

/**
 * Team member with role
 */
export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatar: string;
  readonly role: 'Super Admin' | 'Admin' | 'Manager';
}

/**
 * Available tab types
 */
export type TabType = 'general' | 'notifications' | 'team';

/**
 * Security form structure
 */
export interface SecurityForm {
  platformName: FormControl<string | null>;
  platformUrl: FormControl<string | null>;
  contactEmail: FormControl<string | null>;
  platformDescription: FormControl<string | null>;
  maintenanceMode: FormControl<boolean>;
}
