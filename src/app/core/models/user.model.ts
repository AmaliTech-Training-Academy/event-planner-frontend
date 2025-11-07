import { USER_ROLES } from '../constants/user.constants';

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
  status: 'Active' | 'Inactive'; // converted from backend boolean
  eventsOrganized: number;
  eventsAttended: number;
  joinedDate?: string;
  lastActive?: string;
}

/** Dashboard card data model */
export interface UserCardData {
  title: string;
  count: number;
  icon: string;
  bgColor: string;
  iconColor: string;
  percentageChange?: number;
}

/** Role types */
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/** Backend paginated response wrapper */
export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
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
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  first: boolean;
  empty: boolean;
}

/** User management response (matches your backend exactly) */
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

/** Invite user payload/response */
export interface InviteUserPayload {
  invitationTitle: string;
  invitees: {
    inviteeName: string;
    inviteeEmail: string;
    role: string;
  }[];
  event: number | string;
  status: 'SAVE' | 'SEND'; // assuming backend expects a state indicator like SAVE/SEND
  message?: string;
}

export interface InviteUserResponse {
  data: {
    invitationsSent: number;
  };
}

/** Utility functions */
export function normalizeUserStatus(rawUser: any): User {
  return {
    ...rawUser,
    status: rawUser.status ? 'Active' : 'Inactive',
  };
}

export function mapStatusToBoolean(status: 'Active' | 'Inactive'): boolean {
  return status === 'Active';
}
/** Convert backend boolean status to display string */
export function mapUserStatus(status: boolean): 'Active' | 'Inactive' {
  return status ? 'Active' : 'Inactive';
}
/** Search users response (has both formats) */

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

/** Response for /users/search */
export interface UserSearchResponse {
  description: string | null;
  data: PageableResponse<User>; // directly contains content, pageable, totalPages, etc.
}
