import { Component, OnInit, inject, signal } from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';
import {
  DataTableComponent,
  TableAction,
  TableColumn,
  TableFilter,
} from '../../../../shared/admin-ui/data-table/data-table.component';

interface Transaction {
  transactionId: string;
  date: string;
  eventName: string;
  organizer: string;
  email: string;
  type: 'Completed' | 'Pending' | 'Failed' | 'Refund';
  amount: number;
  paymentMethod: string;
  status: 'Completed' | 'Refunded' | 'Pending';
}

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.scss',
})
export class TransactionsPageComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);

  // Signals for modal states (if needed later)
  protected readonly isCreateEventModalOpen = signal<boolean>(false);
  protected readonly selectedTransaction = signal<Transaction | undefined>(
    undefined
  );

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
      eventName: 'Annual Gala Dinner',
      organizer: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      type: 'Completed',
      amount: 200.0,
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
    },
    {
      transactionId: 'TX128',
      date: '2023-11-18',
      eventName: 'Networking Event',
      organizer: 'Emma Thompson',
      email: 'emma.thompson@example.com',
      type: 'Failed',
      amount: 75.5,
      paymentMethod: 'Credit Card',
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

  constructor() {
    console.log('🏗️ TransactionsPageComponent: Constructor called');
    console.log('📊 Loaded transactions:', this._transactions().length);
  }

  public ngOnInit(): void {
    console.log('🔄 TransactionsPageComponent: ngOnInit called');
    this._layoutService.pageTitle.set('Transaction History');
    this._layoutService.logoSrc.set('icons/transaction-icon.png');
    this._layoutService.logoAlt.set('Transaction History');
  }

  // Action handlers
  private _viewTransaction(transaction: Transaction): void {
    console.log('👁️ View transaction:', transaction.transactionId);
    this.selectedTransaction.set(transaction);
    // TODO: Open view transaction modal
  }

  private _downloadReceipt(transaction: Transaction): void {
    console.log('📥 Download receipt for:', transaction.transactionId);
    // TODO: Implement receipt download
    alert(`Downloading receipt for ${transaction.transactionId}`);
  }

  private _openCreateEventModal(): void {
    console.log('➕ Opening create event modal');
    this.isCreateEventModalOpen.set(true);
    // TODO: Implement create event modal
  }

  protected closeCreateEventModal(): void {
    console.log('❌ Closing create event modal');
    this.isCreateEventModalOpen.set(false);
  }
}
