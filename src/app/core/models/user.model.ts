   // src/app/core/models/user.model.ts

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
