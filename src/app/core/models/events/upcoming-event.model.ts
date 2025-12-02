export interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  startTime: string;
  attendeeCount: number;
  status?: 'upcoming' | 'ongoing' | 'past';
}
