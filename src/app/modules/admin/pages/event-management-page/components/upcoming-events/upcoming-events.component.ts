import { Component, input, output } from '@angular/core';
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
  public events = input.required<UpcomingEvent[]>();
  public title = input<string>('Upcoming Events');
  public showViewAll = input<boolean>(true);

  public viewAllClicked = output<void>();
  public eventClicked = output<UpcomingEvent>();

  public onViewAll(): void {
    this.viewAllClicked.emit();
  }

  public onEventClick(event: UpcomingEvent): void {
    this.eventClicked.emit(event);
  }

  public formatAttendees(count: number): string {
    return `${count} attendee${count !== 1 ? 's' : ''}`;
  }
}
