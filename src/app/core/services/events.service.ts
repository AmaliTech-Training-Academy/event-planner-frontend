import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, take, tap } from 'rxjs';
import { EventBackendServiceService } from './backend/event-backend-service.service';
import { ErrorHandlerService } from './error-handler.service';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../constants/app-routes.constants';
import { EventDetail, GetEventProps, RegisterEventBody } from '../models/event.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class EventsServiceService {
  private _loadingStateSubject = new BehaviorSubject<boolean>(true);
  public readonly loading$ = this._loadingStateSubject.asObservable();

  constructor(
    private readonly eventBackendService: EventBackendServiceService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {}

  public timeZones() {
    this.setLoading(true);
    return this.eventBackendService.getTimeZones().pipe(
      take(1),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public eventTypes() {
    this.setLoading(true);
    return this.eventBackendService.getEventTypes().pipe(
      take(1),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }
  public meetingTypes() {
    this.setLoading(true);
    return this.eventBackendService.getMeeting().pipe(
      take(1),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public createEvent(formData: FormData) {
    this.setLoading(true);
    return this.eventBackendService.createEvent(formData).pipe(
      take(1),
      tap((response) => {
        this.router.navigate([APP_ROUTES.CREATE_EVENT_SUCCESS], {
          state: { eventResponse: response },
        });
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
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
    past,
  }: GetEventProps) {
    this.setLoading(true);
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
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public getEvent(id: string) {
    this.setLoading(true);
    return this.eventBackendService.getEvent(id).pipe(
      take(1),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }
  public getMyEventDetail(id: string) {
    this.setLoading(true);
    return this.eventBackendService.myEventDetails(id).pipe(
      take(1),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public updateEvent(id: string, formData: FormData) {
    this.setLoading(true);
    return this.eventBackendService.updateEvent(id, formData).pipe(
      take(1),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public register(
    id: string,
    data: RegisterEventBody,
    eventData: EventDetail,
    isFree: boolean = false
  ) {
    this.setLoading(true);

    return this.eventBackendService.registerEvent(id, data).pipe(
      take(1),
      tap((response) => {
        if (isFree) {
          this.notificationService.success(
            "Hurray 🎉, you've successfully registered for this event."
          );
          this.router.navigate([APP_ROUTES.EVENT_PAYMENT_SUCCESS], {
            state: { eventData, eventResponse: response },
          });
        }
      }),
      map((response) => response),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => {
        this.setLoading(false);
      })
    );
  }

  public getReciept(refrence: string) {
    return this.eventBackendService.getReciept(refrence).pipe(
      take(1),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => {
        this.setLoading(false);
      })
    );
  }

  public myEvents(page: number = 0, pageSize: number = 3) {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());

    this.setLoading(true);

    return this.eventBackendService.getMyEvents(params).pipe(
      take(1),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  public myEventOverview() {
    this.setLoading(true);
    return this.eventBackendService.myEventOverview().pipe(
      take(1),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  private setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }
}