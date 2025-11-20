// src/app/constants/app-routes.constants.ts

export const APP_ROUTES = {
  // Auth routes
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESET_PASSWORD: '/auth/reset-password',
  ADMIN_LOGIN: '/auth/admin',

  // Public routes
  LANDING_PAGE: '/',

  // App routes
  EXPLORE: '/app/explore',
  PROFILE: '/app/profile',
  ABOUT: '/app/about',
  EVENT_DETAILS: (id: string) => `/app/event/${id}`,
  VENUE_SECTION: '/app/define-venue-sections',
  MANAGE_EVENT_ROLES: '/app/manage-event-roles',
  CREATE_EVENT: '/app/create-event',
  CREATE_EVENT_SUCCESS: '/app/create-event-success',
  MY_EVENTS: '/app/my-events',
  MY_EVENT: (id: string) => `/app/my-events/${id}`,
  MANAGE_EVENT: (id: string) => `/app/manage-event/${id}`,
  PAYMENT_SETTINGS: '/app/payment-settings',
  ADMIN_DASHBOARD: '/admin',
  EVENT_PAYMENT_SUCCESS: '/app/event-payment-success',
  PROFILE_PAGE: '/app/profile',

  // Admin routes
  ADMIN_EVENTS: '/admin/events',
  ADMIN_EVENT_DETAILS: (id: string) => `/admin/events/${id}`,
  ADMIN_ORGANIZERS: '/admin/organizers',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_SETTINGS_SECURITY: '/admin/settings/security',
  ADMIN_SETTINGS_NOTIFICATIONS: '/admin/settings/notifications',
  ADMIN_SETTINGS_TEAM: '/admin/settings/team',
  ADMIN_LOGOUT: '/admin/logout',
  ADMIN_EDIT_PROFILE: '/admin/profile',
} as const;
