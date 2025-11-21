import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, debounce, debounceTime, finalize, take } from 'rxjs';
import { ManageEventBackendService } from './backend/manage-event-backend.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ManageEventService {
  private _loadingStateSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingStateSubject.asObservable();

  constructor(private readonly manageEventBackend: ManageEventBackendService, private readonly errorService: ErrorHandlerService) { }

  public getOverview(id: number) {
    this.setLoading(true)
    return this.manageEventBackend.getEventOverview(id)
      .pipe(
        take(1),
        finalize(() => this.setLoading(false)),
        catchError(err => this.errorService.handle(err))
      )
  }

  public invitees(id: number, searchterm: string, page: number, role: string) {
    this.setLoading(true)
    return this.manageEventBackend.getInvitees(id, searchterm, page, role).pipe(
      take(1),
      finalize(() => this.setLoading(false)),
      catchError(err => this.errorService.handle(err))
    )
  }

  public registrationOverview(id: number) {
    return this.manageEventBackend.getRegistrantsOverview(id).pipe(
      take(1),
      catchError(err => this.errorService.handle(err))
    )
  }

  public searchRegistration(id: number, keyword: string, ticketType: string, page: number = 0) {
    return this.manageEventBackend.searchRegistrants(id, keyword, ticketType, page).pipe(
      take(1),
      debounceTime(300),
      catchError(err => this.errorService.handle(err))
    )
  }

  private setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }

}
