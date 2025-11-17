import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { DashboardData } from '../../models/events';
import { ApiResponse } from '../../models/shared/api-response.model';
import { EventDetailResponse } from '../../models/events/event-details-response.model';

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

  public getEventDetails(
    eventId: number
  ): Observable<ApiResponse<EventDetailResponse>> {
    return this._http.get<ApiResponse<EventDetailResponse>>(
      API_ENDPOINTS.EVENT_DETAILS(eventId)
    );
  }
}
