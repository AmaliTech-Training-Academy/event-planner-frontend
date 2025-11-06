// --- Interfaces for Event Details Page ---

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

// --- Interface for Registration Modal ---

export interface RegistrationInfo {
  eventName: string;
  ticketName: string;
  ticketPrice: number;
}

// --- Interface for Explore & My Events Pages ---

export interface EventCard {
  id: string;
  title: string;
  date: Date;
  location: string;
  imageUrl: string;
  isPaid: boolean;
  attendees: number;
}

// --- Interfaces for Explore Page Filters ---

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

