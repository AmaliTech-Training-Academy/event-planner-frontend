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
} from '../../../shared/admin-ui/data-table/data-table.component';
import {
  AuditLogTableData,
  mapAuditLogToTableData,
} from '@app/core/models/audits/audit-logs.model';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './audit-logs-page.component.html',
  styleUrls: ['./audit-logs-page.component.scss'],
})
export class AuditLogsComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);
  private readonly _auditManagementService: AuditManagementService = inject(AuditManagementService);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _auditLogsData = signal<any>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  private readonly _currentPage = signal<number>(0);
  private readonly _pageSize = signal<number>(10);
  private readonly _emailFilter = signal<string>('');
  private readonly _statusFilter = signal<string>('');
  private readonly _startDate = signal<string>('');
  private readonly _endDate = signal<string>('');

  protected readonly auditLogs = computed<AuditLogTableData[]>(() => {
    const data = this._auditLogsData();
    if (!data || !data.data) {
      return [];
    }
    return data.data.map(mapAuditLogToTableData);
  });

  protected readonly isLoading = computed(() => this._isLoading());
  protected readonly error = computed(() => this._error());

  protected readonly totalPages = computed(() => {
    const data = this._auditLogsData();
    return data?.totalPages || 0;
  });

  protected readonly totalElements = computed(() => {
    const data = this._auditLogsData();
    return data?.totalElements || 0;
  });

  protected readonly currentPageNumber = computed(
    () => this._currentPage() + 1
  );
  protected readonly itemsPerPageValue = computed(() => this._pageSize());

  protected readonly columns: TableColumn<AuditLogTableData>[] = [
    { key: 'fullName', header: 'User', sortable: true },
    { key: 'formattedTimestamp', header: 'Timestamp', sortable: true },
    { key: 'ipAddress', header: 'IP Address', sortable: false },
    { key: 'status', header: 'Status', sortable: true },
  ];

  protected readonly filters: TableFilter[] = [
    {
      key: 'status',
      placeholder: 'Status',
      options: [
        { label: 'All Statuses', value: '' },
        { label: 'Successful', value: 'successful' },
        { label: 'Failed', value: 'failed' },
      ],
    },
  ];

  protected readonly actions = [];

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
      });
  }

  public ngOnInit(): void {
    this._layoutService.pageTitle.set('Audit Logs');
    this._layoutService.logoSrc.set('icons/audit.png');
    this._layoutService.logoAlt.set('Audit Logs');
    this._loadAuditLogs();
  }

  protected onPageChange(page: number): void {
    this._currentPage.set(page - 1);
    this._loadAuditLogs();
  }

  protected onFilterChange(filter: { key: string; value: string }): void {
    if (filter.key === 'status') {
      this._statusFilter.set(filter.value);
      this._currentPage.set(0);
      this._loadAuditLogs();
    }
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
    const status = this._statusFilter() || undefined;

    this._auditManagementService
      .loadAuditLogs(page, size, email, startDate, endDate, status)
      .subscribe({
        error: (err: any) => {
          this._error.set('Failed to load audit logs');
        },
      });
  }

  public refreshData(): void {
    this._loadAuditLogs();
  }
}
