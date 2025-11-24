import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import {
  FetchInvitationsResponse,
  InviteUserPayload,
  InviteUserResponse,
  User,
  UserCardData,
  UserSearchResponse,
  UserManagementResponse,
  UserResponse,
  normalizeUserStatus,
} from '../models/index';
import { USER_ROLES } from '../constants/user.constants';
import {
  UpdateUserPayload,
  UserBackendService,
} from './backend/user-backend.service';
import { ErrorHandlerService } from './error-handler.service';

interface CachedSearchResult {
  users: User[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  timestamp: number;
}

interface UserStats {
  totalUsers: number;
  totalOrganizers: number;
  totalCoOrganizers: number;
  totalAdmin: number;
  totalAttendees: number;
  totalOthers: number;
  totalDeactivatedUsers: number;
}
@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private readonly _users$: BehaviorSubject<User[]> = new BehaviorSubject<
    User[]
  >([]);
  private readonly _userCards$: BehaviorSubject<UserCardData[]> =
    new BehaviorSubject<UserCardData[]>([]);
  private readonly _loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private readonly _totalPages$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private readonly _currentPage$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private readonly _totalElements$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  public readonly totalElements$: Observable<number> =
    this._totalElements$.asObservable();
  public readonly users$: Observable<User[]> = this._users$.asObservable();
  public readonly userCards$: Observable<UserCardData[]> =
    this._userCards$.asObservable();
  public readonly loading$: Observable<boolean> = this._loading$.asObservable();
  public readonly totalPages$: Observable<number> =
    this._totalPages$.asObservable();
  public readonly currentPage$: Observable<number> =
    this._currentPage$.asObservable();

  private _usersCache: User[] = [];
  private readonly _searchCache: Map<string, CachedSearchResult> = new Map<
    string,
    CachedSearchResult
  >();
  private readonly _cacheDuration: number = 5 * 60 * 1000;

  private _userStats: UserStats = {
    totalUsers: 0,
    totalOrganizers: 0,
    totalCoOrganizers: 0,
    totalAdmin: 0,
    totalAttendees: 0,
    totalOthers: 0,
    totalDeactivatedUsers: 0,
  };
  constructor(
    private readonly _userBackend: UserBackendService,
    private readonly _errorHandler: ErrorHandlerService
  ) { }

  public get totalElements(): number {
    return this._totalElements$.getValue();
  }

  public fetchAllUsers(
    page: number = 0,
    size: number = 10
  ): Observable<UserManagementResponse> {
    this._setLoading(true);

    return this._userBackend.getAllUsers(page, size).pipe(
      map((response: UserManagementResponse): UserManagementResponse => {
        const pagination = response.data.users;
        const normalizedUsers: User[] =
          pagination.content.map(normalizeUserStatus);

        return {
          ...response,
          data: {
            totalUsers: response.data.totalUsers,
            totalOrganizers: response.data.totalOrganizers,
            totalAttendees: response.data.totalAttendees,
            totalDeactivatedUsers: response.data.totalDeactivatedUsers,
            users: {
              ...pagination,
              content: normalizedUsers,
            },
          },
        };
      }),

      tap((response: UserManagementResponse) => {
        const pagination = response.data.users;
        const normalizedUsers = pagination.content;

        if (pagination.number === 0) {
          this._usersCache = normalizedUsers;
        } else {
          this._usersCache = [...this._usersCache, ...normalizedUsers];
        }

        this._users$.next(normalizedUsers);
        this._totalPages$.next(pagination.totalPages);
        this._currentPage$.next(pagination.number);
        this._totalElements$.next(pagination.totalElements);

        this._updateUserCards(response.data);
      }),

      catchError((err) => {
        this._errorHandler.handle(err);
        return throwError(() => err);
      }),

      finalize(() => this._setLoading(false))
    );
  }

  public searchUsers(
    keyword?: string,
    role?: string,
    status?: boolean,
    page: number = 0
  ): Observable<User[]> {
    const cacheKey = this._getCacheKey(keyword, role, status, page);

    if (this._searchCache.has(cacheKey)) {
      const cached = this._searchCache.get(cacheKey)!;
      const isExpired = Date.now() - cached.timestamp > this._cacheDuration;

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

    return this._userBackend.searchUsers(keyword, role, status, page).pipe(
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
        this._errorHandler.handle(err);

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

  public getUser(userId: string): Observable<UserResponse> {
    this._setLoading(true);
    return this._userBackend.getUserById(userId).pipe(
      map(
        (response: { data: User }): UserResponse => ({
          success: true,
          message: 'User retrieved successfully',
          data: normalizeUserStatus(response.data),
        })
      ),
      catchError((err) => {
        this._errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._setLoading(false))
    );
  }
  public createUser(user: Partial<User>): Observable<UserResponse> {
    this._setLoading(true);
    return this._userBackend.createUser(user).pipe(
      map(
        (response: UserResponse): UserResponse => ({
          ...response,
          data: normalizeUserStatus(response.data),
        })
      ),
      tap((response: UserResponse) => {
        const updatedUsers = [...this._users$.getValue(), response.data];
        this._users$.next(updatedUsers);

        this._updateCardsFromUserList(updatedUsers);
        this.invalidateCache();
      }),
      catchError((err) => {
        this._errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._setLoading(false))
    );
  }

  public updateUser(
    userId: string,
    payload: UpdateUserPayload
  ): Observable<UserResponse> {
    this._setLoading(true);

    return this._userBackend.updateUser(userId, payload).pipe(
      map(
        (response: UserResponse): UserResponse => ({
          ...response,
          data: normalizeUserStatus(response.data),
        })
      ),
      tap((response: UserResponse) => {
        const users = this._users$
          .getValue()
          .map((u) =>
            String(u.userId) === String(userId) ? response.data : u
          );
        this._users$.next(users);

        this._updateCardsFromUserList(users);
        this.invalidateCache();
      }),
      catchError((err) => {
        this._errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._setLoading(false))
    );
  }

  public updateUserWithFormData(
    userId: string,
    formData: FormData
  ): Observable<UserResponse> {
    this._setLoading(true);

    return this._userBackend.updateUserWithFormData(userId, formData).pipe(
      map(
        (response: UserResponse): UserResponse => ({
          ...response,
          data: normalizeUserStatus(response.data),
        })
      ),
      tap((response: UserResponse) => {
        const users = this._users$
          .getValue()
          .map((u) =>
            String(u.userId) === String(userId) ? response.data : u
          );
        this._users$.next(users);

        this._updateCardsFromUserList(users);
        this.invalidateCache();
      }),
      catchError((err) => {
        this._errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._setLoading(false))
    );
  }

  public toggleUserStatusWithBackend(
    userId: number | string
  ): Observable<void> {
    this._setLoading(true);

    return this._userBackend.toggleUserActivation(userId).pipe(
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

        this._updateCardsFromUserList(updatedUsers);
        this.invalidateCache();
      }),
      catchError((err) => {
        this._errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._setLoading(false))
    );
  }

  public inviteUsers(
    payload: InviteUserPayload
  ): Observable<InviteUserResponse> {
    this._setLoading(true);
    return this._userBackend.inviteUsers(payload).pipe(
      tap((response: InviteUserResponse) => {
        this.invalidateCache();
      }),
      catchError((err) => this._errorHandler.handle(err)),
      finalize(() => this._setLoading(false))
    );
  }

  private _getCacheKey(
    keyword?: string,
    role?: string,
    status?: boolean,
    page: number = 0
  ): string {
    return `${keyword ?? ''}|${role ?? ''}|${status ?? ''}|${page}`;
  }

  private _invalidateSearchCache(): void {
    this._searchCache.clear();
  }

  private _updateCardsFromUserList(users: User[]): void {
    const totalUsers = users.length;

    const totalOrganizers = users.filter(
      (u) => u.role === USER_ROLES.ORGANIZER && u.status === 'Active'
    ).length;

    const totalCoOrganizers = users.filter(
      (u) => u.role === USER_ROLES.CO_ORGANIZER && u.status === 'Active'
    ).length;

    const totalAdmin = users.filter(
      (u) => u.role === USER_ROLES.ADMIN && u.status === 'Active'
    ).length;

    const totalAttendees = users.filter(
      (u) => u.role === USER_ROLES.ATTENDEE && u.status === 'Active'
    ).length;

    const totalDeactivated = users.filter(
      (u) => u.status === 'Inactive'
    ).length;

    const accountedFor =
      totalOrganizers + totalCoOrganizers + totalAdmin + totalAttendees;
    const totalOthers = Math.max(
      0,
      totalUsers - totalDeactivated - accountedFor
    );

    this._userStats = {
      totalUsers,
      totalOrganizers,
      totalCoOrganizers,
      totalAdmin,
      totalAttendees,
      totalOthers,
      totalDeactivatedUsers: totalDeactivated,
    };

    this._updateUserCards();
  }

  private _updateUserCards(data?: Partial<UserStats>): void {
    const stats: UserStats =
      data?.totalUsers != null ? (data as UserStats) : this._userStats;

    if (data?.totalUsers != null) {
      this._userStats = data as UserStats;
    }

    // Calculate Admin count as: Total Users - Active Organizers
    const calculatedAdmin = Math.max(
      0,
      stats.totalUsers - stats.totalOrganizers
    );

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
        title: 'Admin',
        count: calculatedAdmin,
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

      {
        title: 'Active Co-organizers',
        count: stats.totalCoOrganizers,
        icon: '',
        bgColor: '',
        iconColor: '',
      },
      {
        title: 'Attendees',
        count: stats.totalAttendees,
        icon: '',
        bgColor: '',
        iconColor: '',
      },
      {
        title: 'Other Users',
        count: stats.totalOthers,
        icon: '',
        bgColor: '',
        iconColor: '',
      },
    ];

    this._userCards$.next(cards);
  }

  private _setLoading(isLoading: boolean): void {
    this._loading$.next(isLoading);
  }
}
