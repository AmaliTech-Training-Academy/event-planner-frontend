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
  EventStatus,
  mapEventDetailResponseToEventDetails,
  EventDetails as CoreEventDetails, // ✅ Use the core model, not the component
} from '../models/event.model';
import { EventBackendService } from './backend/event-backend.service';

@Injectable({ providedIn: 'root' })
export class EventManagementService {
  private readonly _loading = new BehaviorSubject(false);
  private readonly _dashboardData = new BehaviorSubject<DashboardData | null>(
    null
  );
  private readonly _paginatedEvents =
    new BehaviorSubject<PaginatedResponse<EventManagement> | null>(null);

  // ✅ Add selected event BehaviorSubject
  private readonly _selectedEvent =
    new BehaviorSubject<CoreEventDetails | null>(null);
  public readonly selectedEvent$ = this._selectedEvent.asObservable();

  readonly loading$ = this._loading.asObservable();
  readonly dashboardData$ = this._dashboardData.asObservable();
  readonly paginatedEvents$ = this._paginatedEvents.asObservable();

  constructor(
    private readonly _backend: EventBackendService,
    private readonly _errorHandler: ErrorHandlerService
  ) {}

  public loadDashboardData(
    page = 0,
    size = 10,
    status?: string,
    search?: string
  ): Observable<DashboardData> {
    this._loading.next(true);
    return this._backend.getDashboardData(page, size, status, search).pipe(
      map((res) => res.data),
      tap((data) => {
        this._dashboardData.next(data);
        this._paginatedEvents.next(data.eventManagement);
      }),
      catchError((err) => {
        this._errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._loading.next(false))
    );
  }

  public loadEventDetails(eventId: number): Observable<CoreEventDetails> {
    this._loading.next(true);
    return this._backend.getEventDetails(eventId).pipe(
      map((res) => mapEventDetailResponseToEventDetails(res.data)),
      tap((eventDetails) => this._selectedEvent.next(eventDetails)),
      catchError((err) => {
        this._errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._loading.next(false))
    );
  }
}
