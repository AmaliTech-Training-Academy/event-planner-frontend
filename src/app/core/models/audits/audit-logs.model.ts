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
      avatar: 'https://i.pravatar.cc/150?img=1',
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

  // Generate consistent avatar based on email or id
  const avatarSeed = log.email || log.id || 'default';
  // Use a hash of the seed to get a consistent number
  let hash = 0;
  for (let i = 0; i < avatarSeed.length; i++) {
    hash = (hash << 5) - hash + avatarSeed.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  const avatarIndex = (Math.abs(hash) % 70) + 1;

  return {
    id: log.id || '',
    fullName,
    firstName,
    lastName,
    email: log.email || '',
    avatar: `https://i.pravatar.cc/150?img=${avatarIndex}`,
    ipAddress: log.ipAddress || 'N/A',
    timestamp: dateString || '',
    formattedTimestamp,
    status,
    statusClass: status === 'Successful' ? 'success' : 'failed',
  } as AuditLogTableData;
}
