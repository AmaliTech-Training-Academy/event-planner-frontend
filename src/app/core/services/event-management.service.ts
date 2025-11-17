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

import { EventBackendService } from './backend/event-backend.service';
import {
  DashboardData,
  EventDetails,
  EventManagement,
  mapEventDetailResponseToEventDetails,
} from '../models/events';
import { PaginatedResponse } from '../models/shared';

@Injectable({ providedIn: 'root' })
export class EventManagementService {
  private readonly _loading = new BehaviorSubject(false);
  private readonly _dashboardData = new BehaviorSubject<DashboardData | null>(
    null
  );
  private readonly _paginatedEvents =
    new BehaviorSubject<PaginatedResponse<EventManagement> | null>(null);
  private readonly _selectedEvent = new BehaviorSubject<EventDetails | null>(
    null
  );

  public readonly selectedEvent$ = this._selectedEvent.asObservable();
  public readonly loading$ = this._loading.asObservable();
  public readonly dashboardData$ = this._dashboardData.asObservable();
  public readonly paginatedEvents$ = this._paginatedEvents.asObservable();

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

  public loadEventDetails(eventId: number): Observable<EventDetails> {
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
