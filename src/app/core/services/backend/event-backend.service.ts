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

  /** Fetches full dashboard + paginated event management data */
  public getDashboardData(
    page = 0,
    size = 10,
    status?: string,
    search?: string
  ): Observable<ApiResponse<DashboardData>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (status && status !== 'all') params = params.set('status', status);
    if (search) params = params.set('search', search);

    return this._http.get<ApiResponse<DashboardData>>(
      API_ENDPOINTS.EVENT_MANAGEMENT,
      {
        params,
      }
    );
  }
  /** Fetches detailed information for a specific event by ID */
  public getEventDetails(
    eventId: number
  ): Observable<ApiResponse<EventDetailResponse>> {
    return this._http.get<ApiResponse<EventDetailResponse>>(
      API_ENDPOINTS.EVENT_DETAILS(eventId)
    );
  }
}
