import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';
import {
  DataTableComponent,
  TableColumn,
  TableFilter,
} from '../../../../shared/admin-ui/data-table/data-table.component';
import {
  AUDIT_LOG_STATUS_FILTERS,
  AuditLog,
} from '../../../../core/models/users/audit-logs.model';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './audit-logs-page.component.html',
  styleUrls: ['./audit-logs-page.component.scss'],
})
export class AuditLogsComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);

  public readonly auditLogs = signal<ReadonlyArray<AuditLog>>([]);

  public readonly isLoading = signal<boolean>(false);

  public readonly columns: ReadonlyArray<TableColumn<AuditLog>> = [
    { key: 'fullName', header: 'User' },
    { key: 'timestamp', header: 'Timestamp' },
    { key: 'ipAddress', header: 'IP Address' },
    { key: 'status', header: 'Status' },
  ];

  public readonly filters: ReadonlyArray<TableFilter> = [
    {
      key: 'status',
      placeholder: 'Status',
      options: AUDIT_LOG_STATUS_FILTERS,
    },
  ];

  public ngOnInit(): void {
    this._layoutService.pageTitle.set('Audit Logs');
    this._layoutService.logoSrc.set('icons/audit.png');
    this._layoutService.logoAlt.set('icons/audit.png');

    // TODO: Call audit logs service to load data
    // this._loadAuditLogs();
  }

  // TODO: Implement this method when API service is ready
  // private _loadAuditLogs(): void {
  //   this._isLoading.set(true);
  //   this._auditLogService.getAuditLogs().subscribe({
  //     next: (logs) => {
  //       this._auditLogs.set(logs);
  //       this._isLoading.set(false);
  //     },
  //     error: (error) => {
  //       console.error('Failed to load audit logs:', error);
  //       this._isLoading.set(false);
  //     }
  //   });
  // }
}
