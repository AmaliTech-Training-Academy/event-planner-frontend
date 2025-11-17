import { EventStatus } from './event-status.model';

export interface Event {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  status: EventStatus;
  attendeeCount: number;
  organizer: string;
  category?: string;
  imageUrl?: string;
  isPaid: boolean;
  price?: number;
}
