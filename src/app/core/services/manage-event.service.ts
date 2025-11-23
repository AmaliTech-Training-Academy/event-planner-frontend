import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  finalize,
  Observable,
  take,
} from 'rxjs';
import { ManageEventBackendService } from './backend/manage-event-backend.service';
import { ErrorHandlerService } from './error-handler.service';
import { EventAnalyticsResponse } from '@app/core/models/manage-events';

@Injectable({
  providedIn: 'root',
})
export class ManageEventService {
  private _loadingStateSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingStateSubject.asObservable();

  constructor(
    private readonly manageEventBackend: ManageEventBackendService,
    private readonly errorService: ErrorHandlerService
  ) { }

  public getOverview(id: number) {
    this.setLoading(true);
    return this.manageEventBackend.getEventOverview(id).pipe(
      take(1),
      finalize(() => this.setLoading(false)),
      catchError((err) => this.errorService.handle(err))
    );
  }

  public invitees(id: number, searchterm: string, page: number, role: string) {
    this.setLoading(true);
    return this.manageEventBackend.getInvitees(id, searchterm, page, role).pipe(
      take(1),
      finalize(() => this.setLoading(false)),
      catchError((err) => this.errorService.handle(err))
    );
  }

  public registrationOverview(id: number) {
    return this.manageEventBackend.getRegistrantsOverview(id).pipe(
      take(1),
      catchError((err) => this.errorService.handle(err))
    );
  }

  public searchRegistration(
    id: number,
    keyword: string,
    ticketType: string,
    page: number = 0
  ) {
    return this.manageEventBackend
      .searchRegistrants(id, keyword, ticketType, page)
      .pipe(
        take(1),
        debounceTime(300),
        catchError((err) => this.errorService.handle(err))
      );
  }

  /**
   * Gets overview data based on user role
   * @param isAdmin - Whether the current user is an admin
   * @param eventId - Event ID (required for admin users, optional for attendees)
   * @returns Observable with event analytics data
   */
  public getOverviewForUser(
    isAdmin: boolean,
    eventId?: number
  ): Observable<EventAnalyticsResponse> {
    console.log('getOverviewForUser called with:', { isAdmin, eventId });

    if (isAdmin) {
      // Admin view – use MY_EVENT_DETAILS for event-specific admin data
      if (!eventId) {
        throw new Error('Event ID is required for admin users');
      }
      console.log('Using admin event details endpoint for event:', eventId);
      return this.manageEventBackend
        .getMyEventsOverview(eventId)
        .pipe(catchError((err) => this.errorService.handle(err)));
    }

    // Attendee/Host view – use MY_EVENT_OVERVIEW for all their events overview
    console.log('Using my-events overview endpoint for attendee');
    return this.manageEventBackend
      .getAttendeeOverview()
      .pipe(catchError((err) => this.errorService.handle(err)));
  }

  private setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }
}
