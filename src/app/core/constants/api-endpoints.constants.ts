// core/constants/api-endpoints.constants.ts
// core/constants/api-endpoints.constants.ts
import { environment } from '../../../environments/environment';

const API_VERSION = 'v1';
const BASE = `${environment.API_URL}/${API_VERSION}`;
export const API_ENDPOINTS = {
  AUTH_LOGOUT: `${BASE}/auth/logout`,
  ADMIN_LOGOUT: `${BASE}/auth/admin-logout`,
  AUTH_LOGIN: `${BASE}/auth/login`,
  AUTH_REGISTER: `${BASE}/auth/register`,
  AUTH_VERIFY_OTP: `${BASE}/auth/verify-otp`,
  AUTH_FORGOT_PASSWORD: `${BASE}/auth/forgot-password`,
  GET_USER: (userId: string): string => `${BASE}/users/${userId}`,
  GET_ALL_USERS: `${BASE}/users/management`,
  UPDATE_USER: (userId: string): string => `${BASE}/users/${userId}`,
  DELETE_USER: (userId: string): string => `${BASE}/users/${userId}`,
  CREATE_USER: `${BASE}/users`,
  INVITE_USER: `${BASE}/event-invitations`,
  GET_ALL_INVITATIONS: `${BASE}/event-invitations`,
  AUTH_ADMIN_LOGIN: `${BASE}/auth/admin-login`,

  AUTH_RESEND_OTP: `${BASE}/auth/resend-otp`,
  AUTH_RESET_PASSWORD: `${BASE}/auth/reset-password`,
  AUTH_ME: `${BASE}/auth/me`,
  DEACTIVATE_USER: (userId: string | number) =>
    `${BASE}/users/${userId}/deactivate`,

  UPLOAD_PROFILE_IMAGE: (userId: string): string =>
    `${BASE}/users/${userId}/profile-image`,
  SEARCH_USERS: `${BASE}/users/search`,

  EVENT_MANAGEMENT: `${BASE}/events/event-management`,
  EVENT_DETAILS: (eventId: number) => `${BASE}/events/${eventId}`,
  GET_ALL_EVENTS: `${BASE}/events`,
  CREATE_EVENT: `${BASE}/events`,
  UPDATE_EVENT: (eventId: number) => `${BASE}/events/${eventId}`,
  DELETE_EVENT: (eventId: number) => `${BASE}/events/${eventId}`,

  SEARCH_EVENTS: `${BASE}/events/search`,
} as const;
