import {
  NotificationSetting,
  TeamMember,
} from '@app/modules/attendee/models/admin-settings.types';

export const DEFAULT_NOTIFICATIONS: ReadonlyArray<NotificationSetting> = [
  {
    id: '1',
    title: 'New Event Creation',
    description: 'Get notified when a new event is created',
    enabled: false,
  },
  {
    id: '2',
    title: 'Payment Failures',
    description: 'Get notified when a payment fails',
    enabled: false,
  },
  {
    id: '3',
    title: 'Platform Errors',
    description: 'Get notified about critical platform errors',
    enabled: false,
  },
] as const;

export const DEFAULT_TEAM_MEMBERS: ReadonlyArray<TeamMember> = [
  {
    id: '1',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'icons/user-avatar.png',
    role: 'Super Admin',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'icons/user-avatar.png',
    role: 'Admin',
  },
] as const;

export const DEFAULT_SECURITY_SETTINGS = {
  platformName: 'Event Hub',
  platformUrl: 'https://eventhub.com',
  contactEmail: 'support@eventhub.com',
  platformDescription:
    'EventHub is a comprehensive event management platform for organizers and attendees.',
  maintenanceMode: false,
} as const;

export const ROLE_BADGE_CLASSES: Record<TeamMember['role'], string> = {
  'Super Admin': 'badge--super-admin',
  Admin: 'badge--admin',
  Manager: 'badge--manager',
} as const;
