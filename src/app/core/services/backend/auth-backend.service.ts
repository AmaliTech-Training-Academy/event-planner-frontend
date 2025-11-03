import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { AuthResponseBody, OtpBodyData, RegisterBodyData } from '../../models/auth-response.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthBackendService {

  constructor(private readonly http: HttpClient) { }

  public login(email: string, password: string) {
    return this.http.post(API_ENDPOINTS.AUTH_LOGIN, { email, password })
  }

  public register(fullName: string, email: string, password: string, confirmPassword: string) {
    return this.http.post<AuthResponseBody<RegisterBodyData>>(API_ENDPOINTS.AUTH_REGISTER, { fullName, email, password, confirmPassword })
  }
  public verifyEmail(otp: string, email: string) {
    return this.http.post<AuthResponseBody<OtpBodyData>>(API_ENDPOINTS.AUTH_VERIFY_OTP, { otp, email })
  }
  public forgotPassword(email: string) {
    return this.http.post<AuthResponseBody<unknown>>(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, { email })
  }

  public logout() {
    return this.http.post(API_ENDPOINTS.AUTH_LOGOUT, {})
  }

  public checkAuthUser(userId: string) {
    return this.http.get<{ data: User }>(API_ENDPOINTS.GET_USER(userId))
  }

}
