// event-details-page.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { LayoutService } from '../../../../../../core/services/layout.service';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { APP_ROUTES } from '../../../../../../core/constants/app-routes.constants';

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
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _location = inject(Location);
  private readonly _layoutService = inject(LayoutService);
  protected readonly APP_ROUTES = APP_ROUTES;

  // Reactive signals
  protected readonly eventDetails = signal<EventDetails | null>(null);
  protected readonly hosts = signal<EventHost[]>([]);
  protected readonly activeTab = signal<TabType>('overview');

  public ngOnInit(): void {
    const state = this._location.getState() as EventDetailsPageState;
    const eventData = state.eventData;

    if (eventData) {
      this._loadEventFromState(eventData);
    } else {
      this._router.navigate([this.APP_ROUTES.ADMIN_EVENTS]);
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

  protected setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  protected onBack(): void {
    this._router.navigate([this.APP_ROUTES.ADMIN_EVENTS]);
  }

  protected onEdit(): void {
    const event = this.eventDetails();
    if (event?.id) {
      this._router.navigate([this.APP_ROUTES.ADMIN_EVENT_DETAILS, event.id]);
    }
  }

  protected onSendInvites(): void {
    // TODO: Implement send invites functionality
  }

  protected onViewAllGuests(): void {
    this.setActiveTab('guests');
  }

  protected onScheduleFeedback(): void {
    // TODO: Implement schedule feedback functionality
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
