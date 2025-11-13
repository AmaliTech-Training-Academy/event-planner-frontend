import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  tap,
  take,
  map,
} from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import {
  DashboardData,
  Event,
  EventDetailResponse,
  EventStats,
  PaginatedResponse,
} from '../models/event.model';
import { EventBackendService } from './backend/event-backend.service';

@Injectable({ providedIn: 'root' })
export class EventManagementService {
  private readonly _loadingStateSubject = new BehaviorSubject<boolean>(false);
  private readonly _dashboardData$ = new BehaviorSubject<DashboardData | null>(
    null
  );
  private readonly _currentEvent$ =
    new BehaviorSubject<EventDetailResponse | null>(null);
  private readonly _events$ = new BehaviorSubject<Event[]>([]);

  public readonly loading$ = this._loadingStateSubject.asObservable();
  public readonly dashboardData$ = this._dashboardData$.asObservable();
  public readonly currentEvent$ = this._currentEvent$.asObservable();
  public readonly events$ = this._events$.asObservable();

  constructor(
    private readonly _eventBackend: EventBackendService,
    private readonly _router: Router,
    private readonly _errorHandlerService: ErrorHandlerService
  ) {}

  public loadDashboardData(): Observable<DashboardData> {
    this._setLoading(true);

    return this._eventBackend.getEventManagement().pipe(
      take(1),
      map((response) => response.data),
      tap((data) => {
        this._dashboardData$.next(data);
      }),
      catchError((err) => this._errorHandlerService.handle(err)),
      finalize(() => this._setLoading(false))
    );
  }

  public loadEventDetails(eventId: number): Observable<EventDetailResponse> {
    this._setLoading(true);

    return this._eventBackend.getEventDetails(eventId).pipe(
      take(1),
      map((response) => response.data),
      tap((event) => {
        this._currentEvent$.next(event);
      }),
      catchError((err) => this._errorHandlerService.handle(err)),
      finalize(() => this._setLoading(false))
    );
  }

  public loadAllEvents(
    page: number = 0,
    size: number = 10,
    status?: string,
    category?: string
  ): Observable<PaginatedResponse<Event>> {
    this._setLoading(true);

    return this._eventBackend.getAllEvents(page, size, status, category).pipe(
      take(1),
      map((response) => response.data),
      tap((paginatedData) => {
        this._events$.next(paginatedData.content);
      }),
      catchError((err) => this._errorHandlerService.handle(err)),
      finalize(() => this._setLoading(false))
    );
  }

  public createEvent(event: Partial<Event>): Observable<Event> {
    this._setLoading(true);

    return this._eventBackend.createEvent(event).pipe(
      take(1),
      map((response) => response.data),
      tap((newEvent) => {
        this.loadDashboardData().subscribe();
      }),
      catchError((err) => this._errorHandlerService.handle(err)),
      finalize(() => this._setLoading(false))
    );
  }

  public updateEvent(
    eventId: number,
    event: Partial<Event>
  ): Observable<Event> {
    this._setLoading(true);

    return this._eventBackend.updateEvent(eventId, event).pipe(
      take(1),
      map((response) => response.data),
      tap((updatedEvent) => {
        this._currentEvent$.next(updatedEvent as EventDetailResponse);
        // Optionally reload dashboard
        this.loadDashboardData().subscribe();
      }),
      catchError((err) => this._errorHandlerService.handle(err)),
      finalize(() => this._setLoading(false))
    );
  }

  public deleteEvent(eventId: number): Observable<void> {
    this._setLoading(true);

    return this._eventBackend.deleteEvent(eventId).pipe(
      take(1),
      map(() => void 0),
      tap(() => {
        this._currentEvent$.next(null);
        // Optionally reload dashboard
        this.loadDashboardData().subscribe();
      }),
      catchError((err) => this._errorHandlerService.handle(err)),
      finalize(() => this._setLoading(false))
    );
  }

  public getEventStats(): EventStats | null {
    const dashboardData = this._dashboardData$.getValue();
    return dashboardData?.eventStats ?? null;
  }

  public getCurrentEvent(): EventDetailResponse | null {
    return this._currentEvent$.getValue();
  }

  public getEvents(): Event[] {
    return this._events$.getValue();
  }

  private _setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }
}
