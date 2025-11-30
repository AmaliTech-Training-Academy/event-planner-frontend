import {
  Component,
  signal,
  computed,
  OnInit,
  inject,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { LayoutService } from '../../../../core/services/layout.service';
import { AuditManagementService } from '../../../../core/services/audit-management.service';
import {
  DataTableComponent,
  TableColumn,
  TableFilter,
} from '../../../../shared/admin-ui/data-table/data-table.component';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(50, [
              animate(
                '400ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
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
  private readonly _fullNameFilter = signal<string>('');
  private readonly _statusFilter = signal<string>('');
  private readonly _sortBy = signal<string>('createdAt');
  private readonly _direction = signal<string>('DESC');

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
        { label: 'Successful', value: 'success' },
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
      const statusValue =
        filter.value === 'all' ||
        !filter.value ||
        filter.value.trim().length === 0
          ? ''
          : filter.value.trim();
      this._statusFilter.set(statusValue);
      this._currentPage.set(0);
      this._loadAuditLogs();
    }
  }

  protected onSearch(query: string): void {
    this._fullNameFilter.set(query);
    this._currentPage.set(0);
    this._loadAuditLogs();
  }

  protected trackByLogId(index: number, item: AuditLogTableData): string {
    return item.id || `${item.fullName}-${item.formattedTimestamp}-${index}`;
  }

  private _loadAuditLogs(): void {
    this._error.set(null);

    const page = this._currentPage();
    const size = this._pageSize();
    const fullName = this._fullNameFilter().trim() || undefined;
    const statusValue = this._statusFilter().trim();
    const status =
      statusValue && statusValue.length > 0 ? statusValue : undefined;
    const sortBy = this._sortBy();
    const direction = this._direction();

    this._auditManagementService
      .loadAuditLogs(page, size, fullName, status, sortBy, direction)
      .subscribe({
        error: (err) => {
          this._error.set('Failed to load audit logs');
        },
      });
  }

  public refreshData(): void {
    this._loadAuditLogs();
  }
}
