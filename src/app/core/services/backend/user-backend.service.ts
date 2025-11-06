import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import {
  InviteUserPayload,
  InviteUserResponse,
  User,
  UserManagementResponse,
} from '../../models/user.model';

export interface UpdateUserPayload {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  status: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserBackendService {
  constructor(private readonly http: HttpClient) {}

  public getAllUsers(
    page: number = 0,
    size: number = 10,
    sort: string = 'userId,desc'
  ): Observable<UserManagementResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get<UserManagementResponse>(API_ENDPOINTS.GET_ALL_USERS, {
      params,
    });
  }

  public getUserById(userId: string): Observable<{ data: User }> {
    return this.http.get<{ data: User }>(API_ENDPOINTS.GET_USER(userId));
  }

  public createUser(user: Partial<User>): Observable<{ data: User }> {
    return this.http.post<{ data: User }>(API_ENDPOINTS.CREATE_USER, user);
  }

  public updateUser(
    userId: string,
    user: UpdateUserPayload
  ): Observable<{ data: User }> {
    return this.http.put<{ data: User }>(
      API_ENDPOINTS.UPDATE_USER(userId),
      user
    );
  }

  public toggleUserActivation(userId: number | string): Observable<void> {
    return this.http.post<void>(API_ENDPOINTS.DEACTIVATE_USER(userId), {});
  }

  public uploadProfileImage(
    userId: string,
    imageFile: File
  ): Observable<{ data: { imageUrl?: string; profileImageUrl?: string } }> {
    const formData = new FormData();
    formData.append('file', imageFile);
    return this.http.post<{
      data: { imageUrl?: string; profileImageUrl?: string };
    }>(API_ENDPOINTS.UPLOAD_PROFILE_IMAGE(userId), formData);
  }

  public inviteUsers(
    payload: InviteUserPayload
  ): Observable<InviteUserResponse> {
    return this.http.post<InviteUserResponse>(
      API_ENDPOINTS.INVITE_USER,
      payload
    );
  }

  public searchUsers(
    keyword?: string,
    role?: string,
    status?: boolean,
    page: number = 0,
    size: number = 10
  ): Observable<UserManagementResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (keyword) params = params.set('keyword', keyword);
    if (role) params = params.set('role', role);
    if (status !== undefined) params = params.set('status', status.toString());

    return this.http.get<UserManagementResponse>(API_ENDPOINTS.SEARCH_USERS, {
      params,
    });
  }
}
