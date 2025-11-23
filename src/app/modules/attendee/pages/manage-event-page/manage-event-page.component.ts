import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { MOCK_EVENT_DETAILS } from '../../../../core/data/mock-data';
import { EventDetails, StatCardData, TicketType } from '../../../../core/models/event.model';
import { LayoutService } from '../../../../core/services/layout.service';

import { MANAGE_EVENT_ANALYTIC } from '@app/core/constants/manage-event.contant';
import { UserRole } from '@app/core/models';
import { EventHost } from '@app/core/models/events';
import { EventAnalyticsResponse } from '@app/core/models/manage-events';
import { UserBackendService } from '@app/core/services/backend/user-backend.service';
import { ManageEventService } from '@app/core/services/manage-event.service';
import { NotificationService } from '@app/core/services/notification.service';
import { LoadingCardComponent } from "@app/shared/components/loading-card/loading-card.component";
import { take } from 'rxjs';
import { ModalWrapperComponent } from '../../../../shared/components/modal-wrapper/modal-wrapper.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { GuestComponent } from "./components/guest/guest.component";
import { OverviewComponent } from "./components/overview/overview.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { number } from 'echarts';



export interface Registration {
  fullName: string;
  email: string;
  numberOfTickets: number;
  ticketType: string;
}
export interface InviteUserPayload {
  invitationTitle: string;
  event: number;
  invitees: Array<{
    inviteeName: string;
    inviteeEmail: string;
    role: UserRole;
  }>;
  message: string;
  status: string;
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
    LoadingCardComponent
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

  protected readonly availableEvents = signal<{ id: number, title: string }[]>([]);
  protected readonly currentEventId = signal<number | null>(null);
  private readonly _manageService = inject(ManageEventService);

  protected readonly eventOverview = signal<EventAnalyticsResponse | null>(null)

  protected readonly showInviteModal = signal<boolean>(false);
  protected readonly showSuccessModal = signal<boolean>(false);
  protected readonly isSubmitting = signal<boolean>(false);


  protected loading = signal<boolean>(true)

  protected inviteForm: FormGroup = this._fb.group({
    title: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    event: [null, Validators.required],
    role: ['ATTENDEE', Validators.required],
    message: ['']
  });

  @ViewChild(GuestComponent) invitees!: GuestComponent;

  protected readonly statCards = computed<readonly StatCardData[]>(() => {
    const eventoverview = this.eventOverview();
    if (!eventoverview) return MANAGE_EVENT_ANALYTIC;

    return MANAGE_EVENT_ANALYTIC.map(item => ({
      ...item,
      value: eventoverview.data.eventStats[item.backend_key]
    }));
  });

  public ngOnInit(): void {
    this._route.params.pipe(take(1)).subscribe(params => {
      const urlEventId = params['id'];

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
    });
  }

  private prePopulateEventFields(title: string, id: number) {
    this.inviteForm.patchValue({
      title: title,
      event: number
    })
  }

  private getOverview() {
    const eventId = this.currentEventId();
    if (!eventId) return;
    this.loading.set(true);
    this._manageService.getOverview(eventId).subscribe({
      next: (response) => {
        this.eventOverview.set(response);
        this.prePopulateEventFields(response.data.eventSummary?.title || '', eventId)
      },
      complete: () => {
        this.loading.set(false)
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


    this.inviteForm.patchValue({
      event: eventId,
      role: 'ATTENDEE'
    });
  }

  private _loadTicketsAndHosts(event: EventDetails): void {

  }

  protected setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  protected onBack(): void {
    this._router.navigate([APP_ROUTES.MY_EVENTS]);
  }

  protected onViewAllGuests(): void {
    this.setActiveTab('guests');
  }

  protected onViewTickets(): void { }

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


    let selectedEventId = Number(formData.event);
    if (!selectedEventId || isNaN(selectedEventId)) {
      console.warn('Form ID missing, using Signal ID fallback');
      selectedEventId = this.currentEventId() || 0;
    }

    if (!selectedEventId) {
      this.isSubmitting.set(false);
      this._notificationService.error('Internal Error: Event ID is missing.');
      return;
    }


    const payload: InviteUserPayload = {
      invitationTitle: formData.title,
      event: selectedEventId,
      invitees: [
        {
          inviteeName: formData.name,
          inviteeEmail: formData.email,
          role: formData.role
        }
      ],
      status: status,
      message: formData.message || ''
    };


    this._userBackendService.inviteUsers(payload as any).subscribe({
      next: () => {
        const roleValue = payload.invitees[0].role;
        this.isSubmitting.set(false);
        this._handleSuccess(status);
        this.invitees.addInvitee({
          id: 0,
          inviteeEmail: payload.invitees[0].inviteeEmail,
          inviteeName: payload.invitees[0].inviteeName,
          role: roleValue
        })
      },
      error: (err) => {
        this.isSubmitting.set(false);

        if (err.status === 0) {
          this._notificationService.error('Connection blocked (CORS). Please check your network or use the CORS extension.');
        } else {
          const errorMessage = err.error?.description || err.error?.message || err.statusText || 'Unknown error occurred';
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

    if (status === 'SEND') {
      this._notificationService.success('Invitation sent successfully.');

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
    this._router.navigate([APP_ROUTES.EDIT_EVENT((this.currentEventId()||0).toString())], {
      state: {
        eventId: this.currentEventId()
      }
    })
  }
}