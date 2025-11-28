import {
  EventDetails,
  VenueImage,
  VenueSection,
  TicketInfo,
  EventCard,
  SearchLocation,
  PopularLocation,
  TabToggle,
  EventHostAdmin,
  StatCardData,
  EventSummary,
  TicketStatus,
  EventDetailsAdmin,
  EventTypeFilter
} from '../models/event.model';

import { LineSeriesConfig } from '../models/chart.model';

const eventStartDate = new Date('2025-04-15T00:00:00Z');

export const MOCK_EVENT_DETAILS: EventDetails = {
  id: 'evt123',
  title: 'Tech Innovation Summit 2025',
  date: 'April 15-17, 2025 GMT',
  isPaid: true,
  startDate: eventStartDate,
  location: 'Silicon Valley Convention Center',
  heroImageUrl: 'images/img.png',
  status:'upcoming',
  time: '10:00 AM',
  description:
    'Join us for the most anticipated tech event of the year, bringing together industry leaders, innovators, and tech enthusiasts. The Tech Innovation Summit 2025 will showcase cutting-edge technologies, breakthrough innovations, and insights from world-renowned experts.',
  attendeesCount: '5000+',
  attendees: 0,
  organizer: 'Acme Corp',
  
};

export const MOCK_VENUE_IMAGES: VenueImage[] = [
  { url: 'images/venue1.png', alt: 'Venue Image 1' },
  { url: 'images/venue2.png', alt: 'Venue Image 2' },
  { url: 'images/venue3.png', alt: 'Venue Image 3' },
  { url: 'images/venue4.png', alt: 'Venue Image 4' },
  { url: 'images/venue5.png', alt: 'Venue Image 5' },
  { url: 'images/venue6.png', alt: 'Venue Image 6' },
  { url: 'images/venue7.png', alt: 'Venue Image 7' },
  { url: 'images/venue8.png', alt: 'Venue Image 8' },
  { url: 'images/venue10.png', alt: 'Venue Image 10' },
  { url: 'images/venue11.png', alt: 'Venue Image 11' },
];

export const MOCK_VENUE_SECTIONS: VenueSection[] = [
  {
    id: 'sec1',
    name: 'VIP',
    price: 50,
    imageUrl: 'images/venue11.png',
    availability: 'Full Capacity',
    availabilityType: 'full',
  },
  {
    id: 'sec2',
    name: 'Regular',
    price: 10,
    imageUrl: 'images/venue10.png',
    availability: '29 Seats Available',
    availabilityType: 'available',
  },
];

export const MOCK_TICKETS: TicketInfo[] = [
  {
    title: 'Get Your Free Ticket',
    price: 0,
    features: ['Limited conference access', 'Workshop materials'],
    buttonText: 'Register for Event',
  },
  {
    title: 'VIP Ticket',
    price: 50,
    currency: '$',
    features: [
      'Full conference access',
      'Workshop materials',
      'Networking events',
    ],
    buttonText: 'Buy VIP Ticket',
  },
];

export const MOCK_HELP_EMAIL: string = 'support@techevent.com';


export const MOCK_EVENT_TOGGLES: TabToggle[] = [
  { key: 'upcoming', label: 'Upcoming events', value: false },
  { key: 'past', label: 'Past events', value: true },
];

export const MOCK_EVENT_TYPE_OPTIONS: EventTypeFilter[] = [
  {
    label: 'All Events',
    value: 'all',
  },
  {
    label: 'Paid Events',
    value: 'paid',
  },
  {
    label: 'Free Events',
    value: 'free',
  },
];

export const MOCK_CHART_SERIES: LineSeriesConfig[] = [
  {
    name: 'This year',
    color: '#FF6B35',
    showArea: true,
    lineStyle: 'solid',
    areaGradient: {
      start: 'rgba(255, 107, 53, 0.2)',
      end: 'rgba(255, 107, 53, 0.05)',
    },
    data: [
      { month: 'Jan', value: 12000 },
      { month: 'Feb', value: 15000 },
      { month: 'Mar', value: 18000 },
      { month: 'Apr', value: 22000 },
      { month: 'May', value: 28000 },
      { month: 'Jun', value: 25000 },
      { month: 'Jul', value: 27000 },
    ],
  },
  {
    name: 'Last year',
    color: '#6B7280',
    showArea: false,
    lineStyle: 'dashed',
    data: [
      { month: 'Jan', value: 10000 },
      { month: 'Feb', value: 12000 },
      { month: 'Mar', value: 14000 },
      { month: 'Apr', value: 16000 },
      { month: 'May', value: 20000 },
      { month: 'Jun', value: 22000 },
      { month: 'Jul', value: 24000 },
    ],
  },
];
