// Interfaces
export interface AuditLog {
  id: number;
  fullName: string;
  email: string;
  profileImageUrl?: string;
  ipAddress: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  auditStatus: string;
}

export interface AuditLogsResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  data: AuditLog[];
}

export interface AuditLogTableData {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  initials?: string;
  ipAddress: string;
  timestamp: string;
  formattedTimestamp: string;
  status: 'Success' | 'Failed';
  statusClass: string;
}

export function mapAuditLogToTableData(
  log: AuditLog | null | undefined
): AuditLogTableData {
  if (!log) {
    return {
      id: '',
      fullName: '',
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

  const fullName = log.fullName || log.email.split('@')[0];

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
    log.auditStatus?.toUpperCase() === 'SUCCESS' ? 'Successful' : 'Failed';

  // Generate initials
  let initials = '';
  if (fullName) {
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      initials = `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    } else {
      initials = fullName.substring(0, 2).toUpperCase();
    }
  } else if (log.email) {
    initials = log.email.substring(0, 2).toUpperCase();
  }

  return {
    id: log.id.toString(),
    fullName,
    email: log.email || '',
    avatar: log.profileImageUrl || '',
    initials,
    ipAddress: log.ipAddress || 'N/A',
    timestamp: dateString || '',
    formattedTimestamp,
    status,
    statusClass: status === 'Successful' ? 'success' : 'failed',
  } as AuditLogTableData;
}
