import { EventStats } from './event-stats.model';
import { TopOrganizer } from './top-organizer.model';
import { UpcomingEvent } from './upcoming-event.model';
import { EventManagement } from './event-management.model';
import { PaginatedResponse } from '../shared';

export interface DashboardData {
  eventStats: EventStats;
  topOrganizers: TopOrganizer[];
  upcomingEvents: UpcomingEvent[];
  eventManagement: PaginatedResponse<EventManagement>;
}
