import { Component, inject, signal, OnInit, computed, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LayoutService } from '../../../../core/services/layout.service';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { StatCardData, EventDetails } from '../../../../core/models/event.model';
import { MOCK_EVENT_DETAILS } from '../../../../core/data/mock-data';

import { UserBackendService } from '../../../../core/services/backend/user-backend.service';
import { InviteUserPayload } from '../../../../core/models/index'; 
import { NotificationService } from '../../../../core/services/notification.service';

import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { DataTableComponent, TableColumn, TableFilter } from '../../../../shared/admin-ui/data-table/data-table.component';
import { ModalWrapperComponent } from '../../../../shared/components/modal-wrapper/modal-wrapper.component';
import { EventHost } from '../../../admin/pages/event-management-page/components/event-details/event-details.component';

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
    ReactiveFormsModule,
    ModalWrapperComponent,
    ButtonComponent,
    StatCardComponent,
    DataTableComponent
  ],
  templateUrl: './manage-event-page.component.html',
  styleUrls: ['./manage-event-page.component.scss'],
})
export class ManageEventPageComponent implements OnInit, OnDestroy {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _location = inject(Location);
  private readonly _layoutService = inject(LayoutService);
  private readonly _userBackendService = inject(UserBackendService);
  private readonly _notificationService = inject(NotificationService);

  protected readonly APP_ROUTES = APP_ROUTES;

  protected readonly eventDetails = signal<EventDetails | null>(null);
  protected readonly ticketTypes = signal<TicketType[]>([]);
  protected readonly hosts = signal<EventHost[]>([]);
  protected readonly activeTab = signal<TabType>('overview');
  public readonly registrations = signal<Registration[]>([]);
  
  protected readonly availableEvents = signal<{id: number, title: string}[]>([]);
  protected readonly currentEventId = signal<number | null>(null);

  protected readonly showInviteModal = signal<boolean>(false);
  protected readonly showSuccessModal = signal<boolean>(false);
  protected readonly isSubmitting = signal<boolean>(false);

  protected inviteForm: FormGroup = this._fb.group({
    title: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    event: [null, Validators.required],
    role: ['ATTENDEE', Validators.required],
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
      { title: 'Attendees', value: event.attendees || 0, icon: '/icons/users-icon.png' },
      { title: 'Total Tickets Sold', value: `$${totalRevenue.toFixed(2)}`, icon: '/icons/ticket.svg' }
    ];
  });

  public ngOnInit(): void {
    this._route.params.subscribe(params => {
      const urlEventId = params['id']; 
      
      if (urlEventId) {
        const eventId = Number(urlEventId);
        this.currentEventId.set(eventId);
        
        const state = this._location.getState() as ManageEventPageState;
        if (state.eventData) {
          this._loadEventFromState(state.eventData, eventId);
        } else {
          this._loadEventFromState(MOCK_EVENT_DETAILS, eventId);
        }
      }
    });
  }

  public ngOnDestroy(): void {
    this._toggleBodyScroll(false);
  }

  private _loadEventFromState(eventData: EventDetails, eventId: number): void {
    const event: EventDetails = { ...eventData, id: eventId.toString() };
    this.eventDetails.set(event);
    this._loadTicketsAndHosts(event);
    this._layoutService.pageTitle.set(event.title);
    
    this.availableEvents.set([
      { id: eventId, title: event.title || 'Current Event' }
    ]);
    
    this.inviteForm.patchValue({ event: eventId });
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
    this._router.navigate([this.APP_ROUTES.MY_EVENTS]);
  }

  protected onEdit(): void {
    const eventId = this.currentEventId();
    if (eventId) {
      this._router.navigate([this.APP_ROUTES.CREATE_EVENT, eventId]);
    }
  }

  protected onViewAllGuests(): void {
    this.setActiveTab('guests');
  }

  protected onViewTickets(): void {}

  protected onInviteGuest(): void {
    const eventId = this.currentEventId();
    
    if (!eventId) {
      this._notificationService.error('Error: No Event ID found. Please refresh the page.');
      return;
    }

    this.inviteForm.reset({
      title: '',
      name: '',
      email: '',
      message: '',
      event: eventId,
      role: 'ATTENDEE'
    });
    
    this.showInviteModal.set(true);
    this._toggleBodyScroll(true);
  }

  protected onCloseInviteModal(): void {
    this.showInviteModal.set(false);
    const eventId = this.currentEventId();
    this.inviteForm.reset({ 
      role: 'ATTENDEE',
      event: eventId || null 
    });
    this._toggleBodyScroll(false);
  }

  protected onSendInvite(): void {
    if (this.inviteForm.valid) {
      this._submitInvitation('SENT');
    } else {
      this.inviteForm.markAllAsTouched(); 
    }
  }

  protected onSaveInvite(): void {
    if (this.inviteForm.valid) {
      this._submitInvitation('SAVE');
    } else {
      this.inviteForm.markAllAsTouched();
    }
  }

  private _submitInvitation(status: 'SAVE' | 'SENT'): void {
    const formData = this.inviteForm.value;
    this.isSubmitting.set(true);

    const selectedEventId = Number(formData.event);

    if (!selectedEventId) {
      this.isSubmitting.set(false);
      this._notificationService.error('Internal Error: Event ID is missing.');
      return;
    }

    const payload: InviteUserPayload = {
      invitationTitle: formData.title,
      invitees: [
        {
          inviteeName: formData.name,
          inviteeEmail: formData.email,
          role: formData.role 
        }
      ],
      event: selectedEventId, 
      status: status,
      message: formData.message || ''
    };

    
    this._userBackendService.inviteUsers(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this._handleSuccess(status);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        
        if (err.status === 0) {
           this._notificationService.error('Connection blocked (CORS). Please check your network or use the CORS extension.');
        } else {
           const errorMessage = err.error?.message || err.statusText || 'Unknown error occurred';
           this._notificationService.error(`Failed to send: ${errorMessage}`); 
        }
      }
    });
  }

  private _handleSuccess(status: string): void {
    this.showInviteModal.set(false);
    const eventId = this.currentEventId();
    
    this.inviteForm.reset({ 
      role: 'ATTENDEE',
      event: eventId || null
    });

    if (status === 'SENT') {
      this._notificationService.success('Invitation sent successfully!');
      
      this.showSuccessModal.set(true);
      setTimeout(() => {
        this.showSuccessModal.set(false);
        this._toggleBodyScroll(false);
      }, 3000);
    } else {
      this._notificationService.success('Invitation draft saved successfully.');
      this._toggleBodyScroll(false);
    }
  }

  protected onCloseSuccessModal(): void {
    this.showSuccessModal.set(false);
    this._toggleBodyScroll(false);
  }

  private _toggleBodyScroll(lock: boolean): void {
    const body = document.body;
    body.style.overflow = lock ? 'hidden' : '';
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