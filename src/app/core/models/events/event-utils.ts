import { EventStatus } from './event-status.model';
import { Event } from './event.model';
import { EventManagement } from './event-management.model';
import { EventDetails } from './event-details.model';
import { EventCard } from './event-card.model';
import { EventDetailResponse } from './event-details-response.model';

export function mapEventDetailResponseToEventDetails(
  response: EventDetailResponse
): EventDetails {
  return {
    id: response.id.toString(),
    title: response.title,
    date: response.startTime,
    startDate: new Date(response.startTime),
    location: response.location,
    heroImageUrl: response.heroImageUrl || response.imageUrl || '',
    isPaid: response.isPaid,
    description: response.description,
    attendeesCount: response.attendeeCount.toString(),
  };
}

export function mapEventToEventCard(event: Event): EventCard {
  return {
    id: event.id.toString(),
    title: event.title,
    date: new Date(event.startTime),
    location: event.location,
    imageUrl: event.imageUrl || '',
    isPaid: event.isPaid,
    attendees: event.attendeeCount,
  };
}

export function mapEventManagementToEventCard(
  event: EventManagement
): EventCard {
  return {
    id: event.id.toString(),
    title: event.title,
    date: new Date(event.startTime),
    location: 'TBD',
    imageUrl: '',
    isPaid: false,
    attendees: event.attendeeCount,
  };
}

export function mapEventManagementToEventDetails(
  event: EventManagement
): EventDetails {
  return {
    id: event.id.toString(),
    title: event.title,
    date: event.startTime,
    startDate: new Date(event.startTime),
    location: 'TBD',
    heroImageUrl: '',
    isPaid: false,
    description: '',
    attendeesCount: event.attendeeCount.toString(),
  };
}

export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getEventStatusClass(status: EventStatus): string {
  const statusClasses: Record<EventStatus, string> = {
    ACTIVE: 'status-active',
    DRAFT: 'status-draft',
    COMPLETED: 'status-completed',
    CANCELED: 'status-canceled',
  };
  return statusClasses[status] || 'status-default';
}
