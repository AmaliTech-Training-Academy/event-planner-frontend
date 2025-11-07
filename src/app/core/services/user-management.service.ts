// Complete user-management.service.ts updateUser implementation:

import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  tap,
  throwError,
} from 'rxjs';
import {
  InviteUserPayload,
  User,
  UserCardData,
  UserSearchResponse,
  mapStatusToBoolean,
  normalizeUserStatus,
} from '../models/user.model';
import {
  UserBackendService,
  UpdateUserPayload,
} from './backend/user-backend.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private _users$ = new BehaviorSubject<User[]>([]);
  private _userCards$ = new BehaviorSubject<UserCardData[]>([]);
  private _loading$ = new BehaviorSubject<boolean>(false);
  private _totalPages$ = new BehaviorSubject<number>(0);
  private _currentPage$ = new BehaviorSubject<number>(0);
  private _totalElements$ = new BehaviorSubject<number>(0);

  public readonly totalElements$ = this._totalElements$.asObservable();
  public readonly users$ = this._users$.asObservable();
  public readonly userCards$ = this._userCards$.asObservable();
  public readonly loading$ = this._loading$.asObservable();
  public readonly totalPages$ = this._totalPages$.asObservable();
  public readonly currentPage$ = this._currentPage$.asObservable();

  constructor(
    private readonly userBackend: UserBackendService,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  public fetchAllUsers(page: number = 0, size: number = 10) {
    this.setLoading(true);

    return this.userBackend.getAllUsers(page, size).pipe(
      map((response) => {
        const pagination = response.data?.users ?? response.data;
        const users = pagination?.content ?? [];
        const normalizedUsers: User[] = users.map(normalizeUserStatus);

        return {
          ...response,
          data: {
            ...response.data,
            users: {
              ...pagination,
              content: normalizedUsers,
            },
          },
        };
      }),

      tap((response) => {
        const pagination = response.data?.users ?? response.data;
        const users = pagination?.content ?? [];

        this._users$.next(users);
        this._totalPages$.next(pagination?.totalPages ?? 1);
        this._currentPage$.next(pagination?.number ?? 0);
        this._totalElements$.next(pagination?.totalElements ?? users.length);

        this._updateUserCards(response.data ?? {});
      }),

      catchError((err) => {
        this.errorHandler.handle(err);
        console.error('[UserManagementService] ❌ fetchAllUsers error', err);
        return throwError(() => err);
      }),

      finalize(() => this.setLoading(false))
    );
  }

  public searchUsers(
    keyword?: string,
    role?: string,
    status?: boolean,
    page: number = 0
  ) {
    console.log('[UserManagementService] 🔍 searchUsers called with:', {
      keyword,
      role,
      status,
      page,
    });
    this.setLoading(true);

    return this.userBackend.searchUsers(keyword, role, status, page).pipe(
      map((response: UserSearchResponse) => {
        const users = response.data?.content ?? [];
        const normalizedUsers: User[] = users.map(normalizeUserStatus);

        console.log(
          '[UserManagementService] 🔄 Normalized users:',
          normalizedUsers
        );

        return {
          ...response,
          data: {
            ...response.data,
            users: {
              ...response.data,
              content: normalizedUsers,
            },
          },
        };
      }),
      tap((response) => {
        const parsedUsers = response.data?.users?.content ?? [];
        console.log(
          '[UserManagementService] ✅ Parsed users count:',
          parsedUsers.length
        );
        console.log('[UserManagementService] ✅ First user:', parsedUsers[0]);

        this._users$.next(parsedUsers);
        this._totalPages$.next(response.data?.users?.totalPages ?? 0);
        this._currentPage$.next(response.data?.users?.number ?? 0);
        this._updateUserCards(response.data ?? {});
      }),
      catchError((err) => {
        this.errorHandler.handle(err);
        console.error('[UserManagementService] ❌ searchUsers error', err);
        return throwError(() => err);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  private _updateUserCards(data: any): void {
    const cards: UserCardData[] = [
      {
        title: 'Total Users',
        count: data.totalUsers,
        icon: 'icons/user-icon-orange.png',
        bgColor: '#FFF4ED',
        iconColor: '#FF6B2C',
      },
      {
        title: 'Active Organizers',
        count: data.totalOrganizers,
        icon: 'icons/user-icon-green.png',
        bgColor: '#E8F5E9',
        iconColor: '#4CAF50',
      },
      {
        title: 'Attendees',
        count: data.totalAttendees,
        icon: 'icons/user-icon-blue.png',
        bgColor: '#E3F2FD',
        iconColor: '#2196F3',
      },
      {
        title: 'Deactivated',
        count: data.totalDeactivatedUsers,
        icon: 'icons/user-icon-red.png',
        bgColor: '#FFEBEE',
        iconColor: '#F44336',
      },
    ];
    this._userCards$.next(cards);
  }

  public getUser(userId: string) {
    this.setLoading(true);
    return this.userBackend.getUserById(userId).pipe(
      map((response) => ({
        ...response,
        data: normalizeUserStatus(response.data),
      })),
      catchError((err) => {
        this.errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  public createUser(user: Partial<User>) {
    this.setLoading(true);
    return this.userBackend.createUser(user).pipe(
      map((response) => ({
        ...response,
        data: normalizeUserStatus(response.data),
      })),
      tap((response) =>
        this._users$.next([...this._users$.getValue(), response.data])
      ),
      catchError((err) => {
        this.errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  public updateUser(userId: string, payload: UpdateUserPayload) {
    this.setLoading(true);

    console.log('🔧 [UserManagementService] Updating user:', userId);
    console.log(
      '📤 [UserManagementService] Payload:',
      JSON.stringify(payload, null, 2)
    );

    return this.userBackend.updateUser(userId, payload).pipe(
      map((response) => ({
        ...response,
        data: normalizeUserStatus(response.data),
      })),
      tap((response) => {
        console.log('✅ [UserManagementService] Update successful:', response);
        const users = this._users$
          .getValue()
          .map((u) =>
            String(u.userId) === String(userId) ? response.data : u
          );
        this._users$.next(users);
      }),
      catchError((err) => {
        console.error('❌ [UserManagementService] Update failed:', err);
        console.error('📋 Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.error?.message || err.message,
          error: err.error,
        });
        this.errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  public toggleUserStatusWithBackend(userId: number | string) {
    this.setLoading(true);

    return this.userBackend.toggleUserActivation(userId).pipe(
      tap(() => {
        const users = this._users$.getValue();
        const updatedUsers = users.map((u) => {
          if (u.userId === userId) {
            const newStatus: User['status'] =
              u.status === 'Active' ? 'Inactive' : 'Active';
            return { ...u, status: newStatus };
          }
          return u;
        });
        this._users$.next(updatedUsers);
      }),
      catchError((err) => {
        this.errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  public inviteUsers(payload: InviteUserPayload) {
    this.setLoading(true);
    return this.userBackend.inviteUsers(payload).pipe(
      tap((response) => {
        if (response.data.invitationsSent > 0) {
          console.log(
            `${response.data.invitationsSent} invitation(s) sent successfully`
          );
        }
      }),
      catchError((err) => {
        this.errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  protected setLoading(isLoading: boolean): void {
    this._loading$.next(isLoading);
  }
}
