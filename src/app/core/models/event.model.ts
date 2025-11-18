export interface VenueSection {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  availability: string;
  availabilityType: 'full' | 'available';
}
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

export interface RegistrationInfo {
  eventName: string;
  ticketName: string;
  ticketPrice: number;
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

export interface BaseType {
  id: number;
  name: string;
}


export interface EventResponse {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  location: string;
  flyerUrl: string;
  timeZoneOffSet: string;
}

export type EventType = BaseType;
export type MeetingType = BaseType;



export interface TimeZone {
  zoneId: string,
  gmtOffset: string,
  displayName: string
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
  value: boolean|null;
}

export interface SearchLocation {
  name: string;
  id: string;
}

export interface PopularLocation {
  name: string;
  meta: string;
}

export interface GetEventProps {
  sortBy?: string[];
  pageNumber?: number;
  pageSize?: number;
  location?: string;
  hasTitle?: string;
  date?: string;
  paid?: boolean;
  priceFilter?: string;
  past?: boolean;
}


export interface GetEventsResponse {
  pageNumber: number;
  pageSize: number;
  events: EventSummary[];
}

export interface EventSummary {
  id: number;
  title: string;
  description: string;
  startTime: string | null;
  location: string | null;
  flyerUrl: string;
  ticketPrice: number;
  attendees?:number;
  attendeesCount?:number;
   isPaid?: boolean;
}

export interface EventTypeFilter { label: string, value: string }
// event.model.ts

// ============================================
// EXISTING MODELS (from your codebase)
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
// API RESPONSE MODELS (for backend integration)
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
  eventManagement: EventManagement[];
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

export interface ApiResponse<T> {
  description: string | null;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
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
    location: 'N/A', // EventManagement doesn't include location
    imageUrl: '',
    isPaid: false,
    attendees: event.attendeeCount,
  };
}


export   interface EventFiltersCache {
  isPaid: string | null;
  past: boolean | null;
  date: Date | null;
  searchTerm: string;
  locationTerm: string;
}