import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { ApiResponse } from '../../models/shared/api-response.model';
import {
    EventGraphResponse,
    RegistrationGraphResponse,
} from '../../models/dashboard/dashboard-stats-response.model';

@Injectable({ providedIn: 'root' })
export class DashboardStatsBackendService {
    constructor(private readonly _http: HttpClient) { }

    /**
     * Fetches event creation statistics from the API
     * @returns Observable of event graph data
     */
    public getEventGraphData(): Observable<ApiResponse<EventGraphResponse>> {
        return this._http.get<ApiResponse<EventGraphResponse>>(
            API_ENDPOINTS.EVENT_GRAPH_EVENTS
        );
    }

    /**
     * Fetches user registration statistics from the API
     * @returns Observable of registration graph data
     */
    public getRegistrationGraphData(): Observable<
        ApiResponse<RegistrationGraphResponse>
    > {
        return this._http.get<ApiResponse<RegistrationGraphResponse>>(
            API_ENDPOINTS.EVENT_GRAPH_REGISTRATIONS
        );
    }
}
