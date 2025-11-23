import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EVENTS_API_ENDPOINTS } from '@app/core/constants/api-endpoints.constants';
import {
  EventAnalyticsResponse,
  ManageEventAttendeesResponse,
  ManageRegistrantsOverviewResponse,
  searchRegistrationResponse,
} from '@app/core/models/manage-events';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManageEventBackendService {
  constructor(private readonly http: HttpClient) {}

  public getEventOverview(id: number): Observable<EventAnalyticsResponse> {
    const url = EVENTS_API_ENDPOINTS.MANAGE_EVENT_DETAILS(id);
    console.log('🟢 Event Overview - Calling URL:', url);
    return this.http.get<EventAnalyticsResponse>(url);
  }

  public getInvitees(
    id: number,
    searchTerm: string = '',
    page: number = 0,
    role: string = '',
    size: number = 10
  ): Observable<ManageEventAttendeesResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (role.trim() !== '') {
      params = params.set('role', role);
    }

    if (searchTerm.trim() !== '') {
      params = params.set('keyword', searchTerm).set('page', '0');
    }

    return this.http.get<ManageEventAttendeesResponse>(
      EVENTS_API_ENDPOINTS.MANAGE_EVENT_INVITEES(id),
      { params }
    );
  }

  public getRegistrantsOverview(
    id: number
  ): Observable<ManageRegistrantsOverviewResponse> {
    return this.http.get<ManageRegistrantsOverviewResponse>(
      EVENTS_API_ENDPOINTS.MANAGE_EVENT_REGISTRANTS_OVERVIEW(id)
    );
  }

  public searchRegistrants(
    id: number,
    keyword: string,
    ticketType: string,
    page: number,
    pageSize: number = 10
  ): Observable<searchRegistrationResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (keyword && keyword.trim() !== '') {
      params = params.set('keyword', keyword.trim());
    }

    if (ticketType && ticketType.trim() !== '') {
      params = params.set('ticketType', ticketType.trim());
    }

    return this.http.get<searchRegistrationResponse>(
      EVENTS_API_ENDPOINTS.MANAGE_EVENT_REGISTRANTS_SEARCH(id),
      { params }
    );
  }

  /**
   * Gets the overview for admin users
   * Uses MY_EVENT_OVERVIEW endpoint which provides aggregated data across all events
   */
  public getMyEventsOverview(): Observable<EventAnalyticsResponse> {
    const url = EVENTS_API_ENDPOINTS.MY_EVENT_OVERVIEW;
    console.log('🔵 Admin Overview - Calling URL:', url);
    return this.http.get<EventAnalyticsResponse>(url);
  }
}
