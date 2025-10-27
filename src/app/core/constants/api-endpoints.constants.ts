import { environment } from "../../../environments/environment";


const API_VERSION = 'v1';
const BASE = `${environment.API_URL}/${API_VERSION}`;

export const API_ENDPOINTS = {
    AUTH_LOGOUT: `${BASE}/auth/logout`,
    AUTH_LOGIN: `${BASE}/auth/login`,
    AUTH_REGISTER: `${BASE}/auth/login`,
    AUTH_VERIFY_OTP: `${BASE}/auth/verify-otp`,
    AUTH_RESEND_OTP: `${BASE}/auth/resend-otp`,
    GET_USER: (userId: string): string => `${BASE}/users/${userId}`
};
