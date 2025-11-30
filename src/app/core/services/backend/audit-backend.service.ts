import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { AuditLogsResponse } from '../../models/audits/audit-logs.model';

@Injectable({ providedIn: 'root' })
export class AuditBackendService {
  constructor(private readonly _http: HttpClient) {}

  public getAuditLogs(
    page = 0,
    size = 10,
    fullName?: string,
    status?: string,
    sortBy = 'createdAt',
    direction = 'DESC'
  ): Observable<AuditLogsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);

    if (fullName) {
      params = params.set('fullName', fullName);
    }

    if (status && status.trim().length > 0) {
      params = params.set('status', status.trim().toUpperCase());
    }

    return this._http.get<AuditLogsResponse>(API_ENDPOINTS.GET_AUDIT_LOGS, {
      params,
    });
  }

  public getAuditLogById(logId: string): Observable<AuditLogsResponse> {
    return this._http.get<AuditLogsResponse>(
      API_ENDPOINTS.GET_AUDIT_LOG_BY_ID(logId)
    );
  }
}
