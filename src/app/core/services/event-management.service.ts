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
  throwError,
} from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import {
  DashboardData,
  Event,
  EventDetailResponse,
  EventStats,
  PaginatedResponse,
  EventManagement,
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
  private readonly _events$ =
    new BehaviorSubject<PaginatedResponse<Event> | null>(null);
  private readonly _dashboardEvents$ =
    new BehaviorSubject<PaginatedResponse<EventManagement> | null>(null);
  private readonly _searchResults$ =
    new BehaviorSubject<PaginatedResponse<Event> | null>(null);

  public readonly loading$ = this._loadingStateSubject.asObservable();
  public readonly dashboardData$ = this._dashboardData$.asObservable();
  public readonly currentEvent$ = this._currentEvent$.asObservable();
  public readonly events$ = this._events$.asObservable();
  public readonly dashboardEvents$ = this._dashboardEvents$.asObservable();
  public readonly searchResults$ = this._searchResults$.asObservable();

  constructor(
    private readonly _eventBackend: EventBackendService,
    private readonly _router: Router,
    private readonly _errorHandlerService: ErrorHandlerService
  ) {}

  /**
   * Load admin dashboard data including stats, top organizers, and paginated events
   */
  public loadDashboardData(): Observable<DashboardData> {
    this._setLoading(true);

    return this._eventBackend.getEventManagement().pipe(
      take(1),
      map((response) => response.data),
      tap((data) => {
        this._dashboardData$.next(data);
        // Also update the dashboard events separately for easy access
        this._dashboardEvents$.next(data.eventManagement);
      }),
      catchError((err) => {
        this._errorHandlerService.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._setLoading(false))
    );
  }

  /**
   * Load paginated dashboard events (for pagination controls)
   */
  public loadDashboardEvents(
    page: number = 0,
    size: number = 10
  ): Observable<PaginatedResponse<EventManagement>> {
    this._setLoading(true);

    return this._eventBackend.getEventManagement(page, size).pipe(
      take(1),
      map((response) => response.data.eventManagement),
      tap((paginatedEvents) => {
        this._dashboardEvents$.next(paginatedEvents);

        // Update the full dashboard data with new events
        const currentData = this._dashboardData$.getValue();
        if (currentData) {
          this._dashboardData$.next({
            ...currentData,
            eventManagement: paginatedEvents,
          });
        }
      }),
      catchError((err) => {
        this._errorHandlerService.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._setLoading(false))
    );
  }

  /**
   * Load detailed information for a specific event
   */
  public loadEventDetails(eventId: number): Observable<EventDetailResponse> {
    this._setLoading(true);

    return this._eventBackend.getEventDetails(eventId).pipe(
      take(1),
      map((response) => response.data),
      tap((event) => {
        this._currentEvent$.next(event);
      }),
      catchError((err) => {
        this._errorHandlerService.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._setLoading(false))
    );
  }

  /**
   * Load all events with optional filtering and pagination
   */
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
        this._events$.next(paginatedData);
      }),
      catchError((err) => {
        this._errorHandlerService.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._setLoading(false))
    );
  }

  /**
   * Search events by query
   */
  public searchEvents(
    query: string,
    page: number = 0,
    size: number = 10,
    status?: string
  ): Observable<PaginatedResponse<Event>> {
    this._setLoading(true);

    return this._eventBackend.searchEvents(query, page, size, status).pipe(
      take(1),
      map((response) => response.data),
      tap((paginatedData) => {
        this._searchResults$.next(paginatedData);
      }),
      catchError((err) => {
        this._errorHandlerService.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._setLoading(false))
    );
  }

  /**
   * Create a new event
   */
  public createEvent(event: Partial<Event>): Observable<Event> {
    this._setLoading(true);

    return this._eventBackend.createEvent(event).pipe(
      take(1),
      map((response) => response.data),
      tap((newEvent) => {
        // Refresh dashboard data after creating event
        this.loadDashboardData().subscribe();
      }),
      catchError((err) => {
        this._errorHandlerService.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._setLoading(false))
    );
  }

  /**
   * Update an existing event
   */
  public updateEvent(
    eventId: number,
    event: Partial<Event>
  ): Observable<Event> {
    this._setLoading(true);

    return this._eventBackend.updateEvent(eventId, event).pipe(
      take(1),
      map((response) => response.data),
      tap((updatedEvent) => {
        // Update current event if it's the one being edited
        if (this._currentEvent$.value?.id === eventId) {
          this._currentEvent$.next(updatedEvent as EventDetailResponse);
        }
        // Refresh dashboard
        this.loadDashboardData().subscribe();
      }),
      catchError((err) => {
        this._errorHandlerService.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._setLoading(false))
    );
  }

  /**
   * Delete an event
   */
  public deleteEvent(eventId: number): Observable<void> {
    this._setLoading(true);

    return this._eventBackend.deleteEvent(eventId).pipe(
      take(1),
      map(() => void 0),
      tap(() => {
        // Clear current event if it's the one being deleted
        if (this._currentEvent$.value?.id === eventId) {
          this._currentEvent$.next(null);
        }
        // Refresh dashboard
        this.loadDashboardData().subscribe();
      }),
      catchError((err) => {
        this._errorHandlerService.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._setLoading(false))
    );
  }

  // ============================================
  // GETTERS (Synchronous access to current state)
  // ============================================

  public getEventStats(): EventStats | null {
    return this._dashboardData$.getValue()?.eventStats ?? null;
  }

  public getCurrentEvent(): EventDetailResponse | null {
    return this._currentEvent$.getValue();
  }

  public getEvents(): Event[] {
    return this._events$.getValue()?.content ?? [];
  }

  public getDashboardEvents(): EventManagement[] {
    return this._dashboardEvents$.getValue()?.content ?? [];
  }

  public getSearchResults(): Event[] {
    return this._searchResults$.getValue()?.content ?? [];
  }

  public getPaginationInfo(): {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  } | null {
    const pagination = this._events$.getValue();
    if (!pagination) return null;

    return {
      totalElements: pagination.totalElements,
      totalPages: pagination.totalPages,
      currentPage: pagination.number,
      pageSize: pagination.size,
    };
  }

  public getDashboardPaginationInfo(): {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  } | null {
    const pagination = this._dashboardEvents$.getValue();
    if (!pagination) return null;

    return {
      totalElements: pagination.totalElements,
      totalPages: pagination.totalPages,
      currentPage: pagination.number,
      pageSize: pagination.size,
    };
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private _setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }

  /**
   * Clear all cached data (useful for logout or context switches)
   */
  public clearCache(): void {
    this._dashboardData$.next(null);
    this._currentEvent$.next(null);
    this._events$.next(null);
    this._dashboardEvents$.next(null);
    this._searchResults$.next(null);
  }
}
