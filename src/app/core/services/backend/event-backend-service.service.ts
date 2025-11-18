import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EVENTS_API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { BaseType, EventResponse, EventSummary, EventType, GetEventsResponse, TimeZone } from '../../models/event.model';
import { CacheHttpService } from '../util/CacheHttpClient';
import { MyEventResponse, MyEventStatsResponse } from '@app/core/models/myevent.model';


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

  public getTimeZones(): Observable<TimeZone[]> {
    return this.cacheHttp.get<TimeZone[]>(EVENTS_API_ENDPOINTS.GET_TIME_ZONES);
  }

  public getMeeting(): Observable<BaseType[]> {
    return this.cacheHttp.get<BaseType[]>(EVENTS_API_ENDPOINTS.GET_MEETING_TYPES);
  }

  public createEvent(data: FormData): Observable<EventResponse> {
    return this.http.post<EventResponse>(EVENTS_API_ENDPOINTS.CREATE_EVENT, data);
  }

  public getEvent(id: string): Observable<EventSummary> {
    return this.http.get<EventSummary>(EVENTS_API_ENDPOINTS.GET_EVENT(id));
  }
  public getEvents(params: URLSearchParams): Observable<GetEventsResponse> {
    const queryParam_ = `?${params.toString()}`;
    return this.http.get<GetEventsResponse>(`${EVENTS_API_ENDPOINTS.GET_EVENTS}${queryParam_}`);
  }

  public getMyEvents(params: URLSearchParams) {
    const queryParam_ = `?${params.toString()}`;
    return this.http.get<MyEventResponse>(`${EVENTS_API_ENDPOINTS.MY_EVENT}${queryParam_}`);
  }

  public myEventOverview() {
    return this.http.get<MyEventStatsResponse>(`${EVENTS_API_ENDPOINTS.MY_EVENT_OVERVIEW}`);
  }

}
