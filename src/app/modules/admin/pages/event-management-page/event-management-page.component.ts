// event-management-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';
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

interface EventTableData {
  id: number;
  name: string;
  organizer: string;
  date: string;
  attendees: number;
  status: 'Pending' | 'Completed' | 'Draft' | 'Active' | 'Cancelled';
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
})
export class EventManagementPageComponent {
  private readonly _layoutService = inject(LayoutService);

  // Event Statistics Data
  private readonly _eventStatistics = signal<EventStatistic[]>([
    {
      label: 'Total Events',
      count: 193000,
      color: '#3DC0F3',
    },
    {
      label: 'Active Events',
      count: 120000,
      color: '#656565',
    },
    {
      label: 'Completed Events',
      count: 150000,
      color: '#292929',
    },
    {
      label: 'Cancelled Events',
      count: 75000,
      color: '#FF5A00',
    },
    {
      label: 'Draft Events',
      count: 170000,
      color: '#0787C2',
    },
  ]);

  // Top Organizers Data
  private readonly _topOrganizers = signal<Organizer[]>([
    {
      id: 1,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: undefined,
      eventCount: 8,
      growthPercentage: 34,
      trendData: [10, 15, 12, 18, 22, 20, 25, 28],
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: undefined,
      eventCount: 8,
      growthPercentage: 34,
      trendData: [8, 10, 14, 16, 15, 18, 20, 22],
    },
  ]);

  // Upcoming Events Data
  private readonly _upcomingEvents = signal<UpcomingEvent[]>([
    {
      id: 1,
      title: 'Industry Panel Discussion',
      date: '2025-10-12',
      attendeeCount: 90,
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Tech Conference 2025',
      date: '2025-10-15',
      attendeeCount: 120,
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'Product Launch',
      date: '2025-10-22',
      attendeeCount: 150,
      status: 'upcoming',
    },
  ]);

  // Event Table Data
  private readonly _eventTableData = signal<EventTableData[]>([
    {
      id: 1,
      name: 'Tech Conference 2023',
      organizer: 'John Smith',
      date: '2023-10-15',
      attendees: 120,
      status: 'Pending',
    },
    {
      id: 2,
      name: 'Marketing Workshop',
      organizer: 'Lisa Johnson',
      date: '2023-09-28',
      attendees: 45,
      status: 'Completed',
    },
    {
      id: 3,
      name: 'Leadership Summit',
      organizer: 'Michael Brown',
      date: '2023-11-10',
      attendees: 85,
      status: 'Draft',
    },
    {
      id: 4,
      name: 'Product Launch',
      organizer: 'Sarah Davis',
      date: '2023-10-22',
      attendees: 150,
      status: 'Active',
    },
    {
      id: 5,
      name: 'Annual Networking Event',
      organizer: 'Robert Wilson',
      date: '2023-12-05',
      attendees: 200,
      status: 'Active',
    },
    {
      id: 6,
      name: 'Design Workshop',
      organizer: 'Jennifer Lee',
      date: '2023-09-15',
      attendees: 35,
      status: 'Completed',
    },
  ]);

  // Table Configuration
  public readonly eventTableColumns: TableColumn<EventTableData>[] = [
    { key: 'name', header: 'Event Name', sortable: true },
    { key: 'organizer', header: 'Organizer', sortable: true },
    { key: 'date', header: 'Date', sortable: true },
    { key: 'attendees', header: 'Attendees', sortable: true },
    { key: 'status', header: 'Status', filterable: true },
  ];

  public readonly eventTableActions: TableAction<EventTableData>[] = [
    {
      icon: 'icons/view-event.png',
      label: 'View',
      color: 'view',
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
  ];

  public readonly eventTablePrimaryAction = {
    label: 'Create Event',
    handler: () => this._onCreateEvent(),
  };

  // Public readonly signals
  public readonly eventStatistics = this._eventStatistics.asReadonly();
  public readonly topOrganizers = this._topOrganizers.asReadonly();
  public readonly upcomingEvents = this._upcomingEvents.asReadonly();
  public readonly eventTableData = this._eventTableData.asReadonly();

  constructor() {
    this._layoutService.pageTitle.set('Event Management');
  }

  // Event handlers - Statistics Section
  public onViewAllOrganizers(): void {
    console.log('View all organizers clicked');
    // TODO: Navigate to organizers page
  }

  public onOrganizerClick(organizer: Organizer): void {
    console.log('Organizer clicked:', organizer);
    // TODO: Navigate to organizer detail page
  }

  public onViewAllEvents(): void {
    console.log('View all events clicked');
    // TODO: Navigate to events page
  }

  public onEventClick(event: UpcomingEvent): void {
    console.log('Event clicked:', event);
    // TODO: Navigate to event detail page
  }

  // Event handlers - Table Section
  private _onViewEvent(event: EventTableData): void {
    console.log('View event:', event);
    // TODO: Navigate to event detail page
    // this._router.navigate(['/admin/events', event.id]);
  }

  private _onCreateEvent(): void {
    console.log('Create event clicked');
    // TODO: Navigate to create event page or open modal
    // this._router.navigate(['/admin/events/create']);
  }
}

// ===================================================================
// OPTIONAL: event-management.service.ts (Best Practice)
// ===================================================================
/*
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { EventStatistic } from '../../../../shared/dashboard/event-statistics/event-statistics.component';
import { Organizer } from '../../../../shared/dashboard/top-organizers/top-organizers.component';
import { UpcomingEvent } from '../../../../shared/dashboard/upcoming-events/upcoming-events.component';

export interface EventDashboardData {
  statistics: EventStatistic[];
  topOrganizers: Organizer[];
  upcomingEvents: UpcomingEvent[];
}

@Injectable({
  providedIn: 'root'
})
export class EventManagementService {
  private readonly _apiUrl = '/api/events';
  
  private _statistics = signal<EventStatistic[]>([]);
  private _topOrganizers = signal<Organizer[]>([]);
  private _upcomingEvents = signal<UpcomingEvent[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  public readonly statistics = this._statistics.asReadonly();
  public readonly topOrganizers = this._topOrganizers.asReadonly();
  public readonly upcomingEvents = this._upcomingEvents.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  constructor(private readonly _http: HttpClient) {}

  public loadDashboardData(): void {
    this._loading.set(true);
    this._error.set(null);

    this._http.get<EventDashboardData>(`${this._apiUrl}/dashboard`).pipe(
      tap((data) => {
        this._statistics.set(data.statistics);
        this._topOrganizers.set(data.topOrganizers);
        this._upcomingEvents.set(data.upcomingEvents);
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set('Failed to load dashboard data. Please try again.');
        this._loading.set(false);
        console.error('Error loading dashboard data:', error);
        return of(null);
      })
    ).subscribe();
  }

  public getStatistics(): Observable<EventStatistic[]> {
    return this._http.get<EventStatistic[]>(`${this._apiUrl}/statistics`).pipe(
      tap((stats) => this._statistics.set(stats)),
      catchError((error) => {
        console.error('Error loading statistics:', error);
        throw error;
      })
    );
  }

  public getTopOrganizers(limit: number = 10): Observable<Organizer[]> {
    return this._http.get<Organizer[]>(`${this._apiUrl}/top-organizers`, {
      params: { limit: limit.toString() }
    }).pipe(
      tap((organizers) => this._topOrganizers.set(organizers)),
      catchError((error) => {
        console.error('Error loading top organizers:', error);
        throw error;
      })
    );
  }

  public getUpcomingEvents(limit: number = 5): Observable<UpcomingEvent[]> {
    return this._http.get<UpcomingEvent[]>(`${this._apiUrl}/upcoming`, {
      params: { limit: limit.toString() }
    }).pipe(
      tap((events) => this._upcomingEvents.set(events)),
      catchError((error) => {
        console.error('Error loading upcoming events:', error);
        throw error;
      })
    );
  }

  public refreshData(): void {
    this.loadDashboardData();
  }
}
*/

// ===================================================================
// USAGE WITH SERVICE (event-management-page.component.ts alternative)
// ===================================================================
/*
import { Component, inject, OnInit } from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';
import { EventManagementService } from '../../../../core/services/event-management.service';
import { EventStatisticsComponent } from '../../../../shared/dashboard/event-statistics/event-statistics.component';
import { TopOrganizersComponent } from '../../../../shared/dashboard/top-organizers/top-organizers.component';
import { UpcomingEventsComponent } from '../../../../shared/dashboard/upcoming-events/upcoming-events.component';

@Component({
  selector: 'app-event-management-page',
  standalone: true,
  imports: [
    EventStatisticsComponent,
    TopOrganizersComponent,
    UpcomingEventsComponent
  ],
  templateUrl: './event-management-page.component.html',
  styleUrl: './event-management-page.component.scss',
})
export class EventManagementPageComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);
  private readonly _eventManagementService = inject(EventManagementService);

  // Access signals from service
  public eventStatistics = this._eventManagementService.statistics;
  public topOrganizers = this._eventManagementService.topOrganizers;
  public upcomingEvents = this._eventManagementService.upcomingEvents;
  public loading = this._eventManagementService.loading;
  public error = this._eventManagementService.error;

  constructor() {
    this._layoutService.pageTitle.set('Event Management');
  }

  ngOnInit(): void {
    this._eventManagementService.loadDashboardData();
  }

  public onViewAllOrganizers(): void {
    // Navigate to organizers page
  }

  public onOrganizerClick(organizer: Organizer): void {
    // Navigate to organizer detail
  }

  public onViewAllEvents(): void {
    // Navigate to events page
  }

  public onEventClick(event: UpcomingEvent): void {
    // Navigate to event detail
  }

  public onRefresh(): void {
    this._eventManagementService.refreshData();
  }
}
*/
