export interface User {
  userId: string;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  profileImageUrl: string;
  role: 'Organizer' | 'Co-Organizer' | 'Attendee' | 'Venue Staff';
  status: 'Active' | 'Inactive';
  eventsOrganized: number;
  eventsAttended: number;
  joinedDate: string; // ISO date or formatted date string
  lastActive: string;
}
