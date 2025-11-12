import { Component, signal, OnInit } from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';
import {
  DataTableComponent,
  TableColumn,
  TableFilter,
} from '../../../../shared/admin-ui/data-table/data-table.component';
import { AUDIT_LOG_STATUS_FILTERS, AuditLog } from '../../../../core/models/users/audit-logs.model';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './audit-logs-page.component.html',
  styleUrls: ['./audit-logs-page.component.scss'],
})
export class AuditLogsComponent implements OnInit {
  // Private signals for internal state management
  private readonly _auditLogs = signal<ReadonlyArray<AuditLog>>([
    {
      user: 'Sarah Wilson',
      fullName: 'Sarah Wilson',
      email: 'sarah@example.com',
      timestamp: '2023-01-19 14:53:45',
      ipAddress: '154.214.144.116',
      status: 'Successful',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      user: 'John Smith',
      fullName: 'John Smith',
      email: 'john@example.com',
      timestamp: '2023-02-04 07:19:50',
      ipAddress: '95.126.204.226',
      status: 'Failed',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      user: 'John Smith',
      fullName: 'John Smith',
      email: 'john@example.com',
      timestamp: '2023-03-14 06:39:01',
      ipAddress: '226.6.172.110',
      status: 'Failed',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      user: 'John Smith',
      fullName: 'John Smith',
      email: 'john@example.com',
      timestamp: '2023-03-12 17:04:38',
      ipAddress: '226.253.139.27',
      status: 'Failed',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      user: 'John Smith',
      fullName: 'John Smith',
      email: 'john@example.com',
      timestamp: '2023-02-09 05:08:07',
      ipAddress: '37.26.77.113',
      status: 'Failed',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      user: 'John Smith',
      fullName: 'John Smith',
      email: 'john@example.com',
      timestamp: '2023-03-10 16:57:49',
      ipAddress: '254.250.241.113',
      status: 'Successful',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      user: 'Sarah Wilson',
      fullName: 'Sarah Wilson',
      email: 'sarah@example.com',
      timestamp: '2023-02-15 09:42:03',
      ipAddress: '4.151.89.136',
      status: 'Successful',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      user: 'John Smith',
      fullName: 'John Smith',
      email: 'john@example.com',
      timestamp: '2023-01-10 17:53:51',
      ipAddress: '25.40.31.161',
      status: 'Failed',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      user: 'Sarah Wilson',
      fullName: 'Sarah Wilson',
      email: 'sarah@example.com',
      timestamp: '2023-02-22 19:07:40',
      ipAddress: '196.69.80.124',
      status: 'Successful',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      user: 'John Smith',
      fullName: 'John Smith',
      email: 'john@example.com',
      timestamp: '2023-02-25 18:25:02',
      ipAddress: '206.96.186.211',
      status: 'Failed',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  ]);

  // Simulate loading state (set to false to see actual data)
  private readonly _isLoading = signal<boolean>(false);

  // Protected readonly for template access
  protected readonly auditLogs = this._auditLogs.asReadonly();
  protected readonly isLoading = this._isLoading.asReadonly();

  // Protected readonly configuration - accessible in template
  protected readonly columns: ReadonlyArray<TableColumn<AuditLog>> = [
    {
      key: 'fullName',
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
    },
  ];

  protected readonly filters: ReadonlyArray<TableFilter> = [
    {
      key: 'status',
      placeholder: 'Status',
      options: AUDIT_LOG_STATUS_FILTERS,
    },
  ];

  constructor(private readonly _layoutService: LayoutService) {}

  public ngOnInit(): void {
    this._layoutService.pageTitle.set('Audit Logs');
    this._layoutService.logoSrc.set('icons/audit.png');
    this._layoutService.logoAlt.set('Audit Logs Icon');
  }
}
