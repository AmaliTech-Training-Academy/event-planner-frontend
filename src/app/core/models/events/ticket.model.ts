export interface TicketInfo {
  title: string;
  price: number;
  currency?: string;
  features: string[];
  buttonText: string;
}

export interface RegistrationInfo {
  eventName: string;
  ticketName: string;
  ticketPrice: number;
}
