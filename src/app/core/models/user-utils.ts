import { User } from './user.model';

/** Convert backend boolean status to User status */
export function normalizeUserStatus(user: User): User {
  const isActive =
    typeof user.status === 'boolean'
      ? user.status
      : String(user.status).toLowerCase() === 'active';

  // Generate initials
  let initials = '';
  if (user.fullName) {
    const names = user.fullName.trim().split(' ');
    if (names.length >= 2) {
      initials = `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    } else if (names.length === 1) {
      initials = names[0].substring(0, 2).toUpperCase();
    }
  } else if (user.email) {
    initials = user.email.substring(0, 2).toUpperCase();
  }

  return {
    ...user,
    status: mapUserStatus(isActive),
    initials,
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
