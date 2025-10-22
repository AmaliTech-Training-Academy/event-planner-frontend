import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthBackendService {

  constructor(private readonly http: HttpClient) { }

  public login(email: string, password: string) {
    return this.http.post(API_ENDPOINTS.AUTH_LOGIN, { email, password }, { withCredentials: true })
  }

  public register(fullName: string, email: string, password: string, confirmPassword: string) {
    return this.http.post(API_ENDPOINTS.AUTH_REGISTER, { fullName, email, password, confirmPassword }, { withCredentials: true })
  }
  public verifyEmail(otp: string, email: string) {
    return this.http.post<{ access_token: string, refresh_token: string }>(API_ENDPOINTS.AUTH_VERIFY_OTP, { otp, email }, { withCredentials: true })
  }

  public logout() {
    return this.http.post(API_ENDPOINTS.AUTH_LOGOUT, {}, { withCredentials: true })
  }

  public checkAuthUser(userId: string) {
    return this.http.get<{ data: User }>(API_ENDPOINTS.GET_USER(userId), { withCredentials: true })
  }

}
