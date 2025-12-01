import { EventType, MeetingType, TicketType } from "@app/core/models/event.model";

export interface EventData {
  eventId: number;
  title: string;
  description: string;
  location: string;
  flyerUrl: string;
  zoomMeetingUrl: string;
  startTime: string;  
  endTime: string;    
  eventTime: string;  
  eventMeetingType: MeetingType;
  eventType: EventType;
  ticketTypes: TicketType[];
}