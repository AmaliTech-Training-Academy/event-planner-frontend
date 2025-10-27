   // src/app/core/models/user.model.ts

export interface User {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  profileImageUrl: string;
  status: string;
  name: string;
  avatar?: string;
  role: string;
  eventsOrganized: number;
  eventsAttended: number;
  joinedDate: string;
  lastActive: string;
}

export interface UserCardData {
  title: string;
  count: number;
  percentageChange?: number;
  icon: string;
  bgColor: string;
  iconColor: string;
}

