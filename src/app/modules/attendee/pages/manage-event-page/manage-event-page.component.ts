import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LayoutService } from '../../../../core/services/layout.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { StatCardData } from '../../../../core/models/event.model';
import { DataTableComponent, TableColumn, TableFilter } from '../../../../shared/admin-ui/data-table/data-table.component';
import { 
  EventDetails,
  EventHost 
} from '../../../../modules/admin/pages/event-management-page/components/event-details/event-details.component';

export interface TicketType {
  name: string;
  price: number;
  sold: number;
  total: number;
}

export interface Registration {
  fullName: string;
  email: string;
  numberOfTickets: number;
  ticketType: string;
}

type TabType = 'overview' | 'guests' | 'registration';

interface ManageEventPageState {
  eventData?: EventDetails;
}

@Component({
  selector: 'app-manage-event-page',
  standalone: true,
  imports: [
    CommonModule, 
    NgOptimizedImage, 
    ButtonComponent,
    StatCardComponent,
    DataTableComponent
  ],
  templateUrl: './manage-event-page.component.html',
  styleUrls: ['./manage-event-page.component.scss'],
})
export class ManageEventPageComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _location = inject(Location);
  private readonly _layoutService = inject(LayoutService);
  protected readonly APP_ROUTES = APP_ROUTES;

  
  protected readonly eventDetails = signal<EventDetails | null>(null);
  protected readonly ticketTypes = signal<TicketType[]>([]);
  protected readonly hosts = signal<EventHost[]>([]);
  protected readonly activeTab = signal<TabType>('overview');

  public readonly registrations = signal<Registration[]>([]);

  public readonly registrationColumns = signal<TableColumn<Registration>[]>([
    {
      key: 'fullName',
      header: 'Name',
      sortable: true
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true
    },
    {
      key: 'numberOfTickets',
      header: 'Number of Tickets',
      sortable: true
    },
    {
      key: 'ticketType',
      header: 'Ticket Type',
      sortable: true
    }
  ]);

  public readonly registrationFilters = signal<TableFilter[]>([
    {
      key: 'ticketType',
      placeholder: 'Ticket Type',
      options: [
        { label: 'All', value: 'all' },
        { label: 'VIP', value: 'vip' },
        { label: 'Regular', value: 'regular' }
      ]
    }
  ]);

  protected readonly statCards = computed<StatCardData[]>(() => {
    const event = this.eventDetails();
    if (!event) return [];

    const totalRevenue = this.calculateTotalRevenue();

    return [
      {
        title: 'Attendees',
        value: event.attendees,
        icon: '/icons/users-icon.png'
      },
      {
        title: 'Total Tickets Sold',
        value: `$${totalRevenue.toFixed(2)}`,
        icon: '/icons/ticket.svg'
      }
    ];
  });

  
  public ngOnInit(): void {
    const state = this._location.getState() as ManageEventPageState;
    const eventData = state.eventData;

    if (eventData) {
      this._loadEventFromState(eventData);
    } else {
      // TODO: Fetch event by ID from API
     
    }
  }

 
  private _loadEventFromState(eventData: EventDetails): void {
    // Use the event data as provided by the router state or by the API.
    // TODO: Validate eventData
    const event: EventDetails = {
      ...eventData
     
    };

    this.eventDetails.set(event);

    // TODO: Replace with API calls to fetch associated data (tickets, hosts, registrations)
    this._loadTicketsAndHosts(event);

    // Set page title (layout service)
    this._layoutService.pageTitle.set(event.name);
  }

  private _loadTicketsAndHosts(event: EventDetails): void {
    // TODO: Replace the following with real API calls and set the signals accordingly.
    
  }

  
  protected setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  protected onBack(): void {
    this._router.navigate(['/attendee/events']);
  }

  protected onEdit(): void {
    const event = this.eventDetails();
    if (event?.id) {
      this._router.navigate(['/attendee/events/edit', event.id]);
    }
  }

  protected onViewAllGuests(): void {
    this.setActiveTab('guests');
  }

  protected onViewTickets(): void {
    // TODO: Navigate to ticket management, or open tickets modal
  }

  protected onInviteGuest(): void {
    // TODO: Open invite guest modal or navigate to invite page
  }

  protected getStatusClass(status: string): string {
    return `event-status event-status--${status.toLowerCase()}`;
  }

  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  protected getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  protected getTicketProgress(sold: number, total: number): number {
    return (sold / total) * 100;
  }

  protected calculateTotalRevenue(): number {
    return this.ticketTypes().reduce((total, ticket) => {
      return total + (ticket.price * ticket.sold);
    }, 0);
  }
}
