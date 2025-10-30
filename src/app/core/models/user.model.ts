import { USER_ROLES } from "../constants/user.constants";

export interface User {
  userId: string;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  profileImageUrl: string;
  role: UserRole;
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
  percentageChange?: number;
}


export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];