




export interface VenueSection {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  availability: string;
  availabilityType: 'full' | 'available';
}
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

export interface RegistrationInfo {
  eventName: string;
  ticketName: string;
   ticketPrice: number;
}

export interface VenueImage {
  url: string;
  alt: string;
}

export interface TicketInfo {
  title: string;
  price: number;
  currency?: string;
  features: string[];
  buttonText: string; 
}