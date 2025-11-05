import {
  EventDetails,
  VenueImage,
  VenueSection,
  TicketInfo,
  EventCard,
  SearchLocation,
  PopularLocation,
  TabToggle,
} from '../models/event.model';

const eventStartDate = new Date('2025-04-15T00:00:00Z');

// --- DATA FOR EVENT DETAILS PAGE ---

export const MOCK_EVENT_DETAILS: EventDetails = {
  id: 'evt123',
  title: 'Tech Innovation Summit 2025',
  date: 'April 15-17, 2025 GMT',
  startDate: eventStartDate,
  location: 'Silicon Valley Convention Center',
  heroImageUrl: '/assets/images/event-hero.png',
  isPaid: true,
  description:
    'Join us for the most anticipated tech event of the year, bringing together industry leaders, innovators, and tech enthusiasts. The Tech Innovation Summit 2025 will showcase cutting-edge technologies, breakthrough innovations, and insights from world-renowned experts.',
  attendeesCount: '5000+',
};

export const MOCK_VENUE_IMAGES: VenueImage[] = [
  { url: '/assets/images/venue-1.png', alt: 'Venue Image 1' },
  { url: '/assets/images/venue-2.png', alt: 'Venue Image 2' },
  { url: '/assets/images/venue-3.png', alt: 'Venue Image 3' },
  { url: '/assets/images/venue-4.png', alt: 'Venue Image 4' },
  { url: '/assets/images/venue-5.png', alt: 'Venue Image 5' },
];

export const MOCK_VENUE_SECTIONS: VenueSection[] = [
  {
    id: 'sec1',
    name: 'VIP',
    price: 50,
    imageUrl: '/assets/images/venue-section-vip.png',
    availability: 'Full Capacity',
    availabilityType: 'full',
  },
  {
    id: 'sec2',
    name: 'Regular',
    price: 10,
    imageUrl: '/assets/images/venue-section-regular.png',
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



export const MOCK_EVENT_CARDS: EventCard[] = [
  {
    id: 'evt123',
    title: 'Tech Innovation Summit 2025',
    date: eventStartDate,
    location: 'Silicon Valley, CA',
    imageUrl: '/assets/images/event-card-1.png',
    isPaid: true,
    attendees: 5000,
  },
  {
    id: 'evt124',
    title: 'Community Code & Coffee',
    date: new Date('2025-05-10T00:00:00Z'),
    location: 'Austin, TX',
    imageUrl: '/assets/images/event-card-2.png',
    isPaid: false,
    attendees: 150,
  },
  {
    id: 'evt125',
    title: 'AI World Conference',
    date: new Date('2025-06-20T00:00:00Z'),
    location: 'New York, NY',
    imageUrl: '/assets/images/event-card-3.png',
    isPaid: true,
    attendees: 2500,
  },
];



export const MOCK_EVENT_TOGGLES: TabToggle[] = [
  { key: 'upcoming', label: 'Upcoming events' },
  { key: 'past', label: 'Past events' },
];

export const MOCK_EVENT_TYPE_OPTIONS: string[] = [
  'All Events',
  'Paid Events',
  'Free Events',
];

export const MOCK_RECENT_SEARCHES: SearchLocation[] = [
  { name: 'New York, USA', id: 'ny' },
  { name: 'London, UK', id: 'ldn' },
];

export const MOCK_POPULAR_LOCATIONS: PopularLocation[] = [
  { name: 'San Francisco, USA', meta: 'California' },
  { name: 'Toronto, Canada', meta: 'Ontario' },
  { name: 'Sydney, Australia', meta: 'New South Wales' },
];

