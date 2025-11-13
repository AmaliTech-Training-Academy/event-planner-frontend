// ============================================
// EXISTING FRONTEND MODELS (UI-focused)
// ============================================

export interface EventDetails {
  id: string;
  title: string;
  date: string;
  startDate: Date;
  location: string;
  heroImageUrl: string;
  isPaid: boolean;
  description: string;
  attendeesCount: string;
}

export interface VenueImage {
  url: string;
  alt: string;
  description?: string;
}

export interface VenueSection {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  availability: string;
  availabilityType: 'full' | 'available';
}

export interface TicketInfo {
  title: string;
  price: number;
  currency?: string;
  features: string[];
  buttonText: string;
}

export interface RegistrationInfo {
  eventName: string;
  ticketName: string;
  ticketPrice: number;
}

export interface EventCard {
  id: string;
  title: string;
  date: Date;
  location: string;
  imageUrl: string;
  isPaid: boolean;
  attendees: number;
}

export interface TabToggle {
  key: string;
  label: string;
}

export interface SearchLocation {
  name: string;
  id: string;
}

export interface PopularLocation {
  name: string;
  meta: string;
}

// ============================================
// API RESPONSE MODELS (Backend DTOs)
// ============================================

export interface EventStats {
  totalEvents: number;
  activeEvents: number;
  canceledEvents: number;
  completedEvents: number;
  draftEvents: number;
}

export interface TopOrganizer {
  name: string;
  email: string;
  eventCount: number;
  growthPercentage: number;
}

export interface UpcomingEvent {
  eventTitle: string;
  startTime: string;
  attendeeCount: number;
}

export interface EventManagement {
  id: number;
  title: string;
  organizer: string;
  startTime: string;
  endTime: string;
  attendeeCount: number;
  status: EventStatus;
}

export type EventStatus = 'ACTIVE' | 'DRAFT' | 'COMPLETED' | 'CANCELED';

export interface DashboardData {
  eventStats: EventStats;
  topOrganizers: TopOrganizer[];
  upcomingEvents: UpcomingEvent[];
  eventManagement: PaginatedResponse<EventManagement>; // ✅ Fixed: Now paginated
}

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

// ============================================
// GENERIC API RESPONSE WRAPPERS
// ============================================

export interface ApiResponse<T> {
  description: string | null;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

// ============================================
// UTILITY/MAPPER FUNCTIONS
// ============================================

/**
 * Converts API EventDetailResponse to frontend EventDetails model
 */
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

/**
 * Converts API Event to frontend EventCard model
 */
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

/**
 * Converts API EventManagement to frontend EventCard model
 */
export function mapEventManagementToEventCard(
  event: EventManagement
): EventCard {
  return {
    id: event.id.toString(),
    title: event.title,
    date: new Date(event.startTime),
    location: 'TBD', // EventManagement doesn't include location
    imageUrl: '',
    isPaid: false,
    attendees: event.attendeeCount,
  };
}

/**
 * Format date for display
 */
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time for display
 */
export function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get status badge color class
 */
export function getEventStatusClass(status: EventStatus): string {
  const statusClasses: Record<EventStatus, string> = {
    ACTIVE: 'status-active',
    DRAFT: 'status-draft',
    COMPLETED: 'status-completed',
    CANCELED: 'status-canceled',
  };
  return statusClasses[status] || 'status-default';
}
export function mapEventManagementToEventDetails(
  event: EventManagement
): EventDetails {
  return {
    id: event.id.toString(),
    title: event.title,
    date: event.startTime, // frontend expects a string
    startDate: new Date(event.startTime),
    location: 'TBD', // EventManagement doesn't have location
    heroImageUrl: '',
    isPaid: false,
    description: '',
    attendeesCount: event.attendeeCount.toString(),
  };
}
