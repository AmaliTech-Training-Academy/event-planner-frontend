import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserBackendService {
  constructor(private readonly http: HttpClient) {}

  public getAllUsers() {
    return this.http.get<{ data: User[] }>(API_ENDPOINTS.GET_ALL_USERS);
  }

  public getUserById(userId: string) {
    return this.http.get<{ data: User }>(API_ENDPOINTS.GET_USER(userId));
  }

  public createUser(user: Partial<User>) {
    return this.http.post<{ data: User }>(API_ENDPOINTS.CREATE_USER, user);
  }

  public updateUser(userId: string, user: Partial<User>) {
    return this.http.put<{ data: User }>(
      API_ENDPOINTS.UPDATE_USER(userId),
      user
    );
  }
}
