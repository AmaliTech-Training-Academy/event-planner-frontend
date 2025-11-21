// core/constants/api-endpoints.constants.ts
import { environment } from '../../../environments/environment';

const API_VERSION = 'v1';
const BASE = `${environment.API_URL}/${API_VERSION}`;

export const API_ENDPOINTS = {
  // ============================================
  // AUTHENTICATION ENDPOINTS
  // ============================================
  AUTH_LOGIN: `${BASE}/auth/login`,
  AUTH_ADMIN_LOGIN: `${BASE}/auth/admin-login`,
  AUTH_REGISTER: `${BASE}/auth/register`,
  AUTH_LOGOUT: `${BASE}/auth/logout`,
  ADMIN_LOGOUT: `${BASE}/auth/admin-logout`,
  AUTH_VERIFY_OTP: `${BASE}/auth/verify-otp`,
  AUTH_FORGOT_PASSWORD: `${BASE}/auth/forgot-password`,
  AUTH_RESEND_OTP: `${BASE}/auth/resend-otp`,
  AUTH_RESET_PASSWORD: `${BASE}/auth/reset-password`,
  AUTH_REFRESH_TOKEN: `${BASE}/auth/refresh`,
  AUTH_ME: `${BASE}/auth/me`,

  // ============================================
  // USER MANAGEMENT ENDPOINTS
  // ============================================


  // User endpoints
  GET_USER: (userId: string): string => `${BASE}/users/${userId}`,
  GET_ALL_USERS: `${BASE}/users/management`,
  
  CREATE_USER: `${BASE}/users`,
  UPDATE_USER: (userId: string): string => `${BASE}/users/${userId}`,
  DELETE_USER: (userId: string): string => `${BASE}/users/${userId}`,
  DEACTIVATE_USER: (userId: string | number): string =>
    `${BASE}/users/${userId}/deactivate`,
  SEARCH_USERS: `${BASE}/users/search`,
  
 
  UPLOAD_PROFILE_IMAGE: (userId: string): string =>
    `${BASE}/users/${userId}/profile-image`,

  // ============================================
  // USER INVITATION ENDPOINTS
  // ============================================
  ADMIN_INVITE_USER: `${BASE}/user-invitations/invite-user`,
  VERIFY_INVITATION_TOKEN: `${BASE}/user-invitations/verify`,
  ACCEPT_INVITATION: `${BASE}/user-invitations/accept-invitation`,
  GET_ALL_INVITATIONS: `${BASE}/user-invitations`,
   INVITE_USER: `${BASE}/event-invitations`,
  USER_ACCEPT_INVITATION: `${BASE}/event-invitations/accept-invitation`,

  // ============================================
  // EVENT MANAGEMENT ENDPOINTS
  // ============================================
  // Invitation endpoints

  // Event endpoints
  EVENT_MANAGEMENT: `${BASE}/events/event-management`,
  GET_ALL_EVENTS: `${BASE}/events`,
  CREATE_EVENT: `${BASE}/events`,
  EVENT_DETAILS: (eventId: number): string => `${BASE}/events/${eventId}`,
  UPDATE_EVENT: (eventId: number): string => `${BASE}/events/${eventId}`,
  DELETE_EVENT: (eventId: number): string => `${BASE}/events/${eventId}`,
 
 
  SEARCH_EVENTS: `${BASE}/events/event-management/search`,
  GET_AUDIT_LOGS: `${BASE}/auth/audit_logs`,
  GET_AUDIT_LOG_BY_ID: (logId: string) => `${BASE}/audit-logs/${logId}`,
};

export const EVENTS_API_ENDPOINTS = {
  GET_EVENTS: `${BASE}/events/explore`,
  GET_EVENT: (id: string): string => `${BASE}/events/${id}`,
  REGISTER_EVENT: (id: string): string => `${BASE}/events/${id}/register`,
  CREATE_EVENT: `${BASE}/events`,
  GET_EVENT_TYPES: `${BASE}/event_types`,
  GET_EVENT_TYPE: (id: number): string => `${BASE}/event_types/${id}`,
  CREATE_EVENT_TYPE: `${BASE}/event_types`,
  GET_TIME_ZONES: `${BASE}/timezones`,
  GET_MEETING_TYPES: `${BASE}/event_meeting_types`,
  EVENT_MANAGEMENT: `${BASE}/events/event-management`,
  EVENT_DETAILS: (eventId: number) => `${BASE}/events/${eventId}`,
  GET_ALL_EVENTS: `${BASE}/events`,
  UPDATE_EVENT: (eventId: number) => `${BASE}/events/${eventId}`,
  DELETE_EVENT: (eventId: number) => `${BASE}/events/${eventId}`,
  SEARCH_EVENTS: `${BASE}/events/search`,
  MY_EVENT: `${BASE}/events/my-events`,
  MY_EVENT_OVERVIEW: `${BASE}/events/my-events/overview`,
  MANAGE_EVENT_DETAILS: (id: number) => `${BASE}/events/my-events/details/${id}`,
  MANAGE_EVENT_INVITEES:(id: number) => `${BASE}/event-invitations/${id}/invitees`,
  MANAGE_EVENT_REGISTRANTS_OVERVIEW: (id: number) => `${BASE}/events/${id}/registrations/overview`,
  MANAGE_EVENT_REGISTRANTS_SEARCH: (id: number) => `${BASE}/events/${id}/registrations/search`,
} as const;
