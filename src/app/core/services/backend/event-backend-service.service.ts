import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  API_ENDPOINTS,
  EVENTS_API_ENDPOINTS,
} from '../../constants/api-endpoints.constants';
import {
  BaseType,
  EventDetail,
  EventResponse,
  EventType,
  GetEventsResponse,
  RegisterEventBody,
  RegisterEventResponse,
  TimeZone,
} from '../../models/event.model';
import { CacheHttpService } from '../util/CacheHttpClient';
import {
  MyEventResponse,
  MyEventStatsResponse,
} from '@app/core/models/myevent.model';
import { ApiResponse } from '@app/core/models/shared';
import { EventData } from '@app/modules/attendee/pages/edit-event-page/models/edit-event.model';

@Injectable({
  providedIn: 'root',
})
export class EventBackendServiceService {
  constructor(
    private readonly http: HttpClient,
    private readonly cacheHttp: CacheHttpService
  ) {}

  public getEventTypes(): Observable<EventType[]> {
    return this.cacheHttp.get<EventType[]>(
      EVENTS_API_ENDPOINTS.GET_EVENT_TYPES
    );
  }

  public getEventType(id: number): Observable<EventType> {
    return this.http.get<EventType>(EVENTS_API_ENDPOINTS.GET_EVENT_TYPE(id));
  }

  public getTimeZones(): Observable<TimeZone[]> {
    return this.cacheHttp.get<TimeZone[]>(EVENTS_API_ENDPOINTS.GET_TIME_ZONES);
  }

  public getMeeting(): Observable<BaseType[]> {
    return this.cacheHttp.get<BaseType[]>(
      EVENTS_API_ENDPOINTS.GET_MEETING_TYPES
    );
  }

  public createEvent(data: FormData): Observable<EventResponse> {
    return this.http.post<EventResponse>(
      EVENTS_API_ENDPOINTS.CREATE_EVENT,
      data
    );
  }

  public getEvent(id: string): Observable<EventDetail> {
    return this.http.get<EventDetail>(EVENTS_API_ENDPOINTS.GET_EVENT(id));
  }

  public myEventDetails(id: string): Observable<ApiResponse<EventData>> {
    return this.http.get<ApiResponse<EventData>>(EVENTS_API_ENDPOINTS.GET_MY_EVENT_DETAIL(id));
  }

  public updateEvent(id: string, formData: FormData): Observable<EventDetail> {
    return this.http.post<EventDetail>(
      EVENTS_API_ENDPOINTS.GET_EVENT(id),
      formData
    );
  }

  public getEvents(params: URLSearchParams): Observable<GetEventsResponse> {
    const queryParam_ = `?${params.toString()}`;
    return this.http.get<GetEventsResponse>(
      `${EVENTS_API_ENDPOINTS.GET_EVENTS}${queryParam_}`
    );
  }

  public getMyEvents(params: URLSearchParams): Observable<MyEventResponse> {
    const queryParam_ = `?${params.toString()}`;
    return this.http.get<MyEventResponse>(
      `${EVENTS_API_ENDPOINTS.MY_EVENT}${queryParam_}`
    );
  }

  public myEventOverview(): Observable<MyEventStatsResponse> {
    return this.http.get<MyEventStatsResponse>(
      `${API_ENDPOINTS.MY_EVENT_OVERVIEW}`
    );
  }

  public registerEvent(
    id: string,
    data: RegisterEventBody
  ): Observable<RegisterEventResponse> {
    return this.http.post<RegisterEventResponse>(
      EVENTS_API_ENDPOINTS.REGISTER_EVENT(id),
      data
    );
  }

  public getReciept(refrence: string): Observable<RegisterEventResponse> {
    return this.http.get<RegisterEventResponse>(
      EVENTS_API_ENDPOINTS.REFRENCE_EVENT_INFO(refrence)
    );
  }
}
