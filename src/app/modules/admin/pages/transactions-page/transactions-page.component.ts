import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from '../../../../core/services/layout.service';
import { TransactionsManagementService } from '../../../../core/services/transactions-management.service';
import { TransactionManagement } from '../../../../core/models/transactions-management.model';
import {
  DataTableComponent,
  EmptyState,
  TableAction,
  TableColumn,
  TableFilter,
} from '../../../../shared/admin-ui/data-table/data-table.component';
import {
  LineChartComponent,
  LineSeriesConfig,
} from '../../pages/dashboard-page/components/line-chart/line-chart.component';
import { APP_ROUTES } from '@app/core/constants/app-routes.constants';

type TransactionFilter =
  | 'Total'
  | 'Completed'
  | 'Pending'
  | 'Failed'
  | 'Refund';

interface ChartTab {
  readonly key: TransactionFilter;
  readonly label: string;
}

interface TransactionDisplay extends TransactionManagement {
  readonly formattedDate: string;
  readonly formattedAmount: string;
  readonly displayPaymentMethod: string;
  readonly truncatedEmail: string;
  readonly truncatedEventName: string;
  readonly truncatedTransactionId: string;
}

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [CommonModule, DataTableComponent, LineChartComponent],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.scss',
})
export class TransactionsPageComponent implements OnInit, OnDestroy {
  private readonly _layoutService = inject(LayoutService);
  private readonly _transactionsService = inject(TransactionsManagementService);
  private readonly _router = inject(Router);
  private readonly _destroy$ = new Subject<void>();

  // ✅ REMOVED: _pageSize signal - backend has fixed page size of 10
  private readonly _currentPage = signal<number>(0);
  private readonly _statusFilter = signal<string>('all');
  private readonly _searchKeyword = signal<string>('');

  protected readonly activeTab = signal<TransactionFilter>('Total');
  protected readonly isLoading = signal<boolean>(false);

  private readonly _transactionsSignal = toSignal(
    this._transactionsService.transactions$,
    { initialValue: [] as TransactionManagement[] },
  );

  protected readonly totalElements = toSignal(
    this._transactionsService.totalElements$,
    { initialValue: 0 },
  );

  protected readonly totalPages = toSignal(
    this._transactionsService.totalPages$,
    { initialValue: 0 },
  );

  protected readonly transactions = computed<TransactionDisplay[]>(() => {
    const apiTransactions = this._transactionsSignal();
    return apiTransactions.map((transaction) => ({
      ...transaction,
      formattedDate: this._formatDate(transaction.transactionTime),
      formattedAmount: this._formatAmount(transaction.amount),
      displayPaymentMethod: transaction.paymentMethod || '-',
      truncatedEmail: this._truncateText(transaction.attendeeEmail, 8),
      truncatedEventName: transaction.eventName,
      truncatedTransactionId: this._truncateText(transaction.transactionId, 5),
    }));
  });

  protected readonly APP_ROUTES: typeof APP_ROUTES = APP_ROUTES;

  protected readonly chartTabs: readonly ChartTab[] = [
    { key: 'Total', label: 'Total' },
    { key: 'Completed', label: 'Completed' },
    { key: 'Pending', label: 'Pending' },
    { key: 'Failed', label: 'Failed' },
    { key: 'Refund', label: 'Refund' },
  ] as const;

  protected readonly transactionsEmptyState: EmptyState = {
    imageSrc: 'images/no-transactions.png',
    imageAlt: 'No transactions found',
    message:
      'No transactions found. When events with payments are created, they will appear here.',
  };

  // Chart data configurations
  private readonly _allTransactionsChartData: readonly LineSeriesConfig[] = [
    {
      name: 'This Year',
      data: [
        { month: 'Jan', value: 12500 },
        { month: 'Feb', value: 8200 },
        { month: 'Mar', value: 15800 },
        { month: 'Apr', value: 25200 },
        { month: 'May', value: 28900 },
        { month: 'Jun', value: 21200 },
        { month: 'Jul', value: 24500 },
      ],
      color: '#FF6B35',
      showArea: true,
      lineStyle: 'solid',
      areaGradient: {
        start: 'rgba(255, 107, 53, 0.2)',
        end: 'rgba(255, 107, 53, 0.05)',
      },
    },
    {
      name: 'Last 30 Days',
      data: [
        { month: 'Jan', value: 5800 },
        { month: 'Feb', value: 14200 },
        { month: 'Mar', value: 12800 },
        { month: 'Apr', value: 21500 },
        { month: 'May', value: 6800 },
        { month: 'Jun', value: 12200 },
        { month: 'Jul', value: 29800 },
      ],
      color: '#6B7280',
      showArea: false,
      lineStyle: 'dashed',
    },
  ] as const;

  private readonly _completedChartData: readonly LineSeriesConfig[] =
    [] as const;
  private readonly _pendingChartData: readonly LineSeriesConfig[] = [] as const;
  private readonly _failedChartData: readonly LineSeriesConfig[] = [] as const;
  private readonly _refundChartData: readonly LineSeriesConfig[] = [] as const;

  protected readonly chartSeriesConfig: Signal<readonly LineSeriesConfig[]> =
    computed(() => {
      const chartDataMap: Record<
        TransactionFilter,
        readonly LineSeriesConfig[]
      > = {
        Total: this._allTransactionsChartData,
        Completed: this._completedChartData,
        Pending: this._pendingChartData,
        Failed: this._failedChartData,
        Refund: this._refundChartData,
      };

      return chartDataMap[this.activeTab()];
    });

  protected readonly tableColumns: readonly TableColumn<TransactionDisplay>[] =
    [
      { key: 'transactionId', header: 'Transaction ID', sortable: true },
      { key: 'formattedDate', header: 'Date', sortable: true },
      { key: 'truncatedEventName', header: 'Event Name', sortable: true },
      { key: 'eventOrganizer', header: 'Organizer', filterable: true },
      { key: 'truncatedEmail', header: 'Attendee', filterable: true },
      { key: 'formattedAmount', header: 'Amount', sortable: true },
      {
        key: 'displayPaymentMethod',
        header: 'Payment Method',
        filterable: true,
      },
      { key: 'status', header: 'Status', filterable: true },
    ];

  protected readonly tableActions: readonly TableAction<TransactionManagement>[] =
    [];

  protected readonly tableFilters: readonly TableFilter[] = [
    {
      key: 'status',
      placeholder: 'All Status',
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Success', value: 'SUCCESS' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Failed', value: 'FAILED' },
        { label: 'Cancelled', value: 'CANCELLED' },
      ],
    },
  ];

  public ngOnInit(): void {
    this._layoutService.pageTitle.set('Transaction History');
    this._layoutService.logoSrc.set('icons/transaction-icon.png');
    this._layoutService.logoAlt.set('Transaction History');

    this._transactionsService.loading$
      .pipe(takeUntil(this._destroy$))
      .subscribe((loading) => {
        this.isLoading.set(loading);
      });

    this._loadTransactions();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  protected onTabChange(tab: TransactionFilter): void {
    this.activeTab.set(tab);
  }

  // ✅ UPDATED: Search handler - called by DataTable after debounce
  protected onSearch(searchTerm: string): void {
    console.log('🔍 COMPONENT onSearch received:', searchTerm);

    // Use the service's searchTransactions method which handles everything
    this._transactionsService.searchTransactions(searchTerm);
  }

  // ✅ UPDATED: Single filter handler
  protected onFilterChange(filterEvent: { key: string; value: string }): void {
    console.log('🏷️ COMPONENT onFilterChange:', filterEvent);

    if (filterEvent.key === 'status') {
      this._statusFilter.set(filterEvent.value);
      this._currentPage.set(0); // Reset to first page on filter change
      this._loadTransactions();
    }
  }

  // ✅ UPDATED: Simplified load method - only sends what backend accepts
  private _loadTransactions(): void {
    const page = this._currentPage();
    const status =
      this._statusFilter() !== 'all' ? this._statusFilter() : undefined;
    const keyword = this._searchKeyword().trim() || undefined;

    console.log('🔄 Loading transactions:', { page, status, keyword });

    this._transactionsService
      .loadTransactions({
        page,
        status,
        keyword,
        // ✅ Removed size and sort - backend handles these internally
      })
      .subscribe({
        next: () => {
          console.log('✅ Transactions loaded for page:', page);
        },
        error: (err) => {
          console.error('❌ Failed to load transactions:', err);
        },
      });
  }

  // ✅ UPDATED: Page change handler converts 1-based to 0-based
  protected onPageChange(page: number): void {
    console.log('📄 Page change:', {
      page1Based: page,
      page0Based: page - 1,
    });
    this._currentPage.set(page - 1);
    this._loadTransactions();
  }

  private _formatDate(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private _formatAmount(amount: number | null): string {
    if (amount === null || amount === 0) {
      return 'Free';
    }
    return `$${amount.toFixed(2)}`;
  }

  private _truncateText(text: string, maxLength: number): string {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  private _viewTransaction(transaction: TransactionManagement): void {
    // TODO: Implement view transaction details
  }

  private _downloadReceipt(transaction: TransactionManagement): void {
    // TODO: Implement download receipt
  }
}
