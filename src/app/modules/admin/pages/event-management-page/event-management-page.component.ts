// event-management-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router'; // ADD THIS IMPORT
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
  time?: string; // Add this
  location?: string; // Add this
  description?: string; // Add this
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
  private readonly _router = inject(Router); // ADD THIS LINE

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
      time: '09:00am GMT',
      location: 'Virtual (Zoom meeting)',
    },
    {
      id: 2,
      name: 'Marketing Workshop',
      organizer: 'Lisa Johnson',
      date: '2023-09-28',
      attendees: 45,
      status: 'Completed',
      time: '02:00pm GMT',
      location: 'Conference Room A',
    },
    {
      id: 3,
      name: 'Product Launch',
      organizer: 'John Smith',
      date: '2023-10-15',
      attendees: 120,
      status: 'Pending',
      time: '09:00am GMT',
      location: 'Virtual (Zoom meeting)',
    },
    {
      id: 4,
      name: 'Marketing Workshop',
      organizer: 'Lisa Johnson',
      date: '2023-09-28',
      attendees: 45,
      status: 'Completed',
      time: '02:00pm GMT',
      location: 'Conference Room A',
    },
    {
      id: 5,
      name: 'Product Launch',
      organizer: 'John Smith',
      date: '2023-10-15',
      attendees: 120,
      status: 'Pending',
      time: '09:00am GMT',
      location: 'Virtual (Zoom meeting)',
    },
    {
      id: 6,
      name: 'Marketing Workshop',
      organizer: 'Lisa Johnson',
      date: '2023-09-28',
      attendees: 45,
      status: 'Completed',
      time: '02:00pm GMT',
      location: 'Conference Room A',
    },
    {
      id: 7,
      name: 'Product Launch',
      organizer: 'John Smith',
      date: '2023-10-15',
      attendees: 120,
      status: 'Pending',
      time: '09:00am GMT',
      location: 'Virtual (Zoom meeting)',
    },
    {
      id: 8,
      name: 'Marketing Workshop',
      organizer: 'Lisa Johnson',
      date: '2023-09-28',
      attendees: 45,
      status: 'Completed',
      time: '02:00pm GMT',
      location: 'Conference Room A',
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
    this._router.navigate(['/admin/events', event.id], {
      state: { eventData: event },
    });
  }

  private _onCreateEvent(): void {
    console.log('Create event clicked');
    // Navigate to create event page
    this._router.navigate(['/admin/events/create']);
  }
}
