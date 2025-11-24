import { Component, OnInit, OnDestroy, inject, signal, computed, Signal } from '@angular/core';
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

  protected readonly activeTab = signal<TransactionFilter>('Total');
  protected readonly isLoading = signal<boolean>(false);
  private readonly _transactionsSignal = toSignal(
    this._transactionsService.transactions$,
    { initialValue: [] as TransactionManagement[] }
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

  private readonly _completedChartData: readonly LineSeriesConfig[] = [
    {
      name: 'This Year',
      data: [
        { month: 'Jan', value: 10200 },
        { month: 'Feb', value: 6800 },
        { month: 'Mar', value: 13200 },
        { month: 'Apr', value: 21500 },
        { month: 'May', value: 24800 },
        { month: 'Jun', value: 18500 },
        { month: 'Jul', value: 21200 },
      ],
      color: '#10B981',
      showArea: true,
      lineStyle: 'solid',
      areaGradient: {
        start: 'rgba(16, 185, 129, 0.2)',
        end: 'rgba(16, 185, 129, 0.05)',
      },
    },
    {
      name: 'Last 30 Days',
      data: [
        { month: 'Jan', value: 4800 },
        { month: 'Feb', value: 11500 },
        { month: 'Mar', value: 10200 },
        { month: 'Apr', value: 18200 },
        { month: 'May', value: 5500 },
        { month: 'Jun', value: 10200 },
        { month: 'Jul', value: 25800 },
      ],
      color: '#6B7280',
      showArea: false,
      lineStyle: 'dashed',
    },
  ] as const;

  private readonly _pendingChartData: readonly LineSeriesConfig[] = [
    {
      name: 'This Year',
      data: [
        { month: 'Jan', value: 1800 },
        { month: 'Feb', value: 1200 },
        { month: 'Mar', value: 2100 },
        { month: 'Apr', value: 2800 },
        { month: 'May', value: 3200 },
        { month: 'Jun', value: 2100 },
        { month: 'Jul', value: 2500 },
      ],
      color: '#F59E0B',
      showArea: true,
      lineStyle: 'solid',
      areaGradient: {
        start: 'rgba(245, 158, 11, 0.2)',
        end: 'rgba(245, 158, 11, 0.05)',
      },
    },
    {
      name: 'Last 30 Days',
      data: [
        { month: 'Jan', value: 800 },
        { month: 'Feb', value: 2200 },
        { month: 'Mar', value: 2100 },
        { month: 'Apr', value: 2500 },
        { month: 'May', value: 1000 },
        { month: 'Jun', value: 1500 },
        { month: 'Jul', value: 3200 },
      ],
      color: '#6B7280',
      showArea: false,
      lineStyle: 'dashed',
    },
  ] as const;

  private readonly _failedChartData: readonly LineSeriesConfig[] = [
    {
      name: 'This Year',
      data: [
        { month: 'Jan', value: 350 },
        { month: 'Feb', value: 150 },
        { month: 'Mar', value: 380 },
        { month: 'Apr', value: 680 },
        { month: 'May', value: 720 },
        { month: 'Jun', value: 450 },
        { month: 'Jul', value: 580 },
      ],
      color: '#EF4444',
      showArea: true,
      lineStyle: 'solid',
      areaGradient: {
        start: 'rgba(239, 68, 68, 0.2)',
        end: 'rgba(239, 68, 68, 0.05)',
      },
    },
    {
      name: 'Last 30 Days',
      data: [
        { month: 'Jan', value: 150 },
        { month: 'Feb', value: 380 },
        { month: 'Mar', value: 350 },
        { month: 'Apr', value: 620 },
        { month: 'May', value: 220 },
        { month: 'Jun', value: 380 },
        { month: 'Jul', value: 580 },
      ],
      color: '#6B7280',
      showArea: false,
      lineStyle: 'dashed',
    },
  ] as const;

  private readonly _refundChartData: readonly LineSeriesConfig[] = [
    {
      name: 'This Year',
      data: [
        { month: 'Jan', value: 150 },
        { month: 'Feb', value: 50 },
        { month: 'Mar', value: 120 },
        { month: 'Apr', value: 220 },
        { month: 'May', value: 180 },
        { month: 'Jun', value: 150 },
        { month: 'Jul', value: 220 },
      ],
      color: '#8B5CF6',
      showArea: true,
      lineStyle: 'solid',
      areaGradient: {
        start: 'rgba(139, 92, 246, 0.2)',
        end: 'rgba(139, 92, 246, 0.05)',
      },
    },
    {
      name: 'Last 30 Days',
      data: [
        { month: 'Jan', value: 50 },
        { month: 'Feb', value: 120 },
        { month: 'Mar', value: 150 },
        { month: 'Apr', value: 180 },
        { month: 'May', value: 80 },
        { month: 'Jun', value: 120 },
        { month: 'Jul', value: 220 },
      ],
      color: '#6B7280',
      showArea: false,
      lineStyle: 'dashed',
    },
  ] as const;

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

  protected readonly tableColumns: readonly TableColumn<TransactionDisplay>[] = [
    { key: 'transactionId', header: 'Transaction ID', sortable: true },
    { key: 'formattedDate', header: 'Date', sortable: true },
    { key: 'truncatedEventName', header: 'Event Name', sortable: true },
    { key: 'eventOrganizer', header: 'Organizer', filterable: true },
    { key: 'truncatedEmail', header: 'Attendee', filterable: true },
    { key: 'formattedAmount', header: 'Amount', sortable: true },
    { key: 'displayPaymentMethod', header: 'Payment Method', filterable: true },
    { key: 'status', header: 'Status', filterable: true },
  ];

  protected readonly tableActions: readonly TableAction<TransactionManagement>[] = [];

  protected readonly tableFilters: readonly TableFilter[] = [
    {
      key: 'status',
      placeholder: 'All Status',
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Failed', value: 'FAILED' },
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

  protected onStatusFilterChange(status: string): void {
    if (status === 'all') {
      this._loadTransactions();
    } else {
      this._transactionsService.filterByStatus(status);
    }
  }

  private _loadTransactions(): void {
    this._transactionsService.loadTransactions().subscribe();
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
  }

  private _downloadReceipt(transaction: TransactionManagement): void {
  }
}