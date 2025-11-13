// event-details-page.component.ts
import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { LayoutService } from '../../../../../../core/services/layout.service';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { APP_ROUTES } from '../../../../../../core/constants/app-routes.constants';
import { EventBackendService } from '../../../../../../core/services/backend/event-backend.service';
import { EventDetailResponse } from '../../../../../../core/models/event.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

// ✅ Component-specific EventDetails with all display properties
export interface EventDetails {
  id: number;
  name: string;
  organizer: string;
  date: string;
  attendees: number;
  status: 'Pending' | 'Completed' | 'Draft' | 'Active' | 'Cancelled';
  time?: string;
  location?: string;
  description?: string;
}

interface EventDetailsPageState {
  eventData?: EventDetails;
}

export interface EventHost {
  name: string;
  email: string;
  avatar?: string;
}

type TabType = 'overview' | 'guests' | 'registration';

@Component({
  selector: 'app-event-details-page',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ButtonComponent],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsPageComponent implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _location = inject(Location);
  private readonly _layoutService = inject(LayoutService);
  private readonly _eventBackendService = inject(EventBackendService);
  protected readonly APP_ROUTES = APP_ROUTES;

  // Reactive signals
  protected readonly eventDetails = signal<EventDetails | null>(null);
  protected readonly hosts = signal<EventHost[]>([]);
  protected readonly activeTab = signal<TabType>('overview');
  protected readonly isLoading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

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
    };

    const host: EventHost = {
      name: event.organizer,
      email: `${event.organizer
        .toLowerCase()
        .replace(/\s+/g, '.')}@example.com`,
    };

    this.eventDetails.set(event);
    this.hosts.set([host]);
    this._layoutService.pageTitle.set(event.name);
  }

  private _loadEventFromBackend(eventId: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this._eventBackendService.getEventDetails(eventId).subscribe({
      next: (response) => {
        // ✅ Map EventDetailResponse to component EventDetails
        const event = this._mapResponseToEventDetails(response.data);

        const host: EventHost = {
          name: event.organizer,
          email: `${event.organizer
            .toLowerCase()
            .replace(/\s+/g, '.')}@example.com`,
        };

        this.eventDetails.set(event);
        this.hosts.set([host]);
        this._layoutService.pageTitle.set(event.name);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load event details:', err);
        this.error.set('Failed to load event details');
        this.isLoading.set(false);
      },
    });
  }

  // ✅ Map EventDetailResponse to component EventDetails
  private _mapResponseToEventDetails(
    apiEvent: EventDetailResponse
  ): EventDetails {
    return {
      id: apiEvent.id,
      name: apiEvent.title,
      organizer: apiEvent.organizer,
      date: new Date(apiEvent.startTime).toISOString().split('T')[0],
      attendees: apiEvent.attendeeCount,
      status: this._mapBackendStatus(apiEvent.status),
      time: new Date(apiEvent.startTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      }),
      location: apiEvent.location || 'Virtual (Zoom meeting)',
      description: apiEvent.description || 'Event description coming soon.',
    };
  }

  private _mapBackendStatus(
    status: string
  ): 'Pending' | 'Completed' | 'Draft' | 'Active' | 'Cancelled' {
    const statusMap: Record<
      string,
      'Pending' | 'Completed' | 'Draft' | 'Active' | 'Cancelled'
    > = {
      ACTIVE: 'Active',
      DRAFT: 'Draft',
      COMPLETED: 'Completed',
      CANCELED: 'Cancelled',
    };
    return statusMap[status] || 'Pending';
  }

  protected setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  protected onBack(): void {
    this._router.navigate([this.APP_ROUTES.ADMIN_EVENTS]);
  }

  // ✅ FIXED: Add null check before accessing event properties
  protected onEdit(): void {
    const event = this.eventDetails();
    if (!event) {
      console.warn('Cannot edit: Event details not loaded yet');
      return;
    }

    if (event.id) {
      // Navigate to edit page (adjust route as needed)
      this._router.navigate([
        this.APP_ROUTES.ADMIN_EVENT_DETAILS,
        event.id,
        'edit',
      ]);
    }
  }

  protected onSendInvites(): void {
    const event = this.eventDetails();
    if (!event) {
      console.warn('Cannot send invites: Event details not loaded');
      return;
    }
    // TODO: Implement send invites functionality
    console.log('Send invites for event:', event.id);
  }

  protected onViewAllGuests(): void {
    this.setActiveTab('guests');
  }

  protected onScheduleFeedback(): void {
    const event = this.eventDetails();
    if (!event) {
      console.warn('Cannot schedule feedback: Event details not loaded');
      return;
    }
    // TODO: Implement schedule feedback functionality
    console.log('Schedule feedback for event:', event.id);
  }

  protected getStatusClass(status: string): string {
    return `event-status event-status--${status.toLowerCase()}`;
  }

  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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
}
