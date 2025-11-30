// core/services/audit-management.service.ts
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { AuditBackendService } from './backend/audit-backend.service';
import { AuditLog, AuditLogsResponse } from '../models/audits/audit-logs.model';

@Injectable({ providedIn: 'root' })
export class AuditManagementService {
  private readonly _loading = new BehaviorSubject(false);
  private readonly _auditLogsData =
    new BehaviorSubject<AuditLogsResponse | null>(null);
  private readonly _selectedAuditLog = new BehaviorSubject<AuditLog | null>(
    null
  );

  public readonly loading$ = this._loading.asObservable();
  public readonly auditLogsData$ = this._auditLogsData.asObservable();
  public readonly selectedAuditLog$ = this._selectedAuditLog.asObservable();

  constructor(
    private readonly _backend: AuditBackendService,
    private readonly _errorHandler: ErrorHandlerService
  ) {}


  public loadAuditLogs(
    page = 0,
    size = 10,
    email?: string,
    startDate?: string,
    endDate?: string,
    status?: string
  ): Observable<AuditLogsResponse> {
    console.log('🔧 SERVICE loadAuditLogs:', { page, size, email, status }); // ✅ ADD THIS

    this._loading.next(true);

    return this._backend
      .getAuditLogs(page, size, email, startDate, endDate, status)
      .pipe(
        tap((data) => {
          console.log('✅ Audit logs API response:', {
            // ✅ ADD THIS
            page: data.pageNumber,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            dataLength: data.data?.length,
          });

          this._auditLogsData.next(data);
        }),
        catchError((err) => {
          console.error('❌ loadAuditLogs error:', err); // ✅ ADD THIS
          this._errorHandler.handle(err);
          return throwError(() => err);
        }),
        finalize(() => this._loading.next(false))
      );
  }

  public loadAuditLogById(logId: string): Observable<AuditLogsResponse> {
    this._loading.next(true);

    return this._backend.getAuditLogById(logId).pipe(
      tap((data) => {
        if (data.data && data.data.length > 0) {
          this._selectedAuditLog.next(data.data[0]);
        }
      }),
      catchError((err) => {
        this._errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._loading.next(false))
    );
  }

  public clearSelectedAuditLog(): void {
    this._selectedAuditLog.next(null);
  }

  public clearCache(): void {
    this._auditLogsData.next(null);
    this._selectedAuditLog.next(null);
  }

  public refresh(): void {
    const currentData = this._auditLogsData.getValue();
    if (currentData) {
      this.loadAuditLogs(
        currentData.pageNumber,
        currentData.pageSize
      ).subscribe();
    }
  }
}
