import { FormControl } from '@angular/forms';

export type TabType = 'general' | 'notifications' | 'team';

export interface SecuritySettings {
  platformName: string;
  platformUrl: string;
  contactEmail: string;
  platformDescription: string;
}

export interface SecurityForm {
  platformName: FormControl<string>;
  platformUrl: FormControl<string>;
  contactEmail: FormControl<string>;
  platformDescription: FormControl<string>;
}

export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Super Admin' | 'Admin' | 'Manager';
  active: boolean;
}
