import { User } from './user.model';

/** Convert backend boolean status to User status */
export function normalizeUserStatus(rawUser: any): User {
  return {
    ...rawUser,
    status: rawUser.status ? 'Active' : 'Inactive',
  };
}

/** Convert User status to backend boolean */
export function mapStatusToBoolean(status: 'Active' | 'Inactive'): boolean {
  return status === 'Active';
}

/** Convert backend boolean status to display string */
export function mapUserStatus(status: boolean): 'Active' | 'Inactive' {
  return status ? 'Active' : 'Inactive';
}
