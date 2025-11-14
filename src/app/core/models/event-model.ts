export interface AppEvent {
  id: string; 
  imageUrl: string;
  date: Date; 
  title: string;
  location: string;
  attendees: number;
  isPaid: boolean;
}
