import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, tap } from 'rxjs';
import { User } from '../models/user.model';
import { UserBackendService } from './backend/user-backend.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private _users$ = new BehaviorSubject<User[]>([]);
  private _loading$ = new BehaviorSubject<boolean>(false);

  public readonly users$ = this._users$.asObservable();
  public readonly loading$ = this._loading$.asObservable();

  constructor(
    private readonly userBackend: UserBackendService,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  public fetchAllUsers() {
    this.setLoading(true);
    return this.userBackend.getAllUsers().pipe(
      tap((response) => this._users$.next(response.data)),
      catchError((err) => this.errorHandler.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public getUser(userId: string) {
    this.setLoading(true);
    return this.userBackend.getUserById(userId).pipe(
      finalize(() => this.setLoading(false)),
      catchError((err) => this.errorHandler.handle(err))
    );
  }

  public createUser(user: Partial<User>) {
    this.setLoading(true);
    return this.userBackend.createUser(user).pipe(
      tap((response) =>
        this._users$.next([...this._users$.getValue(), response.data])
      ),
      catchError((err) => this.errorHandler.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public updateUser(userId: string, user: Partial<User>) {
    this.setLoading(true);
    return this.userBackend.updateUser(userId, user).pipe(
      tap((response) => {
        const users = this._users$
          .getValue()
          .map((u) => (u.userId === userId ? response.data : u));
        this._users$.next(users);
      }),
      catchError((err) => this.errorHandler.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  protected setLoading(isLoading: boolean) {
    this._loading$.next(isLoading);
  }
}
