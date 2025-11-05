export const APP_ROUTES = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  LANDING_PAGE: '/',
  EXPLORE: '/app/explore',
  VERIFY_EMAIL: '/auth/verify-email',
  ADMIN_LOGIN: '/auth/admin',
  VENUE_SECTION: '/app/define-venue-sections',
  MANAGE_EVENT_ROLES: '/app/manage-event-roles',
  RESET_PASSWORD: 'auth/reset-password',
  ADMIN_DASHBOARD: '/admin',

  EVENT_DETAILS: (id: string) => `/app/event/${id}`,
};
