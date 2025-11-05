import { environment } from '../../../environments/environment';

const API_VERSION = 'v1';
const BASE = `${environment.API_URL}/${API_VERSION}`;

export const API_ENDPOINTS = {
  AUTH_LOGOUT: `${BASE}/auth/logout`,
  AUTH_LOGIN: `${BASE}/auth/login`,
  AUTH_ADMIN_LOGIN: `${BASE}/auth/admin-login`,
  AUTH_REGISTER: `${BASE}/auth/register`,
  AUTH_VERIFY_OTP: `${BASE}/auth/verify-otp`,
  AUTH_FORGOT_PASSWORD: `${BASE}/auth/forgot-password`,
  GET_USER: (userId: string): string => `${BASE}/users/${userId}`,

  AUTH_RESEND_OTP: `${BASE}/auth/resend-otp`,
  AUTH_RESET_PASSWORD: `${BASE}/auth/reset-password`,
} as const;
