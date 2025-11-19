import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { DashboardData, EventManagement } from '../../models/events';
import { ApiResponse } from '../../models/shared/api-response.model';
import { EventDetailResponse } from '../../models/events/event-details-response.model';
import { PaginatedResponse } from '../../models/shared';

@Injectable({ providedIn: 'root' })
export class EventBackendService {
  constructor(private readonly _http: HttpClient) {}

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

  // New method specifically for search that returns just events
  public searchEvents(
    keyword: string,
    page = 0,
    size = 10,
    status?: string
  ): Observable<ApiResponse<PaginatedResponse<EventManagement>>> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page)
      .set('size', size);

    if (status && status !== 'all') params = params.set('status', status);

    return this._http.get<ApiResponse<PaginatedResponse<EventManagement>>>(
      API_ENDPOINTS.SEARCH_EVENTS,
      {
        params,
      }
    );
  }

  public getEventDetails(
    eventId: number
  ): Observable<ApiResponse<EventDetailResponse>> {
    return this._http.get<ApiResponse<EventDetailResponse>>(
      API_ENDPOINTS.EVENT_DETAILS(eventId)
    );
  }
}
