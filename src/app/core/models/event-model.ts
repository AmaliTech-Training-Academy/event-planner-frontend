export interface AppEvent {
  id: string; 
  imageUrl: string;
  date: string; 
  title: string;
  location: string;
  attendees: number;
  isPaid: boolean;
}