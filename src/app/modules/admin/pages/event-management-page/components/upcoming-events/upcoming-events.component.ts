import { Component, input, output, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from "../../../../../../shared/ui/button/button.component";

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
  imports: [CommonModule, NgOptimizedImage, ButtonComponent],
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.scss'],
})
export class UpcomingEventsComponent {
  public readonly events = input.required<UpcomingEvent[]>();
  public readonly title = input<string>('Upcoming Events');
  public readonly showViewAll = input<boolean>(true);

  public readonly viewAllClicked = output<void>();
  public readonly eventClicked = output<UpcomingEvent>();

  public readonly hasEvents = computed<boolean>(() => this.events().length > 0);

  protected onViewAll(): void {
    this.viewAllClicked.emit();
  }

  protected onEventClick(event: UpcomingEvent): void {
    this.eventClicked.emit(event);
  }

  protected formatAttendees(count: number): string {
    return `${count} attendee${count !== 1 ? 's' : ''}`;
  }

  protected formatDate(dateString: string): string {
    return dateString;
  }

  protected trackByEvent(_index: number, event: UpcomingEvent): number {
    return event.id;
  }

  protected getStatusClass(status?: string): string {
    if (!status) return '';
    return `upcoming-events__status--${status}`;
  }

  protected hasStatus(event: UpcomingEvent): boolean {
    return !!event.status;
  }
}
