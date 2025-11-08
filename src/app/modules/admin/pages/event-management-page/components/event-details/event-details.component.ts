// event-details-page.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { LayoutService } from '../../../../../../core/services/layout.service';

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

export interface EventHost {
  name: string;
  email: string;
  avatar?: string;
}

@Component({
  selector: 'app-event-details-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsPageComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _location = inject(Location);
  private readonly _layoutService = inject(LayoutService);

  // Signals
  public readonly eventDetails = signal<EventDetails | null>(null);
  public readonly hosts = signal<EventHost[]>([]);
  public readonly activeTab = signal<'overview' | 'guests' | 'registration'>(
    'overview'
  );

  ngOnInit(): void {
    // Access state from history/location
    const state = this._location.getState() as any;
    const eventData = state?.eventData;

    if (eventData) {
      this._loadEventFromState(eventData);
    } else {
      // Fallback: For direct URL access or page refresh
      // TODO: In future PR, fetch from API/service
      console.warn('No event data in state. Redirecting back to events list.');
      this._router.navigate(['/admin/events']);
    }
  }

  private _loadEventFromState(eventData: any): void {
    // Add default time and location if not present
    const event: EventDetails = {
      ...eventData,
      time: eventData.time || '09:00am GMT',
      location: eventData.location || 'Virtual (Zoom meeting)',
      description: eventData.description || 'Event description coming soon.',
    };

    // Create host based on organizer
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

  public setActiveTab(tab: 'overview' | 'guests' | 'registration'): void {
    this.activeTab.set(tab);
  }

  public onBack(): void {
    this._router.navigate(['/admin/events']);
  }

  public onEdit(): void {
    const event = this.eventDetails();
    if (event) {
      this._router.navigate(['/admin/events', event.id, 'edit']);
    }
  }

  public onSendInvites(): void {
    console.log('Send invites via email');
    // TODO: Implement send invites functionality
  }

  public onViewAllGuests(): void {
    this.setActiveTab('guests');
  }

  public onScheduleFeedback(): void {
    console.log('Schedule feedback email');
    // TODO: Implement schedule feedback functionality
  }

  public getStatusClass(status: string): string {
    return `event-status event-status--${status.toLowerCase()}`;
  }

  public formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  public getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
