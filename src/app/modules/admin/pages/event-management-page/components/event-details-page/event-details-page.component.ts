import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '../../../../../../core/services/layout.service';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { APP_ROUTES } from '../../../../../../core/constants/app-routes.constants';
import { EventBackendService } from '../../../../../../core/services/backend/event-backend.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { EventManagement } from '../../../../../../core/models/events';

export interface EventDetails {
  id: number;
  name: string;
  organizer: string;
  date: string;
  attendees: number;
  totalTicketsSold: number;
  ticketRevenue: number;
  status:
    | 'Pending'
    | 'Completed'
    | 'Draft'
    | 'Active'
    | 'Cancelled'
    | 'Upcoming';
  time?: string;
  location?: string;
  description?: string;
}

export interface TicketType {
  name: string;
  sold: number;
  remaining: number;
}

export interface EventHost {
  name: string;
  email: string;
  avatar?: string;
}

export interface Guest {
  id: number;
  name: string;
  email: string;
  status: 'pending' | 'confirmed' | 'declined';
  dateSent?: string;
  avatar?: string;
}

interface EventDetailsPageState {
  eventData?: EventDetails;
}

type TabType = 'overview' | 'guests' | 'registration';
type GuestFilter = 'all' | 'confirmed' | 'pending' | 'declined';
type GuestSortBy = 'date' | 'name' | 'status';

@Component({
  selector: 'app-event-details-page',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ButtonComponent, FormsModule],
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.scss'],
})
export class EventDetailsPageComponent implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _location = inject(Location);
  private readonly _layoutService = inject(LayoutService);
  private readonly _eventBackendService = inject(EventBackendService);
  protected readonly APP_ROUTES: typeof APP_ROUTES = APP_ROUTES;

  protected readonly eventDetails = signal<EventDetails | null>(null);
  protected readonly ticketTypes = signal<TicketType[]>([]);
  protected readonly hosts = signal<EventHost[]>([]);
  protected readonly guests = signal<Guest[]>([]);
  protected readonly filteredGuests = signal<Guest[]>([]);
  protected readonly activeTab = signal<TabType>('overview');
  protected readonly isLoading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  // Guest tab specific
  protected readonly guestSearchQuery = signal<string>('');
  protected readonly guestFilter = signal<GuestFilter>('all');
  protected readonly guestSortBy = signal<GuestSortBy>('date');

  private readonly _eventIdFromRoute$: Observable<ParamMap> =
    this._route.paramMap.pipe(takeUntilDestroyed(this._destroyRef));

  public ngOnInit(): void {
    const state = this._location.getState() as EventDetailsPageState;
    const eventData = state.eventData;

    if (eventData) {
      this._loadEventFromState(eventData);
    } else {
      this._eventIdFromRoute$.subscribe((params) => {
        const eventId = params.get('id');
        if (eventId) {
          this._loadEventFromBackend(+eventId);
        } else {
          this._router.navigate([this.APP_ROUTES.ADMIN_EVENTS]);
        }
      });
    }
  }

  private _loadEventFromState(eventData: EventDetails): void {
    const event: EventDetails = {
      ...eventData,
      time: eventData.time ?? '09:00am GMT',
      location: eventData.location ?? 'Virtual (Zoom meeting)',
      description: eventData.description ?? 'Event description coming soon.',
      totalTicketsSold: eventData.totalTicketsSold ?? 565.0,
      ticketRevenue: eventData.ticketRevenue ?? 565.0,
      status: eventData.status || 'Upcoming',
    };

    const host: EventHost = {
      name: event.organizer,
      email: `${event.organizer
        .toLowerCase()
        .replace(/\s+/g, '.')}@example.com`,
    };

    const tickets: TicketType[] = [
      { name: 'Regular', sold: 6, remaining: 2 },
      { name: 'VIP', sold: 14, remaining: 12 },
      { name: 'VVIP', sold: 19, remaining: 43 },
    ];

    this.eventDetails.set(event);
    this.ticketTypes.set(tickets);
    this.hosts.set([host]);
    this._layoutService.pageTitle.set(event.name);
  }

  private _loadEventFromBackend(eventId: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this._eventBackendService.getDashboardData(0, 1000).subscribe({
      next: (response) => {
        const dashboard = response.data;

        if (!dashboard?.eventManagement?.content?.length) {
          this.error.set('No events found in dashboard data.');
          this.isLoading.set(false);
          return;
        }

        const apiEvent = dashboard.eventManagement.content.find(
          (e: EventManagement) => e.id === eventId
        );

        if (!apiEvent) {
          this.error.set(`Event with ID ${eventId} not found.`);
          this.isLoading.set(false);
          return;
        }

        const event: EventDetails = {
          id: apiEvent.id,
          name: apiEvent.title,
          organizer: apiEvent.organizer || 'Unknown Organizer',
          date: apiEvent.startTime
            ? new Date(apiEvent.startTime).toISOString().split('T')[0]
            : 'N/A',
          attendees: apiEvent.attendeeCount || 387,
          totalTicketsSold: 565.0,
          ticketRevenue: 565.0,
          status: this._mapStatusToTableStatus(apiEvent.status),
          time: apiEvent.startTime
            ? new Date(apiEvent.startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
              })
            : '09:00am GMT',
          location: 'Virtual (Zoom meeting)',
          description: 'Event description coming soon.',
        };

        const host: EventHost = {
          name: event.organizer,
          email: `${event.organizer
            .toLowerCase()
            .replace(/\s+/g, '.')}@example.com`,
        };

        const tickets: TicketType[] = [
          { name: 'Regular', sold: 6, remaining: 2 },
          { name: 'VIP', sold: 14, remaining: 12 },
          { name: 'VVIP', sold: 19, remaining: 43 },
        ];

        this.eventDetails.set(event);
        this.ticketTypes.set(tickets);
        this.hosts.set([host]);
        this._layoutService.pageTitle.set(event.name);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load event details');
        this.isLoading.set(false);
      },
    });
  }

  private _mapStatusToTableStatus(
    status: string
  ): 'Pending' | 'Completed' | 'Draft' | 'Active' | 'Cancelled' | 'Upcoming' {
    const statusMap: Record<
      string,
      'Pending' | 'Completed' | 'Draft' | 'Active' | 'Cancelled' | 'Upcoming'
    > = {
      ACTIVE: 'Active',
      DRAFT: 'Draft',
      COMPLETED: 'Completed',
      CANCELED: 'Cancelled',
      UPCOMING: 'Upcoming',
    };
    return statusMap[status] || 'Pending';
  }

  protected setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  protected onBack(): void {
    this._router.navigate([this.APP_ROUTES.ADMIN_EVENTS]);
  }

  protected onEdit(): void {
    const event = this.eventDetails();
    if (!event) {
      return;
    }

    if (event.id) {
      this._router.navigate([
        this.APP_ROUTES.ADMIN_EVENT_DETAILS,
        event.id,
        'edit',
      ]);
    }
  }

  protected onSendInvites(): void {
    console.log('Send invites clicked');
  }

  protected onScheduleFeedback(): void {
    const event = this.eventDetails();
    if (!event) {
      return;
    }
    console.log('Schedule feedback clicked');
  }

  protected onViewAllGuests(): void {
    this.setActiveTab('guests');
  }

  protected getStatusClass(status: string): string {
    return `event-status event-status--${status.toLowerCase()}`;
  }

  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  protected formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  protected getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  protected onGuestSearch(query: string): void {
    this.guestSearchQuery.set(query);
    this._applyGuestFilters();
  }

  protected onGuestFilterChange(filter: GuestFilter): void {
    this.guestFilter.set(filter);
    this._applyGuestFilters();
  }

  protected onGuestSortChange(sortBy: GuestSortBy): void {
    this.guestSortBy.set(sortBy);
    this._applyGuestFilters();
  }

  private _applyGuestFilters(): void {
    let filtered = [...this.guests()];

    const query = this.guestSearchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(
        (guest) =>
          guest.name.toLowerCase().includes(query) ||
          guest.email.toLowerCase().includes(query)
      );
    }

    const filter = this.guestFilter();
    if (filter !== 'all') {
      filtered = filtered.filter((guest) => guest.status === filter);
    }

    const sortBy = this.guestSortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return (a.dateSent || '').localeCompare(b.dateSent || '');
      }
    });

    this.filteredGuests.set(filtered);
  }
}