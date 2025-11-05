import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize } from 'rxjs';
import { EventBackendServiceService } from './backend/event-backend-service.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class EventsServiceService {
  private _loadingStateSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingStateSubject.asObservable();

  constructor(private readonly eventBackendService: EventBackendServiceService, private readonly errorHandlerService: ErrorHandlerService) { }

  public timeZones() {
    this.setLoading(true)
    this.eventBackendService.getTimeZones().pipe(
      catchError(err => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    )
  }
  public eventTypes() {
    this.setLoading(true)
    this.eventBackendService.getEventTypes().pipe(
      catchError(err => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    )
  }

  private setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }

}
