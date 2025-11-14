import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import {
  ApiResponse,
  DashboardData,
  Event,
  EventDetailResponse,
  PaginatedResponse,
} from '../../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventBackendService {
  constructor(private readonly _http: HttpClient) {}

  public getEventManagement(): Observable<ApiResponse<DashboardData>> {
    return this._http.get<ApiResponse<DashboardData>>(
      API_ENDPOINTS.EVENT_MANAGEMENT
    );
  }

  public getEventDetails(
    eventId: number
  ): Observable<ApiResponse<EventDetailResponse>> {
    return this._http.get<ApiResponse<EventDetailResponse>>(
      API_ENDPOINTS.EVENT_DETAILS(eventId)
    );
  }

  public getAllEvents(
    page: number = 0,
    size: number = 10,
    status?: string,
    category?: string
  ): Observable<ApiResponse<PaginatedResponse<Event>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    if (category) {
      params = params.set('category', category);
    }

    return this._http.get<ApiResponse<PaginatedResponse<Event>>>(
      API_ENDPOINTS.GET_ALL_EVENTS,
      { params }
    );
  }

  public createEvent(event: Partial<Event>): Observable<ApiResponse<Event>> {
    return this._http.post<ApiResponse<Event>>(
      API_ENDPOINTS.CREATE_EVENT,
      event
    );
  }

  public updateEvent(
    eventId: number,
    event: Partial<Event>
  ): Observable<ApiResponse<Event>> {
    return this._http.put<ApiResponse<Event>>(
      API_ENDPOINTS.UPDATE_EVENT(eventId),
      event
    );
  }

  public deleteEvent(eventId: number): Observable<ApiResponse<void>> {
    return this._http.delete<ApiResponse<void>>(
      API_ENDPOINTS.DELETE_EVENT(eventId)
    );
  }
}
