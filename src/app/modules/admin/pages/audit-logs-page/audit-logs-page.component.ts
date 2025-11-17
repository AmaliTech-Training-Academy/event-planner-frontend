// features/admin/pages/audit-logs-page/audit-logs-page.component.ts
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
import { AuditLogTableData, mapAuditLogToTableData } from '../../../../core/models/users/audit-logs.model';

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

  // State signals
  private readonly _auditLogsData = signal<any>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Pagination and filter state
  private readonly _currentPage = signal<number>(0);
  private readonly _pageSize = signal<number>(10);
  private readonly _emailFilter = signal<string>('');
  private readonly _startDate = signal<string>('');
  private readonly _endDate = signal<string>('');

  // Computed properties for template
  protected readonly auditLogs = computed<AuditLogTableData[]>(() => {
    console.log('🔄 Computing auditLogs...');
    const data = this._auditLogsData();

    console.log('📦 Raw audit logs data:', data);

    if (!data || !data.auditListResponse) {
      console.log('⚠️ No audit logs data available');
      return [];
    }

    const mappedLogs = data.auditListResponse.map(mapAuditLogToTableData);
    console.log('✅ Mapped audit logs:', mappedLogs);
    console.log('📊 Total audit logs count:', mappedLogs.length);

    return mappedLogs;
  });

  protected readonly isLoading = computed(() => {
    const loading = this._isLoading();
    console.log('⏳ Loading state:', loading);
    return loading;
  });

  protected readonly error = computed(() => this._error());

  protected readonly totalPages = computed(() => {
    const data = this._auditLogsData();
    if (!data) return 0;
    const pages = Math.ceil(
      (data.auditListResponse?.length || 0) / this._pageSize()
    );
    console.log('📄 Total pages:', pages);
    return pages;
  });

  protected readonly totalElements = computed(() => {
    const data = this._auditLogsData();
    const total = data?.auditListResponse?.length || 0;
    console.log('🔢 Total elements:', total);
    return total;
  });

  // Table configuration
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

  protected readonly actions: TableAction<AuditLogTableData>[] = [
    {
      icon: 'icons/eye-open.svg',
      label: 'View Details',
      extraClass: 'plain-action',
      handler: (log: AuditLogTableData) => this._onViewLog(log),
    },
  ];

  constructor() {
    console.log('🏗️ AuditLogsComponent constructor called');

    // Subscribe to service observables
    this._auditManagementService.loading$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((loading) => {
        console.log('🔄 Loading state changed:', loading);
        this._isLoading.set(loading);
      });

    this._auditManagementService.auditLogsData$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        console.log('📨 Received audit logs data from service:', data);
        this._auditLogsData.set(data);

        if (data) {
          console.log('✅ Audit logs data set successfully');
          console.log('  - Page Number:', data.pageNumber);
          console.log('  - Page Size:', data.pageSize);
          console.log('  - Logs Count:', data.auditListResponse?.length || 0);
        }
      });
  }

  public ngOnInit(): void {
    console.log('🚀 AuditLogsComponent ngOnInit called');

    this._layoutService.pageTitle.set('Audit Logs');
    this._layoutService.logoSrc.set('icons/audit.png');
    this._layoutService.logoAlt.set('Audit Logs');

    console.log('📋 Table columns configured:', this.columns);
    console.log('🔧 Table filters configured:', this.filters);

    this._loadAuditLogs();
  }

  // Handle page changes
  protected onPageChange(page: number): void {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📄 PAGE CHANGE EVENT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('New page:', page);
    console.log('Previous page:', this._currentPage());
    this._currentPage.set(page);
    this._loadAuditLogs();
  }

  // Handle filter changes
  protected onFilterChange(filters: Record<string, string>): void {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 FILTER CHANGE EVENT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Filters received:', filters);

    // Handle export separately
    if (filters['export'] && filters['export'] !== '') {
      console.log('📥 Export action triggered:', filters['export']);
      this._handleExport(filters['export']);
      return;
    }

    // Handle email filter
    if (filters['email'] !== undefined) {
      console.log('📧 Email filter changed to:', filters['email']);
      this._emailFilter.set(filters['email']);
    }

    // Reset to first page when filters change
    console.log('🔄 Resetting to first page');
    this._currentPage.set(0);
    this._loadAuditLogs();
  }

  // Handle search
  protected onSearch(query: string): void {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔎 SEARCH EVENT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Search query:', query);
    this._emailFilter.set(query);
    this._currentPage.set(0);
    this._loadAuditLogs();
  }

  // Load audit logs from service
  private _loadAuditLogs(): void {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 LOADING AUDIT LOGS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    this._error.set(null);

    const page = this._currentPage();
    const size = this._pageSize();
    const email = this._emailFilter().trim() || undefined;
    const startDate = this._startDate() || undefined;
    const endDate = this._endDate() || undefined;

    console.log('📋 Request parameters:');
    console.log('  - Page:', page);
    console.log('  - Size:', size);
    console.log('  - Email filter:', email || '(none)');
    console.log('  - Start date:', startDate || '(none)');
    console.log('  - End date:', endDate || '(none)');

    this._auditManagementService
      .loadAuditLogs(page, size, email, startDate, endDate)
      .subscribe({
        next: (data) => {
          console.log('');
          console.log('✅ AUDIT LOGS LOADED SUCCESSFULLY');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('Response data:', data);
          console.log('  - Page Number:', data.pageNumber);
          console.log('  - Page Size:', data.pageSize);
          console.log('  - Total Logs:', data.auditListResponse.length);
          console.log('  - First log:', data.auditListResponse[0]);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        },
        error: (err) => {
          console.log('');
          console.log('❌ AUDIT LOGS LOADING ERROR');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('Error details:', err);
          console.log('Error message:', err.message);
          console.log('Error status:', err.status);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          this._error.set('Failed to load audit logs');
        },
      });
  }

  // View log details
  private _onViewLog(log: AuditLogTableData): void {
    console.log('👁️ View log details:', log);
    // Navigate to detail view or show modal
  }

  // Export functionality
  private _handleExport(format: string): void {
    if (!format) return;

    const data = this.auditLogs();
    console.log(`📥 Exporting ${data.length} audit logs as ${format}`);

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
    console.log('✅ CSV export completed');
  }

  private _exportAsJSON(data: AuditLogTableData[]): void {
    const jsonContent = JSON.stringify(data, null, 2);
    this._downloadFile(jsonContent, 'audit-logs.json', 'application/json');
    console.log('✅ JSON export completed');
  }

  private _exportAsPDF(data: AuditLogTableData[]): void {
    console.log('⚠️ PDF export not implemented yet', data);
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
    console.log(`📥 File downloaded: ${filename}`);
  }

  // Public method to refresh data
  public refreshData(): void {
    console.log('🔄 Manual refresh triggered');
    this._loadAuditLogs();
  }
}
