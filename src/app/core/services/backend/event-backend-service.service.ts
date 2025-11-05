import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EVENTS_API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { EventType, TimeZone } from '../../models/event.model';
import { CacheHttpService } from '../util/CacheHttpClient';


@Injectable({
  providedIn: 'root',
})
export class EventBackendServiceService {

  constructor(private readonly http: HttpClient, private readonly cacheHttp: CacheHttpService) { }

  public getEventTypes(): Observable<EventType[]> {
    return this.cacheHttp.get<EventType[]>(EVENTS_API_ENDPOINTS.GET_EVENT_TYPES);
  }

  public getEventType(id: number): Observable<EventType> {
    return this.http.get<EventType>(EVENTS_API_ENDPOINTS.GET_EVENT_TYPE(id));
  }

  public getTimeZones(): Observable<TimeZone> {
    return this.cacheHttp.get<TimeZone>(EVENTS_API_ENDPOINTS.GET_TIME_ZONES);
  }

}
