import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  tap,
  take,
} from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { EventBackendService } from './backend/event-backend.service';
import {
  EventDetailResponse,
  EventSummary,
  CreateEventRequest,
  UpdateEventRequest,
  EventFilters,
  CancelEventRequest,
  RejectEventRequest,
  PaginationMetadata,
  EventStatistics,
  OrganizerStats,
  UpcomingEvent,
} from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventManagementService {
  private _loadingStateSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingStateSubject.asObservable();

  private _eventsSubject = new BehaviorSubject<EventSummary[]>([]);
  public readonly events$ = this._eventsSubject.asObservable();

  private _paginationSubject = new BehaviorSubject<PaginationMetadata | null>(
    null
  );
  public readonly pagination$ = this._paginationSubject.asObservable();

  private _selectedEventSubject =
    new BehaviorSubject<EventDetailResponse | null>(null);
  public readonly selectedEvent$ = this._selectedEventSubject.asObservable();

  private _statisticsSubject = new BehaviorSubject<EventStatistics | null>(
    null
  );
  public readonly statistics$ = this._statisticsSubject.asObservable();

  private _topOrganizersSubject = new BehaviorSubject<OrganizerStats[]>([]);
  public readonly topOrganizers$ = this._topOrganizersSubject.asObservable();

  private _upcomingEventsSubject = new BehaviorSubject<UpcomingEvent[]>([]);
  public readonly upcomingEvents$ = this._upcomingEventsSubject.asObservable();

  constructor(
    private readonly eventBackend: EventBackendService,
    private readonly router: Router,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  public getAllEvents(filters?: EventFilters): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.getAllEvents(filters).pipe(
      take(1),
      tap((response) => {
        this._eventsSubject.next(response.data);
        this._paginationSubject.next(response.pagination);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public getEventById(eventId: string): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.getEventById(eventId).pipe(
      take(1),
      tap((response) => {
        this._selectedEventSubject.next(response.data);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public createEvent(
    request: CreateEventRequest,
    navigateOnSuccess: boolean = true
  ): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.createEvent(request).pipe(
      take(1),
      tap((response) => {
        if (navigateOnSuccess) {
          this.router.navigate(['/app/events', response.data.id]);
        }
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public updateEvent(
    eventId: string,
    request: UpdateEventRequest
  ): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.updateEvent(eventId, request).pipe(
      take(1),
      tap((response) => {
        this._selectedEventSubject.next(response.data);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public deleteEvent(
    eventId: string,
    navigateOnSuccess: boolean = true
  ): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.deleteEvent(eventId).pipe(
      take(1),
      tap(() => {
        if (navigateOnSuccess) {
          this.router.navigate(['/app/events']);
        }
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public publishEvent(eventId: string): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.publishEvent(eventId).pipe(
      take(1),
      tap((response) => {
        this._selectedEventSubject.next(response.data);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public cancelEvent(
    eventId: string,
    request: CancelEventRequest
  ): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.cancelEvent(eventId, request).pipe(
      take(1),
      tap((response) => {
        this._selectedEventSubject.next(response.data);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public approveEvent(eventId: string): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.approveEvent(eventId).pipe(
      take(1),
      tap((response) => {
        this._selectedEventSubject.next(response.data);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public rejectEvent(
    eventId: string,
    request: RejectEventRequest
  ): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.rejectEvent(eventId, request).pipe(
      take(1),
      tap((response) => {
        this._selectedEventSubject.next(response.data);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public uploadEventBanner(eventId: string, file: File): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.uploadEventBanner(eventId, file).pipe(
      take(1),
      tap(() => {
        // Refresh event details to get updated banner URL
        this.getEventById(eventId).subscribe();
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public deleteEventBanner(eventId: string): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.deleteEventBanner(eventId).pipe(
      take(1),
      tap(() => {
        // Refresh event details
        this.getEventById(eventId).subscribe();
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public getEventsByOrganizer(
    organizerId: string,
    page?: number,
    pageSize?: number
  ): Observable<any> {
    this.setLoading(true);

    return this.eventBackend
      .getEventsByOrganizer(organizerId, page, pageSize)
      .pipe(
        take(1),
        tap((response) => {
          this._eventsSubject.next(response.data);
          this._paginationSubject.next(response.pagination);
        }),
        catchError((err) => this.errorHandlerService.handle(err)),
        finalize(() => this.setLoading(false))
      );
  }

  // Dashboard/Statistics methods
  public getEventStatistics(): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.getEventStatistics().pipe(
      take(1),
      tap((response) => {
        this._statisticsSubject.next(response.data);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public getTopOrganizers(): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.getTopOrganizers().pipe(
      take(1),
      tap((response) => {
        this._topOrganizersSubject.next(response.data);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public getUpcomingEvents(): Observable<any> {
    this.setLoading(true);

    return this.eventBackend.getUpcomingEvents().pipe(
      take(1),
      tap((response) => {
        this._upcomingEventsSubject.next(response.data);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  // Utility methods
  public clearSelectedEvent(): void {
    this._selectedEventSubject.next(null);
  }

  public getCurrentEvents(): EventSummary[] {
    return this._eventsSubject.getValue();
  }

  public getSelectedEvent(): EventDetailResponse | null {
    return this._selectedEventSubject.getValue();
  }

  public getStatistics(): EventStatistics | null {
    return this._statisticsSubject.getValue();
  }

  private setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }
}
