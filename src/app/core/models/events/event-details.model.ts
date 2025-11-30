// models/event-details.models.ts

import { TicketType } from "../event.model";
import { EventStatus } from "./event-status.model";

export interface EventDetails {
  id: string;
  name: string;
  title: string;
  organizer: string;
  date: string;
  attendees: number;
  totalTicketsSold: number;
  ticketRevenue: number;
  status: EventStatus;
  location: string;
  description: string;
}




export interface EventHost {
  id?: number;
  name: string;
  email: string;
  avatar?: string;
  role?: 'organizer' | 'co-host' | 'staff';
}

export interface Guest {
  id: number;
  name: string;
  email: string;
  status: GuestStatus;
  dateSent?: string;
  avatar?: string;
  phoneNumber?: string;
}

export type GuestStatus = 'pending' | 'confirmed' | 'declined';

export interface Registration {
  id: number;
  attendeeName: string;
  email: string;
  registrationDate: string;
  ticketType: string;
  status: RegistrationStatus;
  phoneNumber?: string;
  ticketId?: string;
}

export type RegistrationStatus = 'confirmed' | 'pending' | 'cancelled';

export interface EventStatistics {
  totalAttendees: number;
  totalTicketsSold: number;
  totalRevenue: number;
  confirmedGuests: number;
  pendingGuests: number;
  declinedGuests: number;
}

export interface EventCapacityInfo {
  capacity: number | 'unlimited';
  currentAttendees: number;
  isOpen: boolean;
}

export interface TicketPricing {
  isFree: boolean;
  currency?: string;
  ticketTypes?: TicketType[];
}

// Filter and Sort Types
export type GuestFilter = 'all' | 'confirmed' | 'pending' | 'declined';
export type GuestSortBy = 'date' | 'name' | 'status';
export type TabType = 'overview' | 'guests' | 'registration';

// API Response Types (for backend integration)
export interface EventDetailsApiResponse {
  id: number;
  title: string;
  organizer?: string;
  startTime?: string;
  endTime?: string;
  attendeeCount?: number;
  status: string;
  location?: string;
  description?: string;
  ticketsSold?: number;
  revenue?: number;
}

export interface GuestApiResponse {
  id: number;
  fullName: string;
  email: string;
  invitationStatus: string;
  invitedAt?: string;
  avatarUrl?: string;
}

export interface RegistrationApiResponse {
  id: number;
  attendeeName: string;
  email: string;
  createdAt: string;
  ticketTypeName: string;
  registrationStatus: string;
}