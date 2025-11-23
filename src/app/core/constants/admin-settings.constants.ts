import {
  NotificationSetting,
  SecuritySettings,
  TeamMember,
} from '@app/modules/attendee/models/admin-settings.types';

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  platformName: 'Event Hub',
  platformUrl: 'https://eventhub.com',
  contactEmail: 'support@eventhub.com',
  platformDescription:
    'EventHub is a comprehensive event management platform for organizers and attendees.',
};

export const DEFAULT_NOTIFICATIONS: ReadonlyArray<NotificationSetting> = [
  {
    id: 'new-event',
    title: 'New Event Creation',
    description: 'Get notified when a new event is created',
    enabled: true,
  },
  {
    id: 'payment-failure',
    title: 'Payment Failures',
    description: 'Get notified when a payment fails',
    enabled: true,
  },
  {
    id: 'platform-errors',
    title: 'Platform Errors',
    description: 'Get notified about critical platform errors',
    enabled: false,
  },
];

export const DEFAULT_TEAM_MEMBERS: ReadonlyArray<TeamMember> = [
  {
    id: '1',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'Super Admin',
    active: true,
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    role: 'Admin',
    active: false,
  },
];

export const ROLE_BADGE_CLASSES: Record<TeamMember['role'], string> = {
  'Super Admin': 'badge--super-admin',
  Admin: 'badge--admin',
  Manager: 'badge--manager',
};
