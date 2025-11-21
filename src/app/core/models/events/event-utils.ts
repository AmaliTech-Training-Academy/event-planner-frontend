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
    name: response.title,
    title: response.title,
    organizer: response.organizer || '',
    date: response.startTime || '',
    attendees: response.attendeeCount || 0,
    totalTicketsSold: 0, // Remove response.ticketsSold - set default or get from correct property
    ticketRevenue: 0, // Remove response.revenue - set default or get from correct property
    status: response.status as EventStatus,
    location: response.location,
    description: response.description,
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
    name: event.title,
    title: event.title,
    organizer: '',
    date: event.startTime,
    attendees: event.attendeeCount,
    totalTicketsSold: 0,
    ticketRevenue: 0,
    status: (event.status as EventStatus) || 'DRAFT', // Add this line
    location: 'TBD',
    description: '',
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
