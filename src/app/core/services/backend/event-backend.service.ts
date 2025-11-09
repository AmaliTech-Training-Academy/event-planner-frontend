import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import {
  EventResponse,
  EventListResponse,
  CreateEventRequest,
  UpdateEventRequest,
  EventFilters,
  CancelEventRequest,
  RejectEventRequest,
  BannerUploadResponse,
  EventStatistics,
  TopOrganizersResponse,
  UpcomingEvent,
} from '../../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventBackendService {
  constructor(private readonly http: HttpClient) {}

  public getAllEvents(filters?: EventFilters): Observable<EventListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page !== undefined) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.pageSize !== undefined) {
        params = params.set('pageSize', filters.pageSize.toString());
      }
      if (filters.category) {
        params = params.set('category', filters.category);
      }
      if (filters.location) {
        params = params.set('location', filters.location);
      }
      if (filters.startDate) {
        params = params.set('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params = params.set('endDate', filters.endDate);
      }
      if (filters.eventType) {
        params = params.set('eventType', filters.eventType);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.search) {
        params = params.set('search', filters.search);
      }
    }

    return this.http.get<EventListResponse>(API_ENDPOINTS.EVENTS, { params });
  }

  public getEventById(eventId: string): Observable<EventResponse> {
    return this.http.get<EventResponse>(API_ENDPOINTS.EVENT_BY_ID(eventId));
  }

  public createEvent(request: CreateEventRequest): Observable<EventResponse> {
    return this.http.post<EventResponse>(API_ENDPOINTS.EVENTS, request);
  }

  public updateEvent(
    eventId: string,
    request: UpdateEventRequest
  ): Observable<EventResponse> {
    return this.http.put<EventResponse>(
      API_ENDPOINTS.EVENT_BY_ID(eventId),
      request
    );
  }

  public deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.EVENT_BY_ID(eventId));
  }

  public publishEvent(eventId: string): Observable<EventResponse> {
    return this.http.post<EventResponse>(
      API_ENDPOINTS.EVENT_PUBLISH(eventId),
      {}
    );
  }

  public cancelEvent(
    eventId: string,
    request: CancelEventRequest
  ): Observable<EventResponse> {
    return this.http.post<EventResponse>(
      API_ENDPOINTS.EVENT_CANCEL(eventId),
      request
    );
  }

  public approveEvent(eventId: string): Observable<EventResponse> {
    return this.http.post<EventResponse>(
      API_ENDPOINTS.EVENT_APPROVE(eventId),
      {}
    );
  }

  public rejectEvent(
    eventId: string,
    request: RejectEventRequest
  ): Observable<EventResponse> {
    return this.http.post<EventResponse>(
      API_ENDPOINTS.EVENT_REJECT(eventId),
      request
    );
  }

  public uploadEventBanner(
    eventId: string,
    file: File
  ): Observable<BannerUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<BannerUploadResponse>(
      API_ENDPOINTS.EVENT_BANNER(eventId),
      formData
    );
  }

  public deleteEventBanner(eventId: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.EVENT_BANNER(eventId));
  }

  public getEventsByOrganizer(
    organizerId: string,
    page?: number,
    pageSize?: number
  ): Observable<EventListResponse> {
    let params = new HttpParams();

    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (pageSize !== undefined) {
      params = params.set('pageSize', pageSize.toString());
    }

    return this.http.get<EventListResponse>(
      API_ENDPOINTS.EVENTS_BY_ORGANIZER(organizerId),
      { params }
    );
  }

  // Dashboard/Statistics endpoints
  public getEventStatistics(): Observable<{ data: EventStatistics }> {
    return this.http.get<{ data: EventStatistics }>(
      API_ENDPOINTS.EVENT_STATISTICS
    );
  }

  public getTopOrganizers(): Observable<TopOrganizersResponse> {
    return this.http.get<TopOrganizersResponse>(API_ENDPOINTS.TOP_ORGANIZERS);
  }

  public getUpcomingEvents(): Observable<{ data: UpcomingEvent[] }> {
    return this.http.get<{ data: UpcomingEvent[] }>(
      API_ENDPOINTS.UPCOMING_EVENTS
    );
  }
}
