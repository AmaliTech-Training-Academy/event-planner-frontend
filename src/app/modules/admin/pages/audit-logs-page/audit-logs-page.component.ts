import { Component, signal, OnInit } from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';
import {
  DataTableComponent,
  TableColumn,
  FilterOption,
  TableFilter,
} from '../../../../shared/admin-ui/data-table/data-table.component';

interface AuditLog {
  readonly user: string;
  readonly email: string;
  readonly timestamp: string;
  readonly ipAddress: string;
  readonly status: 'Successful' | 'Failed';
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './audit-logs-page.component.html',
  styleUrls: ['./audit-logs-page.component.scss'],
})
export class AuditLogsComponent implements OnInit {
  private readonly _auditLogs = signal<ReadonlyArray<AuditLog>>([
    {
      user: 'Sarah Wilson',
      email: 'sarah@example.com',
      timestamp: '2023-01-19 14:53:45',
      ipAddress: '154.214.144.116',
      status: 'Successful',
    },
    {
      user: 'John Smith',
      email: 'john@example.com',
      timestamp: '2023-02-04 07:19:50',
      ipAddress: '95.126.204.226',
      status: 'Failed',
    },
    {
      user: 'John Smith',
      email: 'john@example.com',
      timestamp: '2023-03-14 06:39:01',
      ipAddress: '226.6.172.110',
      status: 'Failed',
    },
    {
      user: 'John Smith',
      email: 'john@example.com',
      timestamp: '2023-03-12 17:04:38',
      ipAddress: '226.253.139.27',
      status: 'Failed',
    },
    {
      user: 'John Smith',
      email: 'john@example.com',
      timestamp: '2023-02-09 05:08:07',
      ipAddress: '37.26.77.113',
      status: 'Failed',
    },
    {
      user: 'John Smith',
      email: 'john@example.com',
      timestamp: '2023-03-10 16:57:49',
      ipAddress: '254.250.241.113',
      status: 'Successful',
    },
    {
      user: 'Sarah Wilson',
      email: 'sarah@example.com',
      timestamp: '2023-02-15 09:42:03',
      ipAddress: '4.151.89.136',
      status: 'Successful',
    },
    {
      user: 'John Smith',
      email: 'john@example.com',
      timestamp: '2023-01-10 17:53:51',
      ipAddress: '25.40.31.161',
      status: 'Failed',
    },
  ]);

  protected readonly auditLogs = this._auditLogs.asReadonly();

  protected readonly columns: ReadonlyArray<TableColumn<AuditLog>> = [
    {
      key: 'user',
      header: 'User',
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
    },
    {
      key: 'status',
      header: 'Status',
      getValue: (item: AuditLog) =>
        item.status === 'Successful' ? 'Active' : 'Inactive',
    },
  ];

  protected readonly filters: ReadonlyArray<TableFilter> = [
    {
      key: 'status',
      placeholder: 'Status',
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Successful', value: 'successful' },
        { label: 'Failed', value: 'failed' },
      ] as ReadonlyArray<FilterOption>,
    },
  ];

  constructor(private readonly _layoutService: LayoutService) {}

  ngOnInit(): void {
    this._layoutService.pageTitle.set('Audit Logs');
    this._layoutService.logoSrc.set('icons/audit.png');
    this._layoutService.logoAlt.set('Audit Logs Icon');
  }
}
