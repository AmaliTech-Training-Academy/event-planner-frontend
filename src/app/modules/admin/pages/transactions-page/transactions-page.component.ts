import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';
import {
  DataTableComponent,
  TableAction,
  TableColumn,
  TableFilter,
} from '../../../../shared/admin-ui/data-table/data-table.component';
import {
  LineChartComponent,
  LineSeriesConfig,
  TimeSeriesDataPoint,
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

type TransactionFilter =
  | 'Total'
  | 'Completed'
  | 'Pending'
  | 'Failed'
  | 'Refund';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [DataTableComponent, LineChartComponent],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.scss',
})
export class TransactionsPageComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);

  // Signals for modal states
  protected readonly isCreateEventModalOpen = signal<boolean>(false);
  protected readonly selectedTransaction = signal<Transaction | undefined>(
    undefined
  );

  // Chart-related signals
  protected readonly activeTab = signal<TransactionFilter>('Total');

  protected readonly chartTabs = [
    { key: 'Total' as const, label: 'Total' },
    { key: 'Completed' as const, label: 'Completed' },
    { key: 'Pending' as const, label: 'Pending' },
    { key: 'Failed' as const, label: 'Failed' },
    { key: 'Refund' as const, label: 'Refund' },
  ];

  // Base transaction data for chart (more realistic/volatile)
  private readonly _allTransactionsChartData: LineSeriesConfig[] = [
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
  ];

  private readonly _completedChartData: LineSeriesConfig[] = [
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
  ];

  private readonly _pendingChartData: LineSeriesConfig[] = [
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
  ];

  private readonly _failedChartData: LineSeriesConfig[] = [
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
  ];

  private readonly _refundChartData: LineSeriesConfig[] = [
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
  ];

  protected readonly chartSeriesConfig = computed(() => {
    switch (this.activeTab()) {
      case 'Total':
        return this._allTransactionsChartData;
      case 'Completed':
        return this._completedChartData;
      case 'Pending':
        return this._pendingChartData;
      case 'Failed':
        return this._failedChartData;
      case 'Refund':
        return this._refundChartData;
      default:
        return this._allTransactionsChartData;
    }
  });

  // Mock transaction data
  private readonly _transactions = signal<Transaction[]>([
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

  protected readonly transactions = this._transactions.asReadonly();

  // Table columns configuration
  protected readonly tableColumns: TableColumn<Transaction>[] = [
    { key: 'transactionId', header: 'Transaction ID', sortable: true },
    { key: 'date', header: 'Date', sortable: true },
    { key: 'eventName', header: 'Event Name', sortable: true },
    { key: 'organizer', header: 'Organizer', filterable: true },
    { key: 'type', header: 'Type', filterable: true },
    { key: 'amount', header: 'Amount', sortable: true },
    { key: 'paymentMethod', header: 'Payment Method', filterable: true },
    { key: 'status', header: 'Status', filterable: true },
  ];

  // Helper method to format amount
  protected formatAmount(amount: number): string {
    if (amount === 0) return 'Free';
    return `${amount.toFixed(2)}`;
  }

  // Table actions
  protected readonly tableActions: TableAction<Transaction>[] = [
    {
      icon: 'icons/view-icon.png',
      label: 'View Transaction Details',
      color: 'view',
      type: 'action',
      handler: (transaction) => this._viewTransaction(transaction),
    },
    {
      icon: 'icons/download-icon.png',
      label: 'Download Receipt',
      color: 'edit',
      type: 'action',
      handler: (transaction) => this._downloadReceipt(transaction),
    },
  ];

  // Table filters
  protected readonly tableFilters: TableFilter[] = [
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

  // Primary action button
  protected readonly primaryAction = {
    label: 'Create Event',
    handler: () => this._openCreateEventModal(),
  };

  constructor() {}

  public ngOnInit(): void {
    this._layoutService.pageTitle.set('Transaction History');
    this._layoutService.logoSrc.set('icons/transaction-icon.png');
    this._layoutService.logoAlt.set('Transaction History');
  }

  // Chart tab handler
  protected onTabChange(tab: TransactionFilter): void {
    this.activeTab.set(tab);
  }

  // Action handlers
  private _viewTransaction(transaction: Transaction): void {
    this.selectedTransaction.set(transaction);
    // TODO: Open view transaction modal
  }

  private _downloadReceipt(transaction: Transaction): void {
    // TODO: Implement receipt download
    alert(`Downloading receipt for ${transaction.transactionId}`);
  }

  private _openCreateEventModal(): void {
    this.isCreateEventModalOpen.set(true);
    // TODO: Implement create event modal
  }

  protected closeCreateEventModal(): void {
    this.isCreateEventModalOpen.set(false);
  }
}
