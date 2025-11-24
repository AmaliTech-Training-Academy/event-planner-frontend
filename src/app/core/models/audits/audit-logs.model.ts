// Interfaces (no changes needed)
export interface AuditLog {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  ipAddress: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
}

export interface AuditLogsResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  auditListResponse: AuditLog[];
}

export interface AuditLogTableData {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  initials?: string;
  ipAddress: string;
  timestamp: string;
  formattedTimestamp: string;
  status: 'Successful' | 'Failed';
  statusClass: string;
}

export function mapAuditLogToTableData(
  log: AuditLog | null | undefined
): AuditLogTableData {
  if (!log) {
    return {
      id: '',
      fullName: '',
      firstName: '',
      lastName: '',
      email: '',
      avatar: '',
      initials: '',
      ipAddress: '',
      timestamp: '',
      formattedTimestamp: 'Invalid Date',
      status: 'Failed',
      statusClass: 'failed',
    } as AuditLogTableData;
  }

  let fullName = '';
  const firstName = log.first_name || '';
  const lastName = log.last_name || '';

  if (firstName || lastName) {
    fullName = `${firstName} ${lastName}`.trim();
  } else if (log.email) {
    fullName = log.email.split('@')[0];
  }

  let formattedTimestamp = 'Invalid Date';
  const dateString = log.timestamp || log.createdAt;

  if (dateString) {
    try {
      const date = new Date(dateString);

      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
    } catch (error) {
      // Silently handle parsing errors
    }
  }

  const status =
    log.status?.toLowerCase() === 'failed' ? 'Failed' : 'Successful';

  // Generate initials
  let initials = '';
  if (firstName && lastName) {
    initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  } else if (firstName) {
    initials = firstName.substring(0, 2).toUpperCase();
  } else if (log.email) {
    initials = log.email.substring(0, 2).toUpperCase();
  }

  return {
    id: log.id || '',
    fullName,
    firstName,
    lastName,
    email: log.email || '',
    avatar: '', // No avatar from API for audit logs usually
    initials,
    ipAddress: log.ipAddress || 'N/A',
    timestamp: dateString || '',
    formattedTimestamp,
    status,
    statusClass: status === 'Successful' ? 'success' : 'failed',
  } as AuditLogTableData;
}
