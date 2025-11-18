import {
  EventDetails,
  VenueImage,
  VenueSection,
  TicketInfo,
  EventCard,
  SearchLocation,
  PopularLocation,
  TabToggle,
  EventTypeFilter,
  EventSummary,
} from '../models/event.model';

// import { UserCardData } from '../models/user.model';
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
  { key: 'upcoming', label: 'Upcoming events', value: false },
  { key: 'past', label: 'Past events', value: true },
];



export const MOCK_EVENT_TYPE_OPTIONS: EventTypeFilter[] = [
  {
    label: 'All Events',
    value: 'all'
  },
  {
    label: 'Paid Events',
    value: 'paid'
  },
  {
    label: 'Free Events',
    value: 'free'
  },
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


export const MOCK_MY_EVENTS_CARDS: EventSummary[] = [
  {
    id: 1,
    ticketPrice: 33,
    description: "",
    title: 'Tech Innovation Summit 2025',
    startTime: '',
    location: 'Silicon Valley, CA',
    flyerUrl: 'images/event1.jpg',
    attendees: 5000,
  },
  {
    id: 2,
    ticketPrice: 33,
    description: "",
    title: 'Community Code & Coffee',
    startTime: '',
    location: 'Austin, TX',
    flyerUrl: 'images/event2.jpg',
    attendees: 150,
  },
  {
    id: 3,
    title: 'AI World Conference',
    startTime: '',
    location: 'New York, NY',
    flyerUrl: 'images/event3.jpg',
    ticketPrice: 400,
    description: "",
    attendees: 2500,
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


// export const MOCK_STAT_CARDS: UserCardData[] = [
//   {
   
//     title: 'Total Events Organized',
//     count: 3,
//     icon: 'icons/user-icon-orange.png',
//     bgColor: '#FFF7EC',
//     percentageChange: 11.01,
//   },
//   {
   
//     title: 'Attendees',
//     count: 387,
//     icon: 'icons/user-icon-blue.png',
//     bgColor: '#F0F9FF',
//   },
//   {
  
//     title: 'Total Tickets Sold',
//     count: 565,
//     icon: 'icons/user-icon-blue.png',
//     bgColor: '#F0F9FF',
//   },
// ];