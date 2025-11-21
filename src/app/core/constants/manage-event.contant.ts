import { StatCardData } from "../models/event.model";

export const MANAGE_EVENT_ANALYTIC = [
    {
        title: 'Attendees',
        value: 0,
        icon: '/icons/users-icon.png',
        backend_key: 'totalAttendees',

    },
    {
        title: 'Total Tickets Sold',
        value: 0,
        icon: '/icons/ticket.svg',
        backend_key: 'totalTicketSales',
        currency: true
    }
] as const