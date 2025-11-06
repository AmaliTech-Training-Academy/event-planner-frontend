import { environment } from '../../../environments/environment';

const API_VERSION = 'v1';
const BASE = `${environment.API_URL}/${API_VERSION}`;
export const API_ENDPOINTS = {
  AUTH_LOGOUT: `${BASE}/auth/logout`,
  AUTH_LOGIN: `${BASE}/auth/login`,
  AUTH_REGISTER: `${BASE}/auth/register`,
  AUTH_VERIFY_OTP: `${BASE}/auth/verify-otp`,
  AUTH_RESEND_OTP: `${BASE}/auth/resend-otp`,
  AUTH_RESET_PASSWORD: `${BASE}/auth/reset-password`,
  AUTH_FORGOT_PASSWORD: `${BASE}/auth/forgot-password`,
  GET_USER: (userId: string): string => `${BASE}/users/${userId}`,
  AUTH_ADMIN_LOGIN: `${BASE}/auth/admin-login`,
} as const;

export const EVENTS_API_ENDPOINTS = {
  GET_EVENTS: `${BASE}/events`,
  GET_EVENT: (id: string): string => `${BASE}/events/${id}`,
  CREATE_EVENT: `${BASE}/events`,
  GET_EVENT_TYPES: `${BASE}/event_types`,
  GET_EVENT_TYPE: (id: number): string => `${BASE}/event_types/${id}`,
  CREATE_EVENT_TYPE: `${BASE}/event_types`,
  GET_TIME_ZONES: `${BASE}/timezones`,
  GET_MEETING_TYPES: `${BASE}/event_meeting_types`,
} as const;