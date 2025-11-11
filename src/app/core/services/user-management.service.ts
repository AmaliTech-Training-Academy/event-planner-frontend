import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';
import {
  FetchInvitationsResponse,
  InviteUserPayload,
  User,
  UserCardData,
  UserSearchResponse,
  mapStatusToBoolean,
  normalizeUserStatus,
} from '../models/index';
import {
  UserBackendService,
  UpdateUserPayload,
} from './backend/user-backend.service';
import { ErrorHandlerService } from './error-handler.service';

interface CachedSearchResult {
  users: User[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  timestamp: number;
}

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
  private _usersCache: User[] = [];
  private _searchCache = new Map<string, CachedSearchResult>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private _getCacheKey(
    keyword?: string,
    role?: string,
    status?: boolean,
    page: number = 0
  ) {
    return `${keyword ?? ''}|${role ?? ''}|${status ?? ''}|${page}`;
  }

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
        const normalizedUsers: User[] = users.map(normalizeUserStatus);

        if (pagination?.number === 0) {
          this._usersCache = normalizedUsers;
        } else {
          this._usersCache = [...this._usersCache, ...normalizedUsers];
        }

        this._users$.next(normalizedUsers);
        this._totalPages$.next(pagination?.totalPages ?? 1);
        this._currentPage$.next(pagination?.number ?? 0);
        this._totalElements$.next(
          pagination?.totalElements ?? normalizedUsers.length
        );

        this._updateUserCards(response.data ?? {});
      }),

      catchError((err) => {
        this.errorHandler.handle(err);
        return throwError(() => err);
      }),

      finalize(() => this.setLoading(false))
    );
  }

  public get totalElements(): number {
    return this._totalElements$.getValue();
  }

  private _userStats: {
    totalUsers: number;
    totalOrganizers: number;
    totalAttendees: number;
    totalDeactivatedUsers: number;
  } = {
    totalUsers: 0,
    totalOrganizers: 0,
    totalAttendees: 0,
    totalDeactivatedUsers: 0,
  };

  public searchUsers(
    keyword?: string,
    role?: string,
    status?: boolean,
    page: number = 0
  ) {
    const cacheKey = this._getCacheKey(keyword, role, status, page);

    if (this._searchCache.has(cacheKey)) {
      const cached = this._searchCache.get(cacheKey)!;
      const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;

      if (!isExpired) {
        this._users$.next(cached.users);
        this._totalPages$.next(cached.totalPages);
        this._currentPage$.next(cached.currentPage);
        this._totalElements$.next(cached.totalElements);

        return of(cached.users);
      } else {
        this._searchCache.delete(cacheKey);
      }
    }

    return this.userBackend.searchUsers(keyword, role, status, page).pipe(
      map((response: UserSearchResponse) => {
        const pagination = response.data;
        const users = pagination?.content ?? [];
        return {
          users: users.map(normalizeUserStatus),
          pagination: pagination,
        };
      }),
      tap(({ users, pagination }) => {
        const cachedResult: CachedSearchResult = {
          users,
          totalPages: pagination?.totalPages ?? 1,
          totalElements: pagination?.totalElements ?? users.length,
          currentPage: pagination?.number ?? 0,
          timestamp: Date.now(),
        };

        this._searchCache.set(cacheKey, cachedResult);

        this._users$.next(users);
        this._totalPages$.next(pagination?.totalPages ?? 1);
        this._currentPage$.next(pagination?.number ?? 0);
        this._totalElements$.next(pagination?.totalElements ?? users.length);
      }),
      map(({ users }) => users),
      catchError((err) => {
        this.errorHandler.handle(err);

        this._totalElements$.next(0);
        this._totalPages$.next(0);
        this._currentPage$.next(0);

        return of([]);
      })
    );
  }

  public invalidateCache(): void {
    this._searchCache.clear();
    this._usersCache = [];
  }

  private invalidateSearchCache(): void {
    this._searchCache.clear();
  }

  private _updateUserCards(data?: any): void {
    const stats = data?.totalUsers != null ? data : this._userStats;

    if (data?.totalUsers != null) {
      this._userStats = {
        totalUsers: data.totalUsers,
        totalOrganizers: data.totalOrganizers,
        totalAttendees: data.totalAttendees,
        totalDeactivatedUsers: data.totalDeactivatedUsers,
      };
    }

    const cards: UserCardData[] = [
      {
        title: 'Total Users',
        count: stats.totalUsers,
        icon: 'icons/user-icon-orange.png',
        bgColor: '#FFF4ED',
        iconColor: '#FF6B2C',
      },
      {
        title: 'Active Organizers',
        count: stats.totalOrganizers,
        icon: 'icons/user-icon-green.png',
        bgColor: '#E8F5E9',
        iconColor: '#4CAF50',
      },
      {
        title: 'Attendees',
        count: stats.totalAttendees,
        icon: 'icons/user-icon-blue.png',
        bgColor: '#E3F2FD',
        iconColor: '#2196F3',
      },
      {
        title: 'Deactivated',
        count: stats.totalDeactivatedUsers,
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

    return this.userBackend.updateUser(userId, payload).pipe(
      map((response) => ({
        ...response,
        data: normalizeUserStatus(response.data),
      })),
      tap((response) => {
        const users = this._users$
          .getValue()
          .map((u) =>
            String(u.userId) === String(userId) ? response.data : u
          );
        this._users$.next(users);

        this.invalidateCache();
      }),
      catchError((err) => {
        this.errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this.setLoading(false))
    );
  }

 
  public updateUserWithFormData(userId: string, formData: FormData) {
    this.setLoading(true);

    return this.userBackend.updateUserWithFormData(userId, formData).pipe(
      map((response) => ({
        ...response,
        data: normalizeUserStatus(response.data),
      })),
      tap((response) => {
        const users = this._users$
          .getValue()
          .map((u) =>
            String(u.userId) === String(userId) ? response.data : u
          );
        this._users$.next(users);

        this.invalidateCache();
      }),
      catchError((err) => {
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

        this.invalidateCache();
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
          this.invalidateCache();
        }
      }),
      catchError((err) => {
        this.errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  public fetchInvitations(page?: number, size?: number) {
    this.setLoading(true);
    return this.userBackend.fetchInvitations(page, size).pipe(
      map((response: FetchInvitationsResponse) => {
        return response.data?.content ?? [];
      }),
      catchError((err) => {
        this.errorHandler.handle(err);
        return of([]);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  public fetchInvitationsWithPagination(page: number = 0, size: number = 10) {
    this.setLoading(true);
    return this.userBackend.fetchInvitations(page, size).pipe(
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
