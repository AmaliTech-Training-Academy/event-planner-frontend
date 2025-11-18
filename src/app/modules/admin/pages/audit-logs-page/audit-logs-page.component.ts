import {
  Component,
  signal,
  computed,
  OnInit,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutService } from '../../../../core/services/layout.service';
import { AuditManagementService } from '../../../../core/services/audit-management.service';
import {
  DataTableComponent,
  TableColumn,
  TableFilter,
  TableAction,
} from '../../../../shared/admin-ui/data-table/data-table.component';
import {
  AuditLogTableData,
  mapAuditLogToTableData,
} from '@app/core/models/users/audit-logs.model';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './audit-logs-page.component.html',
  styleUrls: ['./audit-logs-page.component.scss'],
})
export class AuditLogsComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);
  private readonly _auditManagementService = inject(AuditManagementService);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _auditLogsData = signal<any>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  private readonly _currentPage = signal<number>(0);
  private readonly _pageSize = signal<number>(10);
  private readonly _emailFilter = signal<string>('');
  private readonly _startDate = signal<string>('');
  private readonly _endDate = signal<string>('');

  protected readonly auditLogs = computed<AuditLogTableData[]>(() => {
    const data = this._auditLogsData();

    if (!data || !data.auditListResponse) {
      return [];
    }

    const mappedLogs = data.auditListResponse.map(mapAuditLogToTableData);

    return mappedLogs;
  });

  protected readonly isLoading = computed(() => {
    const loading = this._isLoading();
    return loading;
  });

  protected readonly error = computed(() => this._error());

  protected readonly totalPages = computed(() => {
    const data = this._auditLogsData();
    if (!data) return 0;
    const pages = Math.ceil(
      (data.auditListResponse?.length || 0) / this._pageSize()
    );
    return pages;
  });

  protected readonly totalElements = computed(() => {
    const data = this._auditLogsData();
    const total = data?.auditListResponse?.length || 0;
    return total;
  });

  protected readonly columns: TableColumn<AuditLogTableData>[] = [
    { key: 'email', header: 'User Email', sortable: true },
    { key: 'formattedTimestamp', header: 'Timestamp', sortable: true },
    { key: 'ipAddress', header: 'IP Address', sortable: false },
    { key: 'action', header: 'Action', sortable: false },
  ];

  protected readonly filters: TableFilter[] = [
    {
      key: 'email',
      placeholder: 'Filter by Email',
      options: [],
    },
    {
      key: 'status',
      placeholder: 'Filter by Status',
      options: [
        { label: 'All', value: '' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Pending', value: 'pending' },
      ],
    },
    {
      key: 'export',
      placeholder: 'Export As',
      options: [
        { label: 'Export As', value: '' },
        { label: 'CSV', value: 'csv' },
        { label: 'JSON', value: 'json' },
        { label: 'PDF', value: 'pdf' },
      ],
    },
  ];
  private readonly _statusFilter = signal<string>('');

  protected readonly actions: TableAction<AuditLogTableData>[] = [
    {
      icon: 'icons/eye-open.svg',
      label: 'View Details',
      extraClass: 'plain-action',
      handler: (log: AuditLogTableData) => this._onViewLog(log),
    },
  ];

  constructor() {
    this._auditManagementService.loading$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((loading) => {
        this._isLoading.set(loading);
      });

    this._auditManagementService.auditLogsData$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this._auditLogsData.set(data);

        if (data) {
        }
      });
  }

  public ngOnInit(): void {
    this._layoutService.pageTitle.set('Audit Logs');
    this._layoutService.logoSrc.set('icons/audit.png');
    this._layoutService.logoAlt.set('Audit Logs');

    this._loadAuditLogs();
  }

  protected onPageChange(page: number): void {
    this._currentPage.set(page);
    this._loadAuditLogs();
  }

  protected onFilterChange(filters: Record<string, string>): void {
    if (filters['export'] && filters['export'] !== '') {
      this._handleExport(filters['export']);
      return;
    }

    if ('email' in filters) {
      this._emailFilter.set(filters['email']);
    }

    if ('status' in filters) {
      this._statusFilter.set(filters['status']);
    }

    this._currentPage.set(0);
    this._loadAuditLogs();
  }

  protected onSearch(query: string): void {
    this._emailFilter.set(query);
    this._currentPage.set(0);
    this._loadAuditLogs();
  }

  private _loadAuditLogs(): void {
    this._error.set(null);

    const page = this._currentPage();
    const size = this._pageSize();
    const email = this._emailFilter().trim() || undefined;
    const startDate = this._startDate() || undefined;
    const endDate = this._endDate() || undefined;

    this._auditManagementService
      .loadAuditLogs(page, size, email, startDate, endDate)
      .subscribe({
        next: (data) => {},
        error: (err) => {
          this._error.set('Failed to load audit logs');
        },
      });
  }

  private _onViewLog(log: AuditLogTableData): void {}

  private _handleExport(format: string): void {
    if (!format) return;

    const data = this.auditLogs();

    switch (format) {
      case 'csv':
        this._exportAsCSV(data);
        break;
      case 'json':
        this._exportAsJSON(data);
        break;
      case 'pdf':
        this._exportAsPDF(data);
        break;
    }
  }

  private _exportAsCSV(data: AuditLogTableData[]): void {
    const headers = ['ID', 'Email', 'IP Address', 'Timestamp', 'Action'];
    const csvContent = [
      headers.join(','),
      ...data.map((log) =>
        [
          log.id,
          `"${log.email}"`,
          log.ipAddress,
          `"${log.formattedTimestamp}"`,
          log.action,
        ].join(',')
      ),
    ].join('\n');

    this._downloadFile(csvContent, 'audit-logs.csv', 'text/csv');
  }

  private _exportAsJSON(data: AuditLogTableData[]): void {
    const jsonContent = JSON.stringify(data, null, 2);
    this._downloadFile(jsonContent, 'audit-logs.json', 'application/json');
  }

  private _exportAsPDF(data: AuditLogTableData[]): void {
    alert('PDF export feature coming soon!');
  }

  private _downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  public refreshData(): void {
    this._loadAuditLogs();
  }
}
