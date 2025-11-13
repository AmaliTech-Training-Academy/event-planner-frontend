import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  DashboardData,
  Event,
  EventDetailResponse,
  PaginatedResponse,
  EventManagement,
} from '../../models/event.model';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';

@Injectable({ providedIn: 'root' })
export class EventBackendService {
  constructor(private readonly _http: HttpClient) {}

  /**
   * Get dashboard data including stats, top organizers, and paginated events
   */
  public getEventManagement(
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<DashboardData>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this._http.get<ApiResponse<DashboardData>>(
      API_ENDPOINTS.EVENT_MANAGEMENT,
      { params }
    );
  }

  /**
   * Get detailed information for a specific event
   */
  public getEventDetails(
    eventId: number
  ): Observable<ApiResponse<EventDetailResponse>> {
    return this._http.get<ApiResponse<EventDetailResponse>>(
      API_ENDPOINTS.EVENT_DETAILS(eventId)
    );
  }

  /**
   * Get all events with optional filtering and pagination
   */
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

  /**
   * Search events by query
   */
  public searchEvents(
    query: string,
    page: number = 0,
    size: number = 10,
    status?: string
  ): Observable<ApiResponse<PaginatedResponse<Event>>> {
    let params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this._http.get<ApiResponse<PaginatedResponse<Event>>>(
      API_ENDPOINTS.SEARCH_EVENTS,
      { params }
    );
  }

  /**
   * Create a new event
   */
  public createEvent(event: Partial<Event>): Observable<ApiResponse<Event>> {
    return this._http.post<ApiResponse<Event>>(
      API_ENDPOINTS.CREATE_EVENT,
      event
    );
  }

  /**
   * Update an existing event
   */
  public updateEvent(
    eventId: number,
    event: Partial<Event>
  ): Observable<ApiResponse<Event>> {
    return this._http.put<ApiResponse<Event>>(
      API_ENDPOINTS.UPDATE_EVENT(eventId),
      event
    );
  }

  /**
   * Delete an event
   */
  public deleteEvent(eventId: number): Observable<ApiResponse<void>> {
    return this._http.delete<ApiResponse<void>>(
      API_ENDPOINTS.DELETE_EVENT(eventId)
    );
  }

  /**
   * Get event statistics (if you have a separate endpoint for this)
   */
  public getEventStats(): Observable<ApiResponse<any>> {
    // Adjust endpoint if you have a dedicated stats endpoint
    return this._http.get<ApiResponse<any>>(
      `${API_ENDPOINTS.GET_ALL_EVENTS}/stats`
    );
  }
}
