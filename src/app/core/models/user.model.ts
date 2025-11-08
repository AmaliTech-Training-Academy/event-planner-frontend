import { USER_ROLES } from "../constants/user.constants";

/** User model (frontend representation) */
export interface User {
  userId: number;
  name?: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  profileImageUrl?: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  eventsOrganized: number;
  eventsAttended: number;
  joinedDate?: string;
  lastActive?: string;
}

/** Role types */
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
