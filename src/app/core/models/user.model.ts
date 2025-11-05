import { USER_ROLES } from '../constants/user.constants';

export type UserStatus = 'Active' | 'Inactive';

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
  status: UserStatus;

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

// Invite user interfaces
export interface InviteUserData {
  name: string;
  email: string;
  role: UserRole;
}

export interface InviteUserPayload {
  title: string;
  users: InviteUserData[];
  eventId?: string;
  message?: string;
}

export interface InviteUserResponse {
  description: string | null;
  data: {
    invitationsSent: number;
    failedInvitations: number;
    invitations: Array<{
      email: string;
      status: 'sent' | 'failed';
      error?: string;
    }>;
  };
}

// Type definitions
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Helper function to convert backend status to frontend
export function mapUserStatus(status: boolean | string): UserStatus {
  if (typeof status === 'boolean') return status ? 'Active' : 'Inactive';
  return status.toLowerCase() === 'active' ? 'Active' : 'Inactive';
}

// Helper function to convert frontend status to backend
export function mapStatusToBoolean(status: UserStatus | boolean): boolean {
  if (typeof status === 'boolean') return status;
  return status === 'Active';
}

// Normalize a single user
export function normalizeUserStatus(user: RawUser): User {
  return {
    ...user,
    status: mapUserStatus(user.status), // ✅ ensures it's 'Active' | 'Inactive'
    profileImageUrl: user.profileImageUrl ?? null,
    role: user.role as UserRole, // cast backend string to UserRole
  };
}


// Type for raw backend users
export interface RawUser {
  userId: string | number;
  name?: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  profileImageUrl?: string | null;
  role: string; // backend may send string
  status: boolean | string;
  eventsOrganized: number;
  eventsAttended: number;
  joinedDate?: string;
  lastActive?: string;
}

// Normalize an array of users from backend
export function normalizeUsersArray(rawUsers: RawUser[]): User[] {
  return rawUsers.map((user) =>
    normalizeUserStatus({
      ...user,
      role: user.role as UserRole,
      profileImageUrl: user.profileImageUrl ?? null,
    })
  );
}
