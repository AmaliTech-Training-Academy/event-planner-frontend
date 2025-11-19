import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, take, tap } from 'rxjs';
import { EventBackendServiceService } from './backend/event-backend-service.service';
import { ErrorHandlerService } from './error-handler.service';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../constants/app-routes.constants';
import { GetEventProps } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventsServiceService {
  private _loadingStateSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingStateSubject.asObservable();

  constructor(private readonly eventBackendService: EventBackendServiceService, private readonly errorHandlerService: ErrorHandlerService, private readonly router: Router) { }

  public timeZones() {
    this.setLoading(true)
    return this.eventBackendService.getTimeZones().pipe(
      take(1),
      catchError(err => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    )
  }

  public eventTypes() {
    this.setLoading(true)
    return this.eventBackendService.getEventTypes().pipe(
      take(1),
      catchError(err => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    )
  }
  public meetingTypes() {
    this.setLoading(true)
    return this.eventBackendService.getMeeting().pipe(
      take(1),
      catchError(err => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    )
  }

  public createEvent(formData: FormData) {
    this.setLoading(true)
    return this.eventBackendService.createEvent(formData).pipe(
      take(1),
      tap((response) => {
        this.router.navigate([APP_ROUTES.CREATE_EVENT_SUCCESS], {
          state: { eventResponse: response}
        });

      }),
      catchError(err => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    )
  }


  public getEvents({
    sortBy,
    pageNumber,
    pageSize,
    location,
    hasTitle,
    date,
    paid,
    priceFilter,
    past
  }: GetEventProps) {
    this.setLoading(true)
    const params = new URLSearchParams();

    if (sortBy?.length) params.append('sortBy', sortBy.join(','));
    if (pageNumber) params.append('pageNumber', pageNumber.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    if (location) params.append('location', location);
    if (hasTitle) params.append('hasTitle', hasTitle);
    if (date) params.append('date', date);
    if (paid !== undefined) params.append('paid', paid.toString());
    if (priceFilter) params.append('priceFilter', priceFilter);
    if (past !== undefined) params.append('past', past.toString());

    return this.eventBackendService.getEvents(params).pipe(
      take(1),
      catchError(err => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    )
  }

  public getEvent(id: string) {
    this.setLoading(true)
    return this.eventBackendService.getEvent(id).pipe(
      take(1),
      catchError(err => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    )
  }

  private setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }

}
