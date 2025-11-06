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
  mapStatusToBoolean,
  normalizeUserStatus,
} from '../models/user.model';
import { UserBackendService } from './backend/user-backend.service';
import { ErrorHandlerService } from './error-handler.service';

interface UserUpdatePayload {
  userUpdateRequest: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    status: boolean;
  };
  profilePicture?: string;
}

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
        const normalizedUsers: User[] =
          response.data.users.content.map(normalizeUserStatus);
        return {
          ...response,
          data: {
            ...response.data,
            users: { ...response.data.users, content: normalizedUsers },
          },
        };
      }),
      tap((response) => {
        this._users$.next(response.data.users.content);
        this._totalPages$.next(response.data.users.totalPages);
        this._currentPage$.next(response.data.users.number);
        this._updateUserCards(response.data);
      }),
      catchError((err) => {
        this.errorHandler.handle(err);
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
    this.setLoading(true);
    return this.userBackend.searchUsers(keyword, role, status, page).pipe(
      map((response) => {
        const normalizedUsers: User[] =
          response.data.users.content.map(normalizeUserStatus);
        return {
          ...response,
          data: {
            ...response.data,
            users: { ...response.data.users, content: normalizedUsers },
          },
        };
      }),
      tap((response) => {
        this._users$.next(response.data.users.content);
        this._totalPages$.next(response.data.users.totalPages);
        this._currentPage$.next(response.data.users.number);
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

  private buildUpdatePayload(
    user: Partial<User> & { profileImage?: string; profileImageUrl?: string }
  ): UserUpdatePayload {
    const payload: UserUpdatePayload = {
      userUpdateRequest: {
        fullName: user.fullName?.trim() || '',
        email: user.email?.trim() || '',
        phone: user.phone || '',
        address: user.address || '',
        status: mapStatusToBoolean(user.status ?? 'Active'),
      },
    };

    if (user.profileImage) {
      payload.profilePicture = user.profileImage;
    } else if (user.profileImageUrl) {
      payload.profilePicture = user.profileImageUrl;
    }

    return payload;
  }

  public updateUser(
    userId: string,
    user: Partial<User> & { profileImage?: string; profileImageUrl?: string }
  ) {
    this.setLoading(true);
    const payload = this.buildUpdatePayload(user);

    return this.userBackend.updateUser(userId, payload).pipe(
      map((response) => ({
        ...response,
        data: normalizeUserStatus(response.data),
      })),
      tap((response) => {
        const users = this._users$
          .getValue()
          .map((u) =>
            u.userId === userId || u.userId === Number(userId)
              ? response.data
              : u
          );
        this._users$.next(users);
      }),
      catchError((err) => {
        this.errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  public deactivateUser(userId: number | string) {
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

  public toggleUserStatus(userId: number | string) {
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
