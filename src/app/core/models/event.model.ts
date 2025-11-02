import { VenueImage } from '../../shared/components/venue-image-slider/venue-image-slider.component';
import { TicketInfo } from '../../shared/components/ticket-card/ticket-card.component';
import { VenueSection } from '../../shared/components/venue-section-card/venue-section-card.component';


export type{ VenueImage, TicketInfo, VenueSection };

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
}
