import { Component, OnInit, inject, signal, computed, Signal } from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';
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

interface Transaction {
  transactionId: string;
  date: string;
  eventName: string;
  organizer: string;
  email: string;
  type: 'Completed' | 'Pending' | 'Failed' | 'Refund';
  amount: number;
  paymentMethod: string;
  status: 'Completed' | 'Refunded' | 'Pending' | 'Failed';
}

type TransactionFilter = 'Total' | 'Completed' | 'Pending' | 'Failed' | 'Refund';

interface ChartTab {
  readonly key: TransactionFilter;
  readonly label: string;
}

interface PrimaryAction {
  readonly label: string;
  readonly handler: () => void;
}

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [DataTableComponent, LineChartComponent],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.scss',
})
export class TransactionsPageComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);

  protected readonly activeTab = signal<TransactionFilter>('Total');

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
    message: 'No transactions found. When events with payments are created, they will appear here.',
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

  protected readonly chartSeriesConfig: Signal<readonly LineSeriesConfig[]> = computed(() => {
    const chartDataMap: Record<TransactionFilter, readonly LineSeriesConfig[]> = {
      Total: this._allTransactionsChartData,
      Completed: this._completedChartData,
      Pending: this._pendingChartData,
      Failed: this._failedChartData,
      Refund: this._refundChartData,
    };
    
    return chartDataMap[this.activeTab()];
  });

  private readonly _transactions = signal<readonly Transaction[]>([
    {
      transactionId: 'TX123',
      date: '2023-10-15',
      eventName: 'Tech Conference 2023',
      organizer: 'John Smith',
      email: 'john.smith@example.com',
      type: 'Completed',
      amount: 120.99,
      paymentMethod: 'Credit Card',
      status: 'Completed',
    },
    {
      transactionId: 'TX124',
      date: '2023-09-28',
      eventName: 'Marketing Workshop',
      organizer: 'Lisa Johnson',
      email: 'lisa.johnson@example.com',
      type: 'Refund',
      amount: 45.0,
      paymentMethod: 'MTN Mobile Money',
      status: 'Refunded',
    },
    {
      transactionId: 'TX125',
      date: '2023-11-10',
      eventName: 'Leadership Summit',
      organizer: 'Michael Brown',
      email: 'michael.brown@example.com',
      type: 'Pending',
      amount: 85.98,
      paymentMethod: '-',
      status: 'Pending',
    },
    {
      transactionId: 'TX126',
      date: '2023-10-22',
      eventName: 'Product Launch',
      organizer: 'Sarah Davis',
      email: 'alice.smith@example.com',
      type: 'Completed',
      amount: 150.0,
      paymentMethod: 'Credit Card',
      status: 'Completed',
    },
    {
      transactionId: 'TX127',
      date: '2023-12-05',
      eventName: 'Annual Networking Event',
      organizer: 'Robert Wilson',
      email: 'charlie.davis@example.com',
      type: 'Completed',
      amount: 0,
      paymentMethod: 'Airtel Tigo',
      status: 'Completed',
    },
    {
      transactionId: 'TX128',
      date: '2023-11-18',
      eventName: 'Digital Marketing Summit',
      organizer: 'Emma Thompson',
      email: 'emma.thompson@example.com',
      type: 'Pending',
      amount: 95.5,
      paymentMethod: 'Vodafone Cash',
      status: 'Pending',
    },
  ]);

  protected readonly transactions: Signal<readonly Transaction[]> = this._transactions.asReadonly();

  protected readonly tableColumns: readonly TableColumn<Transaction>[] = [
    { key: 'transactionId', header: 'Transaction ID', sortable: true },
    { key: 'date', header: 'Date', sortable: true },
    { key: 'eventName', header: 'Event Name', sortable: true },
    { key: 'organizer', header: 'Organizer', filterable: true },
    { key: 'type', header: 'Type', filterable: true },
    { key: 'amount', header: 'Amount', sortable: true },
    { key: 'paymentMethod', header: 'Payment Method', filterable: true },
    { key: 'status', header: 'Status', filterable: true },
  ];

  protected readonly tableActions: readonly TableAction<Transaction>[] = [
    {
      icon: 'icons/view-icon.png',
      label: 'View Transaction Details',
      color: 'view',
      type: 'action',
      handler: (transaction: Transaction) => this._viewTransaction(transaction),
    },
    {
      icon: 'icons/download-icon.png',
      label: 'Download Receipt',
      color: 'edit',
      type: 'action',
      handler: (transaction: Transaction) => this._downloadReceipt(transaction),
    },
  ];

  protected readonly tableFilters: readonly TableFilter[] = [
    {
      key: 'status',
      placeholder: 'All Status',
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Refunded', value: 'Refunded' },
        { label: 'Failed', value: 'Failed' },
      ],
    },
    {
      key: 'date',
      placeholder: 'Date',
      options: [
        { label: 'All Dates', value: 'all' },
        { label: 'Today', value: 'today' },
        { label: 'This Week', value: 'week' },
        { label: 'This Month', value: 'month' },
        { label: 'This Year', value: 'year' },
      ],
    },
  ];

  protected readonly primaryAction: PrimaryAction = {
    label: 'Create Event',
    handler: () => this._openCreateEventModal(),
  };

  public ngOnInit(): void {
    this._layoutService.pageTitle.set('Transaction History');
    this._layoutService.logoSrc.set('icons/transaction-icon.png');
    this._layoutService.logoAlt.set('Transaction History');
  }

  protected onTabChange(tab: TransactionFilter): void {
    this.activeTab.set(tab);
  }

  private _viewTransaction(transaction: Transaction): void {
  }

  private _downloadReceipt(transaction: Transaction): void {
  }

  private _openCreateEventModal(): void {
  }
}