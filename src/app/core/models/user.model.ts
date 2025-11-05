import { USER_ROLES } from '../constants/user.constants';

// Main User interface
export interface User {
  userId: string | number;
  name?: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  profileImageUrl: string | null;
  role: UserRole;
  status: boolean | 'Active' | 'Inactive'; // Backend sends boolean, frontend uses string
  eventsOrganized: number;
  eventsAttended: number;
  joinedDate?: string;
  lastActive?: string;
}

// User card statistics interface
export interface UserCardData {
  title: string;
  count: number;
  icon: string;
  bgColor: string;
  iconColor: string;
  percentageChange?: number;
}

// API Response interfaces
export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: SortInfo;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: SortInfo;
  first: boolean;
  empty: boolean;
}

export interface SortInfo {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface UserManagementResponse {
  description: string | null;
  data: {
    totalUsers: number;
    totalOrganizers: number;
    totalAttendees: number;
    totalDeactivatedUsers: number;
    users: PageableResponse<User>;
  };
}

// User creation/update payload
export interface CreateUserPayload {
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  profileImageUrl?: string;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  status?: boolean;
}

// Single user response
export interface UserResponse {
  description: string | null;
  data: User;
}

// Type definitions
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type UserStatus = 'Active' | 'Inactive';

// Helper function to convert backend status to frontend
export function mapUserStatus(status: boolean): UserStatus {
  return status ? 'Active' : 'Inactive';
}

// Helper function to convert frontend status to backend
export function mapStatusToBoolean(status: UserStatus | boolean): boolean {
  if (typeof status === 'boolean') return status;
  return status === 'Active';
}
