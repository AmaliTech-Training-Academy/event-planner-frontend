import { AuthResponseBody } from "./auth-response.model";
import { TicketType } from "./event.model";
import { PaginatedResponseData } from "./myevent.model";
import { UserRole } from "./user.model";

export interface EventAnalyticsResponse {
    description: string;
    data: EventAnalyticsData;
}

export interface EventAnalyticsData {
    eventStats: ManageEventStats;
    eventSummary: ManageEventSummary;
    ticketTypes: MangeTicketType[];
    totalInvitedGuests: number;
    eventHosts: ManageEventHost[];
}

export interface ManageEventStats {
    totalEvents: number;
    totalAttendees: number;
    totalTicketSales: number;
}

export interface ManageEventSummary {
    eventStatus: string;
    title?: string;
    organizer: string;
    startTime: string;
    location: string;
}

export interface MangeTicketType {
    id: number;
    name: string;
    remainingTickets: number;
    soldTickets: number;
}

export interface ManageEventHost {
    id: number,
    fullName: string,
    email: string,
    role: string
}


export interface ManageEventInvitee {
    id: number,
    inviteeName: string,
    inviteeEmail: string,
    role: UserRole
}

export interface ManageEventAttendeesResponse {
    description: string;
    data: PaginatedResponseData<ManageEventInvitee[]>
}


export type searchRegistrationResponse = AuthResponseBody<PaginatedResponseData<Registrants[]>>

export interface Registrants {
    id: number,
    name: string,
    email: string,
    numberOfTickets: number,
    ticketType: string
}

export interface MangeRegistrationResponseOverviewData  {
    eventRegistrations: PaginatedResponseData<Registrants[]>
    ticketTypes: TicketType[];
    filters: string[];
    capacity: number;
}

export type ManageRegistrantsOverviewResponse = AuthResponseBody<MangeRegistrationResponseOverviewData>