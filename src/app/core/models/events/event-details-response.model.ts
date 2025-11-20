import { EventStatus } from './event-status.model';

export interface EventDetailResponse {
  id: number;
  title: string;
  description: string;
  organizer: string;
  startTime: string;
  endTime: string;
  location: string;
  attendeeCount: number;
  maxAttendees?: number;
  status: EventStatus;
  category?: string;
  imageUrl?: string;
  heroImageUrl?: string;
  isPaid: boolean;
  price?: number;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}
