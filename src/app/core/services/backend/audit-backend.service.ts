import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import { AuditLogsResponse } from '../../models/audits/audit-logs.model';

@Injectable({ providedIn: 'root' })
export class AuditBackendService {
  constructor(private readonly _http: HttpClient) { }


  public getAuditLogs(
    page = 0,
    size = 10,
    email?: string,
    startDate?: string,
    endDate?: string,
    status?: string
  ): Observable<AuditLogsResponse> {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString());

    if (email) {
      params = params.set('email', email);
    }

    if (startDate) {
      params = params.set('startDate', startDate);
    }

    if (endDate) {
      params = params.set('endDate', endDate);
    }

    if (status) {
      params = params.set('auditStatus', status.toUpperCase());
    }

    return this._http.get<AuditLogsResponse>(API_ENDPOINTS.GET_AUDIT_LOGS, {
      params,
    });
  }

  /**
   * Fetches a single audit log by ID
   * @param logId - The audit log ID
   */
  public getAuditLogById(logId: string): Observable<AuditLogsResponse> {
    return this._http.get<AuditLogsResponse>(
      API_ENDPOINTS.GET_AUDIT_LOG_BY_ID(logId)
    );
  }
}
