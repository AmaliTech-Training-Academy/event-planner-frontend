export interface UpcomingEvent {
  id: number;
  eventTitle: string; // Backend field
  title: string; // Frontend display field
  date: string;
  startTime: string;
  attendeeCount: number;
  status?: 'upcoming' | 'ongoing' | 'past';
}
