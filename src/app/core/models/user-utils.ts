import { User } from './user.model';

/** Convert backend boolean status to User status */
export function normalizeUserStatus(user: User): User {
  const isActive =
    typeof user.status === 'boolean'
      ? user.status
      : String(user.status).toLowerCase() === 'active';
  return {
    ...user,
    status: mapUserStatus(isActive),
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
