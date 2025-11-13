import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutService } from '../../../../core/services/layout.service';
import { EventManagementService } from '../../../../core/services/event-management.service';
import {
  EventStatisticsComponent,
  EventStatistic,
} from '../../../admin/pages/event-management-page/components/event-statistics/event-statistics.component';
import {
  TopOrganizersComponent,
  Organizer,
} from '../../../admin/pages/event-management-page/components/top-organizers/top-organizers.component';
import {
  UpcomingEventsComponent,
  UpcomingEvent,
} from '../../../admin/pages/event-management-page/components/upcoming-events/upcoming-events.component';
import {
  TableColumn,
  TableAction,
  TableFilter,
  FilterOption,
  DataTableComponent,
} from '../../../../shared/admin-ui/data-table/data-table.component';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import {
  DashboardData,
  EventManagement,
  EventStatus,
} from '../../../../core/models/event.model';

interface EventTableData {
  id: number;
  name: string;
  organizer: string;
  date: string;
  attendees: number;
  status: 'Pending' | 'Completed' | 'Draft' | 'Active' | 'Cancelled';
  time?: string;
  location?: string;
  description?: string;
}

@Component({
  selector: 'app-event-management-page',
  standalone: true,
  imports: [
    EventStatisticsComponent,
    TopOrganizersComponent,
    UpcomingEventsComponent,
    DataTableComponent,
  ],
  templateUrl: './event-management-page.component.html',
  styleUrl: './event-management-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventManagementPageComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);
  private readonly _router = inject(Router);
  private readonly _eventManagementService = inject(EventManagementService);
  protected readonly APP_ROUTES = APP_ROUTES;

  // Backend data signal
  private readonly _dashboardData = signal<DashboardData | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Pagination and filter state
  private readonly _currentPage = signal<number>(0);
  private readonly _pageSize = signal<number>(10);
  private readonly _selectedStatus = signal<string>('all');
  private readonly _searchQuery = signal<string>('');

  // Public computed observables
  public readonly eventStatistics = computed<EventStatistic[]>(() => {
    const data = this._dashboardData();
    if (!data) return [];

    const stats = data.eventStats;
    return [
      {
        label: 'Total Events',
        count: stats.totalEvents,
        color: '#3DC0F3',
      },
      {
        label: 'Active Events',
        count: stats.activeEvents,
        color: '#656565',
      },
      {
        label: 'Completed Events',
        count: stats.completedEvents,
        color: '#292929',
      },
      {
        label: 'Cancelled Events',
        count: stats.canceledEvents,
        color: '#FF5A00',
      },
      {
        label: 'Draft Events',
        count: stats.draftEvents,
        color: '#0787C2',
      },
    ];
  });

  public readonly topOrganizers = computed<Organizer[]>(() => {
    const data = this._dashboardData();
    if (!data) return [];

    return data.topOrganizers.map((org, index) => ({
      id: index + 1,
      name: org.name,
      email: org.email,
      avatar: undefined,
      eventCount: org.eventCount,
      growthPercentage: org.growthPercentage,
      trendData: this._generateTrendData(org.growthPercentage),
    }));
  });

  public readonly upcomingEvents = computed<UpcomingEvent[]>(() => {
    const data = this._dashboardData();
    if (!data) return [];

    return data.upcomingEvents.map((event, index) => ({
      id: index + 1,
      title: event.eventTitle,
      date: new Date(event.startTime).toISOString().split('T')[0],
      attendeeCount: event.attendeeCount,
      status: 'upcoming' as const,
    }));
  });

  // ✅ FIXED: Server-side data - NO local filtering
  public readonly eventTableData = computed<EventTableData[]>(() => {
    const data = this._dashboardData();
    if (!data) return [];

    // Return the server data directly - server already filtered it
    return data.eventManagement.content.map((event: EventManagement) => ({
      id: event.id,
      name: event.title,
      organizer: event.organizer,
      date: new Date(event.startTime).toISOString().split('T')[0],
      attendees: event.attendeeCount,
      status: this._mapStatusToTableStatus(event.status),
      time: new Date(event.startTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      }),
      location: 'N/A',
    }));
  });

  public readonly totalPages = computed(() => {
    const data = this._dashboardData();
    return data?.eventManagement.totalPages ?? 0;
  });

  public readonly totalElements = computed(() => {
    const data = this._dashboardData();
    return data?.eventManagement.totalElements ?? 0;
  });

  public readonly isLoading = computed(() => this._isLoading());
  public readonly error = computed(() => this._error());

  public readonly eventTableColumns: TableColumn<EventTableData>[] = [
    { key: 'name', header: 'Event Name', sortable: true },
    { key: 'organizer', header: 'Organizer', sortable: true },
    { key: 'date', header: 'Date', sortable: true },
    { key: 'attendees', header: 'Attendees', sortable: true },
    { key: 'status', header: 'Status', filterable: true },
  ];

  public readonly eventTableActions: TableAction<EventTableData>[] = [
    {
      icon: 'icons/eye-open.svg',
      label: 'View',
      extraClass: 'plain-action',
      handler: (event: EventTableData) => this._onViewEvent(event),
    },
  ];

  public readonly eventTableFilters: TableFilter[] = [
    {
      key: 'status',
      placeholder: 'All Status',
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Cancelled', value: 'CANCELED' },
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

  public readonly eventTablePrimaryAction = {
    label: 'Create Event',
    handler: () => this._onCreateEvent(),
  };

  constructor() {
    this._eventManagementService.loading$
      .pipe(takeUntilDestroyed())
      .subscribe((loading) => {
        this._isLoading.set(loading);
      });

    this._eventManagementService.dashboardData$
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        this._dashboardData.set(data);
      });
  }

  public ngOnInit(): void {
    this._layoutService.pageTitle.set('Event Management');
    this._loadDashboardData();
  }

  public refreshData(): void {
    this._loadDashboardData();
  }

  public onViewAllOrganizers(): void {
    this._router.navigate([this.APP_ROUTES.ADMIN_ORGANIZERS]);
  }

  public onOrganizerClick(organizer: Organizer): void {
    this._router.navigate([this.APP_ROUTES.ADMIN_ORGANIZERS, organizer.id]);
  }

  public onViewAllEvents(): void {
    this._router.navigate([this.APP_ROUTES.ADMIN_EVENTS]);
  }

  public onEventClick(event: UpcomingEvent): void {
    this._router.navigate([this.APP_ROUTES.ADMIN_EVENTS, event.id]);
  }

  // ✅ FIXED: Handle pagination changes - make server request
  public onPageChange(page: number): void {
    this._currentPage.set(page);
    this._loadDashboardData(); // Reload with new page
  }

  // ✅ FIXED: Handle filter changes - make server request
  public onFilterChange(filters: Record<string, string>): void {
    if (filters['status']) {
      this._selectedStatus.set(filters['status']);
    }

    if (filters['export']) {
      this._handleExport(filters['export']);
      return; // Don't reload data for export
    }

    // Reset to first page when filters change
    this._currentPage.set(0);
    this._loadDashboardData(); // Reload with new filters
  }

  // ✅ FIXED: Handle search - make server request
  public onSearch(query: string): void {
    this._searchQuery.set(query);
    this._currentPage.set(0); // Reset to first page
    this._loadDashboardData(); // Reload with search query
  }

  // ✅ FIXED: Load full dashboard with current filters
  private _loadDashboardData(): void {
    this._error.set(null);

    const page = this._currentPage();
    const size = this._pageSize();
    const status =
      this._selectedStatus() !== 'all' ? this._selectedStatus() : undefined;
    const search = this._searchQuery().trim() || undefined;

    this._eventManagementService
      .loadDashboardData(page, size, status, search)
      .subscribe({
        error: (err) => {
          this._error.set('Failed to load dashboard data');
          console.error('Dashboard error:', err);
        },
      });
  }

  // ✅ REMOVED: _loadDashboardEvents - not needed, use _loadDashboardData instead

  private _onViewEvent(event: EventTableData): void {
    this._router.navigate(['/admin/events', event.id]);
  }

  private _onCreateEvent(): void {
    this._router.navigate([this.APP_ROUTES.CREATE_EVENT]);
  }

  private _handleExport(format: string): void {
    if (!format) return;

    const data = this.eventTableData();

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

  private _exportAsCSV(data: EventTableData[]): void {
    const headers = ['Event Name', 'Organizer', 'Date', 'Attendees', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.map((event) =>
        [
          `"${event.name}"`,
          `"${event.organizer}"`,
          event.date,
          event.attendees,
          event.status,
        ].join(',')
      ),
    ].join('\n');

    this._downloadFile(csvContent, 'events.csv', 'text/csv');
  }

  private _exportAsJSON(data: EventTableData[]): void {
    const jsonContent = JSON.stringify(data, null, 2);
    this._downloadFile(jsonContent, 'events.json', 'application/json');
  }

  private _exportAsPDF(data: EventTableData[]): void {
    console.log('PDF export not implemented yet', data);
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

  private _mapStatusToTableStatus(
    status: EventStatus
  ): 'Pending' | 'Completed' | 'Draft' | 'Active' | 'Cancelled' {
    const statusMap: Record<
      EventStatus,
      'Pending' | 'Completed' | 'Draft' | 'Active' | 'Cancelled'
    > = {
      ACTIVE: 'Active',
      DRAFT: 'Draft',
      COMPLETED: 'Completed',
      CANCELED: 'Cancelled',
    };
    return statusMap[status] || 'Pending';
  }

  private _generateTrendData(growthPercentage: number): number[] {
    const baseValue = 10;
    const growth = growthPercentage / 100;
    return Array.from({ length: 8 }, (_, i) => {
      return Math.round(baseValue * (1 + (growth * i) / 7));
    });
  }
}
