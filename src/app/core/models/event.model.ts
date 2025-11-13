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
  meetingLocation: string;
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
}

export interface EventTypeFilter { label: string, value: string }
