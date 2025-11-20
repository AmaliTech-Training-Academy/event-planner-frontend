import { Component, inject, signal, OnInit, computed, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LayoutService } from '../../../../core/services/layout.service';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { StatCardData, EventDetails } from '../../../../core/models/event.model';
import { MOCK_EVENT_DETAILS } from '../../../../core/data/mock-data';
import { InvitationService, InvitationPayload } from '../../../../core/services/invitation.service';

import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { DataTableComponent, TableColumn, TableFilter } from '../../../../shared/admin-ui/data-table/data-table.component';
import { ModalWrapperComponent } from '../../../../shared/components/modal-wrapper/modal-wrapper.component';
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
  private readonly _invitationService = inject(InvitationService);
  
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
    event: [null, Validators.required],  // Changed from '' to null
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
    // CRITICAL FIX: Extract event ID from URL params
    this._route.params.subscribe(params => {
      const urlEventId = params['id'];
      
      if (urlEventId) {
        // We have an ID from the URL - use it!
        const eventId = Number(urlEventId);
        this.currentEventId.set(eventId);
        console.log('Event ID from URL:', eventId);
        
        // Check if we have event data from navigation state
        const state = this._location.getState() as ManageEventPageState;
        if (state.eventData) {
          this._loadEventFromState(state.eventData, eventId);
        } else {
          // Load mock data but use the URL ID
          this._loadEventFromState(MOCK_EVENT_DETAILS, eventId);
        }
      } else {
        // Fallback: no URL param, try state or mock
        const state = this._location.getState() as ManageEventPageState;
        const fallbackId = state.eventData?.id ? Number(state.eventData.id) : 8;
        this.currentEventId.set(fallbackId);
        
        if (state.eventData) {
          this._loadEventFromState(state.eventData, fallbackId);
        } else {
          this._loadEventFromState(MOCK_EVENT_DETAILS, fallbackId);
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
    
    // Populate dropdown with the correct event
    this.availableEvents.set([
      { id: eventId, title: event.title || 'Event' }
    ]);
    
    // Pre-select the event in the form
    this.inviteForm.patchValue({ 
      event: eventId,
      role: 'ATTENDEE'
    });
    
    console.log('Event loaded with ID:', eventId);
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
    const eventId = this.currentEventId();
    if (eventId) {
      this._router.navigate(['/attendee/events/edit', eventId]);
    }
  }

  protected onViewAllGuests(): void {
    this.setActiveTab('guests');
  }

  protected onViewTickets(): void { }

  protected onInviteGuest(): void {
    const eventId = this.currentEventId();
    console.log('Opening invite modal with event ID:', eventId);
    
    if (eventId) {
      // Reset form and set the event ID
      this.inviteForm.reset();
      this.inviteForm.patchValue({ 
        event: eventId,
        role: 'ATTENDEE'
      });
      console.log('Form after patch:', this.inviteForm.value);
    } else {
      console.warn('No event ID available when opening invite modal');
    }
    
    this.showInviteModal.set(true);
    this._toggleBodyScroll(true);
  }

  protected onCloseInviteModal(): void {
    this.showInviteModal.set(false);
    const eventId = this.currentEventId();
    this.inviteForm.reset({ 
      role: 'ATTENDEE',
      event: eventId || ''
    });
    this._toggleBodyScroll(false);
  }

  protected onSendInvite(): void {
    if (this.inviteForm.valid) {
      this._submitInvitation('SEND');
    } else {
      console.error('Form is invalid:', this.inviteForm.errors);
      console.error('Form values:', this.inviteForm.value);
      console.error('Form control errors:', {
        title: this.inviteForm.get('title')?.errors,
        name: this.inviteForm.get('name')?.errors,
        email: this.inviteForm.get('email')?.errors,
        event: this.inviteForm.get('event')?.errors,
        role: this.inviteForm.get('role')?.errors,
      });
      this.inviteForm.markAllAsTouched(); 
    }
  }

  protected onSaveInvite(): void {
    if (this.inviteForm.valid) {
      this._submitInvitation('SAVE');
    } else {
      console.error('Form is invalid:', this.inviteForm.errors);
      console.error('Form values:', this.inviteForm.value);
      console.error('Form control errors:', {
        title: this.inviteForm.get('title')?.errors,
        name: this.inviteForm.get('name')?.errors,
        email: this.inviteForm.get('email')?.errors,
        event: this.inviteForm.get('event')?.errors,
        role: this.inviteForm.get('role')?.errors,
      });
      this.inviteForm.markAllAsTouched();
    }
  }

  private _submitInvitation(status: 'SAVE' | 'SEND'): void {
    const formData = this.inviteForm.value;
    this.isSubmitting.set(true);

    const selectedEventId = Number(formData.event);

    const payload: InvitationPayload = {
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

    console.log('Submitting Invitation Payload:', payload);
    console.log('Event ID being sent:', payload.event);

    this._invitationService.sendInvitation(payload).subscribe({
      next: (res) => {
        console.log('Invitation sent successfully:', res);
        this.isSubmitting.set(false);
        this._handleSuccess(status);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('API Error:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error
        });
        
        if (err.status === 0) {
           alert('Connection blocked by Browser (CORS). Please use a CORS extension or contact backend to whitelist your domain.');
        } else {
           alert(`Failed to send invitation. Error: ${err.statusText || 'Unknown error'}`); 
        }
      }
    });
  }

  private _handleSuccess(status: string): void {
    this.showInviteModal.set(false);
    
    const eventId = this.currentEventId();
    this.inviteForm.reset({ 
      role: 'ATTENDEE',
      event: eventId || ''
    });

    if (status === 'SEND') {
      this.showSuccessModal.set(true);
      setTimeout(() => {
        this.showSuccessModal.set(false);
        this._toggleBodyScroll(false);
      }, 3000);
    } else {
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