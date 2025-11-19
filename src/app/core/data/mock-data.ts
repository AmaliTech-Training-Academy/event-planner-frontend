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
  EventDetailsAdmin
} from '../models/event.model';

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



export const MOCK_EVENT_CARDS: EventCard[] = [
 
  {
    id: 'evt123',
    title: 'Tech Innovation Summit 2025',
    date: new Date('2025-04-15T00:00:00Z'),
    location: 'Silicon Valley, CA',
    imageUrl: 'images/event1.jpg',
    isPaid: true,
    attendees: 5000,
  },
  {
    id: 'evt124',
    title: 'AI World Conference',
    date: new Date('2025-05-10T00:00:00Z'),
    location: 'Austin, TX',
    imageUrl: 'images/event2.jpg',
    isPaid: true,
    attendees: 2500,
  },
  {
    id: 'evt125',
    title: 'Cloud Computing Expo',
    date: new Date('2025-06-20T00:00:00Z'),
    location: 'New York, NY',
    imageUrl: 'images/event3.jpg',
    isPaid: true,
    attendees: 3200,
  },
  {
    id: 'evt126',
    title: 'Blockchain Summit 2025',
    date: new Date('2025-07-15T00:00:00Z'),
    location: 'San Francisco, CA',
    imageUrl: 'images/event1.jpg',
    isPaid: true,
    attendees: 1800,
  },
  {
    id: 'evt127',
    title: 'Cyber Security Conference',
    date: new Date('2025-08-05T00:00:00Z'),
    location: 'Seattle, WA',
    imageUrl: 'images/event2.jpg',
    isPaid: true,
    attendees: 2100,
  },
  {
    id: 'evt128',
    title: 'Mobile Dev Conference',
    date: new Date('2025-09-12T00:00:00Z'),
    location: 'Toronto, Canada',
    imageUrl: 'images/event3.jpg',
    isPaid: true,
    attendees: 2200,
  },
  {
    id: 'evt128',
    title: 'Mobile Dev Conference',
    date: new Date('2025-09-12T00:00:00Z'),
    location: 'Toronto, Canada',
    imageUrl: 'images/event1.jpg',
    isPaid: true,
    attendees: 2200,
  },
  {
    id: 'evt128',
    title: 'Mobile Dev Conference',
    date: new Date('2025-09-12T00:00:00Z'),
    location: 'Toronto, Canada',
    imageUrl: 'images/event2.jpg',
    isPaid: true,
    attendees: 2200,
  },
  {
    id: 'evt128',
    title: 'Mobile Dev Conference',
    date: new Date('2025-09-12T00:00:00Z'),
    location: 'Toronto, Canada',
    imageUrl: 'images/event3.jpg',
    isPaid: true,
    attendees: 2200,
  },
  {
    id: 'evt128',
    title: 'Mobile Dev Conference',
    date: new Date('2025-09-12T00:00:00Z'),
    location: 'Toronto, Canada',
    imageUrl: 'images/event1.jpg',
    isPaid: true,
    attendees: 2200,
  },
  {
    id: 'evt128',
    title: 'Mobile Dev Conference',
    date: new Date('2025-09-12T00:00:00Z'),
    location: 'Toronto, Canada',
    imageUrl: 'images/event2.jpg',
    isPaid: true,
    attendees: 2200,
  },
  {
    id: 'evt128',
    title: 'Mobile Dev Conference',
    date: new Date('2025-09-12T00:00:00Z'),
    location: 'Toronto, Canada',
    imageUrl: 'images/event3.jpg',
    isPaid: true,
    attendees: 2200,
  },

  
  {
    id: 'evt134',
    title: 'Cloud Computing Summit',
    date: new Date('2024-05-22T00:00:00Z'),
    location: 'Denver, CO',
    imageUrl: 'images/event1.jpg',
    isPaid: false,
    attendees: 3000,
  },

  
  {
    id: 'evt138',
    title: 'IoT World Congress',
    date: new Date('2024-04-15T00:00:00Z'),
    location: 'Barcelona, Spain',
    imageUrl: 'images/event3.jpg',
    isPaid: false,
    attendees: 5500,
  },
  {
    id: 'evt139',
    title: 'Robotics Expo 2024',
    date: new Date('2024-03-08T00:00:00Z'),
    location: 'Detroit, MI',
    imageUrl: 'images/event2.jpg',
    isPaid: false,
    attendees: 2200,
  },
  {
    id: 'evt140',
    title: 'Quantum Computing Summit',
    date: new Date('2024-02-12T00:00:00Z'),
    location: 'Cambridge, MA',
    imageUrl: 'images/event1.jpg',
    isPaid: false,
    attendees: 800,
  },

  
  {
    id: 'evt141',
    title: 'Community Code & Coffee',
    date: new Date('2025-11-05T00:00:00Z'),
    location: 'Austin, TX',
    imageUrl: 'images/event2.jpg',
    isPaid: false,
    attendees: 150,
  },
  {
    id: 'evt142',
    title: 'Open Source Meetup',
    date: new Date('2024-03-20T00:00:00Z'),
    location: 'Portland, OR',
    imageUrl: 'images/event1.jpg',
    isPaid: false,
    attendees: 85,
  },
  {
    id: 'evt142',
    title: 'Open Source Meetup',
    date: new Date('2024-03-20T00:00:00Z'),
    location: 'Portland, OR',
    imageUrl: 'images/event1.jpg',
    isPaid: false,
    attendees: 85,
  },
  {
    id: 'evt142',
    title: 'Open Source Meetup',
    date: new Date('2024-03-20T00:00:00Z'),
    location: 'Portland, OR',
    imageUrl: 'images/event2.jpg',
    isPaid: false,
    attendees: 85,
  },
  {
    id: 'evt142',
    title: 'Open Source Meetup',
    date: new Date('2024-03-20T00:00:00Z'),
    location: 'Portland, OR',
    imageUrl: 'images/event3.jpg',
    isPaid: false,
    attendees: 85,
  },
  {
    id: 'evt142',
    title: 'Open Source Meetup',
    date: new Date('2024-03-20T00:00:00Z'),
    location: 'Portland, OR',
    imageUrl: 'images/event1.jpg',
    isPaid: false,
    attendees: 85,
  },
  {
    id: 'evt142',
    title: 'Open Source Meetup',
    date: new Date('2024-03-20T00:00:00Z'),
    location: 'Portland, OR',
    imageUrl: 'images/event2.jpg',
    isPaid: false,
    attendees: 85,
  },
  {
    id: 'evt142',
    title: 'Open Source Meetup',
    date: new Date('2024-03-20T00:00:00Z'),
    location: 'Portland, OR',
    imageUrl: 'images/event3.jpg',
    isPaid: false,
    attendees: 85,
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
  { name: 'San Francisco, USA', id: 'sf' },
  { name: 'Toronto, Canada', id: 'tor' },
];

export const MOCK_POPULAR_LOCATIONS: PopularLocation[] = [
  { name: 'San Francisco, USA', meta: 'California' },
  { name: 'Toronto, Canada', meta: 'Ontario' },
  { name: 'Sydney, Australia', meta: 'New South Wales' },
  { name: 'London, UK', meta: 'England' },
  { name: 'Berlin, Germany', meta: 'Europe' },
];


export const MOCK_MY_EVENTS_CARDS: EventCard[] = [
  {
    id: 'evt123',
    title: 'Tech Innovation Summit 2025',
    date: eventStartDate,
    location: 'Silicon Valley, CA',
    imageUrl: 'images/event1.jpg', 
    isPaid: true,
    attendees: 5000,
  },
  {
    id: 'evt124',
    title: 'Community Code & Coffee',
    date: new Date('2025-05-10T00:00:00Z'),
    location: 'Austin, TX',
    imageUrl: 'images/event2.jpg', 
    isPaid: true,
    attendees: 150,
  },
  {
    id: 'evt125',
    title: 'AI World Conference',
    date: new Date('2025-06-20T00:00:00Z'),
    location: 'New York, NY',
    imageUrl: 'images/event3.jpg', 
    isPaid: true,
    attendees: 2500,
  },
];

export const MOCK_ADMIN_EVENT_DETAILS: EventDetailsAdmin = {
  id: 'evt123',
  name: 'Tech Innovation Summit 2025',
  organizer: 'Tech Events Inc.',
  date: '2025-04-15T00:00:00Z',
  startDate: eventStartDate,
  location: 'Silicon Valley Convention Center',
  heroImageUrl: 'images/event-hero.png',
  isPaid: true,
  description: '...',
  attendees: 5000,
  status: 'Active',
  time: '09:00am GMT',
};


export const MOCK_MANAGE_EVENT_TABS: TabToggle[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'guests', label: 'Guests' },
  { key: 'registrations', label: 'Registrations' },
];

export const MOCK_MANAGE_STATS: StatCardData[] = [
  {
    title: 'Attendees',
    value: 387,
    icon: 'icons/users.svg',
  },
  {
    title: 'Total Tickets Sold',
    value: '$565.00',
    icon: 'icons/ticket.svg',
  },
];

export const MOCK_EVENT_SUMMARY: EventSummary = {
  organizer: 'William Pen (Senior UI/UX Designer)',
  date: '3rd May, 2025',
  time: '09:00am GMT',
  location: 'Virtual (Zoom Meeting)',
};

export const MOCK_TICKET_STATUS: TicketStatus[] = [
  { name: 'Regular', sold: 6, left: 21 },
  { name: 'VIP', sold: 14, left: 12 },
  { name: 'VVIP', sold: 19, left: 43 },
];

export const MOCK_HOSTS: EventHostAdmin[] = [
  { name: 'William Pen', email: 'william.pen@example.com' },
];
