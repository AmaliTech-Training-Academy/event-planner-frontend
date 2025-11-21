import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { MOCK_EVENT_DETAILS } from '../../../../core/data/mock-data';
import { EventDetails, StatCardData } from '../../../../core/models/event.model';
import { InvitationPayload, InvitationService } from '../../../../core/services/invitation.service';
import { LayoutService } from '../../../../core/services/layout.service';

import { MANAGE_EVENT_ANALYTIC } from '@app/core/constants/manage-event.contant';
import { EventAnalyticsResponse } from '@app/core/models/manage-events';
import { ManageEventService } from '@app/core/services/manage-event.service';
import { LoadingCardComponent } from "@app/shared/components/loading-card/loading-card.component";
import { take } from 'rxjs';
import { DataTableComponent } from '../../../../shared/admin-ui/data-table/data-table.component';
import { ModalWrapperComponent } from '../../../../shared/components/modal-wrapper/modal-wrapper.component';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { GuestComponent } from "./components/guest/guest.component";
import { OverviewComponent } from "./components/overview/overview.component";
import { RegistrationComponent } from "./components/registration/registration.component";


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
    DataTableComponent,
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
  private readonly _invitationService = inject(InvitationService);
  private readonly _manageService = inject(ManageEventService);

  protected readonly APP_ROUTES = APP_ROUTES;

  protected readonly eventOverview = signal<EventAnalyticsResponse | null>(null)

  protected readonly eventDetails = signal<EventDetails | null>(null);
  protected readonly activeTab = signal<TabType>('overview');


  protected readonly availableEvents = signal<{ id: number, title: string }[]>([]);
  protected readonly currentEventId = signal<number | null>(null);

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
        this._router.navigate([APP_ROUTES.MY_EVENTS])
      }
      else {
        const eventId = Number(urlEventId);
        this.currentEventId.set(eventId);

        this.getOverview()


        const state = this._location.getState() as ManageEventPageState;
        if (state.eventData) {
          this._loadEventFromState(state.eventData, eventId);
        } else {

          this._loadEventFromState(MOCK_EVENT_DETAILS, eventId);
        }
      }
    });
  }


  private getOverview() {
    const eventId = this.currentEventId()
    if (!eventId) return;
    this.loading.set(true)
    this._manageService.getOverview(eventId).subscribe({
      next: (response) => {
        this.eventOverview.set(response)
      },
      complete : ()=>{
        this.loading.set(false)
      }
    })
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
      { id: eventId, title: event.title || 'Event' }
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
 protected onEdit(): void {
    this._router.navigate([APP_ROUTES.CREATE_EVENT],{
      state : {
        eventId:this.currentEventId()
      }
    })
  }

}