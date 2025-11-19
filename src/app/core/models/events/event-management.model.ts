import { EventStatus } from './event-status.model';

export interface EventManagement {
  id: number;
  title: string;
  organizer: string;
  startTime: string;
  endTime: string;
  attendeeCount: number;
  status: EventStatus;
}
