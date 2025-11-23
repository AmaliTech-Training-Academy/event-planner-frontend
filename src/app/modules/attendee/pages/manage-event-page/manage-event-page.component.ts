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
import { UserBackendService } from '@app/core/services/backend/user-backend.service';
import { NotificationService } from '@app/core/services/notification.service';
import { EventHost, TicketType } from '@app/core/models/events';
import { StatCardComponent } from '@app/shared/components/stat-card/stat-card.component';
import { DataTableComponent } from '@app/shared/admin-ui/data-table/data-table.component';
import { OverviewComponent } from './components/overview/overview.component';
import { GuestComponent } from './components/guest/guest.component';
import { RegistrationComponent } from './components/registration/registration.component';

export interface Registration {
  fullName: string;
  email: string;
  numberOfTickets: number;
  ticketType: string;
}

export interface InviteUserPayload {
  title?: string;
  event?: number;
  invitees: Array<{
    fullName: string;
    email: string;
    role: string;
  }>;
  message: string;
  status: 'SEND' | 'SAVE';
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
    DataTableComponent,
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
  private readonly _userBackendService = inject(UserBackendService);
  private readonly _notificationService = inject(NotificationService);


  protected readonly APP_ROUTES = APP_ROUTES;
  protected readonly isAdminView = computed(() => {
    const authContext = this._authService.getCurrentAuthContext();
    const isAdminPath = window.location.pathname.includes('/admin');
    const isAdmin = authContext === 'admin' || isAdminPath;
    console.log('🔍 isAdminView check:', { authContext, isAdminPath, isAdmin, pathname: window.location.pathname });
    return isAdmin;
  });
  protected readonly breadcrumbText = computed(() =>
    this.isAdminView() ? 'Event Management' : 'My Events'
  );

  // Signals for overview component data
  protected readonly eventOverview = signal<EventAnalyticsResponse | null>(
    null
  );
  protected readonly overviewData = signal<EventAnalyticsData | null>(null);
  protected readonly statCards = signal<readonly StatCardData[]>([]);

  protected readonly activeTab = signal<TabType>('overview');

  protected readonly availableEvents = signal<{ id: number; title: string }[]>(
    []
  );

  protected readonly currentEventId = signal<number | null>(null);
  protected readonly eventDetails = signal<EventDetails | null>(null);

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

    // Check if admin view
    const isAdmin = this.isAdminView() || window.location.pathname.includes('/admin');

    if (isAdmin) {
      // Admin: use MY_EVENT_OVERVIEW endpoint
      this._manageService.getOverviewForUser(true, eventId).subscribe({
        next: (response) => {
          this.eventOverview.set(response);
          this._prepareOverviewData(response);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load admin overview:', err);
          this.loading.set(false);
          this._notificationService.error('Failed to load overview');
        },
      });
    } else {
      // Attendee: use event-specific endpoint
      this._manageService.getOverview(eventId).subscribe({
        next: (response) => {
          this.eventOverview.set(response);
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

    if (!eventId) {
      this._notificationService.error(
        'Error: No Event ID found. Please refresh the page.'
      );
      return;
    }

    this.inviteForm.reset({
      title: '',
      name: '',
      email: '',
      message: '',
      event: eventId,
      role: 'ATTENDEE',
    });

    this.showInviteModal.set(true);
    this._toggleBodyScroll(true);
  }

  protected onCloseInviteModal(): void {
    this.showInviteModal.set(false);
    const eventId = this.currentEventId();
    this.inviteForm.reset({
      role: 'ATTENDEE',
      event: eventId || null,
    });
    this._toggleBodyScroll(false);
  }

  protected onSendInvite(): void {
    if (this.inviteForm.valid) {
      this._submitInvitation('SEND');
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

  private _submitInvitation(status: string): void {
    const formData = this.inviteForm.value;
    this.isSubmitting.set(true);

    const selectedEventId = Number(formData.event);

    if (!selectedEventId) {
      this.isSubmitting.set(false);
      this._notificationService.error('Internal Error: Event ID is missing.');
      return;
    }

    const payload: InviteUserPayload = {
      event: selectedEventId,
      title: formData.title,
      invitees: [
        {
          fullName: formData.name,
          email: formData.email,
          role: formData.role,
        },
      ],
      status: status as any,
      message: formData.message || '',
    };

    this._userBackendService.inviteUsers(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this._handleSuccess(status);
      },
      error: (err) => {
        this.isSubmitting.set(false);

        if (err.status === 0) {
          this._notificationService.error(
            'Connection blocked (CORS). Please check your network or use the CORS extension.'
          );
        } else {
          const errorMessage =
            err.error?.description ||
            err.error?.message ||
            err.statusText ||
            'Unknown error occurred';
          this._notificationService.error(`Failed to send: ${errorMessage}`);
        }
      },
    });
  }

  private _handleSuccess(status: string): void {
    this.showInviteModal.set(false);
    const eventId = this.currentEventId();

    this.inviteForm.reset({
      role: 'ATTENDEE',
      event: eventId || null,
    });

    if (status === 'SEND') {
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

  protected onEdit(): void {
    this._router.navigate([APP_ROUTES.CREATE_EVENT], {
      state: {
        eventId: this.currentEventId(),
      },
    });
  }
}
