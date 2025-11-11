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
import { DashboardData } from '../../../../core/models/event.model';

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

  // This computed signal uses backend data
  public readonly eventStatistics = computed<EventStatistic[]>(() => {
    const data = this._dashboardData();
    if (!data) return [];

    const stats = data.eventStats; // ← From API!
    return [
      {
        label: 'Total Events',
        count: stats.totalEvents, // ← Will be 10
        color: '#3DC0F3',
      },
      {
        label: 'Active Events',
        count: stats.activeEvents, // ← Will be 1
        color: '#656565',
      },
      {
        label: 'Completed Events',
        count: stats.completedEvents, // ← Will be 2
        color: '#292929',
      },
      {
        label: 'Cancelled Events',
        count: stats.canceledEvents, // ← Will be 0
        color: '#FF5A00',
      },
      {
        label: 'Draft Events',
        count: stats.draftEvents, // ← Will be 7
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

  public readonly eventTableData = computed<EventTableData[]>(() => {
    const data = this._dashboardData();
    if (!data) return [];

    return data.eventManagement.map((event) => ({
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
      location: 'N/A', // Not provided in API
    }));
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

  public readonly exportOptions: ReadonlyArray<FilterOption> = [
    { label: 'Export As', value: 'export' },
    { label: 'CSV', value: 'csv' },
    { label: 'JSON', value: 'json' },
    { label: 'PDF', value: 'pdf' },
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
        { label: 'Active', value: 'Active' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Draft', value: 'Draft' },
        { label: 'Cancelled', value: 'Cancelled' },
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

  private _loadDashboardData(): void {
    this._error.set(null);
    this._eventManagementService.loadDashboardData().subscribe({
      error: (err) => {
        this._error.set('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      },
    });
  }

  private _onViewEvent(event: EventTableData): void {
    this._router.navigate([this.APP_ROUTES.ADMIN_EVENT_DETAILS, event.id], {
      state: { eventData: event },
    });
  }

  private _onCreateEvent(): void {
    this._router.navigate([this.APP_ROUTES.CREATE_EVENT]);
  }

  private _mapStatusToTableStatus(
    status: string
  ): 'Pending' | 'Completed' | 'Draft' | 'Active' | 'Cancelled' {
    const statusMap: Record<
      string,
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
