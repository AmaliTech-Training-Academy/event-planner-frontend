export interface User {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  profileImageUrl: string;
  status: string;
  role: 'admin' | 'attendee'; 
}