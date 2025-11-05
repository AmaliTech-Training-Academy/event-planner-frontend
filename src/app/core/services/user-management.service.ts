// core/services/user-management.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, tap, throwError } from 'rxjs';
import {
InviteUserPayload,
User,
UserCardData,
normalizeUserStatus
} from '../models/user.model';
import { UserBackendService } from './backend/user-backend.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private _users$ = new BehaviorSubject<User[]>([]);
  private _userCards$ = new BehaviorSubject<UserCardData[]>([]);
  private _loading$ = new BehaviorSubject<boolean>(false);
  private _totalPages$ = new BehaviorSubject<number>(0);
  private _currentPage$ = new BehaviorSubject<number>(0);

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
        // Normalize all users to ensure 'status' is UserStatus
        const normalizedUsers: User[] = response.data.users.content.map(
          (user) => normalizeUserStatus(user)
        );

        return {
          ...response,
          data: {
            ...response.data,
            users: {
              ...response.data.users,
              content: normalizedUsers,
            },
          },
        };
      }),
      tap((response) => {
        this._users$.next(response.data.users.content);
        this._totalPages$.next(response.data.users.totalPages);
        this._currentPage$.next(response.data.users.number);

        // Update user cards
        this._updateUserCards(response.data);
      }),
      catchError((err) => {
        this.errorHandler.handle(err);
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
        data: normalizeUserStatus(response.data), // normalize before returning
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
        data: normalizeUserStatus(response.data), // normalize created user
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

  public updateUser(userId: string, user: Partial<User>) {
    this.setLoading(true);
    return this.userBackend.updateUser(userId, user).pipe(
      map((response) => ({
        ...response,
        data: normalizeUserStatus(response.data), // normalize updated user
      })),
      tap((response) => {
        const users = this._users$
          .getValue()
          .map((u) => (u.userId === userId ? response.data : u));
        this._users$.next(users);
      }),
      catchError((err) => {
        this.errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  public toggleUserStatus(userId: number | string) {
    const users = this._users$.getValue();
    const updatedUsers = users.map((u) => {
      if (u.userId === userId) {
        // Toggle between Active and Inactive
        const newStatus: User['status'] =
          u.status === 'Active' ? 'Inactive' : 'Active';
        return { ...u, status: newStatus }; // now type-safe
      }
      return u;
    });
    this._users$.next(updatedUsers);
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
