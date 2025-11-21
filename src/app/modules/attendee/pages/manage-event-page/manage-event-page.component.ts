import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { MOCK_EVENT_DETAILS } from '../../../../core/data/mock-data';
import {
  EventDetails,
  StatCardData,
} from '../../../../core/models/event.model';
import { AuthService } from '../../../../core/services/auth.service';
import {
  InvitationPayload,
  InvitationService,
} from '../../../../core/services/invitation.service';
import { LayoutService } from '../../../../core/services/layout.service';

import { MANAGE_EVENT_ANALYTIC } from '@app/core/constants/manage-event.contant';
import {
  EventAnalyticsResponse,
  EventAnalyticsData,
} from '@app/core/models/manage-events';
import { ManageEventService } from '@app/core/services/manage-event.service';
import { LoadingCardComponent } from '@app/shared/components/loading-card/loading-card.component';
import { take } from 'rxjs';
import { ModalWrapperComponent } from '../../../../shared/components/modal-wrapper/modal-wrapper.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { GuestComponent } from './components/guest/guest.component';
import { OverviewComponent } from './components/overview/overview.component';
import { RegistrationComponent } from './components/registration/registration.component';

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
    OverviewComponent,
    GuestComponent,
    RegistrationComponent,
    LoadingCardComponent,
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
  private readonly _manageService = inject(ManageEventService);
  private readonly _authService = inject(AuthService);

  protected readonly APP_ROUTES = APP_ROUTES;
  protected readonly isAdminView = computed(
    () => this._authService.getCurrentAuthContext() === 'admin'
  );
  protected readonly breadcrumbText = computed(() =>
    this.isAdminView() ? 'Event Management' : 'My Events'
  );

  // Signals for overview component data
  protected readonly eventOverview = signal<EventAnalyticsResponse | null>(
    null
  );
  protected readonly overviewData = signal<EventAnalyticsData | null>(null);
  protected readonly statCards = signal<readonly StatCardData[]>([]);

  protected readonly eventDetails = signal<EventDetails | null>(null);
  protected readonly activeTab = signal<TabType>('overview');

  protected readonly availableEvents = signal<{ id: number; title: string }[]>(
    []
  );
  protected readonly currentEventId = signal<number | null>(null);

  protected readonly showInviteModal = signal<boolean>(false);
  protected readonly showSuccessModal = signal<boolean>(false);
  protected readonly isSubmitting = signal<boolean>(false);

  protected loading = signal<boolean>(true);

  protected inviteForm: FormGroup = this._fb.group({
    title: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    event: [null, Validators.required],
    role: ['ATTENDEE', Validators.required],
    message: [''],
  });

  public ngOnInit(): void {
    const urlEventId = this._route.snapshot.paramMap.get('id');

    if (!urlEventId) {
      this._router.navigate([APP_ROUTES.MY_EVENTS]);
    } else {
      const eventId = Number(urlEventId);
      this.currentEventId.set(eventId);

      this.getOverview();

      const state = this._location.getState() as ManageEventPageState;
      if (state.eventData) {
        this._loadEventFromState(state.eventData, eventId);
      } else {
        this._loadEventFromState(MOCK_EVENT_DETAILS, eventId);
      }
    }
  }

  private getOverview(): void {
    const eventId = this.currentEventId();
    if (!eventId) return;

    this.loading.set(true);
    this._manageService.getOverview(eventId).subscribe({
      next: (response) => {
        this.eventOverview.set(response);
        // Transform the response data for the overview component
        this._prepareOverviewData(response);
      },
      complete: () => {
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load overview:', err);
        this.loading.set(false);
      },
    });
  }

  // Transform API response to match OverviewComponent's expected format
  private _prepareOverviewData(response: EventAnalyticsResponse): void {
    if (!response?.data) {
      console.warn('No data in response');
      this.overviewData.set(null);
      this.statCards.set([]);
      return;
    }

    const data = response.data;

    // Set the overview data directly - the component expects EventAnalyticsData
    this.overviewData.set(data);

    // Create stat cards from the analytics data
    const statCardsData: StatCardData[] = [];

    // Check if eventStats exists before accessing it
    if (data.eventStats) {
      // Add stat cards based on eventStats
      if (data.eventStats.totalAttendees !== undefined) {
        statCardsData.push({
          title: 'Total Attendees',
          value: data.eventStats.totalAttendees.toString(),
          icon: '/icons/users-icon.png',
          trend: 'up',
          trendValue: '12%',
        });
      }

      // Fixed: Changed from totalTicketsSold to totalTicketSales
      if (data.eventStats.totalTicketSales !== undefined) {
        statCardsData.push({
          title: 'Tickets Sold',
          value: data.eventStats.totalTicketSales.toString(),
          icon: '/icons/ticket.svg',
          trend: 'up',
          trendValue: '8%',
        });
      }

      // Note: totalRevenue doesn't exist in ManageEventStats interface
      // Remove this block or add totalRevenue to your interface if needed
      // if (data.eventStats.totalRevenue !== undefined) {
      //   statCardsData.push({
      //     title: 'Revenue',
      //     value: `${data.eventStats.totalRevenue.toFixed(2)}`,
      //     icon: '/icons/revenue.svg',
      //     trend: 'up',
      //     trendValue: '15%',
      //   });
      // }
    } else {
      // Fallback: Use alternative data sources if eventStats doesn't exist
      if (data.totalInvitedGuests !== undefined) {
        statCardsData.push({
          title: 'Total Guests',
          value: data.totalInvitedGuests.toString(),
          icon: '/icons/users-icon.png',
          trend: 'up',
          trendValue: '12%',
        });
      }

      if (data.ticketTypes?.length) {
        const totalSold = data.ticketTypes.reduce(
          (sum, ticket) => sum + (ticket.soldTickets || 0),
          0
        );
        const totalRemaining = data.ticketTypes.reduce(
          (sum, ticket) => sum + (ticket.remainingTickets || 0),
          0
        );

        statCardsData.push({
          title: 'Tickets Sold',
          value: totalSold.toString(),
          icon: '/icons/ticket.svg',
          trend: 'up',
          trendValue: '8%',
        });

        statCardsData.push({
          title: 'Tickets Available',
          value: totalRemaining.toString(),
          icon: '/icons/ticket.svg',
          trend: 'neutral',
          trendValue: '',
        });
      }
    }

    // Log for debugging
    console.log('Prepared overview data:', data);
    console.log('Prepared stat cards:', statCardsData);

    this.statCards.set(statCardsData);
  }

  public ngOnDestroy(): void {
    this._toggleBodyScroll(false);
  }

  private _loadEventFromState(eventData: EventDetails, eventId: number): void {
    const event: EventDetails = { ...eventData, id: eventId.toString() };
    this.eventDetails.set(event);
    this._loadTicketsAndHosts(event);
    this._layoutService.pageTitle.set(event.title);

    this.availableEvents.set([{ id: eventId, title: event.title || 'Event' }]);

    this.inviteForm.patchValue({
      event: eventId,
      role: 'ATTENDEE',
    });
  }

  private _loadTicketsAndHosts(event: EventDetails): void {
    // Load additional data if needed
  }

  protected setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  protected onBack(): void {
    const route = this.isAdminView()
      ? APP_ROUTES.EVENT_MANAGEMENT
      : APP_ROUTES.MY_EVENTS;
    this._router.navigate([route]);
  }

  protected onViewAllGuests(): void {
    this.setActiveTab('guests');
  }

  protected onViewTickets(): void {
    // Implement ticket view logic
  }

  protected onInviteGuest(): void {
    const eventId = this.currentEventId();
    console.log('Opening invite modal with event ID:', eventId);

    if (eventId) {
      // Reset form and set the event ID
      this.inviteForm.reset();
      this.inviteForm.patchValue({
        event: eventId,
        role: 'ATTENDEE',
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
      event: eventId || '',
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
          role: formData.role,
        },
      ],
      event: selectedEventId,
      status: status,
      message: formData.message || '',
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
          error: err.error,
        });

        if (err.status === 0) {
          alert(
            'Connection blocked by Browser (CORS). Please use a CORS extension or contact backend to whitelist your domain.'
          );
        } else {
          alert(
            `Failed to send invitation. Error: ${
              err.statusText || 'Unknown error'
            }`
          );
        }
      },
    });
  }

  private _handleSuccess(status: string): void {
    this.showInviteModal.set(false);

    const eventId = this.currentEventId();
    this.inviteForm.reset({
      role: 'ATTENDEE',
      event: eventId || '',
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

  protected onEdit(): void {
    this._router.navigate([APP_ROUTES.CREATE_EVENT], {
      state: {
        eventId: this.currentEventId(),
      },
    });
  }
}
