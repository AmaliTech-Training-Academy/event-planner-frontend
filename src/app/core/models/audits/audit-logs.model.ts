export interface AuditLog {
  id: number;
  fullName: string;
  email: string;
  profileImageUrl: string;
  ipAddress: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  auditStatus: 'SUCCESS' | 'FAILED';
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
      avatar: '',
      ipAddress: '',
      timestamp: '',
      formattedTimestamp: 'Invalid Date',
      status: 'Failed',
      statusClass: 'failed',
    } as AuditLogTableData;
  }

  const fullName = log.fullName || '';
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

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
      // Silent error handling
    }
  }

  const status = log.auditStatus === 'SUCCESS' ? 'Successful' : 'Failed';

  return {
    id: String(log.id) || '',
    fullName,
    firstName,
    lastName,
    email: log.email || '',
    avatar: log.profileImageUrl || '',
    ipAddress: log.ipAddress || 'N/A',
    timestamp: dateString || '',
    formattedTimestamp,
    status,
    statusClass: status === 'Successful' ? 'success' : 'failed',
  } as AuditLogTableData;
}
