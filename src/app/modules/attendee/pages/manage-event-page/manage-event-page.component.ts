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
import { EventDetails } from '../../../../core/models/event.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalWrapperComponent } from '../../../../shared/components/modal-wrapper/modal-wrapper.component';

import { MOCK_EVENT_DETAILS } from '../../../../core/data/mock-data';
import { EventHost } from '@app/core/models/events';

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
    DataTableComponent,
    ReactiveFormsModule,
    ModalWrapperComponent,
  ],
  templateUrl: './manage-event-page.component.html',
  styleUrls: ['./manage-event-page.component.scss'],
})
export class ManageEventPageComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _location = inject(Location);
  private readonly _layoutService = inject(LayoutService);
  protected readonly APP_ROUTES = APP_ROUTES;

  
  protected readonly eventDetails = signal<EventDetails | null>(null);
  protected readonly ticketTypes = signal<TicketType[]>([]);
  protected readonly hosts = signal<EventHost[]>([]);
  protected readonly activeTab = signal<TabType>('overview');
  protected readonly showInviteModal = signal<boolean>(false);
  public readonly registrations = signal<Registration[]>([]);

   protected inviteForm: FormGroup = this._fb.group({
    title: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    event: ['', Validators.required],
    role: ['attendee', Validators.required], 
    message: ['']
  });
 
  
  public readonly registrationColumns: TableColumn<Registration>[] = [
    { key: 'fullName', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'numberOfTickets', header: 'Number of Tickets', sortable: true },
    { key: 'ticketType', header: 'Ticket Type', sortable: true }
  ];

  public readonly registrationFilters: TableFilter[] = [
    {
      key: 'ticketType',
      placeholder: 'Ticket Type',
      options: [
        { label: 'All', value: 'all' },
        { label: 'VIP', value: 'vip' },
        { label: 'Regular', value: 'regular' }
      ]
    }
  ];

 
  protected readonly statCards = computed<StatCardData[]>(() => {
    const event = this.eventDetails();
    if (!event) return [];

    const totalRevenue = this.calculateTotalRevenue();

    return [
      {
        title: 'Attendees',
        value: event.attendees || 0,
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
      
      this._loadEventFromState(MOCK_EVENT_DETAILS);
    }
  }

 
  private _loadEventFromState(eventData: EventDetails): void {
    const event: EventDetails = { ...eventData };
    this.eventDetails.set(event);

    
    this._loadTicketsAndHosts(event);

    this._layoutService.pageTitle.set(event.title);
  }

  private _loadTicketsAndHosts(event: EventDetails): void {
    
    this.ticketTypes.set([
      { name: 'VIP', price: 100, sold: 20, total: 50 },
      { name: 'Regular', price: 50, sold: 150, total: 300 }
    ]);

    
    this.hosts.set([
      { name: 'Jane Doe', email: 'jane@example.com', avatar: '' },
      { name: 'John Smith', email: 'john@example.com', avatar: '' }
    ]);

   
    this.registrations.set([
        { fullName: 'Alice Johnson', email: 'alice@test.com', numberOfTickets: 2, ticketType: 'VIP' },
        { fullName: 'Bob Brown', email: 'bob@test.com', numberOfTickets: 1, ticketType: 'Regular' }
    ]);
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

  protected onViewTickets(): void { }

 protected onInviteGuest(): void {
    this.showInviteModal.set(true);
  }
protected onCloseInviteModal(): void {
  this.showInviteModal.set(false);
  this.inviteForm.reset(); 
}
  protected onSendInvite(): void {
    if (this.inviteForm.valid) {
      // TODO: Call API to invite user
      this.showInviteModal.set(false);
      this.inviteForm.reset({ role: 'attendee' });
    } else {
      this.inviteForm.markAllAsTouched(); 
    }
  }
  protected onInviteSuccess(): void {
    this.showInviteModal.set(false);
  }

  
  protected getStatusClass(status: string): string {
    if (!status) return 'event-status';
    return `event-status event-status--${status.toLowerCase()}`;
  }

  protected formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  protected calculateTotalRevenue(): number {
    return this.ticketTypes().reduce((total, ticket) => {
      return total + (ticket.price * ticket.sold);
    }, 0);
  }
}