import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  attendeeCount: number;
  status?: 'upcoming' | 'ongoing' | 'past';
}

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.scss'],
})
export class UpcomingEventsComponent {
  // Inputs
  public events = input.required<UpcomingEvent[]>();
  public title = input<string>('Upcoming Events');
  public showViewAll = input<boolean>(true);

  // Outputs
  public viewAllClicked = output<void>();
  public eventClicked = output<UpcomingEvent>();

  // Computed
  public hasEvents = computed<boolean>(() => this.events().length > 0);

  /**
   * Handles view all button click
   */
  public onViewAll(): void {
    this.viewAllClicked.emit();
  }

  /**
   * Handles event card click
   */
  public onEventClick(event: UpcomingEvent): void {
    this.eventClicked.emit(event);
  }

  /**
   * Formats attendee count with proper pluralization
   */
  public formatAttendees(count: number): string {
    return `${count} attendee${count !== 1 ? 's' : ''}`;
  }

  /**
   * Formats date string for display
   */
  public formatDate(dateString: string): string {
    return dateString;
  }

  /**
   * TrackBy function for performance optimization
   */
  public trackByEvent(_index: number, event: UpcomingEvent): number {
    return event.id;
  }

  /**
   * Gets status badge class based on event status
   */
  public getStatusClass(status?: string): string {
    if (!status) return '';
    return `upcoming-events__status--${status}`;
  }

  /**
   * Checks if event has a status
   */
  public hasStatus(event: UpcomingEvent): boolean {
    return !!event.status;
  }
}
