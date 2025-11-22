import { UserCardData } from "../models";

export const MY_EVENT_STAT_CARDS: UserCardData[] = [
    {
        iconColor: '',
        title: 'Total Events Organized',
        count: 0,
        icon: 'icons/user-icon-orange.png',
        bgColor: '#FFF7EC',
        backend_key: 'totalEvents'
    },
    {
        iconColor: '',
        title: 'Attendees',
        count: 0,
        icon: 'icons/user-icon-blue.png',
        bgColor: '#F0F9FF',
        backend_key: 'totalAttendees'
    },
    {
        iconColor: '',
        title: 'Total Tickets Sold',
        count: 0,
        icon: 'icons/user-icon-blue.png',
        bgColor: '#F0F9FF',
        backend_key: 'totalTicketSales'
    },
];