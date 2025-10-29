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
  joinedDate: string;
  lastActive: string;
}
export interface UserCardData {
  title: string;
  count: number;
  icon: string;
  bgColor: string;
  iconColor: string;
  percentageChange?: number; // optional
}
