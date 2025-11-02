import {
  EventDetails,
  VenueImage,
  VenueSection,
  TicketInfo,
} from '../models/event.model';

const eventStartDate = new Date('2025-04-15T00:00:00Z');

export const MOCK_EVENT_DETAILS: EventDetails = {
  id: 'evt123',
  title: 'Tech Innovation Summit 2025',
  date: 'April 15-17, 2025 GMT',
  startDate: eventStartDate,
  location: 'Silicon Valley Convention Center',
  heroImageUrl: 'images/img.png',
  isPaid: true,
  description:
    'Join us for the most anticipated tech event of the year, bringing together industry leaders, innovators, and tech enthusiasts. The Tech Innovation Summit 2025 will showcase cutting-edge technologies, breakthrough innovations, and insights from world-renowned experts.',
  attendeesCount: '5000+',
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
  { url: 'images/venue9.png', alt: 'Venue Image 9' },
];

export const MOCK_VENUE_SECTIONS: VenueSection[] = [
  {
    id: 'sec1',
    name: 'VIP',
    price: 50,
    imageUrl: 'images/venue10.png',
    availability: 'Full Capacity',
    availabilityType: 'full',
  },
  {
    id: 'sec2',
    name: 'Regular',
    price: 10,
    imageUrl: 'images/venue11.png',
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

